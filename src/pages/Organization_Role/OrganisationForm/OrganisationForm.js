import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import imageCompression from 'browser-image-compression';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
   
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: 'url("https://media.istockphoto.com/id/1009830244/vector/wave-blue-color-texture.jpg?s=170667a&w=0&k=20&c=OaC8LQd4u2fw9sfDifgE4XHQuwpfYQt_PjkDe66vA5k=")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    borderRadius: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    maxWidth: "800px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
      maxWidth: "90%",
      marginTop: "150px",
    },
  },
  form: {
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  textField: {
    flex: "1 1 100%",
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "5px",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
    "& .MuiFormHelperText-root": {
      color: "white",
    },
    [theme.breakpoints.up("md")]: {
      flex: "1 1 calc(50% - 16px)",
    },
  },
  formControl: {
    flex: "1 1 100%",
    "& .MuiSelect-root": {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "5px",
    },
    [theme.breakpoints.up("md")]: {
      flex: "1 1 calc(50% - 16px)",
    },
  },

  submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#2ED0A5",
        color: "#FFFFFF",
        "&:hover": {
          backgroundColor: "#28b693",
        },
        position: "relative",
      },
      loader: {
        color: "#FFFFFF", // Match the color to the button text color
      },

  uploadInput: {
    display: "none",
  },
  uploadLabel: {
    marginTop: theme.spacing(1),
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: "5px",
    padding: theme.spacing(1),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
  fileName: {
    color: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "150px",
  },
  uploadContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
}));
const OrganizationForm = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    companyLogo: null,
    role: "ORGANIZATION",
    companyName: "",
    contactNumber: "",
    secondContactNumber:"",
    email: "",
    companyAddress: "",
    businessType: "",
    gstIn:"",
    state: "",
    city: "",
    pinCode: "",
    companyStamp: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [companyLogoName, setcompanyLogoName] = useState("No file chosen"); // Add state for company logo name
  const [companyStampName, setcompanyStampName] = useState("No file chosen"); // Add state for company stamp name
  const navigate = useNavigate();

  

  const stateOptions = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
  ];
  

  const businessTypeOptions = [
    { value: "Software", label: "Software" },
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "Corporation", label: "Corporation" },
    { value: "Limited Liability Company (LLC)", label: "Limited Liability Company (LLC)" },
    { value: "Cooperative", label: "Cooperative" },
    { value: "Nonprofit Organization", label: "Nonprofit Organization" },
    { value: "Joint Venture", label: "Joint Venture" },
    { value: "Franchise", label: "Franchise" },
    { value: "Private Limited Company", label: "Private Limited Company" },
    { value: "Public Limited Company", label: "Public Limited Company" },
    { value: "Limited Liability Partnership (LLP)", label: "Limited Liability Partnership (LLP)" },
    { value: "Unlimited Company", label: "Unlimited Company" },
    { value: "Sole Trader", label: "Sole Trader" },
    { value: "Association", label: "Association" },
  ];
  

  const validate = () => {
    const newErrors = {};

    // Check if Company Name is provided
    if (!values.companyName) newErrors.companyName = "Company Name is required";

    // Check if Company Email is provided and valid
    if (!values.email) {
      newErrors.email = "Company Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Invalid email address";
    }

    // Check if Primary Contact Number is provided and valid
    if (!values.contactNumber) {
      newErrors.contactNumber = "Primary Contact Number is required";
    } else if (!/^\d{10}$/.test(values.contactNumber)) {
      newErrors.contactNumber = "Primary Contact Number must be 10 digits";
    }

    // Check if Secondary Contact Number is provided and valid
    if (!values.secondContactNumber) {
      newErrors.secondContactNumber = "Secondary Contact Number is required";
    } else if (!/^\d{10}$/.test(values.secondContactNumber)) {
      newErrors.secondContactNumber = "Secondary Contact Number must be 10 digits";
    }

    // Check if gstIn Number is provided and valid
    if (!values.gstIn) {
      newErrors.gstIn = "gstIn Number is required";
    }

    // Check if Company Address is provided
    if (!values.companyAddress)
      newErrors.companyAddress = "Company Address is required";

    // Check if Business Type is selected
    if (!values.businessType)
      newErrors.businessType = "Business Type is required";

    // Check if State is selected
    if (!values.state) newErrors.state = "State is required";

    // Check if City is provided
    if (!values.city) newErrors.city = "City is required";

    // Check if pinCode is provided and valid
    if (!values.pinCode) {
      newErrors.pinCode = "pinCode is required";
    } else if (!/^\d{6}$/.test(values.pinCode)) {
      newErrors.pinCode = "pinCode must be 6 digits";
    }

    // Validate Company Logo file
    if (!values.companyLogo) {
      newErrors.companyLogo = "Company Logo is required";
    } else if (!["image/jpeg", "image/png"].includes(values.companyLogo.type)) {
      newErrors.companyLogo = "Company Logo must be a JPEG or PNG image";
    } else if (values.companyLogo.size > 1 * 1024 * 1024) {
      // 1MB limit
      newErrors.companyLogo = "Company Logo must be less than 1MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  
  // Image compression function
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const formData = new FormData();

        // Compress Company Logo if present
        if (values.companyLogo) {
            const compressedLogo = await compressImage(values.companyLogo);
            formData.append('companyLogo', compressedLogo, compressedLogo.name);
        }

        // Compress Company Stamp if present
        if (values.companyStamp) {
            const compressedStamp = await compressImage(values.companyStamp);
            formData.append('companyStamp', compressedStamp, compressedStamp.name);
        }

        // Append other form data
        Object.keys(values).forEach((key) => {
            if (values[key] instanceof File) {
                formData.append(key, values[key]);
            } else {
                formData.append(key, values[key]);
            }
        });

        // Make the API call
        const response = await fetch(`${baseUrl}/api/auth/organize/register/organization`, {
            method: "POST",
            body: formData,
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json();
            swal("Success", "Organization registered successfully!", "success");
            navigate("/"); // Redirect to a different route if needed
        } else {
            const errorData = await response.json();
            swal("Error", errorData.message || "An error occurred", "error");
        }
    } catch (error) {
        console.error("Submission error:", error);
        swal('Error', `Registration failed: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
};

  
  
  
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // Max size in MB
      maxWidthOrHeight: 1024, // Max width or height
      useWebWorker: true
    };
    return imageCompression(file, options);
  };
  

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setValues((prev) => ({ ...prev, [name]: value }));
  // };

  //new handlechange code
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear the error for this field if it is valid
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setValues((prev) => ({ ...prev, [name]: file }));

  
     // Update file names
     if (name === "companyLogo") {
      setcompanyLogoName(file.name);
    } else if (name === "companyStamp") {
      setcompanyStampName(file.name);
    }

     // Clear the error for this field if the file is valid
     if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

 

  return (
    <div className={classes.root}>
      <Container component="main" className={classes.container}>
        <Typography
          variant="h4"
          align="center"
          style={{ color: "white", marginBottom: "30px" }}
        >
          Organization Registration Form
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Box className={classes.row}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Company Name*"
              onChange={handleChange}
              value={values.companyName}
              name="companyName"
              autoComplete="off"
              error={!!errors.companyName}
              helperText={errors.companyName}
              className={classes.textField}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="ROLE*"
              onChange={handleChange}
              value={values.role}
              name="role"
              autoComplete="off"
              error={!!errors.role}
              helperText={errors.role}
              className={classes.textField}
              disabled 
              InputProps={{
                style: {
                  backgroundColor: "#757575", // Light gray background for disabled state
                  color: "#fff",           // Gray text color
                },
              }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="email"
              label="Company Email*"
              onChange={handleChange}
              value={values.email}
              name="email"
              autoComplete="off"
              error={!!errors.email}
              helperText={errors.email}
              className={classes.textField}
            />
          </Box>
          <Box className={classes.row}>
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Primary Contact Number*"
              onChange={handleChange}
              value={values.contactNumber}
              name="contactNumber"
              autoComplete="off"
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              className={classes.textField}
            />
            
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="Secondary Contact Number*"
              onChange={handleChange}
              value={values.secondContactNumber}
              name="secondContactNumber"
              autoComplete="off"
              error={!!errors.secondContactNumber}
              helperText={errors.secondContactNumber}
              className={classes.textField}
            />
           
          </Box>
          <Box className={classes.row}>
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Company Address*"
                onChange={handleChange}
                value={values.companyAddress}
                name="companyAddress"
                autoComplete="off"
                error={!!errors.companyAddress}
                helperText={errors.companyAddress}
                className={classes.textField}
              />

            <FormControl
              fullWidth
              variant="filled"
              error={!!errors.businessType}
              className={classes.formControl}
            >
              <InputLabel>Business Type</InputLabel>
              <Select
                value={values.businessType}
                onChange={handleChange}
                name="businessType"
              >
                {businessTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.businessType && (
                <FormHelperText>{errors.businessType}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box className={classes.row}>
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="GSTIN Number*"
                onChange={handleChange}
                value={values.gstIn}
                name="gstIn"
                autoComplete="off"
                error={!!errors.gstIn}
                helperText={errors.gstIn}
                className={classes.textField}
              />
              <FormControl
                fullWidth
                variant="filled"
                error={!!errors.state}
                className={classes.formControl}
              >
                <InputLabel>State</InputLabel>
                <Select value={values.state} onChange={handleChange} name="state">
                  {stateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
              </FormControl>
          </Box>
          <Box className={classes.row}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="City*"
              onChange={handleChange}
              value={values.city}
              name="city"
              autoComplete="off"
              error={!!errors.city}
              helperText={errors.city}
              className={classes.textField}
            />
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="pinCode"
              onChange={handleChange}
              value={values.pinCode}
              name="pinCode"
              error={!!errors.pinCode}
              helperText={errors.pinCode}
              className={classes.textField}
            />
             
          </Box>
         
          <Box className={classes.row} style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
            <Box style={{ flex: "1" }}>
              <Typography
                variant="body1"
                style={{ color: "white", marginBottom: "8px" }}
              >
                Company Logo ( jpg/jpeg/png )
              </Typography>
              <div className={classes.uploadContainer}>
              <label htmlFor="companyLogo" className={classes.uploadLabel}>
                <input
                  type="file"
                  id="companyLogo"
                  onChange={handleFileChange}
                  name="companyLogo"
                  className={classes.uploadInput}
                />
                Choose File
              </label>
              {companyLogoName && (
                <Typography variant="body2" className={classes.fileName}>
                  {companyLogoName}
                </Typography>
              )}
              </div>
              {errors.companyLogo && (
                <Typography
                  variant="body2"
                  style={{ color: "red", marginTop: "8px" }}
                >
                  {errors.companyLogo}
                </Typography>
              )}
            </Box>

            <Box style={{ flex: "1" }}>
              <Typography
                variant="body1"
                style={{ color: "white", marginBottom: "8px" }}
              >
                Company Stamp ( jpg/jpeg/png )
              </Typography>
              <div className={classes.uploadContainer}>
              <label htmlFor="companyStamp" className={classes.uploadLabel}>
                <input
                  type="file"
                  id="companyStamp"
                  onChange={handleFileChange}
                  name="companyStamp"
                  className={classes.uploadInput}
                />
                Choose File
              </label>
              {companyStampName && (
                <Typography variant="body2" className={classes.fileName}>
                  {companyStampName}
                </Typography>
              )}
              </div>
              {/* {errors.companyStamp && (
                <Typography
                  variant="body2"
                  style={{ color: "red", marginTop: "8px" }}
                >
                  {errors.companyStamp}
                </Typography>
              )} */}
            </Box>
            
          </Box>

          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} className={classes.loader} />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default OrganizationForm;