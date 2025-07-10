import React from "react";

interface StatCardProps {
  count: number;
  label: string;
  icon: React.ElementType;
  bgColor?: string;
  textColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  count,
  label,
  icon: Icon,
  bgColor = "from-[#006C67] to-[#B2DFDB]",
  textColor = "text-[#006C67]",
}) => (
  <div className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    {/* Content */}
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 mb-3 tracking-wide uppercase">
          {label}
        </p>
        <p className={`text-3xl font-bold ${textColor} tracking-tight`}>
          {count.toLocaleString()}
        </p>
      </div>
      
      {/* Icon container */}
      <div className="relative">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-lg shadow-slate-200/50 group-hover:shadow-xl group-hover:shadow-slate-300/50 transition-shadow duration-300`}>
          <Icon className={`w-7 h-7 ${textColor} drop-shadow-sm`} />
        </div>
        
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${bgColor} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />
      </div>
    </div>
    
    {/* Bottom accent line */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${bgColor} rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
  </div>
);