"use client";
import { useState, useEffect } from "react";
import { CreateProjectStep } from "@/components/ui/Project/CreateProject/CreateProjectStep";
import { ProjectFormData } from "@/interface/projectFormData";
import { projectService } from "@/lib/api/project";
import { mapFormDataToProjectPayload } from "@/lib/api/project";
import { User } from "@/interface/user";

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
};

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errorFields] = useState<string[]>([]);
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

          // เซ็ตค่า organizationId และ campusId ใน formData
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

  const handleNextStep = async () => {
    if (currentStep === 4) {
      setSubmitLoading(true);
      setSubmitError(null);
      try {
        await projectService.createProject(
          String(localStorage.getItem("accessToken")),
          mapFormDataToProjectPayload(formData) // ใช้ฟังก์ชันนี้
        );
        setSubmitSuccess("สร้างโครงการสำเร็จ!");
        // redirect หรือ reset form ได้ที่นี่
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
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
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
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-md p-4 shadow-md flex items-center gap-3">
          <span className="text-sm text-red-600">{submitError}</span>
        </div>
      )}
    </>
  );
}
