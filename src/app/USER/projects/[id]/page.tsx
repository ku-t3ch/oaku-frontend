"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { UploadActivityHoursCSV } from "@/components/ui/Form/UploadActivityHoursCSV";
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
  User,
  FileText,
  Award,
  Globe,
  Lightbulb,
  BookOpen,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function ProjectIdPage() {
  const params = useParams();
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const { project, loading, error, fetchProject } = useProject(token);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "participants"
  >("overview");

  // Get projectId from params
  const projectId = typeof params.id === "string" ? params.id : "";

  // Get userId from localStorage
  const userString =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userString ? JSON.parse(userString) : undefined;
  const userId = user?.id;

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  // Status configuration
  const getStatusConfig = (status: string) => {
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
          label: "กำลังดำเนินการ",
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

  // Format date
  const formatDate = (dateString: string) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </div>
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

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: "overview", label: "ภาพรวม", icon: Eye },
              { key: "details", label: "รายละเอียด", icon: FileText },
              { key: "participants", label: "ผู้เข้าร่วม", icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() =>
                  setActiveTab(key as "overview" | "details" | "participants")
                }
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? "border-[#006C67] text-[#006C67]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Objectives */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#006C67]" />
                  วัตถุประสงค์โครงการ
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.objectives}
                  </p>
                </div>
              </div>
              {/* Activity Format */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#006C67]" />
                  รูปแบบกิจกรรม
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.activityFormat) &&
                    project.activityFormat.map((format, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {format}
                      </span>
                    ))}
                </div>
              </div>
              {/* SDGs */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#006C67]" />
                  เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.sustainableDevelopmentGoals) &&
                    project.sustainableDevelopmentGoals.map((sdg, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {sdg}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ข้อมูลโครงการ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">รหัสโครงการ</p>
                      <p className="font-medium text-gray-900">
                        {project.activityCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">วิทยาเขต</p>
                      <p className="font-medium text-gray-900">
                        {project.campus?.name || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">หน่วยงาน</p>
                      <p className="font-medium text-gray-900">
                        {project.organization?.nameTh || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">งบประมาณ</p>
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                        }).format(project.budgetUsed || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Kasetsart Student Identities */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#006C67]" />
                  อัตลักษณ์นักศึกษา
                </h3>
                <div className="space-y-2">
                  {Array.isArray(project.kasetsartStudentIdentities) &&
                    project.kasetsartStudentIdentities.map(
                      (identity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#006C67] rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            {identity}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
              {/* Compliance Standards */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#006C67]" />
                  มาตรฐานการดำเนินงาน
                </h3>
                <div className="space-y-2">
                  {Array.isArray(project.complianceStandards) &&
                    project.complianceStandards.map((standard, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {standard}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              รายละเอียดโครงการ
            </h3>
            <div className="space-y-8">
              {/* Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 mb-6 flex items-center gap-3 text-lg">
                  <Calendar className="w-6 h-6 text-[#006C67]" />
                  กำหนดการ
                </h4>
                {project.schedule && project.schedule.length > 0 ? (
                  <div className="relative border-l-2 border-teal-200 ml-3 space-y-10">
                    {project.schedule.map((item, index) => (
                      <div key={index} className="relative pl-10">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-[#006C67] rounded-full border-4 border-white shadow"></div>

                        {/* Date and Location Header */}
                        <div className="mb-4">
                          <p className="font-bold text-gray-800 text-lg">
                            {new Date(
                              item.eachDay?.[0]?.date || Date.now()
                            ).toLocaleDateString("th-TH", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {item.location || "ไม่ระบุสถานที่"}
                          </p>
                        </div>

                        {/* Optional Day Description */}
                        {item.eachDay?.[0]?.description && (
                          <div className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm mb-5">
                            <h5 className="font-semibold text-gray-700 mb-2">
                              รายละเอียดกิจกรรม
                            </h5>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {item.eachDay[0].description}
                            </p>
                          </div>
                        )}

                        {/* Timeline Items for the day */}
                        {item.eachDay?.[0]?.timeline &&
                          item.eachDay[0].timeline.length > 0 && (
                            <div className="space-y-4">
                              {item.eachDay[0].timeline.map((timeItem, i) => (
                                <div key={i} className="flex items-start gap-4">
                                  <div className="bg-teal-50 text-teal-700 rounded-lg px-3 py-1 text-sm font-semibold flex-shrink-0 h-fit w-32 text-center">
                                    <Clock className="w-3 h-3 inline-block mr-1.5 mb-px" />
                                    {timeItem.timeStart} - {timeItem.timeEnd}
                                  </div>
                                  <div className="text-slate-600">|</div>
                                  <div className="text-sm text-gray-700 pt-1.5">
                                    {timeItem.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50/80 rounded-xl border border-dashed border-gray-300">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg text-gray-700 font-semibold">
                      ยังไม่มีกำหนดการ
                    </h5>
                    <p className="text-gray-500 text-sm mt-1">
                      ข้อมูลกำหนดการของโครงการจะถูกเพิ่มในภายหลัง
                    </p>
                  </div>
                )}
              </div>
              {/* Expected Outcomes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  ผลลัพธ์ที่คาดหวัง
                </h4>
                {Array.isArray(project.expectedProjectOutcome) &&
                project.expectedProjectOutcome.length > 0 ? (
                  <div className="space-y-2">
                    {project.expectedProjectOutcome.map((outcome, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {JSON.stringify(outcome)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    ยังไม่มีผลลัพธ์ที่คาดหวัง
                  </p>
                )}
              </div>
              {/* Principles and Reasoning */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  หลักการและเหตุผล
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    {project.principlesAndReasoning || "ยังไม่มีข้อมูล"}
                  </p>
                </div>
              </div>
              {/* Activity Hours */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#006C67]" />
                  ชั่วโมงกิจกรรม
                </h4>
                {Array.isArray(project.activityHours) &&
                project.activityHours.length > 0 ? (
                  <div className="space-y-3">
                    {(() => {
                      // แปลงข้อมูลเป็น Object เดียวเหมือนเดิม ทำงานได้ดีกับโครงสร้างใหม่
                      const activityData = Object.assign({}, ...project.activityHours);

                      return ACTIVITY_HOURS_CATEGORIES.map((category) => {
                        // --- กรณีที่เป็นหมวดหมู่ย่อย (กิจกรรมเสริมสร้างสมรรถนะ) ---
                        if (category.fields) {
                          return (
                            <div key={category.key}>
                              {/* ส่วนหัวของหมวดหมู่ */}
                              <div className="p-3 bg-gray-100 rounded-t-lg">
                                <p className="font-semibold text-gray-800">
                                  {category.title}
                                </p>
                              </div>
                              {/* รายการย่อย */}
                              <div className="border-x border-b border-gray-200 rounded-b-lg p-3 space-y-2">
                                {category.fields.map((field) => {
                                  // [แก้ไข] ดึงข้อมูลจาก activityData โดยตรง ไม่ผ่าน subCategoryData
                                  const hours = activityData[field.name] || 0;
                                  // [ลบออก] ไม่ต้องมีเงื่อนไข if (hours === 0) return null;

                                  return (
                                    <div
                                      key={field.name}
                                      className="flex justify-between items-center text-sm"
                                    >
                                      <span className="text-gray-600">- {field.title}</span>
                                      <span className="font-semibold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                                        {hours} ชั่วโมง
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        // --- กรณีที่เป็นหมวดหมู่หลักทั่วไป ---
                        const hours = activityData[category.key] || 0;
                        // [ลบออก] ไม่ต้องมีเงื่อนไข if (hours === 0) return null;

                        return (
                          <div
                            key={category.key}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm"
                          >
                            <span className="font-medium text-gray-800">
                              {category.title}
                            </span>
                            <span className="font-bold text-[#006C67]">
                              {hours} ชั่วโมง
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลชั่วโมงกิจกรรม</p>
                )}
                {/* Upload CSV Component */}
                <div className="mt-4">
                  {userId ? (
                    <UploadActivityHoursCSV
                      token={token}
                      projectId={projectId}
                      userId={userId}
                      existingFileUrl={
                        Array.isArray(project.activityHourFiles) &&
                        project.activityHourFiles[0]?.fileUrl || null
                      }
                      existingFileName={
                        Array.isArray(project.activityHourFiles) &&
                        project.activityHourFiles[0]?.fileNamePrinciple || null
                      }
                      existingFileId={
                        Array.isArray(project.activityHourFiles) &&
                        project.activityHourFiles[0]?.id || null
                      }
                      onSuccess={() => fetchProject(projectId)}
                      onDeleteSuccess={() => fetchProject(projectId)}
                    />
                  ) : (
                    <div className="text-sm text-gray-400">
                      กำลังโหลดข้อมูลผู้ใช้...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "participants" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Users */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#006C67]" />
                กลุ่มเป้าหมาย
              </h3>
              {Array.isArray(project.targetUser) &&
              project.targetUser.length > 0 ? (
                <div className="space-y-3">
                  {project.targetUser.map((target, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {Object.keys(target)[0]}
                      </span>
                      <span className="text-sm text-blue-600 font-semibold">
                        {Object.values(target)[0]} คน
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  ยังไม่มีข้อมูลกลุ่มเป้าหมาย
                </p>
              )}
            </div>
            {/* Participants */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#006C67]" />
                ผู้เข้าร่วม
              </h3>
              {Array.isArray(project.participants) &&
              project.participants.length > 0 ? (
                <div className="space-y-3">
                  {project.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {Object.keys(participant)[0]}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        {Object.values(participant)[0]} คน
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  ยังไม่มีข้อมูลผู้เข้าร่วม
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
