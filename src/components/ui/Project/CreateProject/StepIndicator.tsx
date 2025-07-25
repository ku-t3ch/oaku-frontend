import React from "react";
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
                ? "bg-[#006C67] text-white shadow-lg transform scale-110"
                : idx < currentStep
                ? "bg-[#009E8E] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {idx + 1}
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
              idx < currentStep ? "bg-[#009E8E]" : "bg-gray-200"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);