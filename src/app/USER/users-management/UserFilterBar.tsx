import { Users, Search } from "lucide-react";
import React, { useCallback } from "react";
import { FilterDropdown } from "./FilterDropdown";

interface Option {
  value: string;
  label: string;
}

interface UserFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  campusOptions: Option[];
  selectedCampus: string;
  setSelectedCampus: (v: string) => void;
  organizationOptions: Option[];
  selectedOrganization: string;
  setSelectedOrganization: (v: string) => void;
  organizationTypeOptions: Option[];
  selectedOrganizationType: string;
  setSelectedOrganizationType: (v: string) => void;
  roleOptions: Option[];
  selectedRole: string;
  setSelectedRole: (v: string) => void;
  isLoading?: boolean;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  search,
  setSearch,
  roleOptions,
  selectedRole,
  setSelectedRole,
  isLoading = false,
}) => {

  // Handler for position (role) changes
  const handleRoleChange = useCallback((newRole: string) => {
    setSelectedRole(newRole);
  }, [setSelectedRole]);

  // Handler for search changes
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, [setSearch]);

  return (
    <div className="flex flex-col sm:flex-row bg-white items-center justify-between gap-4 mb-8 px-4 py-3 rounded-lg shadow-sm border border-gray-200 transition-all duration-200">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          icon={<Users size={16} />}
          label="ทุกตำแหน่ง"
          options={roleOptions}
          selectedValue={selectedRole}
          onSelect={handleRoleChange}
          disabled={isLoading}
        />
      </div>

      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="ค้นหาชื่อหรืออีเมล..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
        />
        {search && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            disabled={isLoading}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};