import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [EmployeeRegId, setEmployeeRegId] = useState(null); // Change to an empty string if it stores a single email
  const [orgId, setorgId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [sId, setSId] = useState(null);
  const [telId, settelId] = useState(null);
  const [tId, settId] = useState(null);
  const [oTLId, setoTLId] = useState(null);
  //counts
  const [count, setCount] = useState(null);
  const [techcount, settechCount] = useState(null);
  const [salescount, setSalescount] = useState(null);
  const [telcount, setTelcount] = useState(null);
  const [AccCount, setAccCount] = useState(null);

  const [smId, setsmId] = useState(null);
  const [mId, setmId] = useState(null);
  const [AdId, setAdId] = useState(null); //AdId = adId
  const [fId, setFid] = useState(null);
  const [selectedItemsInTable, setSelectedItemsInTable] = useState(null);
  const [itId, setitId] = useState(null);
  const [selectedAddItems, setSelectedAddItems] = useState(null);
  const [loginEmail, setloginEmail]= useState(null);
  const [quotationDetails, setquotationDetails] = useState(null);
  const [firstName, setfirstName] = useState(null);
  const [companyName, setcompanyName] = useState(null);
  const [role, setrole] = useState(null);

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
      firstName, setfirstName,
      companyName, setcompanyName,
      role, setrole,
      telId, settelId,
      tId, settId,
      oTLId, setoTLId,
      smId, setsmId,
      mId, setmId,
      count, setCount,
      techcount, settechCount,
      salescount, setSalescount,
      telcount, setTelcount,
      AccCount, setAccCount,
      resetAuth // Include the reset function in the context
    }}>

      {children}
    </AuthContext.Provider>
  );
};