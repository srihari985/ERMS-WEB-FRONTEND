import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Input,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from '../../../AuthProvider';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

function SalesManagerProfile() {
  const { empId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [loader, setLoader] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);  // State for button loader


  const { userId} = useAuth();


  const [employeeData, setEmployeeData] = useState({

    //Basic Details
    prefix: '',
    firstname: '',
    lastname: '',
    email: '',
    contactNumber1: '',
    dateOfBirth:'',
    workEmail: '',
    joiningDate: '',
    hno: '',
    city: '',
    state: '',
    bloodGroup:'',
    nationality: '',
    gender: '',
    //Personal Deatils
    panNumber: '',
    aadharNumber: '',
    passportNo: '',
    motherName: "",
    fatherName: "",
    contactNumber2: "",
    uan: "",
    maritalStatus: "",
    //Professional experience
    previousCompanyName: "",
    previousExperience: "",
    department: "",
    designation: "",
    currentCtc: "",
    higherQualification: "",
    //Bank details
    bankName: "",
    bankAccount: "",
    ifscCode: "",
    bankBranch: "",

    //Documents
    profilePic: null,
    document1: null,
    document2: null,
    document3: null,
  });
  const [tabData, setTabData] = useState({
    0: {},
    1: {},
    2: {},
    3: {},
    4: {}
  });
  const [profilePic, setProfilePic] = useState(null);
  const [document1, setDocument1] = useState(null);
  // const [document2, setDocument2] = useState(null);
  // const [document3, setDocument3] = useState(null);
 
  const [tabIndex, setTabIndex] = useState(0); // Manage active tab
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
  }, []);


  //Fetch Employee Data
  const fetchEmployee = async () => {
    try {
      setLoader(true);
      const response = await fetch(`${baseUrl}/api/v1/saleManagement/getById/${userId}`);
      const data = await response.json();
      setEmployee(data);
      setEmployeeData((prevData) => ({
        ...prevData,
        ...data
      }));
      // Initialize tab-specific data
      setTabData({
        0: {  prefix: data.prefix, 
            firstname: data.firstname, 
            lastname: data.lastname,
              email: data.email,
              contactNumber1: data.contactNumber1,
              dateOfBirth: data.dateOfBirth,
              workEmail: data.workEmail,
              joiningDate: data.joiningDate,
              hno: data.hno,
              city: data.city,
              state: data.state,
              bloodGroup: data.bloodGroup,
              nationality: data.nationality,
              gender: data.gender,
         },
        1: { 
              panNumber: data.panNumber,
              aadharNumber: data.aadharNumber,
              passportNo: data.passportNo,
              motherName: data.motherName,
              fatherName: data.fatherName,
              contactNumber2: data.contactNumber2,
              uan: data.uan,
              maritalStatus: data.maritalStatus,
            },
        2: { 
              previousCompanyName: data.previousCompanyName,
              previousExperience: data.previousExperience,
              department: data.department,
              designation: data.designation,
              currentCtc: data.currentCtc,
              higherQualification:data.higherQualification,
            },
        3: { 
              bankName: data.bankName,
              bankAccount: data.bankAccount,
              ifscCode: data.ifscCode,
              bankBranch: data.bankBranch,
            },
        4: { 
          profilePic: data.profilePic,
          document1: data.document1,
          document2: data.document2,
          document3: data.document3,
            },
      });
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTabData((prevData) => ({
      ...prevData,
      [tabIndex]: {
        ...prevData[tabIndex],
        [name]: value
      }
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'profilePic') {
      setProfilePic(files[0]);
    } else if (name === 'document1') {
      setDocument1(files[0]);
    }
    //  else if (name === 'document2') {
    //   setDocument2(files[0]);
    // } else if (name === 'document3') {
    //   setDocument3(files[0]);
    // }
  };


  

  //new handle save method
    const handleSave = async () => {
      setButtonLoader(true);  // Start the button loader
      const dataToSend = { ...tabData[tabIndex] };

      try {
        if (tabIndex === 4) {
          await handleFileUploadAndSave();
        } else {
          await updateEmployeeData(dataToSend);
        }

        // If the data update is successful
        Swal.fire({
          title: 'Success',
          text: 'Employee Details updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        // If there's an error during the update
        Swal.fire({
          title: 'Error',
          text: 'Failed to update Employee Details!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setButtonLoader(false);  // Stop the button loader
      }
    };

//Update Employee Data
  const updateEmployeeData = async (dataToSend) => {
    try {
      const response = await fetch(`https://hrbp.mapatrawala.com/mapatrawala-hrbp/api/employee/partial/update/${empId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setIsEditing((prev) => ({ ...prev, [tabIndex]: false }));
        fetchEmployee(); // Refresh the employee data
      } else {
        console.error('Failed to update employee data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  //File Upload for save
  const handleFileUploadAndSave = async () => {
    const formData = new FormData();
  
    // Add other fields from tabData[tabIndex] to formData
    Object.keys(tabData[tabIndex]).forEach(key => {
      if (tabData[tabIndex][key] !== null) {
        formData.append(key, tabData[tabIndex][key]);
      }
    });
  
    // Add profile pic and documents to formData if they exist
    if (profilePic) formData.append('profilePic', profilePic);
    if (document1) formData.append('document1', document1);
    // if (document2) formData.append('document2', document2);
    // if (document3) formData.append('document3', document3);
  
    try {
      const response = await fetch(`https://hrbp.mapatrawala.com/mapatrawala-hrbp/api/employee/update/documents/${empId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        setIsEditing((prev) => ({ ...prev, [tabIndex]: false }));
        fetchEmployee(); // Refresh the employee data
      } else {
        console.error('Failed to upload files and update employee data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  

  const handleEditClick = () => {
    setIsEditing((prev) => ({ ...prev, [tabIndex]: true }));
  };

  const handleCancelClick = () => {
    setIsEditing((prev) => ({ ...prev, [tabIndex]: false }));
    setTabData((prevData) => ({ ...prevData, [tabIndex]: employee }));
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };


  // Function to format field names with each word's first letter capitalized
  // const formatFieldName = (field) => {
  //   return field
  //     .replace(/([A-Z])/g, ' $1')  // Insert space before capital letters
  //     .replace(/^./, str => str.toUpperCase())  // Capitalize the first letter of the entire string
  //     .replace(/\b\w/g, char => char.toUpperCase());  // Capitalize the first letter of each word
  // };

  const formatFieldName = (field) => {
    // Special cases for certain field names
    switch (field) {
      case 'dateOfBirth':
        return 'Date of Birth';
      case 'email':
        return 'Email ID';
      case 'contactNumber1':
        return 'Contact Number';
      case 'hno':
        return 'House Number';
      case 'uan':
          return 'UAN';
      case 'ifscCode':
          return 'IFSC Code';
      default:
        // Default behavior: capitalize the first letter of each word, and add spaces before capital letters
        return field
          .replace(/([A-Z])/g, ' $1')  // Insert space before capital letters
          .replace(/^./, str => str.toUpperCase())  // Capitalize the first letter of the entire string
          .replace(/\b\w/g, char => char.toUpperCase());  // Capitalize the first letter of each word
    }
  };

  return (
    <Box margin={2}>
      {loader ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        employee && (
          <Card sx={{ backgroundColor: 'white', boxShadow: 1, marginTop: 11 }}>
            <CardContent>
            <ArrowBackIcon
                style={{
                  // marginRight: isMobile ? 0 : 15, // Adjust margin on mobile and desktop
                  fontSize: "35px", // Adjust size as needed
                  cursor:'pointer',
                  marginBottom:"1%"
                }}

                onClick={() => navigate('/SalesManagerDashboard')}
              />
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
              
                <Box display="flex" alignItems="center">
              
                  <Avatar
                    alt={`${employee.firstname} ${employee.lastname}`}
                    src={`data:image/jpeg;base64,${employee.profilePic}`}
                    sx={{ width: 100, height: 105}}
                  />
                  <Box sx={{ ml:1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 26 }}>
                      {employee.firstname} {employee.lastname}
                    </Typography>
                    <Typography variant="h5" sx={{ fontSize: 20 }}>
                      {employee.employeeId}
                    </Typography>
                  </Box>
                </Box>

                {/* <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#7e31ce",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#13A9BD" },
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate(`/attendance/${empId}`)}
                >
                  View Attendance
                </Button> */}
              </Box>

              <Tabs value={tabIndex} onChange={handleTabChange} aria-label="employee details tabs">
                <Tab label="Basic Details" sx={{ fontWeight: 'bold' }}  />
                <Tab label="Personal Details" sx={{ fontWeight: 'bold' }}  />
                <Tab label="Professional experience" sx={{ fontWeight: 'bold' }} />
                <Tab label="Bank Details" sx={{ fontWeight: 'bold' }} />
                <Tab label="Other Details" sx={{ fontWeight: 'bold' }} />
              </Tabs>

              <Grid container spacing={2} mt={2}>
                {tabIndex === 0 && (
                  <>
                    {/* Basic Details Tab */}
                    {["prefix","firstname","lastname",'email','contactNumber1',
                      'dateOfBirth',
                      'workEmail',
                      'joiningDate',
                      'hno',
                      'city',
                      'state',
                      'bloodGroup',
                      'nationality',
                      'gender',].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Box mb={2}>
                          <Typography
                            sx={{
                              fontSize: 16,
                              backgroundColor: '#dcf5f4',
                              padding: 2
                            }}
                          >
                            <strong>{formatFieldName(field)}:</strong>{' '}
                            {isEditing[tabIndex] ? (
                              <TextField
                                name={field}
                                value={tabData[tabIndex][field] || ''}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                              />
                            ) : (
                              tabData[tabIndex][field]
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {tabIndex === 1 && (
                  <>
                    {/* Personal Details Tab */}
                    {['panNumber','aadharNumber','passportNo','uan','contactNumber2','fatherName','motherName','maritalStatus',].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Box mb={2}>
                          <Typography
                            sx={{
                              fontSize: 16,
                              backgroundColor: '#dcf5f4',
                              padding: 2
                            }}
                          >
                            <strong>{formatFieldName(field)}:</strong>{' '}
                            {isEditing[tabIndex] ? (
                              <TextField
                                name={field}
                                value={tabData[tabIndex][field] || ''}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                              />
                            ) : (
                              tabData[tabIndex][field]
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {tabIndex === 2 && (
                  <>
                    {/* Professional Experience Tab */}
                    {[
                        'previousCompanyName',
                        'previousExperience',
                        'department',
                        'designation',
                        'currentCtc',
                        'higherQualification',

                    ].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Box mb={2}>
                          <Typography
                            sx={{
                              fontSize: 16,
                              backgroundColor: '#dcf5f4',
                              padding: 2
                            }}
                          >
                            <strong>{formatFieldName(field)}:</strong>{' '}
                            {isEditing[tabIndex] ? (
                              <TextField
                                name={field}
                                value={tabData[tabIndex][field] || ''}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                              />
                            ) : (
                              tabData[tabIndex][field]
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {tabIndex === 3 && (
                  <>
                    {/* Bank Details Tab */}
                    {['bankName','bankAccount','ifscCode','bankBranch',].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Box mb={2}>
                        <Typography
                            sx={{
                              fontSize: 16,
                              backgroundColor: '#dcf5f4',
                              padding: 2
                            }}
                          >
                            <strong>{formatFieldName(field)}:</strong>{' '}
                            {isEditing[tabIndex] ? (
                              <TextField
                                name={field}
                                value={tabData[tabIndex][field] || ''}
                                onChange={handleChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                              />
                            ) : (
                              tabData[tabIndex][field]
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {tabIndex === 4 && (
                  <>
                    {/* Other Details Tab */}
                    {['profilePic',].map((field) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Box mb={2}>
                          <Typography
                            sx={{
                              fontSize: 16,
                              backgroundColor: '#dcf5f4',
                              padding: 2,
                            }}
                          >
                            <strong>{formatFieldName(field)}:</strong>{' '}
                            {isEditing[tabIndex] ? (
                              <Input
                                type="file"
                                name={field}
                                onChange={handleFileChange}
                                fullWidth
                              />
                            ) : (
                              // tabData[tabIndex][field] && tabData[tabIndex][field].name 
                              //   ? tabData[tabIndex][field].name 
                              //   : 'No file uploaded'
                              field === 'profilePic' && tabData[tabIndex][field]
                                  ? <Avatar src={`data:image/jpeg;base64,${employee.profilePic}`} sx={{ width: 120, height: 120 }} />
                                  : 'No file uploaded'
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}


              </Grid>

              <Box mt={2}>
                {isEditing[tabIndex] ? (
                  <>
                    {/* <Button onClick={handleSave} color="primary" variant="contained" sx={{ mr: 2 }}>
                      Save
                    </Button> */}
                    <Button
                      variant="contained"
                      sx={{color: "primary", mr: 2  }}
                      onClick={handleSave}
                      disabled={buttonLoader}  // Disable button while loading
                    >
                      {buttonLoader ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        "Save"
                      )}
                  </Button>

                    <Button onClick={handleCancelClick} color="secondary" variant="outlined" ml="10px">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEditClick} color="primary" variant="contained">
                    Edit
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )
      )}
    </Box>
  );
}

export default SalesManagerProfile;
