export const MultiSelect = ({ options, selected, onChange}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {options.map((option) => (
      <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onChange={(e) => {
            if (e.target.checked) {
              onChange([...selected, option.value]);
            } else {
              onChange(selected.filter(v => v !== option.value));
            }
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
);
