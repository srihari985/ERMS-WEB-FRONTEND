import React, { useState , useEffect} from 'react';
import {
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Formik, Form, Field } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';

import { Close as CloseIcon, FileDownload as FileDownloadIcon, SimCardDownload as SimCardDownloadIcon, PictureAsPdf as PictureAsPdfIcon, FilePresent as FilePresentIcon } from '@mui/icons-material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';


const TravelvalidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces")
    .required("Employee Name is required"),
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  customerName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Customer Name must contain only letters and spaces")
    .required("Customer Name is required"),
  travelFrom: Yup.string()
    .required("Travel From is required"),
  travelTo: Yup.string()
    .required("Travel To is required"),
  travelType: Yup.string()
    .required("Travel Type is required"),
  noOfDays: Yup.number()
    .positive("Number of days must be positive")
    .integer("Number of days must be a whole number")
    .required("No. of Days is required"),
  travelCost: Yup.number()
    .positive("Travel cost must be positive")
    .required("Travel Cost is required"),

});

const FoodvalidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces")
    .required("Employee Name is required"),
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  customerName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Customer Name must contain only letters and spaces")
    .required("Customer Name is required"),
  noOfPersons: Yup.number()
    .positive("Number of persons must be positive")
    .integer("Number of persons must be a whole number")
    .required("No. of Persons is required"),
  foodCost: Yup.number()
    .positive("Food cost must be positive")
    .required("Food Cost is required"),
});

