import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "เลือก...",
  className = "",
  disabled = false,
}) => (
  <div className={`relative w-full ${className}`}>
    <select
      className={`
        w-full px-4 py-3 border border-gray-200 rounded-xl bg-white
        text-gray-700 focus:ring-2 focus:ring-[#006C67] focus:border-transparent
        outline-none transition-all duration-200 appearance-none
        ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
      `}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {/* Chevron icon */}
    <span className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </div>
);

export default Select;