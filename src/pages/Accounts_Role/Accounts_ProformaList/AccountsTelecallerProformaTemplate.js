import React, { useRef, useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  CardContent,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  TableCell,
  Menu, MenuItem
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { toCanvas } from "html-to-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useAuth } from "../../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import Swal from 'sweetalert2';
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentIcon from '@mui/icons-material/Assignment';

const baseUrl = process.env.REACT_APP_API_BASE_URL

const AccountsTelecallerProformaTemplate = () => {
  const componentRef = useRef();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [loading,setIsLoading]=useState(false)
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default color is black
  const [theme, setTheme] = useState("modern");
  const [settings, setSettings] = useState({
    showPartyBalance: false,
    enableFreeQty: false,
    showItemDescription: true,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  // const {quotationDetails}=useAuth();
  const [billToShipTo, setBillToShipTo] = useState([]); //SHIP TO BILL TP API
  const [saleItems, setSaleItems] = useState([]); //TABLE API
  const [amounts, setAmounts] = useState([]); //Amounts API
  const [orgData, setOrgData] = useState([]); //Amounts API

  // Access the passed state (profarmaData)
  const { profarmaData } = location.state || {};

  const navigate =useNavigate();

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Quotation",
  }); 


  const { orgId } = useAuth();

  // Auto scroll to bottom when component mounts or updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleColorChange = (event, newColor) => {
    if (newColor) {
      setSelectedColor(newColor);
    }
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleSettingsChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  // Function to download the Quotation as PDF
  const handleDownload = () => {
    toPng(componentRef.current)
      .then((imgData) => {
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size: 210x297mm
        pdf.save("Quotation.pdf");
      })
      .catch((error) => {
        console.error("Could not download Quotation:", error);
      });
  };

 

  // const handleDownload = () => {
  //   html2canvas(componentRef.current, { scale: 4 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  
  //     const imgWidth = 210;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     pdf.save("Quotation.pdf");
  //   });
  // };


  // const handleEdit=() =>{
  //   navigate('/QuotationForm', { state: { profarmaData } });
  // }



  // BILL TO SHIP TO GET METHOD
  const fetchPartyById = async () => {

    try {
      
      const response = await fetch(`${baseUrl}/api/telecaller/addParty/getPartyById/${profarmaData.adId}`);
      if (response.ok) {
        const data = await response.json();
        setBillToShipTo(data); // Set party details
        
        // localStorage.setItem('party', JSON.stringify(data)); // Save party to localStorage
        
      } else {
        console.error('Failed to fetch party details');
      }

    } catch (error) {
      console.error('Error fetching party details:', error);
    }
  };


  //QUOTATION TABLE GET METHOD
  const fetchTableData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/telecaller/itemSalesTable/getfinalItems/${profarmaData.fId}`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setSaleItems(data); // Store the fetched data in the state
      } else {
        console.error('Failed to fetch table data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };


  //AMOUNTS API
  const fetchAmountsData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/telecaller/itemsTotal/getTotals/${profarmaData.fId}`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setAmounts(data); // Store the fetched data in the state
      } else {
        console.error('Failed to fetch table data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };


  //Organization API
  const fetchOrgDetailsData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/organize/getById/${orgId}`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
  
        // Prepend MIME type to companyLogo and companyStamp
        const companyLogo = `data:image/jpeg;base64,${data.companyLogo}`;
        const companyStamp = `data:image/jpeg;base64,${data.companyStamp}`;
  
        setOrgData({ ...data, companyLogo, companyStamp }); // Store the fetched data and formatted images
      } else {
        console.error('Failed to fetch organization details');
      }
    } catch (error) {
      console.error('Error fetching organization details:', error);
    }
  };
  




  useEffect(() => {
    fetchPartyById()
    fetchTableData()
    fetchAmountsData()
    fetchOrgDetailsData()

  }, []);


  //Convert to Invoice Method
  const handleConvertToInvoice = async () => {
    // Show confirmation dialog
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to convert this quotation to an invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, convert it!",
    });
  
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }
  
    setIsLoading(true); // Set loading state
  
    const baseUrl = process.env.REACT_APP_API_BASE_URL; // Ensure the API base URL is set correctly
    try {
      // const token = localStorage.getItem("token"); // Assuming you need token for authentication
      // const headers = {
      //   "Authorization": Bearer ${localStorage.getItem("token")}, // Assuming token is needed for auth
      // };
  
      // Create FormData and append the necessary fields
      const formData = new FormData();
      formData.append("grandTotal", profarmaData.grandTotal); // Add the grandTotal as form data
  
      // Send the quotation data to convert to invoice
      const response = await fetch(
        `${baseUrl}/api/telecaller/invoice/save/${profarmaData.fId}`, // Replace with your endpoint
        {
          method: "POST",
          body: formData, // Sending form data instead of JSON
        }
      );
      const result = await response.json();
  
      if (response.ok && result.status === "exists") {
        // const result = await response.json();
        toast.success('Invoice Already Exists', {
          position: "top-right",
          autoClose: 2000,
        });
      } 
      
      if(response.ok && result.status === "notExists") {
        // const errorText = await response.text();
       
        toast.success('Quotation converted to invoice successfully', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(`Error converting quotation: ${error.message}`, {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };



  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    console.log(`Selected option: ${option}`);
    // Call different functions or set states here based on the selected option
    handleMenuClose();
  };




  function convertNumberToWords(num) {
    const words = [
      "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
      "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
  
    if (num === 0) return words[0];
  
    function convertHundreds(n) {
      let result = "";
      if (n > 99) {
        result += words[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n > 19) {
        result += words[20 + Math.floor(n / 10) - 2] + (n % 10 !== 0 ? " " + words[n % 10] : "");
      } else if (n > 0) {
        result += words[n];
      }
      return result.trim();
    }
  
    function convertThousands(n) {
      if (n >= 1000) {
        return convertHundreds(Math.floor(n / 1000)) + " Thousand " + convertHundreds(n % 1000);
      } else {
        return convertHundreds(n);
      }
    }
  
    let integerPart = Math.floor(num); // Integer part of the number
    let decimalPart = Math.round((num - integerPart) * 100); // Fractional part (up to 2 decimal places)
  
    let result = "";
  
    // Process Crore
    if (integerPart >= 1e7) {
      result += convertThousands(Math.floor(integerPart / 1e7)) + " Crore ";
      integerPart %= 1e7;
    }
  
    // Process Lakh
    if (integerPart >= 1e5) {
      result += convertThousands(Math.floor(integerPart / 1e5)) + " Lakh ";
      integerPart %= 1e5;
    }
  
    // Process Thousand
    if (integerPart >= 1000) {
      result += convertThousands(Math.floor(integerPart / 1000)) + " Thousand ";
      integerPart %= 1000;
    }
  
    // Process Remaining Hundreds, Tens, and Ones
    if (integerPart > 0) {
      result += convertHundreds(integerPart);
    }
  
    // Handle decimal part if it exists
    if (decimalPart > 0) {
      result += " and " + convertHundreds(decimalPart) + " Paise";
    }
  
    return result.trim();
  }
  
  
  

  return (
    <Grid
      container
      marginTop={"70px"}
      // marginLeft={"10px"}
      marginRight={"20px"}
      // spacing={2} // Optional: To manage spacing between grid items
      sx={{ // You can also use sx if you're using Material UI v5 or later for styling
        display: 'flex', // Ensure flex behavior
        justifyContent: 'center', // Example: Center content if needed
        padding: '0', // Ensure no additional padding is applied to the container
        boxSizing: 'border-box',
      }}
    >
      {/* Left Side: Quotation Section */}
      <Grid item xs={12}>
        <Box>

        <Card
        sx={{
          position: 'sticky',
          // top: 0,
          // zIndex: 10,
          width: '100%', // Ensures full width
          maxWidth: '100%', // Avoids exceeding the screen width
          padding: '16px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          boxSizing: 'border-box', // Ensures padding is included in width
        }}
      >
        {/* Quotation Details */}
        <Box display="flex"  sx={{ marginBottom: '20px' }}>
          <ArrowBackIcon
            sx={{
              color: '#1976d2',
              marginRight: '8px',
              marginTop:'10px',
              cursor:'ponter'
            }}
            onClick={ () => navigate("/AccountsProformaList")}
          />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              fontSize: '23px',
              color: '#333',
            }}
          >
            Proforma List #{' '}
            <span style={{ color: '#1976d2' }}>{profarmaData.proFormaNumber}</span>
          </Typography>
        </Box>

        {/* Buttons Section */}
        <Box display="flex" alignItems="center">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Print Button */}
            <Button
              onClick={handlePrint}
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '8px 18px',
                borderRadius: '8px',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#1565c0',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Print Quotation
            </Button>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                backgroundColor: '#e53935',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '8px 18px',
                borderRadius: '8px',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Download Quotation
            </Button>

            {/* Edit Button */}
            {/* <Button
              onClick={handleEdit}
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: '#ff9800',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '8px 18px',
                borderRadius: '8px',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s, background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#f57c00',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              Edit Quotation
            </Button> */}

            {/* Convert to Invoice Button */}
            {/* <Button
              onClick={handleConvertToInvoice}
              variant="contained"
              startIcon={<AssignmentIcon />}
              sx={{
                backgroundColor: '#43a047', // Green color for Convert to Invoice
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '8px 18px',
                borderRadius: '8px',
                border: '2px dotted', // Dotted border with a darker green color
              }}
            >
              Convert to Invoice
            </Button> */}

             {/* Convert to Invoice Dropdown Button */}
      <Button
        onClick={handleButtonClick}
        variant="contained"
        startIcon={<AssignmentIcon />}
        sx={{
          backgroundColor: "#43a047", // Green color for Convert to Invoice
          color: "#fff",
          fontSize: "11px",
          fontWeight: "bold",
          padding: "8px 18px",
          borderRadius: "8px",
          border: "2px dotted", // Dotted border with a darker green color
        }}
      >
        Convert to Invoice
      </Button>
      
      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick("SaleInvoice")}>
          Convert to SaleInvoice
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("DC")}>
          Convert to DC
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("ProformaInvoice")}>
          Convert to ProformaInvoice
        </MenuItem>
      </Menu>
           
          </div>
        </Box>
       
      </Card>
      <ToastContainer />



          {/* The layout for the Quotation */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              ref={componentRef}
              sx={{
                width: "210mm", // A4 width
                height: "297mm", // A4 height
                padding: "20px",

                boxSizing: "border-box",
                backgroundColor: "white", // Default background for the Quotation
                overflow: "hidden", // To ensure the scroll container handles overflow
                "@media print": {
                  size: "A4",
                  margin: "0",
                  padding: "10",
                },
              }}
            >
             <Typography
              sx={{
                paddingBottom: "15px",
                fontWeight: "bold",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px", // Optional: Adjust font size
                color: "#333", // Optional: Adjust font color
              }}
              >
              Leads The Better Way of Technology
            </Typography>
              {/* Scrollable content */}
              <Box
                ref={scrollRef}
                sx={{
                  maxHeight: "100%", // Ensure container height doesn't exceed the page
                  // overflowY: 'scroll', // Allow vertical scroll
                  paddingRight: "6px",
                }}
              >
                {/* Header */}
                <CardContent>
                  <Grid
                    container
                    mb={0}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {/* Left and Center Sections */}
                    <Grid item xs={6} sm={6}>
                      <Grid container spacing={0} alignItems="center">
                        {/* Left Section with Image */}
                        <Grid
                          item
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <img
                            src={orgData.companyLogo}
                            alt="Logo"
                            style={{ width: "120px", height: "130px" , borderRadius:"50%"}}
                          />
                        </Grid>

                        {/* Center Section - Company Info */}
                        <Grid item style={{ flex: 1, marginLeft: "15px" }}>
                          <Grid container direction="column">
                            <Grid item>
                              <Typography
                                variant="h4"
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "left",
                                  color: "red",
                                }}
                              >
                                {orgData.companyName}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography>
                              {orgData.companyAddress}<br/>
                               {orgData.city},{orgData.state},{orgData.pinCode}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                GSTIN:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                 {orgData.gstIn}
                                </span>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                Mobile:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                {orgData.contactNumber}
                                </span>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                Email:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                {orgData.email}
                                </span>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                PAN Number:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                  DDWPM2424N
                                </span>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Right Section for Tax Quotation */}
                    {/* <Grid item xs={6} sm={6}>
                    <Typography
                      variant="h5"
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        paddingLeft: "45px",
                      }}
                    >
                     Quotation
                    </Typography>

                    <Grid
                      container
                      direction="column"
                      spacing={1}
                      style={{ marginTop: "10px", paddingLeft: "10px" }}
                    >
                      <Grid item>
                        <Typography
                          variant="body1"
                          style={{ textAlign: "right" }}
                        >
                          Quotation No{" "}
                          <span
                            style={{
                              paddingLeft: "70px",
                              paddingRight: "70px",
                            }}
                          >
                            :
                          </span>{" "}
                          <strong>AABBCD001/2023</strong>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="body1"
                          style={{ textAlign: "right" }}
                        >
                          Quotation Date{" "}
                          <span
                            style={{
                              paddingLeft: "62px",
                              paddingRight: "105px",
                            }}
                          >
                            :
                          </span>{" "}
                          <strong>16/02/2023</strong>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="body1"
                          style={{ textAlign: "right" }}
                        >
                          Due Date{" "}
                          <span
                            style={{
                              paddingLeft: "80px",
                              paddingRight: "105px",
                            }}
                          >
                            :
                          </span>{" "}
                          <strong>16/02/2023</strong>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="body1"
                          style={{ textAlign: "right" }}
                        >
                          PO No.{" "}
                          <strong style={{ paddingLeft: "10px" }}>
                            ICSI-CCGRT/Admin/600/2024 Dt. 19.04.2024
                          </strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid> */}
                    <Grid item xs={6} sm={6}>
                     
                      <Typography
                        variant="h5"
                        style={{
                          fontWeight: "bold",
                          textAlign: "left",
                          paddingLeft: "45px",
                          marginBottom: "5px",
                        }}
                      >
                        PROFARMA INVOICE
                      </Typography>

                      {/* Labels and Values */}
                      <Grid
                        container
                        direction="column"
                        spacing={1}
                        style={{ paddingLeft: "50px" }}
                      >
                        <Grid item>
                          <Grid container justifyContent="space-between">
                            <Typography
                              variant="body1"
                              style={{ width: "100px", textAlign: "left" }}
                            >
                              Proforma No :
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{ width: "150px", textAlign: "right" }}
                            >
                              {/* <span>:</span> */}
                               <strong>{profarmaData.proFormaNumber}</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container justifyContent="space-between">
                            <Typography
                              variant="body1"
                              style={{ width: "100px", textAlign: "left" }}
                            >
                              Proforma Date :
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{ width: "150px", textAlign: "right" }}
                            >
                              {/* <span>:</span> */}
                               <strong>{profarmaData.date}</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                       
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Bill To / Ship To */}
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Bill To Section */}
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        style={{
                          backgroundColor: "#F9ADA4",
                          width: "35%",
                          paddingLeft: "10px",
                        }} // Apply selected color to "Bill To"
                      >
                        BILL TO
                      </Typography>
                      <Typography style={{ fontWeight: "bold" }}>
                        {billToShipTo.customerName}
                      </Typography>
                      <Typography>
                        Sy.No. 1,{" "}
                        <span>
                         {billToShipTo.billingAddress},{billToShipTo.city},{billToShipTo.state},{billToShipTo.pincode}
                        </span>
                      </Typography>
                      <Typography style={{}}>
                        GSTIN:{" "}
                        <span style={{ paddingLeft: "20px" }}>
                          {billToShipTo.gstIn}
                        </span>
                      </Typography>
                      <Typography style={{}}>
                        Mobile:{" "}
                        <span style={{ paddingLeft: "16px" }}>{billToShipTo.mobileNumber}</span>
                      </Typography>
                      <Typography style={{}}>
                        State:{" "}
                        <span style={{ paddingLeft: "26px" }}>{billToShipTo.state}</span>
                      </Typography>
                    </Grid>

                    {/* Ship To Section */}
                    <Grid item xs={6} style={{}}>
                      {" "}
                      {/* Align text to the right */}
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        style={{
                          backgroundColor: "#F9ADA4",
                          width: "35%",
                          paddingLeft: "10px",
                          marginLeft: "40px",
                        }} // Apply selected color to "Ship To"
                      >
                        SHIP TO
                      </Typography>
                      <Typography
                        style={{ fontWeight: "bold", paddingLeft: "40px" }}
                      >
                        {billToShipTo.customerName}
                      </Typography>
                      <Typography style={{ paddingLeft: "40px" }}>
                        Sy.No. 1,{" "}
                        <span>
                          {billToShipTo.shippingAddress}, {billToShipTo.shippingCity}, {billToShipTo.shippingState}, {billToShipTo.shippingPincode}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>

                {/* Table of Items */}
                {/* <TableContainer component={Paper}> */}
                <Table sx={{ borderCollapse: "collapse" }}>
                  {" "}
                  {/* Collapse borders to remove lines between cells */}
                  <TableHead
                    sx={{ backgroundColor: "#F9ADA4", height: "28px" }}
                  >
                     <TableRow>
                   
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "5%"}}>S.No</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "25%"}}>ITEMS</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "10%"}}>HSN</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "5%" }}>QTY</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "10%" }}>RATE</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "10%" }}>DISC</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "10%" }}>TAX</TableCell>
                   <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", backgroundColor: "#F9ADA4",fontWeight: "bold", width: "15%" }}>AMOUNT</TableCell>
                 </TableRow>
                  </TableHead>
                  <TableBody>
                {saleItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.items}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.hsn}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.qty}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.priceItem}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.discount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.tax}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px",textAlign: "center",fontSize: "15px", }}>
                      {item.amount}
                    </TableCell>
                    </TableRow>
                  ))}
                    {/* Subtotal Row */}
                    <TableRow>
                    {/* Empty cells to span over S.No, ITEMS, HSN, QTY */}
                    <TableCell colSpan={4} sx={{border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: "bold" ,backgroundColor: "#F9ADA4"}} >SUBTOTAL</TableCell>
                    
                    {/* SUBTOTAL label */}
                    {/* <TableCell colSpan={1} sx={{  padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: "bold",backgroundColor: "#F9ADA4" }}></TableCell> */}

                    {/* Subtotal values */}
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: "bold" ,backgroundColor: "#F9ADA4"}}>
                      ₹{amounts.totalAmount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: "bold" ,backgroundColor: "#F9ADA4"}}>
                      ₹{amounts.totalDiscount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: "bold" ,backgroundColor: "#F9ADA4"}}>
                      ₹{amounts.totalTax}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px", fontWeight: "bold" ,backgroundColor: "#F9ADA4"}}>
                      ₹{amounts.finalAmount}
                    </TableCell>
                  </TableRow>

                </TableBody>

                </Table>

                {/* </TableContainer> */}

                {/* Subtotal */}

                {/* <div
  style={{
    backgroundColor: "#F9ADA4",
    marginTop: "10px",
    marginBottom: "9px",
    width: "100%",
    height: "30px",
    paddingTop: "5px",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 10px",
    }}
  >
    
    <Typography style={{ fontWeight: "bold", paddingLeft: "65px" }}>
      SUBTOTAL
    </Typography>

   
    <div
      style={{
        display: "flex",
        gap: "45px", // Add space between items
        alignItems: "center",
      }}
    >
      <Typography style={{ fontWeight: "bold", marginRight: "10px" }}>
        <span>₹</span>{amounts.totalAmount}
      </Typography>
      <Typography style={{ fontWeight: "bold", marginRight: "10px" }}>
        <span>₹</span>{amounts.totalDiscount}
      </Typography>
      <Typography style={{ fontWeight: "bold", marginRight: "10px" }}>
        <span>₹</span>{amounts.totalTax}
      </Typography>
      <Typography style={{ fontWeight: "bold", marginRight: "7px" }}>
        <span>₹</span>{amounts.finalAmount}
      </Typography>
    </div>
  </div>
</div> */}







                {/* Subtotal & Total */}
                <Grid container spacing={2} style={{marginTop:'3px'}}>
                  {/* Bank Details */}
                  <Grid item xs={6}>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      BANK DETAILS
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Typography style={{ paddingRight: "70px" }}>
                        Name:
                      </Typography>
                      <Typography>MAP TECHNOS</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography style={{ paddingRight: "46px" }}>
                        IFSC Code:
                      </Typography>
                      <Typography>HDFC0003796</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography style={{ paddingRight: "39px" }}>
                        Account No:
                      </Typography>
                      <Typography>50200057328051</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <Typography style={{ paddingRight: "75px" }}>
                        Bank:
                      </Typography>
                      <Typography>HDFC Bank, HABSIGUDA</Typography>
                    </div>
                  </Grid>

                  {/* Total Amount Details */}
                  <Grid item xs={6} textAlign="right">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" style={{ fontSize: "18px" }}>
                        TAXABLE AMOUNT
                      </Typography>
                      <Typography variant="body1" style={{ fontSize: "18px" }}>
                        {amounts.additionalCharges}
                      </Typography>
                    </div>
                    {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" style={{ fontSize: "18px" }}>
                      CGST @9%
                    </Typography>
                    <Typography variant="body1" style={{ fontSize: "18px" }}>
                      ₹5583.24
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" style={{ fontSize: "18px" }}>
                      SGST @9%
                    </Typography>
                    <Typography variant="body1" style={{ fontSize: "18px" }}>
                      ₹5583.24
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" style={{ fontSize: "18px" }}>
                      Round Off
                    </Typography>
                    <Typography variant="body1" style={{ fontSize: "18px" }}>
                      -₹0.47
                    </Typography>
                  </div> */}
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid black",
                        paddingLeft: "20px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        TOTAL AMOUNT
                      </Typography>
                      <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        {amounts.grandTotal}
                      </Typography>
                    </div>
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1px solid black",
                        paddingLeft: "20px",
                      }}
                    />
                    
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Total Amount(in words)
                    </Typography>
                    <Typography style={{ textAlign: "right" }}>
                      {/* Seventy Three Thousand Two Hundred Two Rupees */}
                      {convertNumberToWords(amounts.grandTotal) }
                    </Typography>
                  </Grid>
                </Grid>

                {/* Footer */}
                <Box mt={2} textAlign="right">
                  <img
                    src={orgData.companyStamp}
                    alt="Logo"
                
                      style={{ width: "120px", marginRight: "60px", height: "130px" , borderRadius:"50%"}}
                    
                  />
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Authorized Signature for Map Technos
                  </Typography>
                </Box>
              </Box>{" "}
              {/* End Scrollable Box */}
            </Box>
          </div>
        </Box>
      </Grid>

      {/* Right Side: Theme and Color Settings */}
      {/* <Grid item xs={3}>
        <Box
          sx={{
            padding: 4,
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            width: "100%",
          }}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Themes</FormLabel>
            <RadioGroup row value={theme} onChange={handleThemeChange}>
              <FormControlLabel
                value="modern"
                control={<Radio />}
                label="Modern"
              />
              <FormControlLabel
                value="stylish"
                control={<Radio />}
                label="Stylish"
              />
              <FormControlLabel
                value="advanced-gst"
                control={<Radio />}
                label="Advanced GST (Tally)"
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="Create Custom Theme"
              />
            </RadioGroup>

            {theme === "custom" && (
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Create New Custom Theme
              </Button>
            )}
          </FormControl>

          
          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <FormLabel component="legend">Select Color</FormLabel>
            <ToggleButtonGroup
              value={selectedColor}
              exclusive
              onChange={handleColorChange}
              aria-label="text alignment"
              sx={{ display: "flex", flexWrap: "wrap" }}
            >
              <ToggleButton value="#000000" aria-label="left aligned">
                Black
              </ToggleButton>
              <ToggleButton value="#4caf50" aria-label="centered">
                Green
              </ToggleButton>
              <ToggleButton value="#ff9800" aria-label="right aligned">
                Orange
              </ToggleButton>
              <ToggleButton value="#f44336" aria-label="justified">
                Red
              </ToggleButton>
              <ToggleButton value="#3f51b5" aria-label="justified">
                Blue
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 4 }}>
            <FormLabel component="legend">Additional Settings</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.showPartyBalance}
                    onChange={handleSettingsChange}
                    name="showPartyBalance"
                  />
                }
                label="Show Party Balance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.enableFreeQty}
                    onChange={handleSettingsChange}
                    name="enableFreeQty"
                  />
                }
                label="Enable Free Quantity"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.showItemDescription}
                    onChange={handleSettingsChange}
                    name="showItemDescription"
                  />
                }
                label="Show Item Description"
              />
            </FormGroup>
          </FormControl>
        </Box>
      </Grid> */}
    </Grid>
  );
};

export default AccountsTelecallerProformaTemplate;