const TechLead_FoodAndTravel = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFirstCard, setShowFirstCard] = useState(true);
  const [showFormCard, setShowFormCard] = useState(false);
  const [travelAllowanceData, setTravelAllowanceData] = useState([]);
  const [foodAllowanceData, setFoodAllowanceData] = useState([]);
  const oTLId = localStorage.getItem("oTLId");
  const [anchorEl, setAnchorEl] = useState(null);

  const [searchDate, setSearchDate] = useState('');
  const [foodsearchDate, setFoodSearchDate] = useState('');
  


   // Pagination states for Travel Allowance
   const [travelPage, setTravelPage] = useState(0);
   const [travelRowsPerPage, setTravelRowsPerPage] = useState(5);
 
   // Pagination states for Food Allowance
   const [foodPage, setFoodPage] = useState(0);
   const [foodRowsPerPage, setFoodRowsPerPage] = useState(5);


   const fetchTravelAllowanceData = async () => {
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/operationTechLead/travelAllowance/getAll`);
      const data = await response.json();
      setTravelAllowanceData(data);
    } catch (error) {
      console.error('Error fetching travel allowance data:', error);
    }
  };

  const fetchFoodAllowanceData = async () => {
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/operationTechLead/foodAllowance/getAll`);
      const data = await response.json();                     
      setFoodAllowanceData(data);
    } catch (error) {
      console.error('Error fetching food allowance data:', error);
    }
  };

  useEffect(() => {
    fetchTravelAllowanceData();
    fetchFoodAllowanceData(); // Fetch food allowance data on component mount
  }, []);


  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle navigation to the form card
  const handleNextClick = () => {
    setShowFirstCard(false);
    setShowFormCard(true);
  };

  // Handle back navigation to the table card
  const handleBackClick = () => {
    setShowFormCard(false);
    setShowFirstCard(true);
  };

  // Handle submission of travel allowance form
 

  const handleTravelSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
  
    // Function to format date as "DD-MM-YYYY"
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('date', formatDate(values.date));
      formData.append('customerName', values.customerName);
      formData.append('travelFrom', values.travelFrom);
      formData.append('travelTo', values.travelTo);
      formData.append('travelType', values.travelType);
      formData.append('noOfDays', values.noOfDays);
      formData.append('travelCost', values.travelCost);
  
      const response = await fetch(`${baseUrl}/api/operationTechLead/travelAllowance/save/${oTLId}`, {
        method: 'POST',
        body: formData,
      });
  
      // Log the response status and response text for debugging
      console.log("Response Status:", response.status);
  
      // Check if the response is OK (status code in the range 200-299)
      if (response.ok) {
        const responseText = await response.text(); // Read the response as text
        console.log("Response Text:", responseText); // Log the response text for debugging
  
        // Assuming a successful response contains a success message
        toast.success('Form Submitted successfully.', {
          position: 'top-right',
          autoClose: 2000,
        });
  
        // Fetch updated travel allowance data
        await fetchTravelAllowanceData();
      } else {
        // If not a successful response, get the response text for error handling
        const errorText = await response.text(); // Read the response text for error handling
        console.error('Error details:', errorText);
        toast.error(`Error submitting Travel data: ${errorText}`, {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Log the error stack for more details
      console.error('Network or Server Error:', error);
      toast.error('A network error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      resetForm();
      handleBackClick(); // Navigate back to the table view
      setSubmitting(false);
    }
  };
  
  

  // Handle submission of food allowance form
 

  const handleFoodSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true); // Set submitting to true
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      // Create a FormData object
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('date', values.date);
      formData.append('customerName', values.customerName);
      formData.append('noOfPersons', values.noOfPersons);
      formData.append('foodCost', values.foodCost);
  
      const response = await fetch(`${baseUrl}/api/operationTechLead/foodAllowance/save/${oTLId}`, {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
      });
  
      // Log the response status for debugging
      console.log("Response Status:", response.status);
  
      // Check if the response is OK (status code in the range 200-299)
      if (response.ok) {
        const responseText = await response.text(); // Read the response as text
        console.log("Response Text:", responseText); // Log the response text for debugging
  
        // Assuming a successful response contains a success message
        toast.success('Food Form submitted successfully.', {
          position: 'top-right',
          autoClose: 2000,
        });
  
        // Fetch updated food allowance data
        await fetchFoodAllowanceData();
      } else {
        // If not a successful response, get the response text for error handling
        const errorText = await response.text(); // Read the response text for error handling
        console.error('Error details:', errorText);
        toast.error(`Error submitting food form: ${errorText}`, {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Log the error stack for more details
      console.error('Network or Server Error:', error);
      toast.error('A network error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      resetForm(); // Reset form fields
      handleBackClick(); // Navigate back to the table view
      setSubmitting(false); // Set submitting to false
    }
  };
  
  


  // Handle change in pagination for Travel Allowance
  const handleTravelChangePage = (event, newPage) => {
    setTravelPage(newPage);
  };

  const handleTravelChangeRowsPerPage = (event) => {
    setTravelRowsPerPage(parseInt(event.target.value, 10));
    setTravelPage(0);
  };

  // Handle change in pagination for Food Allowance
  const handleFoodChangePage = (event, newPage) => {
    setFoodPage(newPage);
  };

  const handleFoodChangeRowsPerPage = (event) => {
    setFoodRowsPerPage(parseInt(event.target.value, 10));
    setFoodPage(0);
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleExport = (format) => {
    handleCloseMenu();
    if (selectedTab === 0) { // Travel Allowance
      if (format === 'Excel') exportTravelToExcel();
      else if (format === 'PDF') exportTravelToPDF();
      else if (format === 'JSON') exportTravelToJSON();
    } else if (selectedTab === 1) { // Food Allowance
      if (format === 'Excel') exportFoodToExcel();
      else if (format === 'PDF') exportFoodToPDF();
      else if (format === 'JSON') exportFoodToJSON();
    }
  };
  
  const exportTravelToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Travel Allowance Report");
  
    worksheet.columns = [
      { header: 'S.No', key: 'sNo', width: 5 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Travel From', key: 'travelFrom', width: 20 },
      { header: 'Travel To', key: 'travelTo', width: 20 },
      { header: 'Travel Type', key: 'travelType', width: 20 },
      { header: 'No. of Days', key: 'noOfDays', width: 15 },
      { header: 'Travel Cost', key: 'travelCost', width: 15 },
    ];
  
    travelAllowanceData.forEach((item, index) => {
      worksheet.addRow({
        sNo: index + 1,
        date: item.date,
        customerName: item.customerName,
        travelFrom: item.travelFrom,
        travelTo: item.travelTo,
        travelType: item.travelType,
        noOfDays: item.noOfDays,
        travelCost: item.travelCost,
      });
    });
  
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        fillType: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF87CEEB' },
      };
      cell.font = { bold: true };
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Travel_Allowance_Report.xlsx');
  };
  
  const exportTravelToPDF = () => {
    const doc = new jsPDF();
    doc.text("Travel Allowance Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['S.No', 'Date', 'Customer Name', 'Travel From', 'Travel To', 'Travel Type', 'No. of Days', 'Travel Cost']],
      body: travelAllowanceData.map((item, index) => [
        index + 1,
        item.date,
        item.customerName,
        item.travelFrom,
        item.travelTo,
        item.travelType,
        item.noOfDays,
        item.travelCost,
      ]),
    });
    doc.save('Travel_Allowance_Report.pdf');
  };
  
  const exportTravelToJSON = () => {
    const json = JSON.stringify(travelAllowanceData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'Travel_Allowance_Report.json');
  };
  
  const exportFoodToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Food Allowance Report");
  
    worksheet.columns = [
      { header: 'S.No', key: 'sNo', width: 5 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'No. of Persons', key: 'noOfPersons', width: 15 },
      { header: 'Food Cost', key: 'foodCost', width: 15 },
    ];
  
    foodAllowanceData.forEach((item, index) => {
      worksheet.addRow({
        sNo: index + 1,
        date: item.date,
        customerName: item.customerName,
        noOfPersons: item.noOfPersons,
        foodCost: item.foodCost,
      });
    });
  
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        fillType: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF87CEEB' },
      };
      cell.font = { bold: true };
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Food_Allowance_Report.xlsx');
  };
  
  const exportFoodToPDF = () => {
    const doc = new jsPDF();
    doc.text("Food Allowance Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['S.No', 'Date', 'Customer Name', 'No. of Persons', 'Food Cost']],
      body: foodAllowanceData.map((item, index) => [
        index + 1,
        item.date,
        item.customerName,
        item.noOfPersons,
        item.foodCost,
      ]),
    });
    doc.save('Food_Allowance_Report.pdf');
  };
  
  const exportFoodToJSON = () => {
    const json = JSON.stringify(foodAllowanceData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'Food_Allowance_Report.json');
  };
  







  return (
    <Container maxWidth='false' sx={{ padding: 0, margin: 0 }}>
      <ToastContainer/>
      {showFirstCard && (
        <Card
          sx={{
            width: '100%',
            backgroundColor: 'white',
            padding: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            boxShadow: 3,
            marginTop: '80px',
          }}
        >
          <Typography sx={{ marginBottom: 2, fontWeight: 'bold', fontSize: '20px' }}>
            Travel and Food Allowance List
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ marginBottom: 3 }}
          >
            <Tab label="Travel Allowance" />
            <Tab label="Food Allowance" />
          </Tabs>

          <CardContent>
            {selectedTab === 0 && (
                    <>
                      {/* Search Field */}
                      {/* <TextField
                        label="Search by Date"
                        variant="outlined"
                        onChange={(e) => setSearchDate(e.target.value)} // state to hold the search date
                        sx={{ marginBottom: 2,width:'25%' }}
                        InputLabelProps={{ shrink: true }}
                      /> */}

<Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
            <Box display="flex" alignItems="center">
              <TextField
                label="Search by Date"
                variant="outlined"
                onChange={(e) => setSearchDate(e.target.value)} // state to hold the search date
                sx={{ marginBottom: 2, width: '250px' }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleClick}>
                Export
              </Button>
              <Menu
                anchorEl={anchorEl} // Use anchorEl to control menu visibility
                open={Boolean(anchorEl)} // Open the menu if anchorEl is not null
                onClose={handleCloseMenu}
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                              <Typography variant="h4">Travel Allowance List</Typography>
                              <Button
                                variant="contained"
                                style={{ padding: "10px 20px", backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
                                onClick={handleNextClick}
                              >
                                Travel Allowance Form
                              </Button>
                            </Box>

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Sl No</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Customer Name</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel From</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel To</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel Type</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>No. of Days</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel Cost</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {travelAllowanceData  
                              .filter(row => {
                                const dateToSearch = searchDate.trim(); // User's search input
                                const formattedDate = row.date.trim(); // Date from backend in "YYYY-MM-DD"
                  
                                // If search input is empty, show all rows
                                if (!dateToSearch) return true;
                  
                                // Check if the formattedDate contains the search date
                                return formattedDate.includes(dateToSearch); // Allow partial matches (like day '24')
                              })
                              .slice(travelPage * travelRowsPerPage, travelPage * travelRowsPerPage + travelRowsPerPage)
                              .map((row, index) => (
                                <TableRow key={index}>
                                  {/* Serial Number */}
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                                    {travelPage * travelRowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.customerName}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelFrom}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelTo}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelType}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.noOfDays}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelCost}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={travelAllowanceData.length}
                        rowsPerPage={travelRowsPerPage}
                        page={travelPage}
                        onPageChange={handleTravelChangePage}
                        onRowsPerPageChange={handleTravelChangeRowsPerPage}
                      />
                    </>
              )}

            {selectedTab === 1 && (
                    <>
                    
                      {/* Search Field */}
                          {/* <TextField
                            label="Search by Date"
                            variant="outlined"
                            onChange={(e) => setFoodSearchDate(e.target.value)} // Update the search date state
                            sx={{ marginBottom: 2,width:'25%' }}
                            InputLabelProps={{ shrink: true }}
                          /> */}

<Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
                  <Box display="flex" alignItems="center">
                    
                  <TextField
                            label="Search by Date"
                            variant="outlined"
                            onChange={(e) => setFoodSearchDate(e.target.value)} // Update the search date state
                            sx={{ marginBottom: 2,width:'250px' }}
                            InputLabelProps={{ shrink: true }}
                          />
                  </Box>

                  <Box display="flex" gap={2} alignItems="center">
                  <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleClick}>
                    Export
                  </Button>
                  <Menu
                    anchorEl={anchorEl} // Use anchorEl to control menu visibility
                    open={Boolean(anchorEl)} // Open the menu if anchorEl is not null
                    onClose={handleCloseMenu}
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











                          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                            <Typography variant="h4">Food Allowance List</Typography>
                            <Button
                              variant="contained"
                              style={{ padding: "10px 20px", backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
                              onClick={handleNextClick}
                            >
                              Food Allowance Form
                            </Button>
                          </Box>

                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {/* Replacing Employee Name with Sl No */}
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Sl No</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Customer Name</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>No. of Persons</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Food Cost</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {foodAllowanceData
                              .filter(row => {
                                const dateToSearch = foodsearchDate.trim(); // User's search input
                                const formattedDate = row.date.trim(); // Date from backend in "YYYY-MM-DD"
                  
                                // If search input is empty, show all rows
                                if (!dateToSearch) return true;
                  
                                // Check if the formattedDate contains the search date
                                return formattedDate.includes(dateToSearch); // Allow partial matches (like day '24')
                              })
                              .slice(foodPage * foodRowsPerPage, foodPage * foodRowsPerPage + foodRowsPerPage)
                              .map((row, index) => (
                                <TableRow key={index}>
                                  {/* Serial Number Column */}
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                                    {foodPage * foodRowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.customerName}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.noOfPersons}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.foodCost}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={foodAllowanceData.length}
                        rowsPerPage={foodRowsPerPage}
                        page={foodPage}
                        onPageChange={handleFoodChangePage}
                        onRowsPerPageChange={handleFoodChangeRowsPerPage}
                      />
                    </>
              )}
          </CardContent>
        </Card>
      )}

{showFormCard && (
  <Card
    sx={{
      width: '100%',
      backgroundColor: 'white',
      padding: { xs: 2, sm: 3, md: 4 },
      borderRadius: 2,
      boxShadow: 3,
      marginTop: '80px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
      <IconButton onClick={handleBackClick}>
        <ArrowBackIcon />
      </IconButton>
      <Typography sx={{ marginLeft: 1, fontWeight: 'bold', fontSize: '20px' }}>
        Travel and Food Allowance Form
      </Typography>
    </Box>

    <Tabs
      value={selectedTab}
      onChange={handleTabChange}
      indicatorColor="primary"
      textColor="primary"
      sx={{ marginBottom: 3 }}
    >
      <Tab label="Travel Allowance" />
      <Tab label="Food Allowance" />
    </Tabs>

    {/* Formik for Travel Allowance */}
    {selectedTab === 0 && (
     <Formik
     initialValues={{
       name: '',
       date: '',
       customerName: '',
       travelFrom: '',
       travelTo: '',
       travelType: '',
       noOfDays: '',
       travelCost: '',
     }}
     validationSchema={TravelvalidationSchema}
     onSubmit={handleTravelSubmit}
   >
     {({ handleChange, values, errors, touched, isSubmitting }) => (
       <Form>
         <Grid container spacing={2}>
           {/* Employee Name */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="name"
               label="Employee Name"
               variant="outlined"
               fullWidth
               onChange={handleChange}
               value={values.name}
               error={touched.name && Boolean(errors.name)}
               helperText={touched.name && errors.name}
             />
           </Grid>

           {/* Date */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="date"
               label="Date"
               variant="outlined"
               type="date"
               fullWidth
               InputLabelProps={{ shrink: true }}
               onChange={handleChange}
               value={values.date}
               error={touched.date && Boolean(errors.date)}
               helperText={touched.date && errors.date}
             />
           </Grid>

           {/* Customer Name */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="customerName"
               label="Customer Name"
               variant="outlined"
               fullWidth
               onChange={handleChange}
               value={values.customerName}
               error={touched.customerName && Boolean(errors.customerName)}
               helperText={touched.customerName && errors.customerName}
             />
           </Grid>

           {/* Travel From */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="travelFrom"
               label="Travel From"
               variant="outlined"
               fullWidth
               onChange={handleChange}
               value={values.travelFrom}
               error={touched.travelFrom && Boolean(errors.travelFrom)}
               helperText={touched.travelFrom && errors.travelFrom}
             />
           </Grid>

           {/* Travel To */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="travelTo"
               label="Travel To"
               variant="outlined"
               fullWidth
               onChange={handleChange}
               value={values.travelTo}
               error={touched.travelTo && Boolean(errors.travelTo)}
               helperText={touched.travelTo && errors.travelTo}
             />
           </Grid>

           {/* Travel Type */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="travelType"
               label="Travel Type"
               variant="outlined"
               fullWidth
               select
               onChange={handleChange}
               value={values.travelType}
               error={touched.travelType && Boolean(errors.travelType)}
               helperText={touched.travelType && errors.travelType}
             >
               <MenuItem value="Bike">Bike</MenuItem>
               <MenuItem value="Bus">Bus</MenuItem>
               <MenuItem value="Car">Car</MenuItem>
               <MenuItem value="Train">Train</MenuItem>
               <MenuItem value="Flight">Flight</MenuItem>
               <MenuItem value="Others">Others</MenuItem>
             </Field>
           </Grid>

           {/* No. of Days */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="noOfDays"
               label="No. of Days"
               variant="outlined"
               type="number"
               fullWidth
               onChange={handleChange}
               value={values.noOfDays}
               error={touched.noOfDays && Boolean(errors.noOfDays)}
               helperText={touched.noOfDays && errors.noOfDays}
             />
           </Grid>

           {/* Travel Cost */}
           <Grid item xs={12} md={6}>
             <Field
               as={TextField}
               name="travelCost"
               label="Travel Cost"
               variant="outlined"
               type="number"
               fullWidth
               onChange={handleChange}
               value={values.travelCost}
               error={touched.travelCost && Boolean(errors.travelCost)}
               helperText={touched.travelCost && errors.travelCost}
             />
           </Grid>
         </Grid>

         {/* Submit Button */}
         <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
           <Button
             type="submit"
             variant="contained"
             style={{ backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
             disabled={isSubmitting}
           >
             Submit Travel
           </Button>
         </Box>
       </Form>
     )}
   </Formik>
    )}

    {/* Formik for Food Allowance */}
    {selectedTab === 1 && (
      <Formik
      initialValues={{
        name: '',
        date: '',
        customerName: '',
        noOfPersons: '',
        foodCost: '',
      }}
      validationSchema={FoodvalidationSchema}
      onSubmit={handleFoodSubmit}
    >
      {({ handleChange, values, errors, touched, isSubmitting }) => (
        <Form>
          <Grid container spacing={2}>
            {/* Employee Name */}
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="name"
                label="Employee Name"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="date"
                label="Date"
                variant="outlined"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                value={values.date}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />
            </Grid>

            {/* Customer Name */}
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="customerName"
                label="Customer Name"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                value={values.customerName}
                error={touched.customerName && Boolean(errors.customerName)}
                helperText={touched.customerName && errors.customerName}
              />
            </Grid>

            {/* No. of Persons */}
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="noOfPersons"
                label="No. of Persons"
                variant="outlined"
                type="number"
                fullWidth
                onChange={handleChange}
                value={values.noOfPersons}
                error={touched.noOfPersons && Boolean(errors.noOfPersons)}
                helperText={touched.noOfPersons && errors.noOfPersons}
              />
            </Grid>

            {/* Food Cost */}
            <Grid item xs={12} md={6}>
              <Field
                as={TextField}
                name="foodCost"
                label="Food Cost"
                variant="outlined"
                type="number"
                fullWidth
                onChange={handleChange}
                value={values.foodCost}
                error={touched.foodCost && Boolean(errors.foodCost)}
                helperText={touched.foodCost && errors.foodCost}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
              disabled={isSubmitting}
            >
              Submit Food
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
    )}
  </Card>
)}


    </Container>
  );
};

export default TechLead_FoodAndTravel;