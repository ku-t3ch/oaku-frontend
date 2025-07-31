"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { ACTIVITY_HOURS_CATEGORIES } from "@/constants/ActivityHours";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Target,
  Clock,
  DollarSign,
  Building,
  FileText,
  Award,
  Globe,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { ProjectDocumentsCard } from "@/components/ui/Project/ProjectDocumentsCard";
import type { SDG, KasetsartStudentIdentity } from "@/interface/project";

// Schedule type
type ScheduleTimeline = {
  timeStart: string;
  timeEnd: string;
  description: string;
  location: string;
};
type ScheduleDay = {
  date: string;
  description: string;
  timeline: ScheduleTimeline[];
};
type ScheduleItem = {
  eachDay: ScheduleDay[];
};
type ActivityHoursCategoryField = {
  name: string;
  title: string;
  placeholder: string;
};
type ActivityHoursCategory = {
  title: string;
  key: string;
  placeholder?: string;
  fields?: ActivityHoursCategoryField[];
};

// Helper component for individual info items in cards
interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}
const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-4">
    <Icon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 break-words">{value ?? "-"}</p>
    </div>
  </div>
);

// Helper component for list items in cards
interface ListItemProps {
  children: React.ReactNode;
}
const ListItem = ({ children }: ListItemProps) => (
  <div className="flex items-center gap-3">
    <div className="w-2 h-2 bg-[#006C67] rounded-full flex-shrink-0"></div>
    <span className="text-sm text-gray-700">{children}</span>
  </div>
);

