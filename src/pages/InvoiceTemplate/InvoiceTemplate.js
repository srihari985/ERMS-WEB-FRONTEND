import React, { useRef, useEffect, useState } from "react";
import {Typography,Table,TableBody,CardContent,TableContainer,  TableHead,TableRow,Paper,Box,Grid,Button,RadioGroup,FormControlLabel,Radio,Checkbox,FormGroup,FormControl,FormLabel,ToggleButton,ToggleButtonGroup,} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const InvoiceTemplate = () => {
  const componentRef = useRef();
  const scrollRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default color is black
  const [theme, setTheme] = useState("modern");
  const [settings, setSettings] = useState({
    showPartyBalance: false,
    enableFreeQty: false,
    showItemDescription: true,
  });

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "invoice",
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

  // Function to download the invoice as PDF
  const handleDownload = () => {
    toPng(componentRef.current)
      .then((imgData) => {
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size: 210x297mm
        pdf.save("invoice.pdf");
      })
      .catch((error) => {
        console.error("Could not download invoice:", error);
      });
  };

  return (
    <Grid
      container
      spacing={2}
      marginTop={"70px"}
      marginLeft={"30px"}
      marginRight={"20px"}
    >
      {/* Left Side: Invoice Section */}
      <Grid item xs={9}>
        <Box>
          <Button
            onClick={handlePrint}
            variant="contained"
            color="primary"
            sx={{ mb: 3 }}
          >
            Print Invoice
          </Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            color="secondary"
            sx={{ mb: 3, ml: 2 }}
          >
            Download Invoice
          </Button>

          {/* The layout for the invoice */}
          <Box
            ref={componentRef}
            sx={{
              width: "210mm", // A4 width
              height: "297mm", // A4 height
              padding: "20px",
              boxSizing: "border-box",
              backgroundColor: "white", // Default background for the invoice
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

                  {/* Right Section for Tax Invoice */}
                  <Grid item xs={6} sm={6}>
                    <Typography
                      variant="h5"
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        paddingLeft: "45px",
                      }}
                    >
                      TAX INVOICE
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
                          Invoice No{" "}
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
                          Invoice Date{" "}
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
                      THE INSTITUTE OF COMPANY SECRETARIES OF INDIA-CCGRT
                    </Typography>
                    <Typography>
                      Sy.No. 1,{" "}
                      <span>
                        IDA Uppal,Genpact Road, Near Mallikarjuna Swami Temple
                        Uppal, Hyderabad, 500039
                      </span>
                    </Typography>
                    <Typography style={{}}>
                      GSTIN:{" "}
                      <span style={{ paddingLeft: "20px" }}>
                        36AAATT1103F2Z0
                      </span>
                    </Typography>
                    <Typography style={{}}>
                      Mobile:{" "}
                      <span style={{ paddingLeft: "16px" }}>7040411804</span>
                    </Typography>
                    <Typography style={{}}>
                      State:{" "}
                      <span style={{ paddingLeft: "26px" }}>Telangana</span>
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
                      THE INSTITUTE OF COMPANY SECRETARIES OF INDIA-CCGRT
                    </Typography>
                    <Typography style={{ paddingLeft: "40px" }}>
                      Sy.No. 1,{" "}
                      <span>
                        IDA Uppal,Genpact Road, Near Mallikarjuna Swami Temple
                        Uppal, Hyderabad, 500039
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
                <TableHead sx={{ backgroundColor: "#F9ADA4", height: "28px" }}>
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
                  <TableRow style={{ borderBottom: "none", padding: "8px 0" }}>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "center",
                      }}
                    >
                      1
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "left",
                      }}
                    >
                      SAMSUNG A30 PORTR POE SWITCH -CP PLUS
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                      
                      }}
                    >
                  123456
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "center",
                      }}
                    >
                      1
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "center",
                      }}
                    >
                      10,000
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "center",
                      }}
                    >
                      18%
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "right",
                      }}
                    >
                      11,800
                    </td>
                    <td
                      style={{
                        border: "none",
                        padding: "4px 8px",
                        textAlign: "right",
                      }}
                    >
                      11,800
                    </td>
                  </TableRow>
                 
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
                  <Typography
                    style={{ fontWeight: "bold", paddingLeft: "65px" }}
                  >
                    SUBTOTAL
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: "200px",
                    }}
                  >
                    <Typography style={{ fontWeight: "bold" }}>73</Typography>
                  </div>
                  {/* Right Section: Amounts */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{ fontWeight: "bold", marginRight: "10px" }}
                    >
                      <span>₹</span>3,456.24
                    </Typography>
                    <Typography
                      style={{ fontWeight: "bold", marginRight: "10px" }}
                    >
                      <span>₹</span>11,166.48
                    </Typography>
                    <Typography style={{ fontWeight: "bold" }}>
                      <span>₹</span>73,202.47
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
                      ₹62,035.99
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
                      ₹73,202
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
                  style={{ width: "90px", height: "auto", marginRight: "60px" }}
                />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Authorized Signature for Map Technos
                </Typography>
              </Box>
            </Box>{" "}
            {/* End Scrollable Box */}
          </Box>
        </Box>
      </Grid>

      {/* Right Side: Theme and Color Settings */}
      <Grid item xs={3}>
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

          {/* Color Selection */}
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

          {/* Additional Settings */}
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
      </Grid>
    </Grid>
  );
};

export default InvoiceTemplate;
