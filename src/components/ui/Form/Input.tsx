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
    className={`border border-gray-300 rounded-xl  px-3 py-2 w-full ${
      className || ""
    } focus:ring-2 focus:ring-[#006C67] focus:border-transparent outline-none transition-all duration-200 bg-white`}
    readOnly={readOnly}
    min={min}
    max={max}
  />
);
