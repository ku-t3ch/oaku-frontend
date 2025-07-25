import React, { ChangeEvent } from "react";

interface InputProps {
  type?: string;
  value: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  min?: string;
  max?: string;
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
    className={`border rounded px-3 py-2 w-full ${className || ""}`}
    readOnly={readOnly}
    min={min}
    max={max}
  />
);