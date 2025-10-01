import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  icon: React.ReactNode;
  label: string;
  options: Option[];
  selectedValue: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  icon,
  label,
  options,
  selectedValue,
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors border
          ${disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : selectedValue !== "all"
            ? "text-[#006C67] bg-[#006C67]/10 border-[#006C67]/30 hover:bg-[#006C67]/20"
            : "text-gray-600 bg-gray-100/60 hover:bg-[#006C67]/10 hover:text-[#006C67] border-gray-200"}
        `}
        disabled={disabled}
        type="button"
      >
        {icon}
        {selectedLabel}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && !disabled && (
        <div className="absolute z-10 bg-white border border-gray-100 rounded-lg mt-2 w-56 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#006C67]/10 hover:text-[#006C67] text-gray-700 transition-colors ${
                selectedValue === option.value
                  ? "bg-[#006C67]/15 text-[#006C67] font-medium"
                  : ""
              }`}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              disabled={disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};