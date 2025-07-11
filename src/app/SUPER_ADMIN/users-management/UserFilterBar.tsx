import { MapPin, Users, Building2, Search, Shield } from "lucide-react";
import React from "react";
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
  roleOptions: Option[]; // เพิ่ม props สำหรับ role
  selectedRole: string;
  setSelectedRole: (v: string) => void;

}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  search,
  setSearch,
  campusOptions,
  selectedCampus,
  setSelectedCampus,
  organizationOptions,
  selectedOrganization,
  setSelectedOrganization,
  organizationTypeOptions,
  selectedOrganizationType,
  setSelectedOrganizationType,
  roleOptions,
  selectedRole,
  setSelectedRole,
}) => (
  <div className="flex flex-col sm:flex-row bg-white items-center justify-between gap-4 mb-8 px-4 py-3 rounded-lg shadow-sm border border-gray-200 transition-all duration-200">
    {/* Filter Group */}
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown
        icon={<Shield size={16} />}
        label="All Roles"
        options={roleOptions}
        selectedValue={selectedRole}
        onSelect={setSelectedRole}
      />
      <FilterDropdown
        icon={<MapPin size={16} />}
        label="All Campuses"
        options={campusOptions}
        selectedValue={selectedCampus}
        onSelect={setSelectedCampus}
      />
      <FilterDropdown
        icon={<Building2 size={16} />}
        label="All Types"
        options={organizationTypeOptions}
        selectedValue={selectedOrganizationType}
        onSelect={setSelectedOrganizationType}
        disabled={selectedCampus === "all"}
      />
      <FilterDropdown
        icon={<Users size={16} />}
        label="All Organizations"
        options={organizationOptions}
        selectedValue={selectedOrganization}
        onSelect={setSelectedOrganization}
        disabled={selectedCampus === "all"}
      />
    </div>

    {/* Search Input */}
    <div className="relative w-full sm:w-auto">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search name or email..."
        className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:outline-none transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
);
