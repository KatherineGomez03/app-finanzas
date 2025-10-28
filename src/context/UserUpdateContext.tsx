"use client";
import { createContext, useContext, useState, useCallback } from "react";

const UserUpdateContext = createContext<{
  triggerUpdate: () => void;
  updateFlag: number;
}>({
  triggerUpdate: () => { },
  updateFlag: 0,
});

export const UserUpdateProvider = ({ children }: { children: React.ReactNode }) => {
  const [updateFlag, setUpdateFlag] = useState(0);

  const triggerUpdate = useCallback(() => {
    setUpdateFlag(prev => prev + 1);
  }, []);

  return (
    <UserUpdateContext.Provider value={{ triggerUpdate, updateFlag }}>
      {children}
    </UserUpdateContext.Provider>
  );
};

export const useUserUpdate = () => useContext(UserUpdateContext);
