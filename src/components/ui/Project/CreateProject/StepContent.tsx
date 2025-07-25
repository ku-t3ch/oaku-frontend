import React, { useState } from "react";
import { FormField } from "../../Form/FormField";
import { Input } from "../../Form/Input";
import { TextArea } from "../../Form/TextArea";
import { MultiSelect } from "../../Form/MultiSelect";
import { ProjectFormData } from "@/interface/projectFormData";
import { Plus, MapPin, Clock, CheckCircle, X, Trash2 } from "lucide-react";
import {
  ComplianceStandard,
  KasetsartStudentIdentity,
  SDG,
} from "@/interface/project";

interface Timeline {
  timeStart: string;
  timeEnd: string;
  description: string;
}

interface Day {
  date: string;
  description: string;
  timeline: Timeline[];
  participants: { staff?: number; student?: number }[];
}

interface ScheduleLocation {
  location: string;
  eachDay: Day[];
}

interface StepContentProps {
  step: number;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  errorFields: string[];
  orgName: string;
  userToken: string;
  campusName: string;
}

const activityFormatOptions = [
  { value: "workshop", label: "เวิร์กช็อป (Workshop)" },
  { value: "seminar", label: "สัมมนา (Seminar)" },
  { value: "training", label: "อบรม (Training)" },
  { value: "conference", label: "ประชุม/การประชุม (Conference)" },
  { value: "fieldwork", label: "ภาคสนาม (Fieldwork)" },
];

const complianceOptions = [
  { value: "KNOWLEDGE", label: "ความรู้ (KNOWLEDGE)" },
  { value: "SKILLS", label: "ทักษะ (SKILLS)" },
  { value: "ETHICS", label: "จริยธรรม (ETHICS)" },
  { value: "PERSONAL_CHARACTERISTICS", label: "คุณลักษณะส่วนบุคคล" },
];

const identityOptions = [
  { value: "INTEGRITY", label: "ความซื่อสัตย์ (INTEGRITY)" },
  { value: "DETERMINATION", label: "ความมุ่งมั่น (DETERMINATION)" },
  { value: "KNOWLEDGE_CREATION", label: "การสร้างความรู้" },
  { value: "UNITY", label: "ความสามัคคี (UNITY)" },
];

