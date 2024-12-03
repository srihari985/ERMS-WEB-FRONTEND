
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  TextField,
  Button,
  Tabs,
  Tab,
  Input,
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";
import { useAuth } from "../../../AuthProvider";
// import { useCompany } from "../CompanyContext/CompanyContext";
const baseUrl = process.env.REACT_APP_API_BASE_URL;
const OrganizationProfile = () => {
  const [tabIndex, setTabIndex] = useState(0); // Track which tab is selected
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    pinCode: "",
    contactNumber: "",
    secondContactNumber: "",
    gstIn: "",
    companyAddress: "",
    businessType: "",
    city: "",
    state: "",
    email: "",
    companyLogo: "",
    companyStamp: "",
  });
  const [loading, setLoading] = useState(true); // Loader state
  const {userId} = useAuth();
  const [editableState, setEditableState] = useState({
    0: false, // Editable state for "Company Details" tab
    1: false, // Editable state for "Upload Documents" tab
  });

//   const { setCompanyInfo: setCompanyContextInfo } = useCompany(); // Use context to set companyInfo

  const [tempInfo, setTempInfo] = useState({ ...companyInfo });

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/organize/getById/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        

        const data = await response.json();
        setCompanyInfo({
          companyLogo: data.companyLogo,
          companyStamp:data.companyStamp,
          companyName: data.companyName,
          city: data.city,
          state: data.state,
          businessType: data.businessType,
          companyAddress: data.companyAddress,
          contactNumber: data.contactNumber,
          gstIn: data.gstIn,
          secondContactNumber: data.secondContactNumber,
          pinCode: data.pinCode,
          email: data.email,
        });
        setTempInfo(data);

        setLoading(false); // Data fetched, stop loading

      } catch (error) {
        console.error("Error fetching company info:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchCompanyInfo();
  }, []);
