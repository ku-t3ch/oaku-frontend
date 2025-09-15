import {
  MapPin,
  Users,
  Building2,
  Search,
  Shield,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useCallback } from "react";
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
  positionOptions: Option[];
  selectedPosition: string;
  setSelectedPosition: (v: string) => void;
  onFilterChange?: (filters: {
    role: string;
    campus: string;
    organizationType: string;
    organization: string;
    search: string;
  }) => void;
  isLoading?: boolean;
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
  positionOptions,
  selectedPosition,
  setSelectedPosition,
  onFilterChange,
  isLoading = false,
}) => {
  // Handler for campus changes
  const handleCampusChange = useCallback(
    (newCampus: string) => {
      if (newCampus !== selectedCampus) {
        setSelectedOrganizationType("all");
        setSelectedOrganization("all");
      }
      setSelectedCampus(newCampus);
    },
    [
      selectedCampus,
      setSelectedCampus,
      setSelectedOrganizationType,
      setSelectedOrganization,
    ]
  );

  // Handler for organization type changes
  const handleOrganizationTypeChange = useCallback(
    (newOrgType: string) => {
      if (newOrgType !== selectedOrganizationType) {
        setSelectedOrganization("all");
      }
      setSelectedOrganizationType(newOrgType);
    },
    [
      selectedOrganizationType,
      setSelectedOrganizationType,
      setSelectedOrganization,
    ]
  );

  // Handler for role changes
  const handleRoleChange = useCallback(
    (newRole: string) => {
      setSelectedRole(newRole);
      // Reset position when role changes away from ORGANIZATION_USER
      if (newRole !== "ORGANIZATION_USER") {
        setSelectedPosition("all");
      }
    },
    [setSelectedRole, setSelectedPosition]
  );

  // Handler for position changes
  const handlePositionChange = useCallback(
    (newPosition: string) => {
      setSelectedPosition(newPosition);
    },
    [setSelectedPosition]
  );

  // Handler for organization changes
  const handleOrganizationChange = useCallback(
    (newOrg: string) => {
      setSelectedOrganization(newOrg);
    },
    [setSelectedOrganization]
  );

  // Handler for search changes
  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
    },
    [setSearch]
  );

  // Notify parent component of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        role: selectedRole,
        campus: selectedCampus,
        organizationType: selectedOrganizationType,
        organization: selectedOrganization,
        search: search,
      });
    }
  }, [
    selectedRole,
    selectedCampus,
    selectedOrganizationType,
    selectedOrganization,
    search,
    onFilterChange,
  ]);

  // Check if position dropdown should be shown
  const showPositionFilter = selectedRole === "ORGANIZATION_USER";

  return (
    <div className="relative flex flex-col sm:flex-row bg-white items-center justify-between gap-4 mb-8 px-4 py-3 rounded-lg shadow-sm border border-gray-200 transition-all duration-200">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg z-20">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          icon={<Shield size={16} />}
          label="All Roles"
          options={roleOptions}
          selectedValue={selectedRole}
          onSelect={handleRoleChange}
          disabled={isLoading}
        />

        {showPositionFilter && (
          <FilterDropdown
            icon={<Briefcase size={16} />}
            label="All Positions"
            options={positionOptions}
            selectedValue={selectedPosition}
            onSelect={handlePositionChange}
            disabled={isLoading}
          />
        )}

        <FilterDropdown
          icon={<MapPin size={16} />}
          label="All Campuses"
          options={campusOptions}
          selectedValue={selectedCampus}
          onSelect={handleCampusChange}
          disabled={isLoading}
        />
        
        <FilterDropdown
          icon={<Building2 size={16} />}
          label="All Types"
          options={organizationTypeOptions}
          selectedValue={selectedOrganizationType}
          onSelect={handleOrganizationTypeChange}
          disabled={selectedCampus === "all" || isLoading}
        />
        
        <FilterDropdown
          icon={<Users size={16} />}
          label="All Organizations"
          options={organizationOptions}
          selectedValue={selectedOrganization}
          onSelect={handleOrganizationChange}
          disabled={selectedCampus === "all" || isLoading}
        />
      </div>

      <div className="relative w-full sm:w-auto">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search name or email..."
          className="w-full sm:w-64 pl-10 pr-4 py-2 text-black text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
        />
        {search && (
          <button
            onClick={() => handleSearchChange("")}
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