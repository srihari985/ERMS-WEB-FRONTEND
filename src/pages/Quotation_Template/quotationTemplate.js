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
  TableCell
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_BASE_URL

const QuotationTemplate = () => {
  const componentRef = useRef();
  const scrollRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default color is black
  const [theme, setTheme] = useState("modern");
  const [settings, setSettings] = useState({
    showPartyBalance: false,
    enableFreeQty: false,
    showItemDescription: true,
  });

  const {quotationDetails}=useAuth();
  const [billToShipTo, setBillToShipTo] = useState([]); //SHIP TO BILL TP API
  const [saleItems, setSaleItems] = useState([]); //TABLE API
  const [amounts, setAmounts] = useState([]); //Amounts API

  const navigate =useNavigate();

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Quotation",
  });

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


  const handleEdit=() =>{
    navigate('/QuotationForm')
  }



  // BILL TO SHIP TO GET METHOD
  const fetchPartyById = async () => {

    try {
      
      const response = await fetch(`${baseUrl}/api/addParty/getPartyById/${quotationDetails.adId}`);
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
      const response = await fetch(`${baseUrl}/api/itemSalesTable/getfinalItems/${quotationDetails.fId}`); // Replace with your API endpoint
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
      const response = await fetch(`${baseUrl}/api/itemsTotal/getTotals/${quotationDetails.fId}`); // Replace with your API endpoint
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



  useEffect(() => {
    
    fetchPartyById()
    fetchTableData()
    fetchAmountsData()

  }, []);

  return (
    <Grid
      container
      marginTop={"70px"}
      marginLeft={"30px"}
      marginRight={"20px"}
    >
      {/* Left Side: Quotation Section */}
      <Grid item xs={12}>
        <Box>

        <Card
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        // backgroundColor: '#f0f4ff', // Set your background color here
        padding: '16px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}
    >
      {/* Quotation Details */}
      <Box display="flex" alignItems="center" sx={{ marginBottom: '20px' }}>
        <ArrowBackIcon
          sx={{
            color: '#1976d2',
            marginRight: '8px',
          }}
        />
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            fontSize: '23px',
            color: '#333',
          }}
        >
          Quotation/ Estimate #{' '}
          <span style={{ color: '#1976d2' }}>{quotationDetails.quotationNumber}</span>
        </Typography>
      </Box>

      {/* Buttons Section */}
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Print Button */}
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "8px 18px",
              borderRadius: "8px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: "translateY(-3px)",
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
              backgroundColor: "#e53935",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "8px 18px",
              borderRadius: "8px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "#d32f2f",
                transform: "translateY(-3px)",
              },
            }}
          >
            Download Quotation
          </Button>

          {/* Edit Button */}
          <Button
            onClick={handleEdit}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              backgroundColor: "#ff9800",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "8px 18px",
              borderRadius: "8px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.2s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "#f57c00",
                transform: "translateY(-3px)",
              },
            }}
          >
            Edit Quotation
          </Button>
        </div>
      </Box>
    </Card>


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
                  padding: "0",
                },
              }}
            >
              <Typography style={{ paddingBottom: "15px", fontWeight: "bold" }}>
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
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREXVTLV4zTip3OjYRhWNEntAg51kKu9fx2Iw&s"
                            alt="Logo"
                            style={{ width: "90px", height: "auto" }}
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
                                Map Technos
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography>
                                Store 5, Makadia Complex X, Main Road Local,
                                Hyderabad, Telangana
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                GSTIN:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                  36DOWPM4249ANZ1
                                </span>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                Mobile:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                  8886700051
                                </span>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography style={{ fontWeight: "bold" }}>
                                Email:{" "}
                                <span style={{ fontWeight: "normal" }}>
                                  hyd@maptechnos.com
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
                        Quotation
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
                              Quotation No :
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{ width: "150px", textAlign: "right" }}
                            >
                              {/* <span>:</span> */}
                               <strong>{quotationDetails.quotationNumber}</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container justifyContent="space-between">
                            <Typography
                              variant="body1"
                              style={{ width: "100px", textAlign: "left" }}
                            >
                              Quotation Date :
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{ width: "150px", textAlign: "right" }}
                            >
                              {/* <span>:</span> */}
                               <strong>{quotationDetails.quotationDate}</strong>
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
                      <th sx={{ fontWeight: "bold", width: "5%" }}>S.No</th>
                      <th sx={{ fontWeight: "bold", width: "25%" }}>ITEMS</th>
                      <th sx={{ fontWeight: "bold", width: "10%" }}>HSN</th>
                      <th sx={{ fontWeight: "bold", width: "5%" }}>QTY</th>
                      <th sx={{ fontWeight: "bold", width: "10%" }}>RATE</th>
                      <th sx={{ fontWeight: "bold", width: "10%" }}>DISC</th>
                      <th sx={{ fontWeight: "bold", width: "10%" }}>TAX</th>
                      <th sx={{ fontWeight: "bold", width: "15%" }}>AMOUNT</th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                {saleItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.items}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.hsn}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.qty}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.priceItem}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.discount}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.tax}
                    </TableCell>
                    <TableCell style={{ border: "none", textAlign: "center", padding: "4px" }}>
                      {item.amount}
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                </Table>

                {/* </TableContainer> */}

                {/* Subtotal */}

                <div
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
    {/* Left Section: SUBTOTAL */}
    <Typography style={{ fontWeight: "bold", paddingLeft: "65px" }}>
      SUBTOTAL
    </Typography>

    {/* Right Section: Amounts */}
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
</div>







                {/* Subtotal & Total */}
                <Grid container spacing={2} style={{}}>
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" style={{ fontSize: "15px" }}>
                        Received Amount
                      </Typography>
                      <Typography variant="body1" style={{ fontSize: "15px" }}>
                        ₹ 0
                      </Typography>
                    </div>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", marginTop: "10px" }}
                    >
                      Total Amount(in words)
                    </Typography>
                    <Typography style={{ textAlign: "right" }}>
                      Seventy Three Thousand Two Hundred Two Rupees
                    </Typography>
                  </Grid>
                </Grid>

                {/* Footer */}
                <Box mt={2} textAlign="right">
                  <img
                    src="/assets/mapStamp.jpg"
                    alt="Logo"
                    style={{
                      width: "90px",
                      height: "auto",
                      marginRight: "60px",
                    }}
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

export default QuotationTemplate;
