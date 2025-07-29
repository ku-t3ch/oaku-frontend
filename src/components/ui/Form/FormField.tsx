export const FormField = ({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);
