import React from "react";
import { Organization } from "@/interface/organization";
import { OrganizationCard } from "./OrganizationCard";
import { Loader2, Building2, RefreshCw } from "lucide-react";

interface OrganizationListProps {
  organizations: Organization[];
    onClick?: (organization: Organization) => void;
  loading?: boolean;
  onResetFilters?: () => void;
}

export const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
    onClick,
  loading = false,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600">กำลังโหลดข้อมูลองค์กร...</p>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          ไม่พบองค์กร
        </h3>
        <p className="text-slate-500 text-center mb-4">
          ไม่พบองค์กรที่ตรงกับเงื่อนไขการค้นหา
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            ล้างตัวกรอง
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          องค์กรทั้งหมด ({organizations.length})
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {organizations.map((organization) => (
          <OrganizationCard
            key={organization.id}
            organization={organization}
            onClick={() => onClick && onClick(organization)}
          />
        ))}
      </div>
    </div>
  );
};