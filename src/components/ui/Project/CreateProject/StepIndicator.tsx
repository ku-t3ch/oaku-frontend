import React from "react";
import { Check } from "lucide-react";

const steps = [
  "ข้อมูลโครงการ",
  "รายละเอียดโครงการ",
  "งบประมาณและเป้าหมาย",
  "ตารางเวลากิจกรรม",
  "ตรวจสอบและยืนยัน",
];

export const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-8 px-4">
    {steps.map((label, idx) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center">
          <div
            className={`w-15 h-15 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300 ${
              idx === currentStep
                ? "bg-[#006C67]/75 text-white shadow-lg transform scale-110"
                : idx < currentStep
                ? "bg-[#006C67] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {idx < currentStep ? (
              <Check size={20} className="text-white" />
            ) : (
              idx + 1
            )}
          </div>
          <div
            className={`text-xs text-center px-2 transition-colors duration-300 ${
              idx === currentStep
                ? "text-[#006C67] font-semibold"
                : "text-gray-500"
            }`}
          >
            {label}
          </div>
        </div>
        {idx < steps.length - 1 && (
          <div
            className={`h-0.5 w-16 mx-4 mt-5 transition-colors duration-300 ${
              idx < currentStep ? "bg-[#006C67]" : "bg-gray-200"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Demo component to show different states
const Demo = () => {
  const [currentStep, setCurrentStep] = React.useState(2);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        ตัวอย่าง Step Indicator พร้อมเครื่องหมายติ๊ก
      </h2>
      
      <StepIndicator currentStep={currentStep} />
      
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          disabled={currentStep === 0}
        >
          ย้อนกลับ
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          className="px-4 py-2 bg-[#006C67] text-white rounded hover:bg-[#005A56] transition-colors"
          disabled={currentStep === 4}
        >
          ถัดไป
        </button>
      </div>
      
      <div className="text-center mt-4 text-gray-600">
        ขั้นตอนปัจจุบัน: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
};

export default Demo;