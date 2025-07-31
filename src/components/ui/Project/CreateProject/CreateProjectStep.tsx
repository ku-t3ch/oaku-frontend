import React from "react";
import { StepIndicator } from "./StepIndicator";
import StepContent from "./StepContent";
import { ProjectFormData } from "@/interface/projectFormData";
import { useRouter } from "next/navigation";

interface CreateProjectStepProps {
  currentStep: number;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  errorFields: string[];
  orgName: string;
  userToken: string;
  campusName: string;
  onNextStep: () => void;
  onBackStep: () => void;
}

export const CreateProjectStep: React.FC<CreateProjectStepProps> = ({
  currentStep,
  formData,
  setFormData,
  errorFields,
  orgName,
  campusName,
  userToken,
  onNextStep,
  onBackStep,
}) => {

  const router = useRouter();

  const handleBack = () => {
    if (currentStep === 0) {
      router.push("/USER/projects");
    } else {
      onBackStep();
    }
    console.log("Back to previous step", currentStep);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mx-auto max-w-5xl p-8 mt-8">
      <StepIndicator currentStep={currentStep} />

      <StepContent
        step={currentStep}
        formData={formData}
        setFormData={setFormData}
        errorFields={errorFields}
        orgName={orgName}
        campusName={campusName}
        userToken={userToken}
      />
      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          onClick={handleBack}
          disabled={false}
        >
          ย้อนกลับ
        </button>
        <div className="flex flex-col items-end">
          <button
            type="button"
            className={`bg-[#006C67] text-white px-6 py-2 rounded-lg hover:bg-[#004C47] transition `}
            onClick={onNextStep}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
};
