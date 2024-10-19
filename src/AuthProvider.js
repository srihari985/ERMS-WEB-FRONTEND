import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [EmployeeRegId, setEmployeeRegId] = useState(null); // Change to an empty string if it stores a single email
  const [orgId, setorgId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [sId, setSId] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [fId, setFid] = useState(null);
  const [selectedItemsInTable, setSelectedItemsInTable] = useState(null);
  
  return (
    <AuthContext.Provider value={{ EmployeeRegId, setEmployeeRegId,orgId, setorgId, userId, setUserId, token, setToken,sId, setSId,selectedParty, setSelectedParty,fId, setFid,selectedItemsInTable, setSelectedItemsInTable }}>
      {children}
    </AuthContext.Provider>
  );
};