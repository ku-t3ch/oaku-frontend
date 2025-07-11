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
  roles?: RoleItem[]; // เปลี่ยนเป็น object
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
    <div className="flex items-center gap-4 flex-1 min-w-0">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
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
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {name || "ไม่ระบุชื่อ"}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-slate-500 truncate">{userId}</span>
              <span className="text-sm text-slate-500 truncate">| {email}</span>
              {phoneNumber && (
                <span className="text-sm text-slate-500 truncate">
                  | {phoneNumber}
                </span>
              )}
              {/* Show roles sorted by priority (สูงไปต่ำ) */}
              {[...roles]
                .sort(
                  (a, b) =>
                    getRolePriority(b.role, b.position) -
                    getRolePriority(a.role, a.position)
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
          <div className="flex flex-wrap items-center gap-2">
            {campus && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded-md">
                {campus}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                status === "suspended"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : ""
              }`}
            >
              {status === "suspended" ? "ถูกระงับ" : null}
            </span>
          </div>
        </div>
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
