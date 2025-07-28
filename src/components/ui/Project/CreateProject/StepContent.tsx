import React, { useState } from "react";
import { FormField } from "../../Form/FormField";
import { Input } from "../../Form/Input";
import { TextArea } from "../../Form/TextArea";
import { MultiSelect } from "../../Form/MultiSelect";
import { ProjectFormData } from "@/interface/projectFormData";
import { Clock, CheckCircle, X } from "lucide-react";
import {
  ComplianceStandard,
  KasetsartStudentIdentity,
  SDG,
} from "@/interface/project";
import { ACTIVITY_HOURS_CATEGORIES } from "@/constants/ActivityHours";

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
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded focus:outline-none transition-all duration-200";
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";
  const variantClasses = {
    primary: "bg-[#006C67] text-white hover:bg-[#00564d]",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "text-[#006C67] hover:text-[#004c47] hover:bg-[#e6f5f3]",
  };
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${
        variantClasses[variant]
      } ${className} ${disabled ? disabledClasses : ""}`}
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
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // กลุ่มเป้าหมายและผู้เข้าร่วม
  const [targetUserList, setTargetUserList] = useState<
    { type: string; count: string }[]
  >([]);
  const [participantsList, setParticipantsList] = useState<
    { type: string; count: string }[]
  >([]);

  // ตารางกิจกรรมแบบ dynamic
  const [scheduleList, setScheduleList] = useState<ScheduleLocation[]>(
    (formData.schedule as ScheduleLocation[]) || []
  );

  // --- case 3: ตารางกิจกรรมแบบ dynamic ---
  // เพิ่มสถานที่ใหม่
  const handleAddLocation = () => {
    setScheduleList([...scheduleList, { location: "", eachDay: [] }]);
    setFormData({
      ...formData,
      schedule: [...scheduleList, { location: "", eachDay: [] }],
    });
  };

  // เพิ่มวันในสถานที่
  const handleAddDay = (locIdx: number) => {
    const updated = [...scheduleList];
    updated[locIdx].eachDay.push({
      date: "",
      description: "",
      timeline: [],
      participants: [],
    });
    setScheduleList(updated);
    setFormData({ ...formData, schedule: updated });
  };

  // เพิ่มช่วงเวลาในวัน
  const handleAddTimeline = (locIdx: number, dayIdx: number) => {
    const updated = [...scheduleList];
    updated[locIdx].eachDay[dayIdx].timeline.push({
      timeStart: "",
      timeEnd: "",
      description: "",
    });
    setScheduleList(updated);
    setFormData({ ...formData, schedule: updated });
  };

  // ลบสถานที่
  const handleRemoveLocation = (locIdx: number) => {
    const updated = scheduleList.filter((_, i) => i !== locIdx);
    setScheduleList(updated);
    setFormData({ ...formData, schedule: updated });
  };

  // ลบวัน
  const handleRemoveDay = (locIdx: number, dayIdx: number) => {
    const updated = [...scheduleList];
    updated[locIdx].eachDay = updated[locIdx].eachDay.filter(
      (_, i) => i !== dayIdx
    );
    setScheduleList(updated);
    setFormData({ ...formData, schedule: updated });
  };

  // ลบช่วงเวลา
  const handleRemoveTimeline = (
    locIdx: number,
    dayIdx: number,
    tlIdx: number
  ) => {
    const updated = [...scheduleList];
    updated[locIdx].eachDay[dayIdx].timeline = updated[locIdx].eachDay[
      dayIdx
    ].timeline.filter((_, i) => i !== tlIdx);
    setScheduleList(updated);
    setFormData({ ...formData, schedule: updated });
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
                  <div className="flex items-center text-gray-600 ">
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
        <div className="max-w-3xl mx-auto space-y-8 text-black">
          <div className="grid grid-cols-1 gap-8">
            <Card className="p-6 border bg-white shadow-none">
              <SectionHeader title="รายละเอียดกิจกรรม" />
              <div className="space-y-6">
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

            <Card className="p-6 border bg-white shadow-none">
              <SectionHeader title="ชั่วโมงกิจกรรม" />
              <div className="space-y-2">
                {ACTIVITY_HOURS_CATEGORIES.map((cat) =>
                  !cat.fields ? (
                    <div key={cat.key} className="flex flex-col gap-2">
                      <span className="text-base font-medium text-gray-900">
                        {cat.title}
                      </span>
                      <FormField label="">
                        <Input
                          type="number"
                          min={0}
                          value={
                            formData.activityHours?.[0]?.[cat.key] !==
                              undefined &&
                            formData.activityHours?.[0]?.[cat.key] !== null
                              ? formData.activityHours?.[0]?.[cat.key]
                              : ""
                          }
                          onChange={(e) => {
                            const updated = {
                              ...(formData.activityHours?.[0] || {}),
                              [cat.key]: Number(e.target.value),
                            };
                            setFormData({
                              ...formData,
                              activityHours: [{ ...updated }],
                            });
                          }}
                          placeholder={cat.placeholder}
                          className="w-full"
                        />
                      </FormField>
                    </div>
                  ) : (
                    <div key={cat.key} className="space-y-2">
                      <span className="text-base font-medium text-gray-900">
                        {cat.title}
                      </span>
                      <div className="gap-2 ">
                        {cat.fields.map((field) => (
                          <div key={field.name} className="flex flex-col ">
                            <FormField label="">
                              <Input
                                min={0}
                                type="number"
                                value={
                                  formData.activityHours?.[0]?.[field.name] !==
                                    undefined &&
                                  formData.activityHours?.[0]?.[field.name] !==
                                    null
                                    ? formData.activityHours?.[0]?.[field.name]
                                    : ""
                                }
                                onChange={(e) => {
                                  const updated = {
                                    ...(formData.activityHours?.[0] || {}),
                                    [field.name]: Number(e.target.value),
                                  };
                                  setFormData({
                                    ...formData,
                                    activityHours: [{ ...updated }],
                                  });
                                }}
                                placeholder={field.placeholder}
                                className="w-full"
                              />
                            </FormField>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>

            <Card className="p-6 border bg-white shadow-none">
              <SectionHeader title="วัตถุประสงค์" />
              <FormField label="วัตถุประสงค์และรายละเอียดกิจกรรม" required>
                <TextArea
                  value={formData.objectives || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, objectives: e.target.value })
                  }
                  placeholder="อธิบายวัตถุประสงค์และรายละเอียดของกิจกรรม"
                  rows={6}
                />
                {errorMsg("objectives")}
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
                {errorMsg("principlesAndReasoning")}
              </FormField>
            </Card>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="max-w-6xl mx-auto text-black">
          <div className="grid gap-6">
            <div className="space-y-6">
              <Card>
                <SectionHeader title="งบประมาณและเป้าหมาย" />
                <div className="space-y-4">
                  <FormField label="งบประมาณที่ใช้ (บาท)" required>
                    <Input
                      min={0}
                      type="number"
                      value={
                        formData.budgetUsed === 0
                          ? ""
                          : formData.budgetUsed ?? ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budgetUsed:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      placeholder="งบประมาณที่ใช้"
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

              {/* Location */}
              <Card>
                <SectionHeader title="สถานที่จัดกิจกรรม" />
                <div className="space-y-4">
                  <FormField label="ชื่อสถานที่">
                    <Input
                      value={formData.location?.location || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            location: e.target.value,
                            outside: formData.location?.outside,
                          },
                        })
                      }
                      placeholder="ชื่อสถานที่"
                    />
                  </FormField>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="outsideKU"
                      checked={!!formData.location?.outside}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            location: {
                              location: formData.location?.location || "",
                              outside: {
                                postcode: "",
                                address: "",
                                city: "",
                                province: "",
                              },
                            },
                          });
                        } else {
                          setFormData({
                            ...formData,
                            location: {
                              location: formData.location?.location || "",
                              outside: undefined,
                            },
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="outsideKU"
                      className="text-sm text-gray-700"
                    >
                      จัดกิจกรรมนอกมหาวิทยาลัยเกษตรศาสตร์
                    </label>
                  </div>
                  {formData.location?.outside && (
                    <>
                      <FormField label="รหัสไปรษณีย์">
                        <Input
                          value={formData.location.outside.postcode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode: e.target.value,
                                  address:
                                    formData.location?.outside?.address || "",
                                  city: formData.location?.outside?.city || "",
                                  province:
                                    formData.location?.outside?.province || "",
                                },
                              },
                            })
                          }
                          placeholder="รหัสไปรษณีย์"
                        />
                      </FormField>
                      <FormField label="ที่อยู่">
                        <Input
                          value={formData.location.outside.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode || "",
                                  address: e.target.value,
                                  city: formData.location?.outside?.city || "",
                                  province:
                                    formData.location?.outside?.province || "",
                                },
                              },
                            })
                          }
                          placeholder="ที่อยู่"
                        />
                      </FormField>
                      <FormField label="อำเภอ/เขต">
                        <Input
                          value={formData.location.outside.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode || "",
                                  address:
                                    formData.location?.outside?.address || "",
                                  city: e.target.value,
                                  province:
                                    formData.location?.outside?.province || "",
                                },
                              },
                            })
                          }
                          placeholder="อำเภอ/เขต"
                        />
                      </FormField>
                      <FormField label="จังหวัด">
                        <Input
                          value={formData.location.outside.province}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode || "",
                                  address:
                                    formData.location?.outside?.address || "",
                                  city: formData.location?.outside?.city || "",
                                  province: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="จังหวัด"
                        />
                      </FormField>
                    </>
                  )}
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
                            setFormData({
                              ...formData,
                              targetUser: list
                                .filter((i) => i.type && i.count)
                                .map((i) => ({ [i.type]: Number(i.count) })),
                            });
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
                            setFormData({
                              ...formData,
                              targetUser: list
                                .filter((i) => i.type && i.count)
                                .map((i) => ({ [i.type]: Number(i.count) })),
                            });
                          }}
                          placeholder="จำนวน"
                        />
                        {targetUserList.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const list = targetUserList.filter(
                                (_, i) => i !== idx
                              );
                              setTargetUserList(list);
                              setFormData({
                                ...formData,
                                targetUser: list
                                  .filter((i) => i.type && i.count)
                                  .map((i) => ({ [i.type]: Number(i.count) })),
                              });
                            }}
                          >
                            ลบ
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      disabled={
                        targetUserList.length > 0 &&
                        (!targetUserList[targetUserList.length - 1].type ||
                          !targetUserList[targetUserList.length - 1].count)
                      }
                      onClick={() => {
                        const list = [
                          ...targetUserList,
                          { type: "", count: "" },
                        ];
                        setTargetUserList(list);
                        setFormData({
                          ...formData,
                          targetUser: list
                            .filter((i) => i.type && i.count)
                            .map((i) => ({ [i.type]: Number(i.count) })),
                        });
                      }}
                    >
                      เพิ่มประเภทกลุ่มเป้าหมาย
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
                            setFormData({
                              ...formData,
                              participants: list
                                .filter((i) => i.type && i.count)
                                .map((i) => ({ [i.type]: Number(i.count) })),
                            });
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
                            setFormData({
                              ...formData,
                              participants: list
                                .filter((i) => i.type && i.count)
                                .map((i) => ({ [i.type]: Number(i.count) })),
                            });
                          }}
                          placeholder="จำนวน"
                        />
                        {participantsList.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const list = participantsList.filter(
                                (_, i) => i !== idx
                              );
                              setParticipantsList(list);
                              setFormData({
                                ...formData,
                                participants: list
                                  .filter((i) => i.type && i.count)
                                  .map((i) => ({ [i.type]: Number(i.count) })),
                              });
                            }}
                          >
                            ลบ
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      disabled={
                        participantsList.length > 0 &&
                        (!participantsList[participantsList.length - 1].type ||
                          !participantsList[participantsList.length - 1].count)
                      }
                      onClick={() => {
                        const list = [
                          ...participantsList,
                          { type: "", count: "" },
                        ];
                        setParticipantsList(list);
                        setFormData({
                          ...formData,
                          participants: list
                            .filter((i) => i.type && i.count)
                            .map((i) => ({ [i.type]: Number(i.count) })),
                        });
                      }}
                    >
                      เพิ่มประเภทผู้เข้าร่วม
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Expected Outcomes */}
              <Card>
                <SectionHeader title="ผลที่คาดว่าจะได้รับ" />
                <div className="space-y-2">
                  {(formData.expectedProjectOutcome || []).map(
                    (outcome, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          value={outcome}
                          onChange={(e) => {
                            const updated = [
                              ...(formData.expectedProjectOutcome || []),
                            ];
                            updated[idx] = e.target.value;
                            setFormData({
                              ...formData,
                              expectedProjectOutcome: updated,
                            });
                          }}
                          placeholder={`ผลที่คาดว่าจะได้รับ #${idx + 1}`}
                        />
                        {(formData.expectedProjectOutcome?.length ?? 0) > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = (
                                formData.expectedProjectOutcome || []
                              ).filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                expectedProjectOutcome: updated,
                              });
                            }}
                          >
                            ลบ
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    disabled={
                      formData.expectedProjectOutcome &&
                      formData.expectedProjectOutcome.length > 0 &&
                      !formData.expectedProjectOutcome[
                        formData.expectedProjectOutcome.length - 1
                      ]
                    }
                    onClick={() => {
                      setFormData({
                        ...formData,
                        expectedProjectOutcome: [
                          ...(formData.expectedProjectOutcome || []),
                          "",
                        ],
                      });
                    }}
                  >
                    เพิ่มผลที่คาดว่าจะได้รับ
                  </Button>
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
              {/* ตารางกิจกรรมแบบ dynamic */}
              {scheduleList.map((loc, locIdx) => (
                <div key={locIdx} className="mb-4 border rounded-xl p-4">
                  <FormField label={`ชื่อสถานที่ #${locIdx + 1}`}>
                    <Input
                      value={loc.location}
                      onChange={(e) => {
                        const updated = [...scheduleList];
                        updated[locIdx].location = e.target.value;
                        setScheduleList(updated);
                        setFormData({ ...formData, schedule: updated });
                      }}
                      placeholder="ชื่อสถานที่"
                    />
                  </FormField>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-2"
                    onClick={() => handleRemoveLocation(locIdx)}
                  >
                    ลบสถานที่นี้
                  </Button>
                  {/* วันในสถานที่ */}
                  {loc.eachDay.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="ml-4 mb-2 p-2 bg-gray-50 rounded"
                    >
                      <FormField label={`วันที่ #${dayIdx + 1}`}>
                        <Input
                          type="date"
                          value={day.date}
                          min={formData.dateStart || ""}
                          max={formData.dateEnd || ""}
                          onChange={(e) => {
                            const updated = [...scheduleList];
                            updated[locIdx].eachDay[dayIdx].date =
                              e.target.value;
                            setScheduleList(updated);
                            setFormData({ ...formData, schedule: updated });
                          }}
                        />
                      </FormField>
                      <FormField label="รายละเอียดกิจกรรมในวันนั้น">
                        <TextArea
                          value={day.description}
                          onChange={(e) => {
                            const updated = [...scheduleList];
                            updated[locIdx].eachDay[dayIdx].description =
                              e.target.value;
                            setScheduleList(updated);
                            setFormData({ ...formData, schedule: updated });
                          }}
                          rows={2}
                        />
                      </FormField>
                      {/* ผู้เข้าร่วม */}
                      <div className="flex gap-2 mb-2">
                        <FormField label="บุคลากร">
                          <Input
                            type="number"
                            min={0}
                            value={day.participants?.[0]?.staff ?? ""}
                            onChange={(e) => {
                              const updated = [...scheduleList];
                              if (
                                !updated[locIdx].eachDay[dayIdx].participants[0]
                              ) {
                                updated[locIdx].eachDay[
                                  dayIdx
                                ].participants[0] = {};
                              }
                              updated[locIdx].eachDay[
                                dayIdx
                              ].participants[0].staff = Number(e.target.value);
                              setScheduleList(updated);
                              setFormData({ ...formData, schedule: updated });
                            }}
                          />
                        </FormField>
                        <FormField label="นักศึกษา">
                          <Input
                            type="number"
                            min={0}
                            value={day.participants?.[1]?.student ?? ""}
                            onChange={(e) => {
                              const updated = [...scheduleList];
                              if (
                                !updated[locIdx].eachDay[dayIdx].participants[1]
                              ) {
                                updated[locIdx].eachDay[
                                  dayIdx
                                ].participants[1] = {};
                              }
                              updated[locIdx].eachDay[
                                dayIdx
                              ].participants[1].student = Number(
                                e.target.value
                              );
                              setScheduleList(updated);
                              setFormData({ ...formData, schedule: updated });
                            }}
                          />
                        </FormField>
                      </div>
                      {/* ช่วงเวลา */}
                      <div className="border-t pt-2 mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          ช่วงเวลา
                        </p>
                        {day.timeline.map((tl, tlIdx) => (
                          <div
                            key={tlIdx}
                            className="ml-4 mb-2 flex gap-2 items-center"
                          >
                            <FormField label="เวลาเริ่ม">
                              <Input
                                type="time"
                                value={tl.timeStart}
                                onChange={(e) => {
                                  const updated = [...scheduleList];
                                  updated[locIdx].eachDay[dayIdx].timeline[
                                    tlIdx
                                  ].timeStart = e.target.value;
                                  setScheduleList(updated);
                                  setFormData({
                                    ...formData,
                                    schedule: updated,
                                  });
                                }}
                              />
                            </FormField>
                            <FormField label="เวลาสิ้นสุด">
                              <Input
                                type="time"
                                value={tl.timeEnd}
                                onChange={(e) => {
                                  const updated = [...scheduleList];
                                  updated[locIdx].eachDay[dayIdx].timeline[
                                    tlIdx
                                  ].timeEnd = e.target.value;
                                  setScheduleList(updated);
                                  setFormData({
                                    ...formData,
                                    schedule: updated,
                                  });
                                }}
                              />
                            </FormField>
                            <FormField label="รายละเอียดช่วงเวลา">
                              <Input
                                value={tl.description}
                                onChange={(e) => {
                                  const updated = [...scheduleList];
                                  updated[locIdx].eachDay[dayIdx].timeline[
                                    tlIdx
                                  ].description = e.target.value;
                                  setScheduleList(updated);
                                  setFormData({
                                    ...formData,
                                    schedule: updated,
                                  });
                                }}
                                placeholder="รายละเอียดช่วงเวลา"
                              />
                            </FormField>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveTimeline(locIdx, dayIdx, tlIdx)
                              }
                            >
                              ลบช่วงเวลา
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleAddTimeline(locIdx, dayIdx)}
                        >
                          เพิ่มช่วงเวลา
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleRemoveDay(locIdx, dayIdx)}
                      >
                        ลบวัน
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddDay(locIdx)}
                  >
                    เพิ่มวันในสถานที่นี้
                  </Button>
                </div>
              ))}
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleAddLocation}
              >
                เพิ่มสถานที่ใหม่
              </Button>
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
