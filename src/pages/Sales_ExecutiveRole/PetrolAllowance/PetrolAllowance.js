import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from 'date-fns';
import * as Yup from "yup";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,Tabs,
  Tab,
  TableRow, Select, FormControl, InputLabel,
  Paper, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../../AuthProvider";
import Swal from "sweetalert2";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
// import * as XLSX from "xlsx";
// import XLSX from 'xlsx-style';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { typography } from "@mui/system";




const PetrolAllowance = () => {
  // const [showForm, setShowForm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const { sId } = useAuth();

  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [totalKm, setTotalKm] = useState(0);
  const [totalPetrolCharge, setTotalPetrolCharge] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateType, setDateType] = useState("date"); // "year", "month", or "date"
  const [dateRange, setDateRange] = useState("last365Days");



  const [filteredTableData, setFilteredTableData] = useState([]); // Filtered data for display





  const [showForm, setShowForm] = useState(false);
  
    // Initialize state from local storage
    const [activeTab, setActiveTab] = useState(() => {
      const savedTab = localStorage.getItem("activeTab");
      return savedTab ? JSON.parse(savedTab) : 0; // Default to tab 0
    });
  
    const [formValues, setFormValues] = useState(() => {
      const savedFormValues = localStorage.getItem("formValues");
      return savedFormValues
        ? JSON.parse(savedFormValues)
        : {
            startReading: "",
            petrolChargePerKm: "",
            additionalComments: "",
            startReadingImage: null,
            endReading: "",
            endReadingImage: null,
          };
    });
  
    const [isSubmitted, setIsSubmitted] = useState(() => {
      const savedIsSubmitted = localStorage.getItem("isSubmitted");
      return savedIsSubmitted ? JSON.parse(savedIsSubmitted) : false;
    });
  
    // Save state to local storage whenever it changes
    // useEffect(() => {
    //   localStorage.setItem("activeTab", JSON.stringify(activeTab));
    //   localStorage.setItem("formValues", JSON.stringify(formValues));
    //   localStorage.setItem("isSubmitted", JSON.stringify(isSubmitted));
    // }, [activeTab, formValues, isSubmitted]);
    useEffect(() => {
      localStorage.setItem("activeTab", JSON.stringify(activeTab));
      // localStorage.setItem("formValues", JSON.stringify(formValues));
      localStorage.setItem("isSubmitted", JSON.stringify(isSubmitted));
    }, [activeTab, isSubmitted]);
  







  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
const fetchTotalValues = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Fetched data:", data);

    // Update state based on API response
    setTotalKm(data.totalKmTraveled || 0);
    setTotalPetrolCharge(data.totalAmount || 0);
  } catch (error) {
    console.error("Error fetching total values:", error);
    // Handle error by resetting values if necessary
    setTotalKm(0);
    setTotalPetrolCharge(0);
  }
};

// const handleDateChange = (date) => {
//   setSelectedDate(date);
//   if (date) {
//     const baseUrl = process.env.REACT_APP_API_BASE_URL;
//     if (dateType === "year") {
//       const year = format(date, "yyyy");
//       fetchTotalValues(`${baseUrl}/api/perolAllowance/totalAmountAndKmPerYear/${year}`);
//     } else if (dateType === "month") {
//       const yearMonth = format(date, "yyyy/MM");
//       fetchTotalValues(`${baseUrl}/api/perolAllowance/totalAmountAndKmPerMonth/${yearMonth}`);
//     } else if (dateType === "date") { 
//       const fullDate = format(date, "yyyy-MM-dd");
//       fetchTotalValues(`${baseUrl}/api/perolAllowance/totalAmountAndKmPerDay/${fullDate}`);
//     }                           
//   }
// };

const handleDateTypeChange = (event) => {
  setDateType(event.target.value);
  setSelectedDate(null); // Reset selected date when switching types
};



//   // Fetch table data
//   const fetchTableData = async () => {
//     try {
//       const baseUrl=process.env.REACT_APP_API_BASE_URL
//       const response = await fetch(
//         `${baseUrl}/api/perolAllowance/getBySalesId/${sId}`
//       ); // Replace with your actual API endpoint
//       const data = await response.json();

