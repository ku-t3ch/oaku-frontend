/**
 * สร้าง proxy URL สำหรับ Google images เพื่อหลีกเลี่ยง CORS
 * @param imageUrl - Original image URL
 * @returns Proxy URL or original URL if not Google image
 */
export const getProxyImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  // ถ้าเป็น Google image ให้ใช้ proxy
  if (imageUrl.includes('googleusercontent.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  }

  // ถ้าเป็น URL อื่นๆ ให้ใช้ตรงๆ
  return imageUrl;
};

/**
 * สร้าง fallback avatar text จากชื่อหรือ email
 * @param name - User name
 * @param email - User email (fallback)
 * @returns Single character for avatar
 */
export const getAvatarText = (name?: string, email?: string): string => {
  if (name) {
    return name.charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return 'U';
};

/**
 * ตรวจสอบว่า URL เป็นรูปภาพที่ valid หรือไม่
 * @param url - Image URL to validate
 * @returns Boolean indicating if URL is valid image
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = parsedUrl.pathname.toLowerCase();
    
    return validExtensions.some(ext => pathname.endsWith(ext)) || 
           url.includes('googleusercontent.com');
  } catch {
    return false;
  }
};

/**
 * Crop image from file using canvas
 * @param file - File object (image)
 * @param crop - { x, y, width, height } in pixels
 * @param aspect - aspect ratio (optional)
 * @returns Promise<string> - base64 cropped image
 */
export const cropImage = (
  file: File,
  crop: { x: number; y: number; width: number; height: number },
  aspect?: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let outputWidth = crop.width;
        let outputHeight = crop.height;
        if (aspect) {
          outputHeight = crop.width / aspect;
        }
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          outputWidth,
          outputHeight
        );
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};