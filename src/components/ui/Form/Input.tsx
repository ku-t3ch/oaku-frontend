import React, { ChangeEvent } from "react";

interface InputProps {
  type?: string;
  value: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  min?: number | string;
  max?: number | string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  readOnly,
  min,
  max,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border border-gray-300 rounded-xl px-3 py-2 w-full
  ${
    readOnly
      ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
      : "bg-white focus:ring-2 focus:ring-[#006C67] focus:border-transparent"
  }
  ${className || ""}
  outline-none transition-all duration-200`}
    readOnly={readOnly}
    min={min}
    max={max}
  />
);
