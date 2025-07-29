import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X, Trash2 } from "lucide-react";
import { projectService } from "@/lib/api/project";

export const UploadPDF = ({
  token,
  projectId,
  onSuccess,
  existingFileUrl,
  onDeleteSuccess,
}: {
  token: string;
  projectId: string;
  onSuccess?: () => void;
  existingFileUrl?: string | null;
  onDeleteSuccess?: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    await handleFile(selectedFile);
  };

  const handleFile = async (selectedFile: File | undefined) => {
    setSuccess(null);
    setLocalError(null);

    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setUploadProgress(0);
      setLocalError("ไฟล์ต้องเป็น .pdf เท่านั้น");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setUploadProgress(0);
      setLocalError("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }
    setFile(selectedFile);
    setUploadProgress(0);

    // Simulate progress bar
    let progress = 0;
    setLoading(true);
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 300);

    try {
      await projectService.uploadProjectDocumentFile(token, projectId, selectedFile);
      clearInterval(interval);
      setUploadProgress(100);
      setSuccess("อัปโหลดสำเร็จ");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      clearInterval(interval);
      setUploadProgress(0);
      setFile(null);
      setLocalError(
        (err as { message?: string })?.message ||
          "เกิดข้อผิดพลาดในการอัปโหลดไฟล์"
      );
    }
    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Delete file (implement your own logic if needed)
  const handleDelete = async () => {
    setLocalError(null);
    // You may need to call an API to delete the file
    if (onDeleteSuccess) onDeleteSuccess();
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#006C67] flex items-center gap-2">
          <Upload className="w-5 h-5" />
          อัปโหลดไฟล์เอกสารโครงการ (.pdf)
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          รองรับเฉพาะไฟล์ .pdf ขนาดไม่เกิน 5MB
        </p>
      </div>

      {existingFileUrl ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full mb-3 bg-green-50">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            มีไฟล์เอกสารโครงการ
          </p>
          <div className="flex gap-3">
            <a
              href={existingFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#006C67] text-white rounded-lg text-sm font-medium hover:bg-[#005550] transition-colors"
            >
              ดูไฟล์
            </a>
            <button
              onClick={async () => {
                setLocalError(null);
                setSuccess(null);
                await handleDelete();
              }}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              ลบไฟล์
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-xl transition-all duration-200
            ${
              dragActive
                ? "border-[#006C67] bg-[#e6f5f3]"
                : "border-gray-200 hover:border-[#006C67]"
            }
            ${localError ? "border-red-300 bg-red-50" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            onChange={handleFileChange}
            className="sr-only"
            disabled={loading}
          />
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
          >
            <div
              className={`p-3 rounded-full mb-3 ${
                localError ? "bg-red-100" : "bg-[#e6f5f3]"
              }`}
            >
              <Upload
                className={`w-6 h-6 ${
                  localError ? "text-red-600" : "text-[#006C67]"
                }`}
              />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              คลิกเพื่ออัปโหลด หรือ ลากไฟล์มาวาง
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </label>
          {file && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-[#e6f5f3]">
                    <FileText className="w-5 h-5 text-[#006C67]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!loading && (
                  <button
                    onClick={() => setFile(null)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>กำลังอัปโหลด...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#006C67] transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {localError && (
        <div className="mt-3 flex items-start space-x-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{localError}</span>
        </div>
      )}
      {success && (
        <div className="mt-3 flex items-start space-x-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};