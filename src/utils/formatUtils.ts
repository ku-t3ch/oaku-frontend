/**
 * จัดรูปแบบวันที่เป็นภาษาไทย
 * @param dateString - ISO date string
 * @returns Formatted Thai date string
 */
export const formatThaiDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'ไม่ระบุวันที่';
  }
};

/**
 * จัดรูปแบบวันที่แบบสั้น
 * @param dateString - ISO date string
 * @returns Short formatted date string
 */
export const formatShortDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH');
  } catch {
    return 'N/A';
  }
};

/**
 * ตัดข้อความที่ยาวเกินไป
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};