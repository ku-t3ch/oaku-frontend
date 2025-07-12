import React from "react";
import {
  getRoleLabel,
  getRoleBadgeClasses,
  getRolePriority,
} from "@/utils/roleUtils";

interface RoleItem {
  role: string;
  position?: string;
}

interface ListUserProps {
  userId: string;
  name: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  
  roles?: RoleItem[];
  campus?: string;
  status: "active" | "suspended";
  onEdit?: () => void;
  onClick?: () => void;
}

export const ListUserCard: React.FC<ListUserProps> = ({
  userId,
  name,
  email,
  image,
  phoneNumber,
  roles = [],
  campus,
  status,
  onEdit,
  onClick,
}) => (
  <div
    className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-200 cursor-pointer"
    onClick={onClick}
  >
    {/* Avatar */}
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden mr-4">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-12 h-12 object-cover rounded-full"
        />
      ) : (
        <span className="text-lg font-semibold text-white">
          {name?.charAt(0)?.toUpperCase() || "U"}
        </span>
      )}
    </div>
    {/* User Info */}
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      {/* Name + Roles */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900 truncate">
          {name || "ไม่ระบุชื่อ"}
        </h3>
        <div className="flex flex-wrap gap-1">
          {[...roles]
            .sort(
              (a, b) =>
                getRolePriority(b.role, b.position) -
                getRolePriority(a.role, a.position)
            )
            .filter(
              (item, idx, arr) =>
                arr.findIndex(
                  (r) =>
                    r.role === item.role &&
                    (r.position || "") === (item.position || "")
                ) === idx
            )
            .map((item, idx) => (
              <span
                key={item.role + (item.position || "") + idx}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${getRoleBadgeClasses(
                  item.role
                )}`}
              >
                {getRoleLabel(item.role, item.position)}
              </span>
            ))}
        </div>
      </div>
      {/* Other Info */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="truncate">{userId}</span>
        <span>| {email}</span>
        {phoneNumber && <span>| {phoneNumber}</span>}

        {campus && (
          <>
            <span>|</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded-md">
              {campus}
            </span>
          </>
        )}
        {status === "suspended" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 ml-2">
            ถูกระงับ
          </span>
        )}
      </div>
    </div>
    {/* Actions */}
    <div className="flex items-center gap-2 ml-4">
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          แก้ไข
        </button>
      )}
    </div>
  </div>
);

export default ListUserCard;