const sdgOptions = Array.from({ length: 17 }, (_, i) => ({
  value: `SDG${i + 1}`,
  label: `SDG ${i + 1}`,
}));

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  icon?: React.ElementType;
  className?: string;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded focus:outline-none transition-all duration-200";
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";
  const variantClasses = {
    primary: "bg-[#006C67] text-white hover:bg-[#00564d]",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "text-[#006C67] hover:text-[#004c47] hover:bg-[#e6f5f3]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const SuccessToast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed bottom-4 right-4 bg-[#e6f5f3] border border-[#b3e2da] rounded-md p-4 shadow-md flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-[#006C67]" />
    <span className="text-sm text-[#006C67]">{message}</span>
    <button onClick={onClose} className="text-[#006C67] hover:text-[#004c47]">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const StepContent: React.FC<StepContentProps> = ({
  step,
  formData,
  setFormData,
  errorFields,
  orgName,
  campusName,
}) => {
  const errorMsg = (field: string) =>
    errorFields.includes(field) ? (
      <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <div className="w-1 h-1 bg-red-500 rounded-full" />
        กรุณากรอกข้อมูล
      </div>
    ) : null;

  // States
  const [scheduleLocation, setScheduleLocation] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleDayDescription, setScheduleDayDescription] = useState("");
  const [scheduleTimeStart, setScheduleTimeStart] = useState("");
  const [scheduleTimeEnd, setScheduleTimeEnd] = useState("");
  const [scheduleTimelineDescription, setScheduleTimelineDescription] =
    useState("");
  const [timelineList, setTimelineList] = useState<Timeline[]>([]);
  const [scheduleList, setScheduleList] = useState<ScheduleLocation[]>(
    (formData.schedule as ScheduleLocation[]) || []
  );
  const [dayStaffParticipant, setDayStaffParticipant] = useState("");
  const [dayStudentParticipant, setDayStudentParticipant] = useState("");
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const [targetUserList, setTargetUserList] = useState<
    { type: string; count: string }[]
  >([]);
  const [participantsList, setParticipantsList] = useState<
    { type: string; count: string }[]
  >([]);

  // Handlers
  const handleAddTimeline = () => {
    if (!scheduleTimeStart || !scheduleTimeEnd) return;
    setTimelineList([
      ...timelineList,
      {
        timeStart: scheduleTimeStart,
        timeEnd: scheduleTimeEnd,
        description: scheduleTimelineDescription,
      },
    ]);
    setScheduleTimeStart("");
    setScheduleTimeEnd("");
    setScheduleTimelineDescription("");
  };

  const handleAddDayToLocation = () => {
    if (!scheduleDate) return;
    if (
      (formData.dateStart && scheduleDate < formData.dateStart) ||
      (formData.dateEnd && scheduleDate > formData.dateEnd)
    ) {
      setAddSuccess("วันที่ต้องอยู่ในช่วงวันที่จัดกิจกรรม");
      setTimeout(() => setAddSuccess(null), 3000);
      return;
    }

    const newDay: Day = {
      date: scheduleDate,
      description: scheduleDayDescription,
      timeline: timelineList,
      participants: [
        { staff: Number(dayStaffParticipant) || 0 },
        { student: Number(dayStudentParticipant) || 0 },
      ],
    };

    const updatedScheduleList = [...scheduleList];
    const locationIdx = updatedScheduleList.findIndex(
      (s) => s.location === scheduleLocation
    );

    if (locationIdx === -1) {
      updatedScheduleList.push({
        location: scheduleLocation,
        eachDay: [newDay],
      });
    } else {
      updatedScheduleList[locationIdx].eachDay.push(newDay);
    }

    setScheduleList(updatedScheduleList);
    setFormData({ ...formData, schedule: updatedScheduleList });
    setScheduleDate("");
    setScheduleDayDescription("");
    setTimelineList([]);
    setDayStaffParticipant("");
    setDayStudentParticipant("");
    setAddSuccess("เพิ่มวันและผู้เข้าร่วมสำเร็จ!");
    setTimeout(() => setAddSuccess(null), 3000);
  };

  const removeTimeline = (index: number) => {
    setTimelineList(timelineList.filter((_, i) => i !== index));
  };

  switch (step) {
    case 0:
      return (
        <div className="max-w-4xl mx-auto space-y-6 text-black">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="รหัสกิจกรรม" required>
                  <Input
                    value={formData.activityCode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, activityCode: e.target.value })
                    }
                    placeholder="เช่น ACT2024001"
                  />
                  {errorMsg("activityCode")}
                </FormField>

                <FormField label="ชื่อโครงการ (ภาษาไทย)" required>
                  <Input
                    value={formData.nameTh || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nameTh: e.target.value })
                    }
                    placeholder="ชื่อโครงการภาษาไทย"
                  />
                  {errorMsg("nameTh")}
                </FormField>
                <FormField label="วิทยาเขต">
                  <div className="flex items-center text-gray-600">
                    <Input value={campusName} readOnly />
                  </div>
                </FormField>
              </div>

              <div className="">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="วันที่เริ่มต้น" required>
                    <Input
                      type="date"
                      value={formData.dateStart || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dateStart: e.target.value })
                      }
                    />
                    {errorMsg("dateStart")}
                  </FormField>

                  <FormField label="วันที่สิ้นสุด" required>
                    <Input
                      type="date"
                      value={formData.dateEnd || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dateEnd: e.target.value })
                      }
                    />
                    {errorMsg("dateEnd")}
                  </FormField>
                </div>
                <FormField label="ชื่อโครงการ (ภาษาอังกฤษ)" required>
                  <Input
                    value={formData.nameEn || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="Project Name in English"
                  />
                  {errorMsg("nameEn")}
                </FormField>
                <FormField label="หน่วยงาน">
                  <div className="flex items-center text-gray-600">
                    <Input value={orgName} readOnly />
                  </div>
                </FormField>
              </div>
            </div>
          </Card>
        </div>
      );

    case 1:
      return (
        <div className="max-w-4xl mx-auto space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <SectionHeader title="รายละเอียดกิจกรรม" />
              <div className="space-y-4">
                <FormField label="รูปแบบกิจกรรม">
                  <MultiSelect
                    options={activityFormatOptions}
                    selected={formData.activityFormat || []}
                    onChange={(values) =>
                      setFormData({ ...formData, activityFormat: values })
                    }
                    placeholder="เลือกรูปแบบกิจกรรม"
                  />
                </FormField>

                <FormField label="หลักการและเหตุผล">
                  <TextArea
                    value={formData.principlesAndReasoning || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        principlesAndReasoning: e.target.value,
                      })
                    }
                    placeholder="อธิบายหลักการและเหตุผลในการจัดกิจกรรม"
                    rows={4}
                  />
                </FormField>

                <FormField label="มาตรฐานการปฏิบัติ">
                  <MultiSelect
                    options={complianceOptions}
                    selected={formData.complianceStandards || []}
                    onChange={(values) =>
                      setFormData({
                        ...formData,
                        complianceStandards: values as ComplianceStandard[],
                      })
                    }
                    placeholder="เลือกมาตรฐานการปฏิบัติ"
                  />
                </FormField>
              </div>
            </Card>

            <Card>
              <SectionHeader title="วัตถุประสงค์" />
              <FormField label="วัตถุประสงค์และรายละเอียดกิจกรรม" required>
                <TextArea
                  value={formData.objectives || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, objectives: e.target.value })
                  }
                  placeholder="อธิบายวัตถุประสงค์และรายละเอียดของกิจกรรม"
                  rows={12}
                />
                {errorMsg("objectives")}
              </FormField>
            </Card>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="max-w-6xl mx-auto text-black">
          <div className="grid  gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Budget & Goals */}
              <Card>
                <SectionHeader title="งบประมาณและเป้าหมาย" />
                <div className="space-y-4">
                  <FormField label="งบประมาณที่ใช้ (บาท)" required>
                    <Input
                      type="number"
                      value={formData.budgetUsed ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budgetUsed:
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value),
                        })
                      }
                      placeholder="0"
                    />
                    {errorMsg("budgetUsed")}
                  </FormField>

                  <FormField label="อัตลักษณ์นักศึกษามหาวิทยาลัยเกษตรศาสตร์">
                    <MultiSelect
                      options={identityOptions}
                      selected={formData.kasetsartStudentIdentities || []}
                      onChange={(values) =>
                        setFormData({
                          ...formData,
                          kasetsartStudentIdentities:
                            values as KasetsartStudentIdentity[],
                        })
                      }
                      placeholder="เลือกอัตลักษณ์นักศึกษา"
                    />
                  </FormField>

                  <FormField label="เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)">
                    <MultiSelect
                      options={sdgOptions}
                      selected={formData.sustainableDevelopmentGoals || []}
                      onChange={(values) =>
                        setFormData({
                          ...formData,
                          sustainableDevelopmentGoals: values as SDG[],
                        })
                      }
                      placeholder="เลือก SDGs ที่เกี่ยวข้อง"
                    />
                  </FormField>
                </div>
              </Card>

              {/* Participants */}
              <Card>
                <SectionHeader title="กลุ่มเป้าหมายและผู้เข้าร่วม" />
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      กลุ่มเป้าหมาย
                    </p>
                    {targetUserList.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          value={item.type}
                          onChange={(e) => {
                            const list = [...targetUserList];
                            list[idx].type = e.target.value;
                            setTargetUserList(list);
                          }}
                          placeholder="ประเภท เช่น บุคลากร, นักศึกษา"
                        />
                        <Input
                          type="number"
                          value={item.count}
                          onChange={(e) => {
                            const list = [...targetUserList];
                            list[idx].count = e.target.value;
                            setTargetUserList(list);
                          }}
                          placeholder="จำนวน"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTargetUserList(
                              targetUserList.filter((_, i) => i !== idx)
                            );
                          }}
                        >
                          ลบ
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        setTargetUserList([
                          ...targetUserList,
                          { type: "", count: "" },
                        ])
                      }
                    >
                      เพิ่มประเภทกลุ่มเป้าหมาย
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2 ml-2"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          targetUser: targetUserList
                            .filter((item) => item.type && item.count)
                            .map((item) => ({
                              [item.type]: Number(item.count),
                            })),
                        });
                        setAddSuccess("บันทึกกลุ่มเป้าหมายสำเร็จ!");
                        setTimeout(() => setAddSuccess(null), 3000);
                      }}
                    >
                      บันทึกกลุ่มเป้าหมาย
                    </Button>
                  </div>

                  {/* ผู้เข้าร่วมกิจกรรม */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      ผู้เข้าร่วมกิจกรรม
                    </p>
                    {participantsList.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          value={item.type}
                          onChange={(e) => {
                            const list = [...participantsList];
                            list[idx].type = e.target.value;
                            setParticipantsList(list);
                          }}
                          placeholder="ประเภท เช่น บุคลากร, นักศึกษา"
                        />
                        <Input
                          type="number"
                          value={item.count}
                          onChange={(e) => {
                            const list = [...participantsList];
                            list[idx].count = e.target.value;
                            setParticipantsList(list);
                          }}
                          placeholder="จำนวน"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setParticipantsList(
                              participantsList.filter((_, i) => i !== idx)
                            );
                          }}
                        >
                          ลบ
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        setParticipantsList([
                          ...participantsList,
                          { type: "", count: "" },
                        ])
                      }
                    >
                      เพิ่มประเภทผู้เข้าร่วม
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2 ml-2"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          participants: participantsList
                            .filter((item) => item.type && item.count)
                            .map((item) => ({
                              [item.type]: Number(item.count),
                            })),
                        });
                        setAddSuccess("บันทึกผู้เข้าร่วมสำเร็จ!");
                        setTimeout(() => setAddSuccess(null), 3000);
                      }}
                    >
                      บันทึกผู้เข้าร่วม
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {addSuccess && (
            <SuccessToast
              message={addSuccess}
              onClose={() => setAddSuccess(null)}
            />
          )}
        </div>
      );

    case 3:
      return (
        <div className="max-w-6xl mx-auto text-black">
          <Card>
            <SectionHeader title="ตารางกิจกรรม" />
            <div className="space-y-4">
              <Input
                value={scheduleLocation}
                onChange={(e) => setScheduleLocation(e.target.value)}
                placeholder="ชื่อสถานที่"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={scheduleDate}
                  min={formData.dateStart || ""}
                  max={formData.dateEnd || ""}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>

              <TextArea
                value={scheduleDayDescription}
                onChange={(e) => setScheduleDayDescription(e.target.value)}
                placeholder="รายละเอียดกิจกรรมในวันนั้น"
                rows={2}
              />

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ช่วงเวลา
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="time"
                      value={scheduleTimeStart}
                      onChange={(e) => setScheduleTimeStart(e.target.value)}
                    />
                    <Input
                      type="time"
                      value={scheduleTimeEnd}
                      onChange={(e) => setScheduleTimeEnd(e.target.value)}
                    />
                  </div>
                  <Input
                    value={scheduleTimelineDescription}
                    onChange={(e) =>
                      setScheduleTimelineDescription(e.target.value)
                    }
                    placeholder="รายละเอียดช่วงเวลา"
                  />
                  <Button
                    onClick={handleAddTimeline}
                    size="sm"
                    variant="ghost"
                    icon={Plus}
                  >
                    เพิ่มช่วงเวลา
                  </Button>
                </div>

                {timelineList.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {timelineList.map((tl, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="text-sm">
                          <span className="font-medium">
                            {tl.timeStart} - {tl.timeEnd}
                          </span>
                          {tl.description && (
                            <span className="text-gray-600 ml-2">
                              {tl.description}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeTimeline(idx)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleAddDayToLocation}
                icon={Plus}
                className="w-full"
              >
                เพิ่มวันในตารางกิจกรรม
              </Button>

              {scheduleList.length > 0 && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm font-medium text-gray-700">
                    ตารางกิจกรรมที่เพิ่มแล้ว
                  </p>
                  {scheduleList.map((loc, idx) => (
                    <div key={idx} className="border rounded-xl p-4 space-y-3">
                      <h5 className="font-medium text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {loc.location}
                      </h5>
                      {loc.eachDay.map((day: Day, dIdx: number) => (
                        <div
                          key={dIdx}
                          className="ml-6 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {day.date}
                            </span>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>
                                บุคลากร: {day.participants?.[0]?.staff || 0}
                              </span>
                              <span>
                                นักศึกษา: {day.participants?.[1]?.student || 0}
                              </span>
                            </div>
                          </div>
                          {day.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {day.description}
                            </p>
                          )}
                          {day.timeline.length > 0 && (
                            <div className="space-y-1">
                              {day.timeline.map(
                                (tl: Timeline, tIdx: number) => (
                                  <div
                                    key={tIdx}
                                    className="text-xs text-gray-500"
                                  >
                                    {tl.timeStart} - {tl.timeEnd}
                                    {tl.description && `: ${tl.description}`}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      );

    case 4:
      return (
        <div className="max-w-6xl mx-auto text-black">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-6 h-6" style={{ color: "#006C67" }} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                ตรวจสอบข้อมูลโครงการ
              </h3>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#006C67" }}
                    />
                    ข้อมูลพื้นฐาน
                  </h4>
                  <div className="space-y-3 ml-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">รหัสกิจกรรม</span>
                      <span className="text-sm text-gray-900">
                        {formData.activityCode || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        ชื่อโครงการ (EN)
                      </span>
                      <span className="text-sm text-gray-900">
                        {formData.nameEn || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        ชื่อโครงการ (TH)
                      </span>
                      <span className="text-sm text-gray-900">
                        {formData.nameTh || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">ระยะเวลา</span>
                      <span className="text-sm text-gray-900">
                        {formData.dateStart} ถึง {formData.dateEnd}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#006C67" }}
                    />
                    งบประมาณและเป้าหมาย
                  </h4>
                  <div className="space-y-3 ml-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">งบประมาณ</span>
                      <span className="text-sm text-gray-900">
                        {formData.budgetUsed?.toLocaleString()} บาท
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        รูปแบบกิจกรรม
                      </span>
                      <span className="text-sm text-gray-900">
                        {formData.activityFormat?.join(", ") || "ไม่ได้ระบุ"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">หน่วยงาน</span>
                      <span className="text-sm text-gray-900">{orgName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">วิทยาเขต</span>
                      <span className="text-sm text-gray-900">
                        {campusName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              {formData.objectives && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#006C67" }}
                    />
                    วัตถุประสงค์
                  </h4>
                  <div className="ml-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {formData.objectives}
                    </p>
                  </div>
                </div>
              )}

              {/* Expected Outcomes */}
              {formData.expectedProjectOutcome &&
                formData.expectedProjectOutcome.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#006C67" }}
                      />
                      ผลที่คาดว่าจะได้รับ
                    </h4>
                    <div className="ml-4 p-4 bg-gray-50 rounded-xl">
                      <ul className="space-y-2">
                        {formData.expectedProjectOutcome.map((outcome, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          </Card>
        </div>
      );

    default:
      return null;
  }
};

export default StepContent;
