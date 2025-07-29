"use client";

import { completeActivityHourFile } from "@/lib/api/project";
import { FileText, Download } from "lucide-react";
import { useEffect, useState } from "react";

import { UploadActivityHoursCSV } from "@/components/ui/Form/UploadActivityHoursCSV";
import { Project } from "@/interface/project";

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
  const [activeTab, setActiveTab] = useState("pdf");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // อ่าน role จาก localStorage
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
            onClick={() => setActiveTab("pdf")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pdf"
                ? "border-[#006C67] text-[#006C67]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            ไฟล์สรุปโครงการ (PDF)
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "csv"
                ? "border-[#006C67] text-[#006C67]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            ไฟล์ชั่วโมงกิจกรรม (CSV)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "pdf" && <div>wsg</div>}

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
                          
                          {!file.isCompleted && userRole === "CAMPUS_ADMIN" && (
                            <button
                              onClick={() => handleComplete(file.id)}
                              disabled={loadingId === file.id}
                              className="px-3 py-1.5 bg-[#006C67] text-white rounded-md text-sm font-medium hover:bg-[#005550] transition-colors disabled:opacity-50"
                            >
                              {loadingId === file.id ? "กำลังยืนยัน..." : "ยืนยัน"}
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
      </div>
    </div>
  );
}
