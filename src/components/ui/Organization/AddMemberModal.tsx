import React, { useState, useEffect } from "react";
import { X, Search, User, Loader2, Check } from "lucide-react";
import { User as UserType } from "@/interface/user";
import { useUsers, useUsersByFilter, useAddUserToOrganization } from "@/hooks/useUserApi";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationTypeId: string;
  currentUser: UserType;
  token: string;
  onSuccess: () => void;
  userType: "SUPER_ADMIN" | "CAMPUS_ADMIN";
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  organizationId,
  organizationTypeId,
  currentUser,
  token,
  onSuccess,
  userType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("MEMBER"); 
  // เปลี่ยนจาก availableUsers เป็น allDisplayUsers
  const [allDisplayUsers, setAllDisplayUsers] = useState<UserType[]>([]);

  // Hook สำหรับ get users ทั้งหมด (super admin)
  const { users: allUsers, loading: loadingAllUsers, fetchUsers } = useUsers(token);
  
  // Hook สำหรับ get users ตาม filter (campus admin)
  const { users: filteredUsers, loading: loadingFilteredUsers, fetchUsersByFilter } = useUsersByFilter(token);
  
  // Hook สำหรับเพิ่ม user เข้า organization
  const { mutate: addUserToOrg, loading: addingUser } = useAddUserToOrganization(token);

  const isLoading = loadingAllUsers || loadingFilteredUsers;
  
  // แยกการเลือก users ตาม userType
  const users = userType === "SUPER_ADMIN" ? allUsers : filteredUsers;

  // Fetch users based on userType
  useEffect(() => {
    if (isOpen && token) {
      if (userType === "SUPER_ADMIN") {
        fetchUsers();
      } else if (userType === "CAMPUS_ADMIN") {
        fetchUsersByFilter({
          campusId: currentUser.campus.id,
        });
      }
    }
  }, [isOpen, token, userType, currentUser.campus, fetchUsers, fetchUsersByFilter]);

  // แสดง users ทั้งหมดแต่แยกว่าใครอยู่ใน organization แล้ว
  useEffect(() => {
    setAllDisplayUsers(users);
  }, [users]);

  // ฟังก์ชันตรวจสอบว่า user อยู่ใน organization นี้แล้วหรือไม่
  const isUserInOrganization = (user: UserType) => {
    return user.userOrganizations?.some(
      userOrg => userOrg.organization?.id === organizationId
    ) || false;
  };

  // Filter users by search term
  const filteredDisplayUsers = allDisplayUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = async (userId: string) => {
    try {
      await addUserToOrg(userId, {
        organizationTypeId,
        organizationId,
        position: selectedPosition,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedPosition("MEMBER");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">เพิ่มสมาชิกใหม่</h3>
              <p className="text-sm text-slate-500 mt-1">
                เลือกผู้ใช้ที่ต้องการเพิ่มเข้าองค์กร
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Position Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ตำแหน่งในองค์กร
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedPosition("MEMBER")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  selectedPosition === "MEMBER"
                    ? "bg-[#006C67] text-white shadow"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                สมาชิกทั่วไป
              </button>
              <button
                onClick={() => setSelectedPosition("HEAD")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  selectedPosition === "HEAD"
                    ? "bg-[#006C67] text-white shadow"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                หัวหน้าองค์กร
              </button>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ค้นหาผู้ใช้
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="พิมพ์ชื่อหรืออีเมลเพื่อค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 text-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006C67]/50 focus:border-[#006C67]"
              />
            </div>
          </div>

          {/* Users List */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              รายชื่อผู้ใช้
            </label>
            <div className="border border-slate-200 rounded-lg max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="text-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#006C67] mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">
                    กำลังโหลด{userType === "SUPER_ADMIN" 
                      ? "ผู้ใช้ทั้งหมด" 
                      : `ผู้ใช้ใน${currentUser.campus.name}`}...
                  </p>
                </div>
              ) : filteredDisplayUsers.length === 0 ? (
                <div className="text-center p-8">
                  <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    {searchTerm ? "ไม่พบผู้ใช้ที่ค้นหา" : "ไม่มีผู้ใช้"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredDisplayUsers.map((user) => {
                    const isAlreadyMember = isUserInOrganization(user);
                    return (
                      <div 
                        key={user.id} 
                        className={`flex items-center justify-between p-3 ${
                          isAlreadyMember ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-base">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className={`font-medium text-sm ${
                              isAlreadyMember ? 'text-slate-500' : 'text-slate-800'
                            }`}>
                              {user.name}
                            </h4>
                            <p className="text-xs text-slate-500">{user.email}</p>
                            <p className="text-xs text-slate-400">{user.campus?.name}</p>
                          </div>
                        </div>
                        
                        {isAlreadyMember ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm">
                            <Check className="w-4 h-4" />
                            สมาชิก
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddMember(user.id)}
                            disabled={addingUser}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006C67] text-white rounded-md text-sm hover:bg-[#005A56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingUser ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "เพิ่ม"
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right rounded-b-lg">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};