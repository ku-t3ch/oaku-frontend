"use client";
import { useState, useEffect } from "react";
import { CreateProjectStep } from "@/components/ui/Project/CreateProject/CreateProjectStep";
import { ProjectFormData } from "@/interface/projectFormData";
import { projectService } from "@/lib/api/project";
import { mapFormDataToProjectPayload } from "@/lib/api/project";
import {
  validateProjectForm,
  getErrorMessage,
} from "@/utils/validationProjectUtils";
import { useRouter } from "next/navigation";

const initialFormData: ProjectFormData = {
  activityCode: "",
  nameEn: "",
  nameTh: "",
  dateStart: "",
  dateEnd: "",
  activityFormat: [],
  objectives: "",
  expectedProjectOutcome: [],
  budgetUsed: 0,
  principlesAndReasoning: "",
  status: "PADDING",
  complianceStandards: [],
  kasetsartStudentIdentities: [],
  sustainableDevelopmentGoals: [],
  organizationId: "",
  campusId: "",
  activityHourFile: [],
  activityHours: [],
  location: {
    location: "",
    outside: undefined,
  },
  schedule: [],
  targetUser: 0,
  participants: 0,
};

const stepFields: Record<number, string[]> = {
  0: ["activityCode", "nameTh", "nameEn", "dateStart", "dateEnd"],
  1: ["objectives", "activityFormat", "complianceStandards"],
  2: ["budgetUsed", "kasetsartStudentIdentities", "location"],
  3: ["schedule"],
  4: [],
};

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [orgName, setOrgName] = useState("");
  const [campusName, setCampusName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [publicOrgId, setPublicOrgId] = useState("");

  // ดึงข้อมูล organization จาก localStorage แค่รอบแรกเท่านั้น
  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedOrgString = localStorage.getItem("selectedOrganization");
      if (selectedOrgString) {
        try {
          const selectedOrg = JSON.parse(selectedOrgString);
          setOrgName(
            selectedOrg?.organization?.nameTh ||
              selectedOrg?.organization?.nameEn ||
              ""
          );
          setCampusName(selectedOrg?.organization.campus?.name || "");
          const organizationId = selectedOrg?.organization?.id || "";
          const campusId = selectedOrg?.organization?.campus?.id || "";
          const publicOrganizationId = selectedOrg?.publicOrganizationId || "";
          setFormData((prev) => ({
            ...prev,
            organizationId,
            campusId,
          }));
          setPublicOrgId(publicOrganizationId);
        } catch {
          setOrgName("");
          setCampusName("");
          setFormData((prev) => ({
            ...prev,
            organizationId: "",
            campusId: "",
          }));
        }
      }
    }
    // dependency array ว่าง เพื่อให้รันแค่รอบแรก
  }, []);

  // Auto-hide error popup after 4 seconds
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError(null);
        setErrorFields([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

  // Auto-hide success popup after 3 seconds
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleNextStep = async () => {
    const allErrors = validateProjectForm(formData, publicOrgId);
    setErrorFields(allErrors);

    // กรองเฉพาะ error ที่เกี่ยวกับ step ปัจจุบัน
    const stepErrorFields = allErrors.filter((err) =>
      isErrorForStep(err, stepFields[currentStep])
    );

    if (stepErrorFields.length > 0) {
      setSubmitError("กรุณาตรวจสอบข้อมูลที่กรอกให้ครบถ้วนและถูกต้อง");
      return;
    }

    setSubmitError(null);

    if (currentStep === 4) {
      setSubmitLoading(true);
      try {
        await projectService.createProject(
          String(localStorage.getItem("accessToken")),
          mapFormDataToProjectPayload(formData)
        );
        setSubmitSuccess("สร้างโครงการสำเร็จ!");
        setTimeout(() => {
          router.push("/USER/projects");
        }, 1000);
      } catch (err: unknown) {
        setSubmitError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setSubmitLoading(false);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setSubmitError(null);
  };

  // ฟังก์ชันช่วยกรอง error ให้ match ได้ทั้ง field และข้อความภาษาไทย
  function isErrorForStep(err: string, fields: string[]) {
    return fields.some((field) => {
      const thMsg = getErrorMessage(field);
      // เงื่อนไขนี้จะ match error ภาษาไทยที่เกี่ยวข้องกับ field
      return (
        err.includes(field) ||
        err === field ||
        err.includes(thMsg) ||
        thMsg.includes(err) ||
        err.startsWith(thMsg.split(" ")[0]) ||
        getErrorMessage(err) === thMsg ||
        err === thMsg ||
        // เฉพาะกรณี activityCode ให้ match error ภาษาไทยที่ validateProjectForm สร้าง
        (field === "activityCode" &&
          [
            "รหัสกิจกรรมต้องเป็นเลขล้วน 12 หลัก",
            "รหัสกิจกรรมไม่ตรงกับองค์กรเดิม",
            "กรุณากรอกรหัสกิจกรรม",
          ].includes(err))
      );
    });
  }

  // กรอง error ตาม step
  const filteredErrors = errorFields.filter((err) =>
    isErrorForStep(err, stepFields[currentStep])
  );

  return (
    <>
      <CreateProjectStep
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        errorFields={filteredErrors}
        orgName={orgName}
        userToken={String(localStorage.getItem("accessToken"))}
        campusName={campusName}
        onNextStep={handleNextStep}
        onBackStep={handleBackStep}
      />
      {submitLoading && (
        <div className="fixed bottom-4 right-4 bg-[#e6f5f3] border border-[#b3e2da] rounded-md p-4 shadow-md flex items-center gap-3">
          <span className="text-sm text-[#006C67]">กำลังบันทึกข้อมูล...</span>
        </div>
      )}
      {submitSuccess && (
        <div className="fixed bottom-4 right-4 bg-[#e6f5f3] border border-[#b3e2da] rounded-md p-4 shadow-md flex items-center gap-3">
          <span className="text-sm text-[#006C67]">{submitSuccess}</span>
        </div>
      )}
      {submitError && filteredErrors.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-md p-4 shadow-md flex flex-col gap-2">
          <span className="text-sm text-red-600">{submitError}</span>
          <ul className="text-xs text-red-500 list-disc ml-4">
            {filteredErrors.map((err, idx) => (
              <li key={idx}>{getErrorMessage(err)}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}