import React from "react";
import { Organization } from "@/interface/organization";
import { Building2 } from "lucide-react";

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
}) => {

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        {/* Left side: Icon + Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#006C67]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
              {organization.nameEn}
            </h3>
            
            {/* Thai name */}
            <p className="text-slate-600 mb-2">
              {organization.nameTh}
            </p>

            {/* ID */}
            <div className="text-sm text-slate-500 mb-3">
              {organization.publicOrganizationId}
            </div>

            {/* Campus and Type as badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {organization.campus?.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {organization.organizationType?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};