
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
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {options.length === 0 && (
      <span className="text-gray-400 text-sm">{placeholder}</span>
    )}
    {options.map((option) => {
      const checked = selected.includes(option.value);
      return (
        <label
          key={option.value}
          className={`flex items-center gap-2 px-2 py-2 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer
            ${checked ? "bg-[#006C67]/10 border-[#006C67]" : ""}
          `}
          style={{ minHeight: 40 }}
        >
          <span
            className={`flex items-center justify-center w-5 h-5 rounded-full border border-gray-300
              ${checked ? "bg-[#006C67]" : "bg-white"}
              transition-colors`}
          >
            {checked && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 8.5L7 11.5L12 6.5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked) {
                onChange([...selected, option.value]);
              } else {
                onChange(selected.filter((v) => v !== option.value));
              }
            }}
            className="sr-only"
          />
          <span className="text-xs text-gray-700 font-normal break-words">
            {option.label}
          </span>
        </label>
      );
    })}
  </div>
);