//       // Check if response is an array or a single object
//       const formattedData = Array.isArray(data) ? data : [data];

//       setTableData(formattedData); // Set table data as an array (even if it's one object)
//       console.log("Fetched petrol table data:", formattedData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data when the component mounts
//   useEffect(() => {
//     fetchTableData();
//   }, []);

//     // Filter table data based on the search query
//     const filteredData = tableData.filter((row) =>
//       row.date.includes(searchQuery)
//     );

const handleDateChange = async (date) => {
  setSelectedDate(date);
  if (date) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    let fetchUrl = "";
    let filterKey = "";

    try {
      if (dateType === "year") {
        const year = format(date, "yyyy");
        fetchUrl = `${baseUrl}/api/perolAllowance/totalAmountAndKmPerYear/${year}`;
        filterKey = year; // Filter rows by year
      } else if (dateType === "month") {
        const yearMonth = format(date, "yyyy/MM");
        fetchUrl = `${baseUrl}/api/perolAllowance/totalAmountAndKmPerMonth/${yearMonth}`;
        filterKey = format(date, "yyyy-MM"); // Filter rows by year and month
      } else if (dateType === "date") {
        const fullDate = format(date, "yyyy-MM-dd");
        fetchUrl = `${baseUrl}/api/perolAllowance/totalAmountAndKmPerDay/${fullDate}`;
        filterKey = fullDate; // Filter rows by exact date
      }

      // Fetch total values
      if (fetchUrl) {
        await fetchTotalValues(fetchUrl);
      }

      // Filter table data based on the selected date
      const filteredTableData = tableData.filter((row) =>
        row.date.startsWith(filterKey) // Matches the beginning of the row's date
      );
      setFilteredTableData(filteredTableData); // Save filtered data
    } catch (error) {
      console.error("Error fetching total values or filtering data:", error);
    }
  }
};

