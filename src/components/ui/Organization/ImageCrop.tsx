import React, { useState, useRef, useCallback } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import Image from "next/image";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (canvas: HTMLCanvasElement) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
    },
    [aspectRatio]
  );

  const getCroppedCanvas = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): HTMLCanvasElement => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // กำหนดขนาดสุดท้ายเป็น 400x400 เสมอ
      const finalSize = 400;
      canvas.width = finalSize;
      canvas.height = finalSize;

      // คำนวณขนาดจริงของ crop area
      const sourceX = crop.x * scaleX;
      const sourceY = crop.y * scaleY;
      const sourceWidth = crop.width * scaleX;
      const sourceHeight = crop.height * scaleY;

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        finalSize,
        finalSize
      );

      return canvas;
    },
    []
  );

  const handleCropConfirm = useCallback(() => {
    if (completedCrop && imgRef.current) {
      try {
        const canvas = getCroppedCanvas(imgRef.current, completedCrop);
        onCropComplete(canvas);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  }, [completedCrop, getCroppedCanvas, onCropComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 bg-opacity-50">
      <div className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            ปรับขนาดรูปภาพ
          </h3>
          <button
            aria-label="Close"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={aspectRatio === 1}
            minWidth={50}
            minHeight={50}
          >
            <Image
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              onLoad={onImageLoad}
              style={{ maxHeight: "400px", maxWidth: "600px" }}
            />
          </ReactCrop>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          <p>• รูปภาพจะถูกปรับขนาดเป็น 400×400 พิกเซล</p>
          <p>• เหมาะสำหรับการแสดงผลเป็นรูปโปรไฟล์ชมรม</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleCropConfirm}
            className="rounded-md bg-[#006C67] px-4 py-2 text-sm font-medium text-white hover:bg-[#005f5b]"
            disabled={!completedCrop}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};
