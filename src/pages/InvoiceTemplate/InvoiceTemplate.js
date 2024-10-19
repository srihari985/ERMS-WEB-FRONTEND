import React, { useRef, useEffect, useState } from 'react';
import {Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Box,Grid,Button,RadioGroup,FormControlLabel,Radio,Checkbox,FormGroup,FormControl,FormLabel,ToggleButton,ToggleButtonGroup} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const Invoice = () => {
  const componentRef = useRef();
  const scrollRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color is black
  const [theme, setTheme] = useState('modern');
  const [settings, setSettings] = useState({
    showPartyBalance: false,
    enableFreeQty: false,
    showItemDescription: true,
  });

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'invoice',
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
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size: 210x297mm
        pdf.save('invoice.pdf');
      })
      .catch((error) => {
        console.error('Could not download invoice:', error);
      });
  };

  return (
    <Grid container spacing={2} marginTop={'70px'} marginLeft={'30px'} marginRight={'20px'}>
      {/* Left Side: Invoice Section */}
      <Grid item xs={9}>
        <Box>
          <Button onClick={handlePrint} variant="contained" color="primary" sx={{ mb: 3 }}>
            Print Invoice
          </Button>
          <Button onClick={handleDownload} variant="contained" color="secondary" sx={{ mb: 3, ml: 2 }}>
            Download Invoice
          </Button>

          {/* The layout for the invoice */}
          <Box
            ref={componentRef}
            sx={{
              width: '210mm', // A4 width
              height: '297mm', // A4 height
              padding: '20mm',
              boxSizing: 'border-box',
              backgroundColor: '#e6f0e9', // Default background for the invoice
              overflow: 'hidden', // To ensure the scroll container handles overflow
              '@media print': {
                size: 'A4',
                margin: '0',
                padding: '0',
              },
            }}
          >
            {/* Scrollable content */}
            <Box
              ref={scrollRef}
              sx={{
                maxHeight: '100%', // Ensure container height doesn't exceed the page
                // overflowY: 'scroll', // Allow vertical scroll
                paddingRight: '6px',
              }}
            >
              {/* Header */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Typography variant="h5">Map Technos</Typography>
                  <Typography>Store 5, Makadia Complex X, Main Road Local, Hyderabad, Telangana</Typography>
                  <Typography>GSTIN: 36DOWPM4249ANZ1</Typography>
                  <Typography>Mobile: 9866780931</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="h6">TAX INVOICE</Typography>
                  <Typography>Invoice No: AABBCD001/2023</Typography>
                  <Typography>Invoice Date: 16/02/2023</Typography>
                </Grid>
              </Grid>

              {/* Bill To / Ship To */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: selectedColor }} // Apply selected color to "Bill To"
                  >
                    BILL TO:
                  </Typography>
                  <Typography>Sample Party</Typography>
                  <Typography>12 Park Circus, Connaught Circus, New Delhi</Typography>
                  <Typography>Mobile: 7040411804</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: selectedColor }} // Apply selected color to "Ship To"
                  >
                    SHIP TO:
                  </Typography>
                  <Typography>Sample Party</Typography>
                  <Typography>129/123 Sarjapur, Bangalore</Typography>
                </Grid>
              </Grid>

              {/* Table of Items */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: selectedColor }}> {/* Apply selected color to TableHead */}
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>HSN</TableCell>
                      <TableCell>QTY</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Tax</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>SAMSUNG A30</TableCell>
                      <TableCell>1234</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>10000</TableCell>
                      <TableCell>18%</TableCell>
                      <TableCell>11,800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell>EARPLUGS</TableCell>
                      <TableCell>40511192</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>90</TableCell>
                      <TableCell>18%</TableCell>
                      <TableCell>190</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell>PUMA TSHIRT</TableCell>
                      <TableCell>2032</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>900</TableCell>
                      <TableCell>18%</TableCell>
                      <TableCell>1,900</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Subtotal & Total */}
              <Grid container spacing={2} mt={3}>
                <Grid item xs={6}>
                  <Typography variant="body2">Notes:</Typography>
                  <Typography>Sample Note</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1">Subtotal: ₹14,050</Typography>
                  <Typography variant="body1">Taxable Amount: ₹12,123.86</Typography>
                  <Typography variant="body1">CGST/SGST: ₹1,746.14</Typography>
                  <Typography variant="h6" sx={{ color: selectedColor }}>
                    {/* Apply selected color to Total Amount */}
                    Total Amount: ₹14,050
                  </Typography>
                </Grid>
              </Grid>

              {/* Footer */}
              <Box mt={4} textAlign="center">
                <Typography variant="body2">Authorized Signature for Map Technos</Typography>
              </Box>
            </Box>{' '}
            {/* End Scrollable Box */}
          </Box>
        </Box>
      </Grid>

      {/* Right Side: Theme and Color Settings */}
      <Grid item xs={3}>
        <Box sx={{ padding: 4, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', width: '100%' }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Themes</FormLabel>
            <RadioGroup row value={theme} onChange={handleThemeChange}>
              <FormControlLabel value="modern" control={<Radio />} label="Modern" />
              <FormControlLabel value="stylish" control={<Radio />} label="Stylish" />
              <FormControlLabel value="advanced-gst" control={<Radio />} label="Advanced GST (Tally)" />
              <FormControlLabel value="custom" control={<Radio />} label="Create Custom Theme" />
            </RadioGroup>

            {theme === 'custom' && (
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
              sx={{ display: 'flex', flexWrap: 'wrap' }}
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
                control={<Checkbox checked={settings.showPartyBalance} onChange={handleSettingsChange} name="showPartyBalance" />}
                label="Show Party Balance"
              />
              <FormControlLabel
                control={<Checkbox checked={settings.enableFreeQty} onChange={handleSettingsChange} name="enableFreeQty" />}
                label="Enable Free Quantity"
              />
              <FormControlLabel
                control={<Checkbox checked={settings.showItemDescription} onChange={handleSettingsChange} name="showItemDescription" />}
                label="Show Item Description"
              />
            </FormGroup>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Invoice;
