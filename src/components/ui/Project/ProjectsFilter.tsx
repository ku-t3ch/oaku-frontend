import React, { useRef } from "react";
import { Search, MapPin, Building, ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface FilterOption {
  value: string;
  label: string;
}

interface ProjectsFilterProps {
  // Search
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Campus Filter (for SUPER_ADMIN only)
  showCampusFilter?: boolean;
  selectedCampus?: string;
  campusOptions?: FilterOption[];
  onCampusChange?: (value: string) => void;
  showCampusDropdown?: boolean;
  onToggleCampusDropdown?: () => void;

  // Organization Type Filter (for SUPER_ADMIN & CAMPUS_ADMIN)
  showOrgTypeFilter?: boolean;
  selectedOrgType?: string;
  orgTypeOptions?: FilterOption[];
  onOrgTypeChange?: (value: string) => void;
  showOrgTypeDropdown?: boolean;
  onToggleOrgTypeDropdown?: () => void;

  // Display Info (for CAMPUS_ADMIN & USER)
  campusName?: string;
  organizationName?: string;

  // Active Filters
  activeFilters?: Array<{
    type: string;
    label: string;
    value: string;
    onRemove: () => void;
  }>;
  onClearAll?: () => void;
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "ค้นหาโครงการ (ชื่อ, รหัส, หน่วยงาน)...",
  showCampusFilter,
  selectedCampus,
  campusOptions = [],
  onCampusChange,
  showCampusDropdown,
  onToggleCampusDropdown,
  showOrgTypeFilter,
  selectedOrgType,
  orgTypeOptions = [],
  onOrgTypeChange,
  showOrgTypeDropdown,
  onToggleOrgTypeDropdown,
  campusName,
  organizationName,
  activeFilters = [],
  onClearAll,
}) => {
  const campusFilterRef = useRef<HTMLDivElement>(null);
  const typeFilterRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    campusFilterRef,
    () => {
      onToggleCampusDropdown?.();
    },
    showCampusDropdown
  );

  useClickOutside(
    typeFilterRef,
    () => {
      onToggleOrgTypeDropdown?.();
    },
    showOrgTypeDropdown
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:border-[#006C67] focus:ring-0 transition-colors placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {/* Campus Filter (SUPER_ADMIN) */}
          {showCampusFilter && (
            <div className="relative" ref={campusFilterRef}>
              <button
                onClick={onToggleCampusDropdown}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-[#006C67] hover:bg-[#006C67]/5 transition-all duration-200"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:block">
                  {campusOptions.find((c) => c.value === selectedCampus)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showCampusDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showCampusDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                  {campusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onCampusChange?.(option.value);
                        onToggleCampusDropdown?.();
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                        selectedCampus === option.value
                          ? "bg-[#006C67]/10 text-[#006C67]"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Campus Info Display (CAMPUS_ADMIN) */}
          {campusName && (
            <div className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-xl">
              <MapPin className="w-4 h-4 text-[#006C67]" />
              <span>{campusName}</span>
            </div>
          )}

          {/* Organization Type Filter (SUPER_ADMIN & CAMPUS_ADMIN) */}
          {showOrgTypeFilter && (
            <div className="relative" ref={typeFilterRef}>
              <button
                onClick={onToggleOrgTypeDropdown}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-[#006C67] hover:bg-[#006C67]/5 transition-all duration-200"
              >
                <Building className="w-4 h-4" />
                <span className="hidden sm:block">
                  {
                    orgTypeOptions.find((t) => t.value === selectedOrgType)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showOrgTypeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showOrgTypeDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                  {orgTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onOrgTypeChange?.(option.value);
                        onToggleOrgTypeDropdown?.();
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors ${
                        selectedOrgType === option.value
                          ? "bg-[#006C67]/10 text-[#006C67]"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Organization Info Display (USER) */}
          {organizationName && (
            <div className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-xl">
              <Building className="w-4 h-4 text-[#006C67]" />
              <span>{organizationName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-600">ตัวกรองที่ใช้งาน:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full"
              >
                {filter.label}
                <button
                  onClick={filter.onRemove}
                  className="ml-1 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
            {onClearAll && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
