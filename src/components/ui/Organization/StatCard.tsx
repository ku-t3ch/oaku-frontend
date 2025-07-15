import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  count,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side: Label and Count */}
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#006C67]">
            {count}
          </p>
        </div>

        {/* Right side: Icon */}
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-2xl flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#006C67]" />
        </div>
      </div>
    </div>
  );
};