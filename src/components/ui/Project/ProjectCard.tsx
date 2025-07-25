
import React from "react";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Project } from "@/interface/project";

interface ProjectCardProps {
  project: Project;
  onProjectClick: (project: Project) => void;
  organizationName?: string; // สำหรับ USER role
}

const getStatusProps = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return { text: "เสร็จสิ้น", bgClass: "bg-[#006C67]" };
    case "IN_PROGRESS":
      return { text: "กำลังดำเนินการ", bgClass: "bg-blue-600" };
    case "PADDING":
      return { text: "ร่างโครงการ", bgClass: "bg-amber-500" };
    case "CANCELED":
      return { text: "ยกเลิก", bgClass: "bg-red-600" };
    default:
      return { text: status, bgClass: "bg-gray-400" };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateParticipants = (data: Array<Record<string, number>> | null) => {
  if (!data) return 0;
  return data.reduce(
    (total, group) =>
      total + Object.values(group).reduce((sum, count) => sum + count, 0),
    0
  );
};

const formatBudget = (budget: number | null) => {
  if (!budget) return "ไม่ระบุ";
  return new Intl.NumberFormat("th-TH").format(budget) + " บาท";
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onProjectClick, 
  organizationName 
}) => {
  const status = getStatusProps(project.status);
  const currentParticipants = calculateParticipants(project.participants || []);
  const targetParticipants = calculateParticipants(project.targetUser || []);

  return (
    <div
      className="group bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200/50 shadow-md overflow-hidden cursor-pointer rounded-xl"
      onClick={() => onProjectClick(project)}
    >
      {/* Status Header */}
      <div className={`h-2 ${status.bgClass}`} />

      <div className="p-6">
        <div className="pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {project.activityCode}
              </span>
              <span className={`inline-block px-2 py-1 text-center text-xs font-semibold rounded-full ${status.bgClass} text-white`}>
                {status.text}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-[#006C67] transition-colors mb-1">
            {project.nameTh}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {project.nameEn}
          </p>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-[#006C67]" />
            <span>
              {formatDate(project.dateStart)} - {formatDate(project.dateEnd)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-[#006C67]" />
            <span className="truncate">
              {project.location?.location || "ไม่ระบุสถานที่"}
              {project.location?.outside &&
                project.location.outside.length > 0 &&
                `, ${project.location.outside[0].province}`}
            </span>
          </div>

          {/* Participants */}
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2 text-[#006C67]" />
            <span>
              {currentParticipants} / {targetParticipants} คน
            </span>
          </div>

          {/* Budget */}
          {project.budgetUsed && (
            <div className="text-sm">
              <span className="text-gray-600">งบประมาณที่ใช้: </span>
              <span className="font-semibold text-gray-800">
                {formatBudget(project.budgetUsed)}
              </span>
            </div>
          )}

          {/* SDG Tags */}
          {project.sustainableDevelopmentGoals && project.sustainableDevelopmentGoals.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.sustainableDevelopmentGoals.slice(0, 3).map((sdg) => (
                <span
                  key={sdg}
                  className="px-2 py-1 text-xs text-[#006C67] border border-[#006C67]/30 bg-[#006C67]/5 hover:bg-[#006C67]/10 rounded-full"
                >
                  {sdg}
                </span>
              ))}
              {project.sustainableDevelopmentGoals.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-full">
                  +{project.sustainableDevelopmentGoals.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm">
            <p className="text-gray-500 text-xs">หน่วยงาน</p>
            <p className="font-medium text-gray-700 truncate">
              {organizationName || 
               project.organization?.nameTh ||
               project.organization?.nameEn ||
               "ไม่ระบุหน่วยงาน"}
            </p>
          </div>
          <button
            className="flex items-center gap-2 text-[#006C67] hover:bg-[#006C67]/10 px-3 py-1 rounded-lg font-semibold group-hover:translate-x-1 transition-transform text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onProjectClick(project);
            }}
          >
            ดูรายละเอียด
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};