//   [setCompanyContextInfo]

  const handleEdit = () => {
    setEditableState((prev) => ({ ...prev, [tabIndex]: true }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(tempInfo).forEach((key) => {
      formData.append(key, tempInfo[key]);
    });

    try {
      let response;
      if (tabIndex === 0) {
        response = await fetch(`https://hrbp.mapatrawala.com/mapatrawala-hrbp/api/organisation/update/1`, {
          method: "PATCH",
          body: JSON.stringify(tempInfo),
          headers: { "Content-Type": "application/json" },
        });
      } else if (tabIndex === 1) {
        response = await fetch(`https://hrbp.mapatrawala.com/mapatrawala-hrbp/api/organisation/organisation/1`, {
          method: "PATCH",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedData = await response.json();
      setCompanyInfo(updatedData);

      //new code
      // Update context with new company info
    //   setCompanyContextInfo({
    //     companyLogo: updatedData.companyLogo,
    //     companyName: updatedData.companyName,
        
    //   });

      setEditableState((prev) => ({ ...prev, [tabIndex]: false }));
      Swal.fire("Success", "Profile updated successfully!", "success");
    
    } catch (error) {
      console.error("Error saving company info:", error);
      Swal.fire("Error", "Failed to update profile. Please try again.", "error");
    }
  };

 

  const handleCancel = () => {
    setTempInfo({ ...companyInfo });
    setEditableState((prev) => ({ ...prev, [tabIndex]: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const fileType = file.type;
      const fileSize = file.size / 1024 / 1024;

      if (!["image/jpeg", "image/png"].includes(fileType)) {
        Swal.fire("Error", "Only JPEG and PNG files are allowed.", "error");
        return;
      }

      if (fileSize > 1) {
        Swal.fire("Error", "File size must be less than 1MB.", "error");
        return;
      }

      setTempInfo((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setEditableState((prev) => ({ ...prev, [newValue]: false }));
  };

  // const formatFieldName = (field) => {
  //   if (field === "profilePic") return "Profile Picture";
  //   if (field === "document1") return "Document 1";
  //   return field;
  // };

  return (
    <Box mt={9} mx={2} display="flex" justifyContent="center">
      <Card
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          p: 3,
          width: "100%",
          maxWidth: isMobile ? "100%" : "1400px",
          marginBottom: 5,
          position: "relative",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontSize: 24, fontWeight: "bold", marginBottom: 2 }}>
            Profile
          </Typography>

          {/* Company Logo and Name */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>

            {loading ? (
          <Typography variant="h4">Loading...</Typography>  
        ) : (
          <>

            <img
              src={`data:image/jpeg;base64,${companyInfo.companyLogo}`}
              alt="Company Logo"
              style={{
                maxWidth: isMobile ? "100px" : "130px",
                height: isMobile ? "100px" : "140px",
                borderRadius: "65%",
                marginBottom: "5px",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontSize: isMobile ? 20 : 24,
                fontWeight: "bold",
                marginTop: 1,
                marginBottom: 5,
                textAlign: "center",
              }}
            >
              {companyInfo.companyName}
            </Typography>

            </>
            )}

          </Box>

          {/* Tab Navigation */}
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Company Details" />
            <Tab label="Upload Documents" />
          </Tabs>

          {/* First Tab: Text Fields */}
          {tabIndex === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} mb={2}>
                {editableState[0] ? (
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={tempInfo.companyName || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ backgroundColor: "#E0F5F3", borderRadius: 1 }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ backgroundColor: "#E0F5F3", p: 2, borderRadius: 1 }}
                  >
                    <strong style={{ fontSize: "16px" }}>Company Name :</strong>{" "}
                    <strong style={{ fontSize: "18px" }}>{companyInfo.companyName}</strong>
                  </Typography>
                )}
              </Grid>

              {[
                { label: "Business Type", name: "businessType" },
                { label: "Address", name: "companyAddress" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Primary Contact", name: "contactNumber" },
                { label: "GSTIN", name: "gstIn" },
                { label: "Secondary Contact", name: "secondContactNumber" },
                { label: "Pincode", name: "pinCode" },
                { label: "Email ID", name: "email" },
              ].map(({ label, name }) => (
                <Grid item xs={12} md={6} key={name} mb={2}>
                  {editableState[0] ? (
                    <TextField
                      fullWidth
                      label={label}
                      name={name}
                      value={tempInfo[name] || ""}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{ backgroundColor: "#E0F5F3", borderRadius: 1 }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ backgroundColor: "#E0F5F3", p: 2, borderRadius: 1 }}
                    >
                      <strong style={{ fontSize: "16px" }}>{label} :</strong>{" "}
                      <strong style={{ fontSize: "18px" }}>{companyInfo[name]}</strong>
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          )}

          {/* Second Tab: File Uploads */}
   {tabIndex === 1 && (
            <>
              {["companyLogo", "companyStamp"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Box mb={2}>
                    <Typography
                      sx={{
                        fontSize: 16,
                        backgroundColor: "#E0F5F3",
                        padding: 2,
                        borderRadius: 1,
                      }}
                    >
                      <strong>{field === "companyLogo" ? "Company Logo" : "Company Stamp"}:</strong>{" "}
                      {editableState[1] ? (
                        <Input
                          type="file"
                          name={field}
                          onChange={handleFileChange}
                          inputProps={{ accept: ".jpg,.jpeg,.png" }}
                          fullWidth
                        />
                      ) : field === "companyLogo" && companyInfo[field] ? (
                        <Avatar
                          src={`data:image/jpeg;base64,${companyInfo.companyLogo}`}
                          alt="Company Logo"
                          sx={{ width: 120, height: 120, mt: 1 }}
                        />
                      ) : field === "companyStamp" && companyInfo[field] ? (
                        <Avatar
                          src={`data:image/jpeg;base64,${companyInfo.companyStamp}`}
                          alt="Company Stamp"
                          sx={{ width: 120, height: 120, mt: 1 }}
                        />
                      ) : (
                        "No file uploaded"
                      )}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}


          {/* Save/Cancel/Edit Buttons */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            {editableState[tabIndex] ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mr: 2 }}
                >
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrganizationProfile;