// Fetch all table data
const fetchTableData = async () => {
  try {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/perolAllowance/getBySalesId/${sId}`);
    const data = await response.json();

    // Ensure table data is always an array
    const formattedData = Array.isArray(data) ? data : [data];

    // Sort by date in descending order (latest dates first)
    const sortedData = formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update state with the sorted data
    setTableData(sortedData);
    setFilteredTableData(sortedData); // Set as default filtered data
    console.log("Fetched and sorted petrol table data:", sortedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


// Filter table data based on the search query
const filteredData = filteredTableData.filter((row) =>
  row.date.includes(searchQuery)
);

// Fetch data when the component mounts
useEffect(() => {
  fetchTableData();
}, []);

















  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  
  const exportToExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PetrolAllowance");

    // Define columns with headers that match your actual data properties, including "Sl. No"
    worksheet.columns = [
        { header: 'Sl. No', key: 'slNo', width: 10 }, // Serial number column
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Start Time', key: 'startTime', width: 15 },
        { header: 'End Time', key: 'endTime', width: 15 },
        { header: 'Start Reading', key: 'startReading', width: 15 },
        { header: 'End Reading', key: 'endReading', width: 15 },
        // { header: 'Total KM', key: 'totalKmTraveledPerDay', width: 15 },
        { header: 'Petrol Charge per KM', key: 'petrolChargePerKm', width: 20 },
        { header: 'Additional Comments', key: 'additionalComments', width: 25 },
        
        // Add more columns if needed based on your data properties
    ];

    // Add data rows to the worksheet with "Sl. No" as a sequential number
    data.forEach((item, index) => {
        worksheet.addRow({
            slNo: index + 1, // Increment serial number starting from 1
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            startReading: item.startReading,
            endReading: item.endReading,
            // totalKmTraveledPerDay: item.totalKmTraveledPerDay,
            petrolChargePerKm: item.petrolChargePerKm,
            additionalComments: item.additionalComments,
           
            // Map additional properties as needed
        });
    });

    // Style the header row with sky blue background
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '87CEEB' }, // Sky blue color
        };
        cell.font = { bold: true };
    });

    // Save the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "PetrolAllowanceData.xlsx");
};
  
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text("Petrol Allowance Data", 14, 10);
    
    const tableData = data.map((row, index) => [
      index + 1, 
      row.date || '', // Ensure the date field exists
      row.startTime || '', 
      row.startReading || '', 
      row.endTime || '', 
      row.endReading || '', 
      // row.totalKmTraveledPerDay || '', 
      row.petrolChargePerKm || '', 
      row.additionalComments || '',
    ]);
  
    doc.autoTable({
      head: [["Sl No", "Date", "Start Time", "Start Reading", "End Time", "End Reading", "Petrol Charge Per Km", "Comments"]],
      body: tableData,
    });
    
    doc.save("PetrolAllowanceData.pdf");
  };
  
  const exportToJSON = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PetrolAllowanceData.json";
    link.click();
  };
  
  const handleExport = (format) => {
    const data = filteredData.map(row => ({
      date: row.date,
      startTime: row.startTime,
      startReading: row.startReading,
      endTime: row.endTime,
      endReading: row.endReading,
      // totalKmTraveledPerDay: row.totalKmTraveledPerDay,
      petrolChargePerKm: row.petrolChargePerKm,
      additionalComments: row.additionalComments,
    }));
  
    switch (format) {
      case "Excel":
        exportToExcel(data);
        break;
      case "PDF":
        exportToPDF(data);
        break;
      case "JSON":
        exportToJSON(data);
        break;
      default:
        break;
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormValues({ ...formValues, [name]: files[0] });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };







  
// handleSubmit for initial form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation for required fields
  if (!formValues.startReading || !formValues.startReadingImage || !formValues.petrolChargePerKm) {
    toast.error('Please fill in all the required fields before submitting.', { autoClose: 5000 });
    return;
  }

  console.log('Form values on submit:', formValues);

  // Prepare form data
  const formData = new FormData();
  formData.append('startReading', formValues.startReading);
  formData.append('startReadingImage', formValues.startReadingImage);
  formData.append('petrolChargePerKm', formValues.petrolChargePerKm);
  formData.append('additionalComments', formValues.additionalComments);

  // Debugging: log all FormData entries
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  try {
    const response = await axios.post(`${baseUrl}/api/perolAllowance/save/${sId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Check for 201 status code and display response text
    if (response.status === 201) {
      setIsSubmitted(true);
      // setActiveTab(1); // Enable End Reading tab
      setFormValues({
          startReading: "",
          petrolChargePerKm: "",
          additionalComments: "",
          startReadingImage: null,
      })
      handleBack();
      toast.success(response?.data || 'Start Reading submitted successfully', { autoClose: 1000 });
      fetchTableData();
      setActiveTab(1);
    }
  } catch (error) {
    console.error('Error during initial submission:', error);
    const errorMessage = error.response?.data || 'Failed to submit the form. Please try again.';
    toast.error(errorMessage, { autoClose: 3000 });
  }
};




// handleUpdate for updating remaining fields
const handleUpdate = async () => {
  // Validate remaining fields
  if (!formValues.endReading || !formValues.endReadingImage) {
    toast.error('Please fill in all the required fields before submitting.', { autoClose: 5000 });
    return;
  }

  // Create formData object and append all values
  const formData = new FormData();
  // formData.append('startReading', formValues.startReading);
  formData.append('startReadingImage', formValues.startReadingImage);
  // formData.append('additionalComments', formValues.additionalComments);
  formData.append('endReading', formValues.endReading);
  formData.append('endReadingImage', formValues.endReadingImage);
  // formData.append('petrolChargePerKm', formValues.petrolChargePerKm);
 
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  try {
   const response= await axios.patch(`${baseUrl}/api/perolAllowance/update/${sId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Updating remaining fields...', formValues);
    if (response.status === 200) {
      // setIsSubmitted(true);
      setIsSubmitted(false);
      // setActiveTab(0); // Switch back to Start Reading tab
      handleBack();
      toast.success(response?.data || 'Updated successfully', { autoClose: 1000 });
      fetchTableData();
      setActiveTab(0);
    }

    // setShowForm(false); // Close dialog or reset form
    // setIsSubmitted(false); // Reset to show initial form state 
  } catch (error) {
    console.error('Error during update:', error);
    const errorMessage = error.response?.data || 'Failed to submit the form. Please try again.';
    toast.error(errorMessage, { autoClose: 3000 });
  }
};





  return (
    <div>
      {showForm ? (
       <Dialog open={showForm} onClose={handleBack} maxWidth="sm">
       <DialogTitle>
         <div style={{ display: "flex", alignItems: "center" }}>
           <h3 style={{ margin: 0 }}>Petrol Allowance</h3>
         </div>
       </DialogTitle>
 
       <DialogContent>
         <Tabs value={activeTab} onChange={handleTabChange} aria-label="Petrol Allowance Tabs" >
           <Tab label="Start Reading" disabled={isSubmitted} />
           <Tab label="End Reading" disabled={!isSubmitted} />
         </Tabs>
 
         {activeTab === 0 && (
           <form onSubmit={handleSubmit}>
             <Grid container spacing={2} sx={{marginTop:'20px'}}>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   name="startReading"
                   type="number"
                   label="Start Reading"
                   value={formValues.startReading}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   name="petrolChargePerKm"
                   type="number"
                   label="Petrol Charge Per Km"
                   value={formValues.petrolChargePerKm}
                   onChange={handleChange}
                 />
               </Grid>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   name="additionalComments"
                   type="text"
                   label="Additional Comments"
                   value={formValues.additionalComments}
                   onChange={handleChange}
                 />
               </Grid>
                <Grid item xs={12}>
                  <div style={{ position: 'relative' }}>
                    <label
                      htmlFor="startReadingImage"
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '10px',
                        backgroundColor: 'white',
                        padding: '0 5px',
                        fontSize: '12px',
                        color: '#666',
                      }}
                    >
                      Start Reading Photo
                    </label>
                    <input
                      id="startReadingImage"
                      name="startReadingImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '13px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        height: '56px',
                      }}
                      disabled={isSubmitted}
                    />
                  </div>
                </Grid>
             </Grid>
            <DialogActions>
              <Button onClick={handleBack} variant="outlined" style={{ marginTop: '10px' }}>
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '10px' }}
                disabled={
                  !formValues.startReading ||
                  !formValues.petrolChargePerKm ||
                  !formValues.additionalComments ||
                  !formValues.startReadingImage 
                }
              >
                Submit
              </Button>
            </DialogActions>
           </form>
         )}
 
         {activeTab === 1 && (
           <>
             <Grid container spacing={2} sx={{marginTop:'20px'}}>
               <Grid item xs={12}>
                 <TextField
                   fullWidth
                   name="endReading"
                   type="number"
                   label="End Reading"
                   value={formValues.endReading}
                   onChange={handleChange}
                 />
               </Grid>
                 <Grid item xs={12}>
                   <div style={{ position: 'relative' }}>
                     <label
                       htmlFor="endReadingImage"
                       style={{
                         position: 'absolute',
                         top: '-10px',
                         left: '10px',
                         backgroundColor: 'white',
                         padding: '0 5px',
                         fontSize: '12px',
                         color: '#666',
                       }}
                     >
                       End Reading Photo
                     </label>
                     <input
                       id="endReadingImage"
                       name="endReadingImage"
                       type="file"
                       accept="image/*"
                       onChange={handleFileChange}
                       style={{
                         display: 'block',
                         width: '100%',
                         padding: '13px',
                         border: '1px solid #ccc',
                         borderRadius: '4px',
                         height: '56px',
                       }}
                     />
                   </div>
                 </Grid>
                 
             </Grid>
             
             <DialogActions>
                <Button onClick={handleBack} variant="outlined" style={{ marginTop: '10px' }}>
                  Close
                </Button>
               <Button
                 variant="contained"
                 color="primary"
                 style={{marginTop:'10px'}}
                 onClick={handleUpdate}
                 disabled={!formValues.endReading || !formValues.endReadingImage}
               >
                 Update
               </Button>
             </DialogActions>
           </>
         )}
       </DialogContent>
       <ToastContainer />
     </Dialog>
     
      ) : (
        <Card
          sx={{ marginTop: "5.5%", marginLeft: "20px", marginRight: "20px" }}
        >
          <CardContent>
            {/* <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>Petrol Allowance List</h2>
            </div> */}
            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
        <Box display="flex" alignItems="center">
          
          <Typography variant="h3" component="h3" sx={{ marginLeft: 2 }}>
          Petrol Allowance List
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
      <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleClick}>
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleExport("Excel")}>
          <ListItemIcon><SimCardDownloadIcon /></ListItemIcon>
          <ListItemText primary="Excel" sx={{ fontWeight: 'bold' }} />
        </MenuItem>
        <MenuItem onClick={() => handleExport("PDF")}>
          <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
          <ListItemText primary="PDF" sx={{ fontWeight: 'bold' }} />
        </MenuItem>
        <MenuItem onClick={() => handleExport("JSON")}>
          <ListItemIcon><FilePresentIcon /></ListItemIcon>
          <ListItemText primary="JSON" sx={{ fontWeight: 'bold' }} />
        </MenuItem>
      </Menu>
    </Box>
      </Box>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
             
               {/* Date Picker for selecting a date */}

               <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <FormControl sx={{ marginBottom: "4px", width: "20%" }}>
                    <InputLabel id="date-type-label">Select Date Type</InputLabel>
                    <Select
                      labelId="date-type-label"
                      value={dateType}
                      onChange={handleDateTypeChange}
                      label="Select Date Type"
                    >
                      <MenuItem value="year">Year</MenuItem>
                      <MenuItem value="month">Year/Month</MenuItem>
                      <MenuItem value="date">Year/Month/Date</MenuItem>
                    </Select>
                  </FormControl>

                  <DatePicker
                    views={dateType === "year" ? ["year"] : dateType === "month" ? ["year", "month"] : ["year", "month", "day"]}
                    label={`Search by ${dateType === "year" ? "Year" : dateType === "month" ? "Year/Month" : "Year/Month/Date"}`}
                    name="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth sx={{ marginBottom: "15px", width: "30%" }} />
                    )}
                  />
                </LocalizationProvider>




              <div style={{display:'flex'}}>
                <Typography variant="h4" style={{fontWeight:'bold',paddingRight:'8px',}}>Total Amount:</Typography>
                <Typography variant="h4" style={{fontWeight:'bold',color:'red'}}>{totalPetrolCharge}₹</Typography>
              </div>
              <div style={{display:'flex'}}>
                <Typography variant="h4" style={{fontWeight:'bold',paddingRight:'8px'}}>Total KM:</Typography>
                <Typography variant="h4" style={{fontWeight:'bold',color:'red'}}>{totalKm}kms</Typography>
              </div>
             
              <Button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                variant="contained"
                onClick={handleNext}
              >
                Petrol Allowance Form
              </Button>
            </div>

           

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Sl No</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Date</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Start Time</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Start Reading</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>End Time</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>End Reading</TableCell>
                    {/* <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Total KM</TableCell> */}
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Petrol Charge Per Km</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Additional Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow key={row.id} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                        {/* Row-wise TableCells */}
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{index + 1}</TableCell>
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.date}</TableCell>
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.startTime}</TableCell>
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.startReading}</TableCell>
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.endTime}</TableCell>
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.endReading}</TableCell>
                        {/* <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.totalKmTraveledPerDay}</TableCell> */}
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.petrolChargePerKm}</TableCell>
                        <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.additionalComments}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} style={{ textAlign: "center" }}>
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 30, 50]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        
        </Card>
       
      )}
    </div>
  );
};

export default PetrolAllowance;