// Main Page Component
export default function ProjectIdPage() {
  const params = useParams();
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const { project, loading, error, fetchProject } = useProject(token);

  const projectId = typeof params.id === "string" ? params.id : "";

  const userString =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userString ? JSON.parse(userString) : undefined;
  const userId = user?.id;

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  type StatusType =
    | "COMPLETED"
    | "IN_PROGRESS"
    | "PADDING"
    | "CANCELED"
    | string;
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "text-green-700 bg-green-100",
          icon: CheckCircle,
          label: "เสร็จสิ้น",
        };
      case "IN_PROGRESS":
        return {
          color: "text-blue-700 bg-blue-100",
          icon: Clock,
          label: "ดำเนินการ",
        };
      case "PADDING":
        return {
          color: "text-white bg-amber-500",
          icon: AlertCircle,
          label: "ร่างโครงการ",
        };
      case "CANCELED":
        return {
          color: "text-red-700 bg-red-100",
          icon: XCircle,
          label: "ยกเลิก",
        };
      default:
        return {
          color: "text-gray-700 bg-gray-100",
          icon: Clock,
          label: "ไม่ระบุ",
        };
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#006C67] mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลดข้อมูลโครงการ...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ไม่พบข้อมูลโครงการ
          </h2>
          <p className="text-gray-600 mb-6">ไม่สามารถโหลดข้อมูลโครงการได้</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[#006C67] text-white rounded-lg hover:bg-[#005A56] transition-colors"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="top-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.nameTh}
                </h1>
                <p className="text-sm text-gray-500">{project.nameEn}</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </div>
          </div>
        </div>
      </div>

      {/* Project Hero Section */}
      <div className="bg-gradient-to-r from-[#006C67] to-[#008B85] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Box: วันที่เริ่มต้น */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 shadow-md">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-white/80" />
                <div>
                  <p className="text-white/80 text-sm">วันที่เริ่มต้น</p>
                  <p className="text-white font-semibold text-lg">
                    {formatDate(project.dateStart)}
                  </p>
                </div>
              </div>
            </div>
            {/* Divider: ถึง */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/50 to-white/50"></div>
                <div className="bg-white text-[#006C67] font-bold text-sm rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                  ถึง
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/50 to-white/50"></div>
              </div>
            </div>
            {/* Box: วันที่สิ้นสุด */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 shadow-md">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-white/80" />
                <div>
                  <p className="text-white/80 text-sm">วันที่สิ้นสุด</p>
                  <p className="text-white font-semibold text-lg">
                    {formatDate(project.dateEnd)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Major Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                เกี่ยวกับโครงการ
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#006C67]" />
                    วัตถุประสงค์
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
                    {project.objectives || "ยังไม่มีข้อมูล"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#006C67]" />
                    หลักการและเหตุผล
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
                    {project.principlesAndReasoning || "ยังไม่มีข้อมูล"}
                  </p>
                </div>
              </div>
            </div>

            {userId && (
              <ProjectDocumentsCard
                project={project}
                token={token}
                userId={userId}
                onActionSuccess={() => fetchProject(projectId)}
              />
            )}

            {/* Schedule Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#006C67]" />
                กำหนดการ
              </h2>
              {Array.isArray(project.schedule) &&
              project.schedule.length > 0 ? (
                <div className="relative border-l-2 border-teal-200 ml-3 space-y-10">
                  {project.schedule.map((item: ScheduleItem, index: number) =>
                    item.eachDay && item.eachDay.length > 0
                      ? item.eachDay.map((day, dayIdx) => (
                          <div
                            key={`${index}-${dayIdx}`}
                            className="relative pl-10"
                          >
                            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-[#006C67] rounded-full border-4 border-white shadow"></div>
                            <p className="font-bold text-gray-800 text-lg">
                              {formatDate(day.date)}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {day.timeline?.[0]?.location ||
                                project.location?.location ||
                                "ไม่ระบุสถานที่"}
                            </p>
                            {day.timeline && day.timeline.length > 0 && (
                              <div className="mt-4 space-y-3 border-t pt-4">
                                {day.timeline.map(
                                  (timeItem: ScheduleTimeline, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-4"
                                    >
                                      <div className="bg-teal-50 text-teal-700 rounded-lg px-3 py-1 text-sm font-semibold flex-shrink-0 w-32 text-center">
                                        {timeItem.timeStart} -{" "}
                                        {timeItem.timeEnd}
                                      </div>
                                      <p className="text-sm text-gray-700 pt-1">
                                        {timeItem.description}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      : null
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50/80 rounded-xl border border-dashed">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h5 className="text-lg text-gray-700 font-semibold">
                    ยังไม่มีกำหนดการ
                  </h5>
                  <p className="text-gray-500 text-sm mt-1">
                    ข้อมูลจะถูกเพิ่มในภายหลัง
                  </p>
                </div>
              )}
            </div>

            {/* Activity Hours Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#006C67]" />
                ชั่วโมงกิจกรรม
              </h2>
              {Array.isArray(project.activityHours) &&
              project.activityHours.length > 0 ? (
                <div className="space-y-3">
                  {(() => {
                    // ใช้ reduce เพื่อรวม activityHours เป็น object เดียว ป้องกัน key ซ้ำ/ข้อมูลหาย
                    const activityData = project.activityHours.reduce(
                      (
                        acc: Record<string, number>,
                        curr: Record<string, number>
                      ) => ({
                        ...acc,
                        ...curr,
                      }),
                      {}
                    );
                    return ACTIVITY_HOURS_CATEGORIES.map(
                      (category: ActivityHoursCategory) => {
                        if (category.fields) {
                          const subCategoryHours = category.fields.reduce(
                            (acc: number, field: ActivityHoursCategoryField) =>
                              acc + (activityData[field.name] || 0),
                            0
                          );
                          if (subCategoryHours === 0) return null;

                          return (
                            <div
                              key={category.key}
                              className="border border-gray-200 rounded-lg"
                            >
                              <div className="p-3 bg-gray-100 rounded-t-md">
                                <p className="font-semibold text-gray-800">
                                  {category.title}
                                </p>
                              </div>
                              <div className="p-3 space-y-2">
                                {category.fields.map(
                                  (field: ActivityHoursCategoryField) => {
                                    const hours = activityData[field.name] || 0;
                                    if (hours === 0) return null;
                                    return (
                                      <div
                                        key={field.name}
                                        className="flex justify-between items-center text-sm pl-2"
                                      >
                                        <span className="text-gray-600">
                                          - {field.title}
                                        </span>
                                        <span className="font-semibold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                                          {hours} ชั่วโมง
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }

                        const hours = activityData[category.key] || 0;
                        if (hours === 0) return null;

                        return (
                          <div
                            key={category.key}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm"
                          >
                            <span className="font-medium text-gray-800">
                              {category.title}
                            </span>
                            <span className="font-bold text-teal-600">
                              {hours} ชั่วโมง
                            </span>
                          </div>
                        );
                      }
                    );
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  ยังไม่มีข้อมูลชั่วโมงกิจกรรม
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-8 lg:sticky lg:top-24">
            {/* Key Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ข้อมูลหลัก
              </h2>
              <div className="space-y-5">
                <InfoItem
                  icon={FileText}
                  label="รหัสโครงการ"
                  value={project.activityCode}
                />
                <InfoItem
                  icon={MapPin}
                  label="วิทยาเขต"
                  value={project.campus?.name}
                />
                <InfoItem
                  icon={Building}
                  label="หน่วยงาน"
                  value={project.organization?.nameTh}
                />
                <InfoItem
                  icon={DollarSign}
                  label="งบประมาณ"
                  value={new Intl.NumberFormat("th-TH", {
                    style: "currency",
                    currency: "THB",
                  }).format(project.budgetUsed || 0)}
                />
              </div>
            </div>

            {/* Participants Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#006C67]" />
                ผู้เข้าร่วม
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                    กลุ่มเป้าหมาย
                  </h3>
                  <span className="font-semibold text-gray-900">
                    {project.targetUser} คน
                  </span>
                </div>
                <div className="border-t my-4"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                    ผู้เข้าร่วมจริง
                  </h3>
                  <span className="font-semibold text-gray-900">
                    {project.participants} คน
                  </span>
                </div>
              </div>
            </div>

            {/* Classifications Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                การจำแนกประเภท
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#006C67]" /> SDGs
                  </h3>
                  <div className="flex flex-wrap gap-2 pl-7">
                    {Array.isArray(project.sustainableDevelopmentGoals) &&
                    project.sustainableDevelopmentGoals.length > 0 ? (
                      (project.sustainableDevelopmentGoals as SDG[]).map(
                        (sdg, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                          >
                            {sdg}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">ไม่มีข้อมูล</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#006C67]" />{" "}
                    อัตลักษณ์นักศึกษา
                  </h3>
                  <div className="space-y-2 pl-7">
                    {Array.isArray(project.kasetsartStudentIdentities) &&
                    project.kasetsartStudentIdentities.length > 0 ? (
                      (
                        project.kasetsartStudentIdentities as KasetsartStudentIdentity[]
                      ).map((identity, index) => (
                        <ListItem key={index}>{identity}</ListItem>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">ไม่มีข้อมูล</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
