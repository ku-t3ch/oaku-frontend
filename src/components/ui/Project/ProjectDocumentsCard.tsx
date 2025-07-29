"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import { UploadActivityHoursCSV } from "@/components/ui/Form/UploadActivityHoursCSV";
import { Project } from "@/interface/project";

interface ProjectDocumentsCardProps {
  project: Project;
  token: string;
  userId: string;
  onActionSuccess: () => void;
}

export function ProjectDocumentsCard({ project, token, userId, onActionSuccess }: ProjectDocumentsCardProps) {
  const [activeTab, setActiveTab] = useState("pdf");

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
        {activeTab === "pdf" && (
          <div>
            wsg
          </div>
        )}

        {activeTab === "csv" && (
          <div className="space-y-4">
            {/* The main upload component for adding NEW CSV files */}
            <div>
                 <UploadActivityHoursCSV
                    token={token}
                    projectId={project.id}
                    userId={userId}
                    onSuccess={onActionSuccess}
                    // Pass null to existingFile props to make it an "add new" button
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