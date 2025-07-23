import React from "react";
import { FileStack, FileCheck, FileClock, FileText, LucideIcon } from "lucide-react";
import { Project } from "@/interface/project";

interface ProjectsStatisticsProps {
  projects: Project[];
}

export const ProjectsStatistics: React.FC<ProjectsStatisticsProps> = ({ projects }) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgressProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const pendingProjects = projects.filter((p) => p.status === "PADDING").length;

  const StatCard = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: number }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-[#006C67]">{value}</p>
        </div>
        <div className="h-12 w-12 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-[#006C67]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={FileStack} label="โครงการทั้งหมด" value={totalProjects} />
      <StatCard icon={FileCheck} label="เสร็จสิ้น" value={completedProjects} />
      <StatCard icon={FileClock} label="กำลังดำเนินการ" value={inProgressProjects} />
      <StatCard icon={FileText} label="ร่างโครงการ" value={pendingProjects} />
    </div>
  );
};