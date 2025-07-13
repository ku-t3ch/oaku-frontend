import React, { createContext, useContext, useState } from "react";

interface SelectedUserContextType {
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
}

const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

export const SelectedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <SelectedUserContext.Provider value={{ selectedUserId, setSelectedUserId }}>
      {children}
    </SelectedUserContext.Provider>
  );
};

export const useSelectedUser = () => {
  const context = useContext(SelectedUserContext);
  if (!context) throw new Error("useSelectedUser must be used within SelectedUserProvider");
  return context;
};