import React from "react";
import { Organization } from "@/interface/organization";
import { Building2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface OrganizationCardProps {
  organization: Organization;
  onClick?: (organization: Organization) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(organization);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        {/* Left side: Icon + Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#006C67]/15 to-[#006C67]/25 rounded-full flex items-center justify-center">
            {organization.image ? (
              <Image
                width={80}
                height={80}
                src={organization.image}
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Building2 className="w-8 h-8 text-[#006C67] group-hover:text-[#004D4A]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-900 mb-1 transition-colors">
              {organization.nameEn}
            </h3>

            {/* Thai name */}
            <p className="text-slate-600 mb-2">{organization.nameTh}</p>

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
        <div className="flex items-center gap-1 text-xs text-[#006C67] transition-opacity">
          <span>ดูรายละเอียด</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
