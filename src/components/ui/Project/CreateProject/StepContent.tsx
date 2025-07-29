import React, { useState, useEffect, useCallback } from "react";
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
import Select from "../../Form/Select";

interface Timeline {
  timeStart: string;
  timeEnd: string;
  description: string;
  location?: string;
}

interface Day {
  date: string;
  description: string;
  timeline: Timeline[];
}

interface Schedule {
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
const Card = React.memo(
  ({
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
  )
);
Card.displayName = "Card";

const SectionHeader = React.memo(({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
  </div>
));
SectionHeader.displayName = "SectionHeader";

const Button = React.memo(
  ({
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
  }
);
Button.displayName = "Button";

const SuccessToast = React.memo(
  ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed bottom-4 right-4 bg-[#e6f5f3] border border-[#b3e2da] rounded-md p-4 shadow-md flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-[#006C67]" />
      <span className="text-sm text-[#006C67]">{message}</span>
      <button onClick={onClose} className="text-[#006C67] hover:text-[#004c47]">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
);
SuccessToast.displayName = "SuccessToast";

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  formData,
  setFormData,
  errorFields,
  orgName,
  campusName,
}) => {
  // Error message helper
  const errorMsg = useCallback(
    (field: string) =>
      errorFields.includes(field) ? (
        <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <div className="w-1 h-1 bg-red-500 rounded-full" />
          กรุณากรอกข้อมูล
        </div>
      ) : null,
    [errorFields]
  );

  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const [scheduleList, setScheduleList] = useState<Schedule[]>(
    Array.isArray(formData.schedule) && formData.schedule.length > 0
      ? (formData.schedule as Schedule[])
      : [{ eachDay: [] }]
  );

  useEffect(() => {
    setFormData({
      ...formData,
      schedule: scheduleList.map((schedule) => ({
        eachDay: schedule.eachDay.map((day) => ({
          ...day,
          timeline: day.timeline.map((tl) => ({
            ...tl,
            location: tl.location ?? "",
          })),
        })),
      })),
    });
  }, [scheduleList, setFormData]);

  const updateScheduleList = useCallback(
    (updater: (prev: Schedule[]) => Schedule[]) => {
      setScheduleList(updater);
    },
    []
  );

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
              <div>
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
                    <Select
                      options={identityOptions}
                      value={formData.kasetsartStudentIdentities?.[0] || ""}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          kasetsartStudentIdentities: value
                            ? [value as KasetsartStudentIdentity]
                            : [],
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
              <Card className="p-4 border bg-white shadow-none">
                <SectionHeader title="สถานที่จัดกิจกรรม" />
                <div className="space-y-3">
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
                      className="rounded-md border-gray-300 focus:ring-[#006C67] focus:border-[#006C67]"
                    />
                  </FormField>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      id="outsideKU"
                      checked={!!formData.location?.outside}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          location: {
                            location: formData.location?.location || "",
                            outside: e.target.checked
                              ? {
                                  postcode: "",
                                  address: "",
                                  subdistrict: "",
                                  city: "",
                                  province: "",
                                }
                              : undefined,
                          },
                        });
                      }}
                      className="accent-[#006C67] w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-[#006C67] transition-all"
                    />
                    จัดกิจกรรมนอกมหาวิทยาลัยเกษตรศาสตร์
                  </label>
                  {formData.location?.outside && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3 mt-2">
                      <FormField label="รหัสไปรษณีย์">
                        <Input
                          value={formData.location.outside.postcode ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode: e.target.value,
                                  address:
                                    formData.location?.outside?.address ?? "",
                                  subdistrict:
                                    formData.location?.outside?.subdistrict ??
                                    "",
                                  city: formData.location?.outside?.city ?? "",
                                  province:
                                    formData.location?.outside?.province ?? "",
                                },
                              },
                            })
                          }
                          placeholder="รหัสไปรษณีย์"
                          className="rounded-md border-gray-300 focus:ring-[#006C67] focus:border-[#006C67]"
                        />
                      </FormField>
                      <FormField label="ที่อยู่">
                        <Input
                          value={formData.location.outside.address ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode ?? "",
                                  address: e.target.value,
                                  subdistrict:
                                    formData.location?.outside?.subdistrict ??
                                    "",
                                  city: formData.location?.outside?.city ?? "",
                                  province:
                                    formData.location?.outside?.province ?? "",
                                },
                              },
                            })
                          }
                          placeholder="ที่อยู่"
                          className="rounded-md border-gray-300 focus:ring-[#006C67] focus:border-[#006C67]"
                        />
                      </FormField>
                      <FormField label="ตำบล">
                        <Input
                          value={formData.location.outside.subdistrict ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode ?? "",
                                  address:
                                    formData.location?.outside?.address ?? "",
                                  subdistrict: e.target.value,
                                  city: formData.location?.outside?.city ?? "",
                                  province:
                                    formData.location?.outside?.province ?? "",
                                },
                              },
                            })
                          }
                          placeholder="ตำบล"
                          className="rounded-md border-gray-300 focus:ring-[#006C67] focus:border-[#006C67]"
                        />
                      </FormField>
                      <FormField label="อำเภอ/เขต">
                        <Input
                          value={formData.location.outside.city ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode ?? "",
                                  address:
                                    formData.location?.outside?.address ?? "",
                                  subdistrict:
                                    formData.location?.outside?.subdistrict ??
                                    "",
                                  city: e.target.value,
                                  province:
                                    formData.location?.outside?.province ?? "",
                                },
                              },
                            })
                          }
                          placeholder="อำเภอ/เขต"
                          className="rounded-md border-gray-300 focus:ring-[#006C67] focus:border-[#006C67]"
                        />
                      </FormField>
                      <FormField label="จังหวัด">
                        <Input
                          value={formData.location.outside.province ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: {
                                location: formData.location?.location || "",
                                outside: {
                                  postcode:
                                    formData.location?.outside?.postcode ?? "",
                                  address:
                                    formData.location?.outside?.address ?? "",
                                  subdistrict:
                                    formData.location?.outside?.subdistrict ??
                                    "",
                                  city: formData.location?.outside?.city ?? "",
                                  province: e.target.value,
                                },
                              },
                            })
                          }
                          placeholder="จังหวัด"
                          className="rounded-md border-gray-300 focus:ring-[#006C67] focus:border-[#006C67]"
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              </Card>
              {/* Participants */}
              <Card>
                <SectionHeader title="กลุ่มเป้าหมายและผู้เข้าร่วม" />
                <div className="space-y-4">
                  <FormField label="จำนวนกลุ่มเป้าหมาย">
                    <Input
                      type="number"
                      min={0}
                      value={formData.targetUser ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetUser: Number(e.target.value),
                        })
                      }
                      placeholder="กรอกจำนวนกลุ่มเป้าหมาย"
                    />
                  </FormField>
                  <FormField label="จำนวนผู้เข้าร่วมกิจกรรม">
                    <Input
                      type="number"
                      min={0}
                      value={formData.participants ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          participants: Number(e.target.value),
                        })
                      }
                      placeholder="กรอกจำนวนผู้เข้าร่วมกิจกรรม"
                    />
                  </FormField>
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
        <div className="max-w-4xl mx-auto text-black">
          <Card className="p-10 border bg-white shadow-lg">
            <SectionHeader title="ตารางกิจกรรม" />
            <div className="space-y-8">
              {scheduleList[0]?.eachDay?.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className="border rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm relative mb-6"
                >
                  {/* ปุ่มลบวัน มุมขวาบน */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 rounded-full shadow-sm transition-all z-10"
                    icon={X}
                    onClick={() => {
                      updateScheduleList((prev) => {
                        const updated = [...prev];
                        updated[0].eachDay = updated[0].eachDay.filter(
                          (_, i) => i !== dayIdx
                        );
                        return updated;
                      });
                    }}
                    aria-label="ลบวัน"
                  >
                    ลบวัน
                  </Button>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <FormField label={`วันที่ #${dayIdx + 1}`}>
                      <Input
                        type="date"
                        value={day.date}
                        min={formData.dateStart || ""}
                        max={formData.dateEnd || ""}
                        className="rounded-lg border-gray-300 focus:ring-[#006C67] focus:border-[#006C67] bg-white"
                        onChange={(e) => {
                          updateScheduleList((prev) => {
                            const updated = [...prev];
                            updated[0].eachDay[dayIdx].date = e.target.value;
                            return updated;
                          });
                        }}
                      />
                    </FormField>
                  </div>
                  <FormField label="รายละเอียดกิจกรรมในวันนั้น">
                    <TextArea
                      value={day.description}
                      onChange={(e) => {
                        updateScheduleList((prev) => {
                          const updated = [...prev];
                          updated[0].eachDay[dayIdx].description =
                            e.target.value;
                          return updated;
                        });
                      }}
                      rows={2}
                    />
                  </FormField>
                  <hr className="my-6 border-gray-200" />
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-[#006C67]" />
                      <span className="text-lg font-semibold text-gray-700">
                        ช่วงเวลา
                      </span>
                    </div>
                    <div className="space-y-6">
                      {day.timeline.map((tl, tlIdx) => (
                        <div
                          key={tlIdx}
                          className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                          {/* ปุ่มลบช่วงเวลา มุมขวาบน */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 mb-6 border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 rounded-full shadow-sm transition-all z-10"
                            icon={X}
                            onClick={() => {
                              updateScheduleList((prev) => {
                                const updated = [...prev];
                                updated[0].eachDay[dayIdx].timeline =
                                  updated[0].eachDay[dayIdx].timeline.filter(
                                    (_, i) => i !== tlIdx
                                  );
                                return updated;
                              });
                            }}
                            aria-label="ลบช่วงเวลา"
                          >
                            ลบช่วงเวลา
                          </Button>
                          <div className="mb-2" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="เริ่ม">
                              <Input
                                type="time"
                                value={tl.timeStart}
                                className="rounded-lg border-gray-300 focus:ring-[#006C67] focus:border-[#006C67] bg-white"
                                onChange={(e) => {
                                  updateScheduleList((prev) => {
                                    const updated = [...prev];
                                    updated[0].eachDay[dayIdx].timeline[
                                      tlIdx
                                    ].timeStart = e.target.value;
                                    return updated;
                                  });
                                }}
                              />
                            </FormField>
                            <FormField label="สิ้นสุด">
                              <Input
                                type="time"
                                value={tl.timeEnd}
                                className="rounded-lg border-gray-300 focus:ring-[#006C67] focus:border-[#006C67] bg-white"
                                onChange={(e) => {
                                  updateScheduleList((prev) => {
                                    const updated = [...prev];
                                    updated[0].eachDay[dayIdx].timeline[
                                      tlIdx
                                    ].timeEnd = e.target.value;
                                    return updated;
                                  });
                                }}
                              />
                            </FormField>
                          </div>
                          <FormField label="รายละเอียด">
                            <Input
                              value={tl.description}
                              onChange={(e) => {
                                updateScheduleList((prev) => {
                                  const updated = [...prev];
                                  updated[0].eachDay[dayIdx].timeline[
                                    tlIdx
                                  ].description = e.target.value;
                                  return updated;
                                });
                              }}
                              placeholder="รายละเอียดช่วงเวลา"
                              className="rounded-lg border-gray-300 focus:ring-[#006C67] focus:border-[#006C67] bg-white"
                            />
                          </FormField>
                          <FormField label="สถานที่">
                            <Input
                              value={tl.location || ""}
                              onChange={(e) => {
                                updateScheduleList((prev) => {
                                  const updated = [...prev];
                                  updated[0].eachDay[dayIdx].timeline[
                                    tlIdx
                                  ].location = e.target.value;
                                  return updated;
                                });
                              }}
                              placeholder="สถานที่"
                              className="rounded-lg border-gray-300 focus:ring-[#006C67] focus:border-[#006C67] bg-white"
                            />
                          </FormField>
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-2 w-full md:w-auto"
                        icon={Clock}
                        onClick={() => {
                          updateScheduleList((prev) => {
                            const updated = [...prev];
                            updated[0].eachDay[dayIdx].timeline.push({
                              timeStart: "",
                              timeEnd: "",
                              description: "",
                              location: "",
                            });
                            return updated;
                          });
                        }}
                      >
                        เพิ่มช่วงเวลา
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="primary"
                size="md"
                className="w-full mt-4"
                icon={Clock}
                onClick={() => {
                  updateScheduleList((prev) => {
                    const updated = [...prev];
                    if (!updated[0]) updated[0] = { eachDay: [] };
                    updated[0].eachDay.push({
                      date: "",
                      description: "",
                      timeline: [],
                    });
                    return updated;
                  });
                }}
              >
                เพิ่มวัน
              </Button>
            </div>
          </Card>
        </div>
      );

    case 4:
      return (
        <div className="max-w-3xl mx-auto text-black">
          <Card className="p-8 border bg-white shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-[#006C67]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                ตรวจสอบข้อมูลโครงการ
              </h3>
            </div>
            {/* แสดง idku */}
            <div className="mb-6">
              <InfoRow label="IDKU" value={formData.kasetsartStudentIdentities && formData.kasetsartStudentIdentities.length > 0 ? formData.kasetsartStudentIdentities.join(", ") : "-"} />
            </div>
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-[#006C67] mb-3">ข้อมูลพื้นฐาน</h4>
                  <div className="space-y-2">
                    <InfoRow label="รหัสกิจกรรม" value={formData.activityCode} />
                    <InfoRow label="ชื่อโครงการ (TH)" value={formData.nameTh} />
                    <InfoRow label="ชื่อโครงการ (EN)" value={formData.nameEn} />
                    <InfoRow
                      label="ระยะเวลา"
                      value={
                        formData.dateStart && formData.dateEnd
                          ? `${formatDate(formData.dateStart)} ถึง ${formatDate(formData.dateEnd)}`
                          : "-"
                      }
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-[#006C67] mb-3">งบประมาณและเป้าหมาย</h4>
                  <div className="space-y-2">
                    <InfoRow
                      label="งบประมาณ"
                      value={
                        formData.budgetUsed
                          ? `${formData.budgetUsed.toLocaleString()} บาท`
                          : "-"
                      }
                    />
                    <InfoRow
                      label="รูปแบบกิจกรรม"
                      value={
                        formData.activityFormat?.length
                          ? formData.activityFormat.join(", ")
                          : "-"
                      }
                    />
                    <InfoRow label="หน่วยงาน" value={orgName} />
                    <InfoRow label="วิทยาเขต" value={campusName} />
                  </div>
                </div>
              </div>
              {/* Objectives */}
              {formData.objectives && (
                <div>
                  <h4 className="font-semibold text-[#006C67] mb-2">วัตถุประสงค์</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm whitespace-pre-line">
                    {formData.objectives}
                  </div>
                </div>
              )}
              {/* Expected Outcomes */}
              {formData.expectedProjectOutcome &&
                formData.expectedProjectOutcome.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#006C67] mb-2">ผลที่คาดว่าจะได้รับ</h4>
                    <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {formData.expectedProjectOutcome.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                          <span className="w-2 h-2 bg-[#006C67] rounded-full mt-2 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {/* ตารางกิจกรรมแบบสรุป */}
              {Array.isArray(formData.schedule) && formData.schedule[0]?.eachDay?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#006C67] mb-2">สรุปตารางกิจกรรม</h4>
                  <div className="space-y-4">
                    {formData.schedule[0].eachDay.map((day, dayIdx) => (
                      <details key={dayIdx} className="bg-gray-50 rounded-lg p-4">
                        <summary className="cursor-pointer font-medium text-[#006C67] flex items-center gap-2">
                          วันที่ {formatDate(day.date) || `#${dayIdx + 1}`}
                          <span className="text-gray-400 ml-2">{day.description}</span>
                        </summary>
                        <div className="mt-2 ml-2 space-y-2">
                          <div className="text-sm text-gray-700 mb-2">
                            <span className="font-semibold">รายละเอียด:</span> {day.description || "-"}
                          </div>
                          {day.timeline.length > 0 && (
                            <div>
                              <div className="font-semibold text-gray-700 mb-1">ช่วงเวลา:</div>
                              <ul className="space-y-2">
                                {day.timeline.map((tl, tlIdx) => (
                                  <li key={tlIdx} className="text-sm text-gray-700 ml-2">
                                    <span className="text-gray-500">เวลา:</span> {tl.timeStart} - {tl.timeEnd}{" "}
                                    <span className="text-gray-500 ml-2">รายละเอียด:</span> {tl.description || "-"}
                                    {tl.location && (
                                      <span className="text-gray-500 ml-2">สถานที่:</span>
                                    )}
                                    {tl.location}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
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

// Helper component for info row
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-gray-500 w-36">{label}:</span>
    <span className="text-gray-900 font-medium">{value || "-"}</span>
  </div>
);

export default StepContent;
