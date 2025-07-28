"use client";
import { useState, useEffect } from "react";
import { CreateProjectStep } from "@/components/ui/Project/CreateProject/CreateProjectStep";
import { ProjectFormData } from "@/interface/projectFormData";
import { projectService } from "@/lib/api/project";
import { mapFormDataToProjectPayload } from "@/lib/api/project";
import { User } from "@/interface/user";
import { validateProjectForm } from "@/utils/validationProjectUtils";

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
  targetUser: [],
  participants: [],
};

const stepFields: Record<number, string[]> = {
  0: ["activityCode", "nameTh", "nameEn", "dateStart", "dateEnd"],
  1: ["objectives", "activityFormat", "complianceStandards"],
  2: ["budgetUsed", "location"],
  3: ["schedule"],
  4: [],
};

function getErrorMessage(code: string) {
  switch (code) {
    case "activityCode": return "กรุณากรอกรหัสกิจกรรม";
    case "nameTh": return "กรุณากรอกชื่อโครงการภาษาไทย";
    case "nameEn": return "กรุณากรอกชื่อโครงการภาษาอังกฤษ";
    case "dateStart": return "กรุณากรอกวันที่เริ่มต้น";
    case "dateEnd": return "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น";
    case "objectives": return "กรุณากรอกวัตถุประสงค์";
    case "budgetUsed": return "งบประมาณต้องไม่ติดลบ";
    case "location": return "กรุณากรอกสถานที่จัดกิจกรรม";
    case "location.outside.postcode": return "กรุณากรอกรหัสไปรษณีย์";
    case "location.outside.address": return "กรุณากรอกที่อยู่";
    case "location.outside.city": return "กรุณากรอกอำเภอ/เขต";
    case "location.outside.province": return "กรุณากรอกจังหวัด";
    default: return code;
  }
}

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [orgName, setOrgName] = useState("");
  const [campusName, setCampusName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user: User = JSON.parse(userString);
          const userOrg = user.userOrganizations?.[0];
          setOrgName(
            userOrg?.organization?.nameTh || userOrg?.organization?.nameEn || ""
          );
          setCampusName(userOrg?.organization?.campus?.name || "");
          const organizationId = userOrg?.organization?.id || "";
          const campusId = userOrg?.organization?.campus?.id || "";
          setFormData((prev) => ({
            ...prev,
            organizationId,
            campusId,
          }));
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
    const allErrors = validateProjectForm(formData);
    const fieldsToCheck = stepFields[currentStep] || [];
    const errors = allErrors.filter((err) =>
      fieldsToCheck.length === 0 ? true : fieldsToCheck.some((field) => err.startsWith(field))
    );
    setErrorFields(errors);

    if (errors.length > 0) {
      setSubmitError("กรุณาตรวจสอบข้อมูลที่กรอกให้ครบถ้วนและถูกต้อง");
      return;
    }

    if (currentStep === 4) {
      setSubmitLoading(true);
      setSubmitError(null);
      try {
        await projectService.createProject(
          String(localStorage.getItem("accessToken")),
          mapFormDataToProjectPayload(formData)
        );
        setSubmitSuccess("สร้างโครงการสำเร็จ!");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setSubmitError(err.message);
        } else {
          setSubmitError("เกิดข้อผิดพลาด");
        }
      } finally {
        setSubmitLoading(false);
      }
    } else {
      setSubmitError(null);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setSubmitError(null);
  };

  return (
    <>
      <CreateProjectStep
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        errorFields={errorFields}
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
      {submitError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-md p-4 shadow-md flex flex-col gap-2">
          <span className="text-sm text-red-600">{submitError}</span>
          {errorFields.length > 0 && (
            <ul className="text-xs text-red-500 list-disc ml-4">
              {errorFields.map((err, idx) => (
                <li key={idx}>{getErrorMessage(err)}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}