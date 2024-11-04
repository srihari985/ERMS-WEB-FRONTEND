import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [EmployeeRegId, setEmployeeRegId] = useState(null); // Change to an empty string if it stores a single email
  const [orgId, setorgId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [sId, setSId] = useState(null);
  const [AdId, setAdId] = useState(null); //AdId = adId
  const [fId, setFid] = useState(null);
  const [selectedItemsInTable, setSelectedItemsInTable] = useState(null);
  const [itId, setitId] = useState(null);
  const [selectedAddItems, setSelectedAddItems] = useState(null);
  const [loginEmail, setloginEmail]= useState(null);
  const [quotationDetails, setquotationDetails] = useState(null);

  // Function to reset all authentication-related states
  const resetAuth = () => {
    setEmployeeRegId(null);
    setorgId(null);
    setUserId(null);
    setToken(null);
    setSId(null);
    setAdId(null);
    // setFid(null);
    setSelectedItemsInTable(null);
    setitId(null);
    setSelectedAddItems(null);
    setloginEmail(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      EmployeeRegId, setEmployeeRegId,
      orgId, setorgId, 
      userId, setUserId, 
      token, setToken,
      sId,setSId,
      AdId,setAdId,
      fId, setFid,
      selectedItemsInTable, setSelectedItemsInTable,
      itId, setitId,
      selectedAddItems, setSelectedAddItems,
      loginEmail, setloginEmail,
      quotationDetails, setquotationDetails,
      resetAuth // Include the reset function in the context
    }}>

      {children}
    </AuthContext.Provider>
  );
};