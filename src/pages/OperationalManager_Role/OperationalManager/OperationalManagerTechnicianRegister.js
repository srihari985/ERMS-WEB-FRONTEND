import React, { useState } from "react";
import { Formik, useField} from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Card,
  Typography,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import swal from "sweetalert";
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from '../../../AuthProvider';
// Define styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const FacebookCircularProgress = styled(CircularProgress)({
  color: "#3b5998",
});



const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal","Other"
];

const OperationalManagerTechnicianRegister = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const { userId,token } = useAuth(); // Access userId from AuthContext
  const baseUrl=process.env.REACT_APP_API_BASE_URL
  const managetoken = token;
  // Validation schema using yup
  const validationSchemaTab0 = yup.object().shape({
    // Basic Details
    prefix: yup.string().required("Prefix is required"),
    firstname: yup
      .string()
      .required("First Name is required")
      .matches(/^[a-zA-Z\s]+$/, "First Name can only contain letters"),
    lastname: yup
      .string()
      .required("Last Name is required")
      .matches(/^[a-zA-Z\s]+$/, "Last Name can only contain letters"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    contactNumber1: yup
      .string()
      .required("Contact Number is required")
      .matches(/^\d+$/, "Contact Number can only contain numbers")
      .matches(/^[0-9]{10}$/, "Contact Number must be exactly 10 digits"),

    gender: yup.string().required("Gender is required"),

    dateofBirth: yup
      .date()
      .required("Date of Birth is required")
      .max(new Date(), "Date of Birth cannot be in the future"),

    nationality: yup.string().required("Nationality is required"),

    workEmail: yup
      .string()
      .email("Invalid email format")
      .required("Work Email is required"),
    joiningDate: yup
      .date()
      .required("Joining Date is required")
      .max(new Date(), "Joining Date cannot be in the future"),

    city: yup
      .string()
      .required("City is required")
      .matches(/^[a-zA-Z\s]+$/, "City can only contain letters"),

    state: yup.string().required("State is required"),
    role: yup.string().required("Role is required"),

    
  });

  const validationSchemaTab1 = yup.object().shape({
    panNumber: yup
    .string()
    .required("PAN Number is required")
    .matches(/^(?=(.*[A-Z]){6})(?=(.*[0-9]){4})[A-Z0-9]{10}$/, "PAN Number must have exactly 6 capital letters and 4 digits in any order"),
    
    aadharNumber: yup
    .string()
    .required("Aadhar Number is required")
    .matches(/^[0-9]{12}$/, "Aadhar Number must be exactly 12 digits"),

    fatherName: yup
      .string()
      .required("Father Name is required")
      .matches(/^[A-Za-z\s]+$/, "Father Name can only contain letters")
      .max(100, "Father Name cannot exceed 100 characters"),

    motherName: yup
      .string()
      .required("Mother Name is required")
      .matches(/^[A-Za-z\s]+$/, "Mother Name can only contain letters")
      .max(100, "Mother Name cannot exceed 100 characters"),
    
  });
  const validationSchemaTab2 = yup.object().shape({
    higherQualification: yup
      .string()
      .required("Higher Qualification is required")
      .max(50, "Qualification can't be longer than 50 characters"),
    currentCtc: yup.number()
      .typeError('CTC must be a number')
      .required('Current CTC is required')
      .positive('CTC must be a positive number')
      .max(10000000, 'CTC cannot exceed 10 million'), // Example max value

    previousCompanyName: yup
      .string()
      .matches(/^[A-Za-z\s]+$/, 'Previous Company Name must contain only letters')
      .test(
        'is-fresher-or-company',
        'Previous Company Name is required or enter NA for fresher',
        (value) => value === 'NA' || (value && value.length > 0)
      )
      .max(100, "Previous Company Name cannot exceed 100 characters"),
    
    previousExperience: yup
      .number()
      .typeError('Previous Experience must be a number')
      .required('Previous Experience is required')
      .min(0, 'Previous Experience cannot be negative') // Allows 0 and positive numbers
      .max(99, 'Previous Experience cannot exceed 2 digits'), // Ensures up to 2 digits

    // reportingManager: yup
    //   .string()
    //   .required("Reporting Manager Name is required")
    //   .max(50, "Reporting Manager Name can't be longer than 50 characters"),

    // reportingSalesManager: yup
    //   .string()
    //   .required("Reporting Sales Manager Name is required")
    //   .max(50, "Reporting Sales Manager Name can't be longer than 50 characters"),
    
    
  });
  const validationSchemaTab4 = yup.object().shape({
    bankName: yup
      .string()
      .required("Bank Name is required")
      .matches(/^[A-Za-z\s]+$/, "Bank Name can only contain letters")
      .max(100, "Bank Name cannot exceed 100 characters"),

    bankAccount: yup
      .string()
      .required("Bank Account Number is required")
      .matches(/^\d{9,18}$/, "Bank Account Number must be between 9 and 18 digits"),

    ifscCode: yup
      .string()
      .required("IFSC Code is required")
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "IFSC Code must be in capital letters and numbers"),

    bankBranch: yup
      .string()
      .required("Bank Branch is required")
      .matches(/^[A-Za-z\s]+$/, "Bank Branch can only contain letters")
      .max(100, "Bank Branch cannot exceed 100 characters"),

    
  });
  const validationSchemaTab5 = yup.object().shape({
    profilePic: yup
      .mixed()
      .required("Profile picture is required")
      .test("fileSize", "File size should be less than 1MB", (value) => {
        return value && value.size <= 1024 * 1024; // 1MB in bytes
      })
      .test("fileFormat", "Unsupported file format. Only JPG, JPEG, and PNG are allowed", (value) => {
        return value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
      }),
    
    // document1: yup.mixed()
    // .required("Document 1 is required")
    // .test(
    //   "fileType",
    //   "Only .pdf files and less than 1 MB are allowed",
    //   (value) => value && value.type === "application/pdf"
    // )
    // .test(
    //   "fileSize",
    //   "File must be less than 1 MB",
    //   (value) => value && value.size <=  1024 * 1024 // 1 MB in bytes
    // ),

    
  });

  const getValidationSchema = () => {
    switch (currentTab) {
      case 0:
        return validationSchemaTab0;
      case 1:
        return validationSchemaTab1;
      case 2:
        return validationSchemaTab2;
      case 4:
        return validationSchemaTab4;
      case 5:
        return validationSchemaTab5;
      // Add cases for other tabs if needed
      default:
        return validationSchemaTab0; // Default schema
    }
  };
  
  
  
  
  //  new handle submit code
  const handleSubmit = async (values) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Add Employee',
      text: "Are you sure you want to add new employee?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      setLoading(true);
      try {
        // 
        const sanitizedValues = { ...values };
        Object.keys(sanitizedValues).forEach((key) => {
          if (sanitizedValues[key] === '' || sanitizedValues[key] === 'null') {
            sanitizedValues[key] = null;
          }
        });
  
        const formData = new FormData();
  
        // Function to compress files
        const compressFile = async (file) => {
          if (!file) return file;
  
          if (file.type.startsWith('image/')) {
            // Compress image file
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1024 };
            return await imageCompression(file, options);
          } else if (file.type === 'application/pdf') {
            // Compress PDF file
            const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
            const compressedPdf = await pdfDoc.save();
            return new Blob([compressedPdf], { type: 'application/pdf' });
          }
          return file;
        };
  
        // Function to handle and append files
        const handleFile = async (key, file) => {
          const compressedFile = await compressFile(file);
          formData.append(key, compressedFile);
        };
  
        // Append files and other values to FormData
        await Promise.all(
          Object.keys(sanitizedValues).map(async (key) => {
            if (sanitizedValues[key] && sanitizedValues[key] instanceof File) {
              await handleFile(key, sanitizedValues[key]);
            } else if (sanitizedValues[key] !== null) {
              formData.append(key, sanitizedValues[key]);
            }
          })
        );
  
        // const response = await fetch(`${baseUrl}/api/auth/organize/register/admin/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`, {
        //   method: 'POST',
        //   body: formData,
        // });


        // Determine API endpoint based on role
        let apiEndpoint;
        switch (values.role) {        
          case 'TECHNICIAN':
              apiEndpoint = `${baseUrl}/api/v1/operationTechLead/register/technician/${userId}`;
              break;
          case 'SALES':
              apiEndpoint = `${baseUrl}/api/v1/operationTechLead/register/sales/${userId}`;
              break;
          case 'TELECALLER':
              apiEndpoint = `${baseUrl}/api/v1/operationTechLead/register/telecaller/${userId}`;
              break;
          default:
            throw new Error('Invalid role specified');
        }

        // Make the API call
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${managetoken}`, // Replace token with your auth token
          },
        });

  
        if (response.ok) {
          const responseData = await response.json();
          Swal.fire({
            title: 'Success',
            text: 'Employee Added Successfully',
            icon: 'success',
          });
          
        } else {
          const errorText = await response.text();
          console.error('Error submitting the form:', response.statusText, errorText);
          Swal.fire({
            title: 'Error',
            text: `${response.statusText} ${errorText}`,
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Error submitting the form', error);
        Swal.fire({
          title: 'Error',
          text: 'An unexpected error occurred while submitting the form.',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Initial form values
  const initialValues = {
    //Basic
    prefix: "",
    firstname: "",
    lastname: "",
    email: "",
    contactNumber1: "",
    gender: "",
    dateofBirth:"",
    nationality: "",
    workEmail: "",
    joiningDate: "", 
    hno: "",
    city: "",
    state: "",
    bloodGroup:'',
    role:"",

    //Personal Deatils
    panNumber: "",
    aadharNumber: "",
    passportNo: "",
    contactNumber2: "",
    uan: "",

    //Family Details
    fatherName: "",
    motherName: "",
    maritalStatus: "",

    //Professional Summary
    previousCompanyName: "",
    previousExperience: "",
    department: "",
    designation: "",
    currentCtc: "",
    higherQualification: "",
    // reportingManager:"",
    // reportingSalesManager:"",

    //Salary BreakDown
    bonus:0,
    otherEarnings:0,
    workBasisPay:0,
    overTime:0,
    incentive:0,
    tax:0,
    pf:0,
    loanRepayment:0,
    earlyLeavingFine:0,
    lateComingFine:0,
    otherDeductions:0,
    hra:0,
    dra:0,
    petrolAllowance:0,
    foodAllowance:0,
    basicSalary:0,

    //Bank details
    bankName: "",
    bankAccount: "",
    ifscCode: "",
    bankBranch: "",

    //Documents
    profilePic: null,
    // document1: null,
    // document2: null,
    // document3: null,
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  
  const prefixOptions = [
    { value: "Mr.", label: "Mr." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Miss.", label: "Miss." },
    { value: "Ms.", label: "Ms." },
    { value: "Mx.", label: "Mx." },
  ];
 

  return (
    <Box marginTop={9}>

     
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          validateForm,
          setFieldValue,
          setTouched,
        }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent the default form submission behavior
              handleSubmit(values); // Call the handleSubmit function with form values
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Card
                sx={{
                  padding: 2,
                  backgroundColor: "#fff",
                  width: "96%",
                  height: "60%",
                }}
              >
             
                 
                {currentTab === 0 && (
                  <Box>
                     {/* <ArrowBackIcon
                        style={{
                          marginRight:3, // Adjust margin on mobile and desktop
                          fontSize: "30px", // Adjust size as needed
                          cursor:'pointer'
                        }}

                        onClick={() => navigate(`/employee}`)}
                      />
                    <Typography
                      variant="h6"
                      fontSize={20}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                      Basic Details
                    </Typography> */}
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      {/* <ArrowBackIcon
                        style={{
                          marginRight: 3, // Adjust margin as needed
                          fontSize: "30px", // Adjust size as needed
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/employee`)}
                      /> */}
                      <Typography
                        variant="h6"
                        fontSize={20}
                        sx={{ fontWeight: "bold" }}
                      >
                        Basic Details
                      </Typography>
                    </Box>
                    <Box
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                    >
                      <FormControl
                        fullWidth
                        error={touched.prefix && !!errors.prefix}
                      >
                        <InputLabel htmlFor="prefix">Prefix</InputLabel>
                        <Select
                          id="prefix"
                          name="prefix"
                          value={values.prefix}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Prefix"
                          inputProps={{
                            id: "prefix",
                          }}
                        >
                          {prefixOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {touched.prefix && errors.prefix}
                        </FormHelperText>
                      </FormControl>
                      
                      {/* <StyledTextField
                        fullWidth
                        type="text"
                        label="First Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstname}
                        name="firstname"
                        autoComplete="off"
                        error={!!touched.firstname && !!errors.firstname}
                        helperText={touched.firstname && errors.firstname}
                      /> */}
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="First Name"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.firstname}
                        name="firstname"
                        autoComplete="off"
                        error={!!touched.firstname && !!errors.firstname}
                        helperText={touched.firstname && errors.firstname}
                      />

                     
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Last Name"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.lastname}
                        name="lastname"
                        autoComplete="off"
                        error={!!touched.lastname && !!errors.lastname}
                        helperText={touched.lastname && errors.lastname}
                      />
                      <StyledTextField
                        fullWidth
                        type="email"
                        label="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        autoComplete="off"
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Contact Number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.contactNumber1}
                        name="contactNumber1"
                        autoComplete="off"
                        error={
                          !!touched.contactNumber1 && !!errors.contactNumber1
                        }
                        helperText={
                          touched.contactNumber1 && errors.contactNumber1
                        }
                      />
                      

                      <StyledTextField
                        fullWidth
                        type="date"
                        label="Date of Birth"
                        InputLabelProps={{ shrink: true }}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.dateofBirth}
                        name="dateofBirth"
                        autoComplete="off"
                        error={!!touched.dateofBirth && !!errors.dateofBirth}
                        helperText={touched.dateofBirth && errors.dateofBirth}
                      />
                      <StyledTextField
                        fullWidth
                        type="email"
                        label="Work Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.workEmail}
                        name="workEmail"
                        autoComplete="off"
                        error={!!touched.workEmail && !!errors.workEmail}
                        helperText={touched.workEmail && errors.workEmail}
                      />
                      <StyledTextField
                        fullWidth
                        type="date"
                        label="Joining Date"
                        InputLabelProps={{ shrink: true }}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.joiningDate}
                        name="joiningDate"
                        autoComplete="off"
                        error={!!touched.joiningDate && !!errors.joiningDate}
                        helperText={touched.joiningDate && errors.joiningDate}
                      />
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="House Number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.hno}
                        name="hno"
                        autoComplete="off"
                        error={!!touched.hno && !!errors.hno}
                        helperText={touched.hno && errors.hno}
                      />
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="City"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.city}
                        name="city"
                        autoComplete="off"
                        error={!!touched.city && !!errors.city}
                        helperText={touched.city && errors.city}
                      />
                      {/* <StyledTextField
                        fullWidth
                        type="text"
                        label="State"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.state}
                        name="state"
                        autoComplete="off"
                        error={!!touched.state && !!errors.state}
                        helperText={touched.state && errors.state}
                      /> */}
                      <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                          label="State"
                          value={values.state || ''}
                          onChange={handleChange}
                          name="state"
                          onBlur={handleBlur}
                          error={!!touched.state && !!errors.state}
                        >
                          {states.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.state && errors.state && (
                          <Typography color="error" variant="body2">
                            {errors.state}
                          </Typography>
                        )}
                      </FormControl>

                      

                        <FormControl fullWidth>
                          <InputLabel>Blood Group</InputLabel>
                          <Select
                            label="Blood Group"
                            value={values.bloodGroup}
                            onChange={handleChange}
                            name="bloodGroup"
                            onBlur={handleBlur}
                            error={!!touched.bloodGroup && !!errors.bloodGroup}
                          >
                            <MenuItem value="A+">A+</MenuItem>
                            <MenuItem value="A-">A-</MenuItem>
                            <MenuItem value="B+">B+</MenuItem>
                            <MenuItem value="B-">B-</MenuItem>
                            <MenuItem value="O+">O+</MenuItem>
                            <MenuItem value="O-">O-</MenuItem>
                            <MenuItem value="AB+">AB+</MenuItem>
                            <MenuItem value="AB-">AB-</MenuItem>
                            <MenuItem value="AB-">None</MenuItem>
                          </Select>
                          {touched.bloodGroup && errors.bloodGroup && (
                            <Typography color="error" variant="body2">
                              {errors.bloodGroup}
                            </Typography>
                          )}
                        </FormControl>

                    
                      <FormControl fullWidth>
                        <InputLabel>Nationality</InputLabel>
                        <Select
                          label="Nationality"
                          value={values.nationality}
                          onChange={handleChange}
                          name="nationality"
                          onBlur={handleBlur}
                          error={!!touched.nationality && !!errors.nationality}
                        >
                          
                          <MenuItem value="Indian">Indian</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                         
                        </Select>
                        {touched.nationality && errors.nationality && (
                          <Typography color="error" variant="body2">
                            {errors.nationality}
                          </Typography>
                        )}
                      </FormControl>

                      <FormControl
                        fullWidth
                        error={touched.gender && !!errors.gender}
                      >
                        <InputLabel htmlFor="gender">Gender</InputLabel>
                        <Select
                          id="gender"
                          name="gender"
                          value={values.gender}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Gender"
                          inputProps={{
                            id: "gender",
                          }}
                        >
                          {genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {touched.gender && errors.gender}
                        </FormHelperText>
                      </FormControl>
{/* newly added code */}
                      <FormControl fullWidth>
                        <InputLabel> Select Role</InputLabel>
                        <Select
                          label="Select Role"
                          value={values.role}
                          onChange={handleChange}
                          name="role"
                          onBlur={handleBlur}
                          error={!!touched.role && !!errors.role}
                        >
                          
                      
                         
                          <MenuItem value="SALES">SALES</MenuItem>
                          <MenuItem value="TECHNICIAN">TECHNICIAN</MenuItem>
                          <MenuItem value="TELECALLER">TELECALLER</MenuItem>
                         
                        </Select>
                        {touched.role && errors.role && (
                          <Typography color="error" variant="body2">
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>

                      
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      marginTop={3}
                    >
                      <Button
                        variant="contained"
                      
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        // onClick={() => {
                        //   validateForm().then((errors) => {
                        //     if (Object.keys(errors).length === 0) {
                        //       setCurrentTab(1);
                        //     }
                        //   });
                        // }}
                        onClick={async () => {
                          // Set all fields as touched to trigger error messages
                          setTouched({
                            prefix: true,
                            firstname: true,
                            lastname: true,
                            email: true,
                            contactNumber1: true,
                            gender: true,
                            dateofBirth:true,
                            nationality: true,
                            workEmail: true,
                            joiningDate: true,
                            city: true,
                            state: true,
                            role: true,
                            // Add other fields similarly
                          });
                          const errors = await validateForm();
                          if (!Object.keys(errors).length) {
                            setCurrentTab(1);
                          }
                          
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}

                {currentTab === 1 && (
                  <Box>
                    <Typography
                      variant="h6"
                      fontSize={20}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                      Personal Details
                    </Typography>
                   
                    <Box
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    >
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="PAN Number"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.panNumber}
                        name="panNumber"
                        autoComplete="off"
                        error={!!touched.panNumber && !!errors.panNumber}
                        helperText={touched.panNumber && errors.panNumber}
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Aadhar Number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.aadharNumber}
                        name="aadharNumber"
                        autoComplete="off"
                        error={!!touched.aadharNumber && !!errors.aadharNumber}
                        helperText={touched.aadharNumber && errors.aadharNumber}
                      />
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Passport No"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.passportNo}
                        name="passportNo"
                        autoComplete="off"
                        error={!!touched.passportNo && !!errors.passportNo}
                        helperText={touched.passportNo && errors.passportNo}
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="UAN No"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.uan}
                        name="uan"
                        autoComplete="off"
                        error={!!touched.uan && !!errors.uan}
                        helperText={touched.uan && errors.uan}
                      />
                       <StyledTextField
                        fullWidth
                        type="text"
                        label="Father Name"
                        onBlur={handleBlur}
                        // onChange={handleChange}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}

                        value={values.fatherName}
                        name="fatherName"
                        autoComplete="off"
                        error={!!touched.fatherName && !!errors.fatherName}
                        helperText={touched.fatherName && errors.fatherName}
                      />

                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Mother Name"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.motherName}
                        name="motherName"
                        autoComplete="off"
                        error={!!touched.motherName && !!errors.motherName}
                        helperText={touched.motherName && errors.motherName}
                      />

                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Emergency Contact No"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.contactNumber2}
                        name="contactNumber2"
                        autoComplete="off"
                        error={
                          !!touched.contactNumber2 && !!errors.contactNumber2
                        }
                        helperText={
                          touched.contactNumber2 && errors.contactNumber2
                        }
                      />
                      
                       {/* <StyledTextField
                        fullWidth
                        type="text"
                        label="Marital Status"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.maritalStatus}
                        name="maritalStatus"
                        autoComplete="off"
                        error={!!touched.maritalStatus && !!errors.maritalStatus}
                        helperText={touched.maritalStatus && errors.maritalStatus}
                      /> */}
                      <FormControl fullWidth error={!!touched.maritalStatus && !!errors.maritalStatus}>
                        <InputLabel>Marital Status</InputLabel>
                        <Select
                          label="Marital Status"
                          value={values.maritalStatus}
                          onChange={handleChange}
                          name="maritalStatus"
                          onBlur={handleBlur}
                        >
                          <MenuItem value="Single">Single</MenuItem>
                          <MenuItem value="Married">Married</MenuItem>
                          <MenuItem value="Divorced">Divorced</MenuItem>
                          <MenuItem value="Widowed">Widowed</MenuItem>
                          <MenuItem value="Separated">Other</MenuItem>
                        </Select>
                        {touched.maritalStatus && errors.maritalStatus && (
                          <Typography color="error" variant="body2">
                            {errors.maritalStatus}
                          </Typography>
                        )}
                      </FormControl>

                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginTop={3}
                    >
                      <Button
                        variant="contained"
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        onClick={() => setCurrentTab(0)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="contained"
                        style={{ width: "100px", backgroundColor:'#7e31ce' }}
                        // onClick={() => {
                      
                        //   validateForm().then((errors) => {
                        //     if (Object.keys(errors).length === 0) {
                        //       setCurrentTab(2);
                        //     }
                        //   });
                        // }}
                        onClick={async () => {
                          // Set all fields as touched to trigger error messages
                          setTouched({
                            panNumber: true,
                            aadharNumber: true,
                            fatherName:true,
                            motherName:true,
                            // Add other fields similarly
                          });
                          const errors = await validateForm();
                          if (!Object.keys(errors).length) {
                            setCurrentTab(2);
                          }
                          
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}


                {currentTab === 2 && (
                  <Box>
                    <Typography
                      variant="h6"
                      fontSize={20}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                      Professional Summary
                    </Typography>
                   
                    <Box
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    >
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Previous Company Name"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.previousCompanyName}
                        name="previousCompanyName"
                        autoComplete="off"
                        error={
                          !!touched.previousCompanyName &&
                          !!errors.previousCompanyName
                        }
                        helperText={
                          touched.previousCompanyName &&
                          errors.previousCompanyName
                        }
                      />

                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Previous Experience"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.previousExperience}
                        name="previousExperience"
                        autoComplete="off"
                        error={
                          !!touched.previousExperience &&
                          !!errors.previousExperience
                        }
                        helperText={
                          touched.previousExperience &&
                          errors.previousExperience
                        }
                      />
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Current Department"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.department}
                        name="department"
                        autoComplete="off"
                        error={!!touched.department && !!errors.department}
                        helperText={touched.department && errors.department}
                      />
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Designation"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.designation}
                        name="designation"
                        autoComplete="off"
                        error={!!touched.designation && !!errors.designation}
                        helperText={touched.designation && errors.designation}
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Current CTC"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.currentCtc}
                        name="currentCtc"
                        autoComplete="off"
                        error={!!touched.currentCtc && !!errors.currentCtc}
                        helperText={touched.currentCtc && errors.currentCtc}
                      />

                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Higher Education"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.higherQualification}
                        name="higherQualification"
                        autoComplete="off"
                        error={
                          !!touched.higherQualification &&
                          !!errors.higherQualification
                        }
                        helperText={
                          touched.higherQualification &&
                          errors.higherQualification
                        }
                      />

{/* <StyledTextField
                        fullWidth
                        type="text"
                        label="Reporting Manager"
                        onBlur={handleBlur}
                         onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.reportingManager}
                        name="reportingManager"
                        autoComplete="off"
                        error={
                          !!touched.reportingManager &&
                          !!errors.reportingManager
                        }
                        helperText={
                          touched.reportingManager &&
                          errors.reportingManager
                        }
                      />

<StyledTextField
                        fullWidth
                        type="text"
                        label="Reporting Sales Manager"
                        onBlur={handleBlur}
                         onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.reportingSalesManager}
                        name="reportingSalesManager"
                        autoComplete="off"
                        error={
                          !!touched.reportingSalesManager &&
                          !!errors.reportingSalesManager
                        }
                        helperText={
                          touched.reportingSalesManager &&
                          errors.reportingSalesManager
                        }
                      /> */}

                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginTop={3}
                    >
                      <Button
                        variant="contained"
                       
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        onClick={() => setCurrentTab(1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="contained"
                      
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        // onClick={() => {
                        //   validateForm().then((errors) => {
                        //     if (Object.keys(errors).length === 0) {
                        //       setCurrentTab(3);
                        //     }
                        //   });
                        // }}
                        onClick={async () => {
                          // Set all fields as touched to trigger error messages
                          setTouched({
                            currentCtc:true,
                            higherQualification: true,
                            previousCompanyName:true,
                            previousExperience:true,
                            // reportingManager:true,
                            // reportingSalesManager:true,
                            
                            // Add other fields similarly
                          });
                          const errors = await validateForm();
                          if (!Object.keys(errors).length) {
                            setCurrentTab(3);
                          }
                          
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}

                {currentTab === 3 && (
                  <Box>
                    <Typography
                      variant="h6"
                      fontSize={20}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                     Salary BreakDown
                    </Typography>
                   
                    <Box
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    >
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Basic Salary"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.basicSalary}
                        name="basicSalary"
                        autoComplete="off"
                        error={
                          !!touched.basicSalary &&
                          !!errors.basicSalary
                        }
                        helperText={
                          touched.basicSalary &&
                          errors.basicSalary
                        }
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Tax"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.tax}
                        name="tax"
                        autoComplete="off"
                        error={
                          !!touched.tax &&
                          !!errors.tax
                        }
                        helperText={
                          touched.tax &&
                          errors.tax
                        }
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="HRA"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.hra}
                        name="hra"
                        autoComplete="off"
                        error={
                          !!touched.hra &&
                          !!errors.hra
                        }
                        helperText={
                          touched.hra &&
                          errors.hra
                        }
                      />
                      
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="PF"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.pf}
                        name="pf"
                        autoComplete="off"
                        error={
                          !!touched.pf &&
                          !!errors.pf
                        }
                        helperText={
                          touched.pf &&
                          errors.pf
                        }
                      />
                      
                         <StyledTextField
                        fullWidth
                        type="number"
                        label="DRA"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.dra}
                        name="dra"
                        autoComplete="off"
                        error={
                          !!touched.dra &&
                          !!errors.dra
                        }
                        helperText={
                          touched.dra &&
                          errors.dra
                        }
                      />
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Loan Repayment"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.loanRepayment}
                        name="loanRepayment"
                        autoComplete="off"
                        error={
                          !!touched.loanRepayment &&
                          !!errors.loanRepayment
                        }
                        helperText={
                          touched.loanRepayment &&
                          errors.loanRepayment
                        }
                      />
                    
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Bonus"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.bonus}
                        name="bonus"
                        autoComplete="off"
                        error={
                          !!touched.bonus &&
                          !!errors.bonus
                        }
                        helperText={
                          touched.bonus &&
                          errors.bonus
                        }
                      />
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Early Leaving Fine"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.earlyLeavingFine}
                        name="earlyLeavingFine"
                        autoComplete="off"
                        error={
                          !!touched.earlyLeavingFine &&
                          !!errors.earlyLeavingFine
                        }
                        helperText={
                          touched.earlyLeavingFine &&
                          errors.earlyLeavingFine
                        }
                      />
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Other Earnings"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.otherEarnings}
                        name="otherEarnings"
                        autoComplete="off"
                        error={
                          !!touched.otherEarnings &&
                          !!errors.otherEarnings
                        }
                        helperText={
                          touched.otherEarnings &&
                          errors.otherEarnings
                        }
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Late Coming Fine"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lateComingFine}
                        name="lateComingFine"
                        autoComplete="off"
                        error={
                          !!touched.lateComingFine &&
                          !!errors.lateComingFine
                        }
                        helperText={
                          touched.lateComingFine &&
                          errors.lateComingFine
                        }
                      />
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Work Basis Pay"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.workBasisPay}
                        name="workBasisPay"
                        autoComplete="off"
                        error={!!touched.workBasisPay && !!errors.workBasisPay}
                        helperText={touched.workBasisPay && errors.workBasisPay}
                      />
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Other Deductions"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.otherDeductions}
                        name="otherDeductions"
                        autoComplete="off"
                        error={
                          !!touched.otherDeductions &&
                          !!errors.otherDeductions
                        }
                        helperText={
                          touched.otherDeductions &&
                          errors.otherDeductions
                        }
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Petrol Allowance"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.petrolAllowance}
                        name="petrolAllowance"
                        autoComplete="off"
                        error={
                          !!touched.petrolAllowance &&
                          !!errors.petrolAllowance
                        }
                        helperText={
                          touched.petrolAllowance &&
                          errors.petrolAllowance
                        }
                      />
                       <StyledTextField
                        fullWidth
                        type="number"
                        label="Food Allowance"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.foodAllowance}
                        name="foodAllowance"
                        autoComplete="off"
                        error={
                          !!touched.foodAllowance &&
                          !!errors.foodAllowance
                        }
                        helperText={
                          touched.foodAllowance &&
                          errors.foodAllowance
                        }
                      />
                     
                     

                     
                     
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Over Time"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.overTime}
                        name="overTime"
                        autoComplete="off"
                        error={!!touched.overTime && !!errors.overTime}
                        helperText={touched.overTime && errors.overTime}
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Incentive"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.incentive}
                        name="incentive"
                        autoComplete="off"
                        error={!!touched.incentive && !!errors.incentive}
                        helperText={touched.incentive && errors.incentive}
                      />

                      
                      
                       
                      
                     
                      
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginTop={3}
                    >
                      <Button
                        variant="contained"
                       
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        onClick={() => setCurrentTab(2)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="contained"
                      
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        onClick={() => {
                          validateForm().then((errors) => {
                            if (Object.keys(errors).length === 0) {
                              setCurrentTab(4);
                            }
                          });
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}

                {currentTab === 4 && (
                  <Box>
                    <Typography
                      variant="h6"
                      fontSize={20}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                      Bank Details
                    </Typography>
                    {/* <Typography
                      variant="h6"
                      fontSize={16}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                      Work Experience :
                    </Typography> */}
                    <Box
                      display="grid"
                      gap="15px"
                      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    >
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Bank Name"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.bankName}
                        name="bankName"
                        autoComplete="off"
                        error={!!touched.bankName && !!errors.bankName}
                        helperText={touched.bankName && errors.bankName}
                      />
                      <StyledTextField
                        fullWidth
                        type="number"
                        label="Bank Account Number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.bankAccount}
                        name="bankAccount"
                        autoComplete="off"
                        error={!!touched.bankAccount && !!errors.bankAccount}
                        helperText={touched.bankAccount && errors.bankAccount}
                      />
                      <StyledTextField
                        fullWidth
                        type="text"
                        label="IFSC Code"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.ifscCode}
                        name="ifscCode"
                        autoComplete="off"
                        error={!!touched.ifscCode && !!errors.ifscCode}
                        helperText={touched.ifscCode && errors.ifscCode}
                      />

                      <StyledTextField
                        fullWidth
                        type="text"
                        label="Bank Branch"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          handleChange({
                            target: {
                              name: e.target.name,
                              value: upperCaseValue,
                            },
                          });
                        }}
                        value={values.bankBranch}
                        name="bankBranch"
                        autoComplete="off"
                        error={!!touched.bankBranch && !!errors.bankBranch}
                        helperText={touched.bankBranch && errors.bankBranch}
                      />
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginTop={3}
                    >
                      <Button
                        variant="contained"
                       
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        onClick={() => setCurrentTab(3)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="contained"
                       
                        style={{ width: "100px",backgroundColor:'#7e31ce' }}
                        // onClick={() => {
                        //   validateForm().then((errors) => {
                        //     if (Object.keys(errors).length === 0) {
                        //       setCurrentTab(5);
                        //     }
                        //   });
                        // }}
                        onClick={async () => {
                          // Set all fields as touched to trigger error messages
                          setTouched({
                            bankName: true,
                            bankAccount: true,
                            ifscCode: true,
                            bankBranch: true,
                            // Add other fields similarly
                          });
                          const errors = await validateForm();
                          if (!Object.keys(errors).length) {
                            setCurrentTab(5);
                          }
                          
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}

                {currentTab === 5 && (
                  <Box>
                    <Typography
                      variant="h6"
                      fontSize={20}
                      sx={{ fontWeight: "bold" }}
                      marginBottom={2}
                    >
                      Other Details
                    </Typography>
                    <Box
                      display="grid"
                      gap="30px"
                      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    >
                      <StyledTextField
                        fullWidth
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        label="Profile Picture (JPG/JPEG/PNG)"
                        onBlur={handleBlur}
                        onChange={(e) =>
                          setFieldValue("profilePic", e.currentTarget.files[0])
                        }
                        name="profilePic"
                        error={!!touched.profilePic && !!errors.profilePic}
                        helperText={touched.profilePic && errors.profilePic}
                      />
                      
                      {/* <StyledTextField
                        fullWidth
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        label="Document (PDF)"
                        onBlur={handleBlur}
                        onChange={(e) =>
                          setFieldValue("document1", e.currentTarget.files[0])
                        }
                        name="document1"
                        error={!!touched.document1 && !!errors.document1}
                        helperText={touched.document1 && errors.document1}
                      /> */}
          
                      {/* <StyledTextField
                        fullWidth
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        label="Document 2"
                        onBlur={handleBlur}
                        onChange={(e) =>
                          setFieldValue("document2", e.currentTarget.files[0])
                        }
                        name="document2"
                        error={!!touched.document2 && !!errors.document2}
                        helperText={touched.document2 && errors.document2}
                      /> */}
                      {/* <StyledTextField
                        fullWidth
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        label="Document 3"
                        onBlur={handleBlur}
                        onChange={(e) =>
                          setFieldValue("document3", e.currentTarget.files[0])
                        }
                        name="document3"
                        error={!!touched.document3 && !!errors.document3}
                        helperText={touched.document3 && errors.document3}
                      /> */}
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginTop={3}
                    >
                      <Button
                        variant="contained"
                        style={{ width: "100px",height:"35px",backgroundColor:'#7e31ce' }}
                        onClick={() => setCurrentTab(4)}
                      >
                        Previous
                      </Button>
                      <StyledButton
                        type="submit"
                        variant="contained"
                        style={{ width: "130px",backgroundColor:'#7e31ce' }}
                        disabled={loading}
                        onClick={async (e) => {
                          e.preventDefault(); // Prevent default form submission
                          setTouched({
                            profilePic: true,
                            // document1: true,
                            // Add other fields if needed
                          });
                          
                          // Trigger form validation
                          const errors = await validateForm();
                          
                          if (Object.keys(errors).length === 0) {
                            // No errors, submit the form
                            handleSubmit(values); // Ensure values are passed
                          }
                        }}
                      >
                        {loading ? (
                          <FacebookCircularProgress size={24} sx={{ color: "#fff" }} />
                        ) : (
                          "Submit The Form"
                        )}
                      </StyledButton>
                    </Box>
                  </Box>
                )}
              </Card>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default OperationalManagerTechnicianRegister;