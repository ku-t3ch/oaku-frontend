import { Checkbox } from "@heroui/react";

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {options.length === 0 && (
      <span className="text-gray-400 text-sm">{placeholder}</span>
    )}
    {options.map((option) => (
      <label
        key={option.value}
        className="flex items-center gap-3 px-1 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        style={{ minHeight: 44 }}
      >
        <Checkbox
          className="w-5 h-5 text-[#006C67] border-gray-300 rounded-full focus:ring-[#006C67]"
          color="primary"
          radius="full"
          isSelected={selected.includes(option.value)}
          onChange={(e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
              onChange([...selected, option.value]);
            } else {
              onChange(selected.filter((v) => v !== option.value));
            }
          }}
        />
        <span className="text-xs text-gray-700 font-normal break-words">
          {option.label}
        </span>
      </label>
    ))}
  </div>
);