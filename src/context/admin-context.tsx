import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  setIsAdmin: () => {},
});

const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin");
    setIsAdmin(storedAdmin === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
