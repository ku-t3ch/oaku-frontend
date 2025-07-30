"use client";

import { completeActivityHourFile } from "@/lib/api/project";
import { FileText, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { UploadActivityHoursCSV } from "@/components/ui/Form/UploadActivityHoursCSV";
import { UploadPDF } from "@/components/ui/Form/UploadPDF";
import { Project } from "@/interface/project";
import { projectService } from "@/lib/api/project";
import { useActivityHours } from "@/hooks/useActivityHours";

interface ProjectDocumentsCardProps {
  project: Project;
  token: string;
  userId: string;
  onActionSuccess: () => void;
}

export function ProjectDocumentsCard({
  project,
  token,
  userId,
  onActionSuccess,
}: ProjectDocumentsCardProps) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return window.sessionStorage.getItem("project-documents-active-tab") || "pdf";
    }
    return "pdf";
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Use hook for CSV file actions
  const {
    deleteFile: deleteCsvFile,
    loading: csvLoading,
    error: csvError,
  } = useActivityHours(token);

  // Read role from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const selectedRole = localStorage.getItem("selectedRole");
        if (selectedRole) {
          const parsed = JSON.parse(selectedRole);
          setUserRole(parsed.data.role);
        }
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  // Complete CSV file
  const handleComplete = async (fileId: string) => {
    if (!token || !project?.id || !fileId) return;
    setLoadingId(fileId);
    try {
      await completeActivityHourFile(token, project.id, fileId);
      onActionSuccess();
    } catch (e) {
      console.error("Error completing activity hour file:", e);
    } finally {
      setLoadingId(null);
    }
  };

  // Delete CSV file using hook
  const handleDeleteCsv = async (fileId: string) => {
    setDeletingId(fileId);
    setDeleteError(null);
    try {
      await deleteCsvFile(fileId);
      onActionSuccess();
    } catch (unknown) {
      console.error("Error deleting CSV file:", unknown);
      setDeleteError("ลบไฟล์ไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  const getS3KeyFromUrl = (url: string) => {
    try {
      const match = url.match(/https?:\/\/[^/]+\/([^?]+)/);
      return match ? decodeURIComponent(match[1]) : "";
    } catch {
      return "";
    }
  };
  const handleDeletePdf = async () => {
    setDeletingId("pdf");
    setDeleteError(null);
    try {
      const fileKey = project.documentFiles
        ? getS3KeyFromUrl(project.documentFiles)
        : "";
      if (!fileKey.endsWith(".pdf")) throw new Error("Key ไม่ใช่ไฟล์ PDF");
      console.log("Deleting PDF file with key:", fileKey);
      await projectService.deleteProjectPdfFile(token, project.id, fileKey);
      onActionSuccess();
    } catch (err) {
      console.error("Error deleting PDF file:", err);
      setDeleteError(
        (err as { message?: string })?.message || "ลบไฟล์ PDF ไม่สำเร็จ"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const isTabLocked = !!loadingId || !!deletingId || csvLoading;
  const safeSetActiveTab = (tab: string) => {
    if (isTabLocked) return;
    setActiveTab(tab);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("project-documents-active-tab", activeTab);
    }
  }, [activeTab]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <FileText className="w-6 h-6 text-[#006C67]" />
        เอกสารโครงการ
      </h2>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => safeSetActiveTab("pdf")}
            disabled={isTabLocked}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pdf"
                ? "border-[#006C67] text-[#006C67]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } ${isTabLocked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            ไฟล์สรุปโครงการ (PDF)
          </button>
          <button
            onClick={() => safeSetActiveTab("csv")}
            disabled={isTabLocked}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "csv"
                ? "border-[#006C67] text-[#006C67]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } ${isTabLocked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            ไฟล์ชั่วโมงกิจกรรม (CSV)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "pdf" && (
          <div>
            {/* Preview uploaded PDF file */}
            {project.documentFiles ? (
              <div className="border border-gray-200 rounded-lg px-4 py-3 bg-white mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#006C67]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#006C67]" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    ไฟล์สรุปโครงการ.pdf
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={project.documentFiles}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm text-[#006C67] hover:bg-[#006C67]/10 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleDeletePdf}
                    disabled={deletingId === "pdf"}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">ยังไม่มีไฟล์ PDF</p>
              </div>
            )}
            {/* Upload PDF component */}
            <UploadPDF
              token={token}
              projectId={project.id}
              existingFileUrl={project.documentFiles || null}
              existingFileKey={
                project.documentFiles
                  ? getS3KeyFromUrl(project.documentFiles)
                  : ""
              }
              onSuccess={onActionSuccess}
              onDeleteSuccess={onActionSuccess}
            />
          </div>
        )}

        {activeTab === "csv" && (
          <div className="space-y-4">
            {/* Preview uploaded CSV files */}
            <div>
              {Array.isArray(project.activityHourFiles) &&
              project.activityHourFiles.length > 0 ? (
                <div className="space-y-3">
                  {project.activityHourFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group border border-gray-200 rounded-lg px-4 py-3 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-[#006C67]/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#006C67]" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {file.fileNamePrinciple}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {file.isCompleted ? (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                  ยืนยันแล้ว
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                                  รอดำเนินการ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          {file.fileUrl && (
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-sm text-[#006C67] hover:bg-[#006C67]/10 rounded-md transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteCsv(file.id)}
                            disabled={deletingId === file.id || csvLoading}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {!file.isCompleted && userRole === "CAMPUS_ADMIN" && (
                            <button
                              onClick={() => handleComplete(file.id)}
                              disabled={loadingId === file.id}
                              className="px-3 py-1.5 bg-[#006C67] text-white rounded-md text-sm font-medium hover:bg-[#005550] transition-colors disabled:opacity-50"
                            >
                              {loadingId === file.id
                                ? "กำลังยืนยัน..."
                                : "ยืนยัน"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">ยังไม่มีไฟล์</p>
                </div>
              )}
            </div>
            {/* The main upload component for adding NEW CSV files */}
            <div>
              <UploadActivityHoursCSV
                token={token}
                projectId={project.id}
                userId={userId}
                onSuccess={onActionSuccess}
                existingFileUrl={null}
                existingFileName={null}
                existingFileId={null}
                onDeleteSuccess={onActionSuccess}
              />
            </div>
          </div>
        )}
        {(deleteError || csvError) && (
          <div className="mt-3 text-sm text-red-600">
            {deleteError || csvError}
          </div>
        )}
      </div>
    </div>
  );
}
