import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  MenuItem,
  Select,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardHeader,
  TablePagination,
  TextField,
  Tabs,
  Tab,Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";  // For toast messages, ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function AccountsInvoiceList() {
  const navigate = useNavigate();

  // States
  const [tabIndex, setTabIndex] = useState(0); // Tab index for switching
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch data
 
  const fetchQuotations = async () => {
    try {
      const endpoint = `${baseUrl}/api/invoice/getAll`;
      const response = await fetch(endpoint);
      const data = await response.json();
  
      // Filter data based on `empId` when switching between tabs
      let filteredData = [];
      if (tabIndex === 0) {
        // Filter for "Sales" empId
        filteredData = data.filter((item) => item.empId.startsWith("SALES"));
      } else if (tabIndex === 1) {
        // Filter for "TEL" empId
        filteredData = data.filter((item) => item.empId.startsWith("TEL"));
      }
  
      // Set the filtered data to state
      setQuotations(filteredData);
      setFilteredQuotations(filteredData);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  

  useEffect(() => {
    fetchQuotations();
  }, [tabIndex]); // Refetch data when tab index changes

  const applyFilters = () => {
    let filteredData = [...quotations];
    const now = new Date();

    // Apply date range filter
    if (dateRange) {
      switch (dateRange) {
        case "today":
          filteredData = filteredData.filter(
            (q) => new Date(q.date).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) =>
              new Date(q.date).toDateString() ===
              yesterday.toDateString()
          );
          break;
        case "lastWeek":
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          filteredData = filteredData.filter(
            (q) => new Date(q.date) >= lastWeek
          );
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.date) >= lastMonth
          );
          break;
        default:
          break;
      }
    }

    // Apply search filter based on empId or partyName
    if (searchQuery) {
      filteredData = filteredData.filter(
        (q) =>
          q.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.partyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Set filtered data
    setFilteredQuotations(filteredData);
  };

  // Apply filters whenever dateRange or searchQuery changes
  useEffect(() => {
    applyFilters();
  }, [dateRange, searchQuery, quotations]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusClick = (row) => {
    navigate('/AccountsInvoiceTemplate', { state: { invoiceData: row } });
  };

  const handleTelecallerStatusClick = (row) => {
    navigate('/AccountsTelecallerInvoiceTemplate', { state: { invoiceData: row } });
  };

  //payments Click
  const handlePaymentsClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

   // Close the dialog
   const handleClose = () => {
    setOpenDialog(false);
  };


  //Payments API
  const handlePayment = async () => {
   
    const formData = new FormData();
    formData.append("invoiceNumber", selectedRow.invoiceNumber);
    formData.append("paymentAmount", paymentAmount);
    formData.append("dueDate", dueDate);
    formData.append("transactionId", transactionId);
    formData.append("payMethod", payMethod);
    formData.append("paymentDate", paymentDate);


  try {
    // Call the API to submit the form data (replace with your actual API endpoint)
    const response = await fetch(`${baseUrl}/api/transaction/save`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      toast.success('Payment information submitted successfully!');
      setOpenDialog(false); // Close the dialog on success
    } else {
      throw new Error('Failed to submit payment data');
    }
  } catch (error) {
    console.error('Error submitting payment data:', error);
    toast.error('Failed to submit payment data.');
  }
  
  // Close the dialog after successful submission
  handleClose();

};




  return (
    <Card
      style={{
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "5.3%",
        marginLeft: "15px",
        marginRight: "15px",
      }}
    >
      

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} indicatorColor="primary" textColor="primary">
        <Tab sx={{fontWeight:'bold',fontSize:'13px'}} label="Sales Invoice" />
        <Tab sx={{fontWeight:'bold',fontSize:'13px'}} label="Telecaller Invoice" />
      </Tabs>


      <CardContent>
        <Typography variant="h4" style={{ marginBottom: "10px",textAlign:'center',fontWeight:'bold' }}>
         {tabIndex === 0 ? "Sales Invoice List" : "Telecaller Invoice List"}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* Date Filter */}
            <FormControl fullWidth variant="outlined" style={{ width: '280px' }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label="Date Range"
              >
                <MenuItem value="last365Days">Last 365 Days</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last Week</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="last6Months">Last 6 Months</MenuItem>
                <MenuItem value="lastYear">Last Year</MenuItem>
              </Select>
            </FormControl>

            {/* Search Field */}
            <TextField
              label="Search by Emp ID or Party Name"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '280px' }}
            />
          </div>
        </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["S.No", "Date", "Emp Id", "Invoice Number", "Party Name", "Amount", "Status", "Payments"].map((header) => (
                  <TableCell
                    key={header}
                    style={{
                      fontWeight: "bold",
                      border: "1px solid #ACB4AE",
                      fontSize: "17px",
                      textAlign: "center",
                      backgroundColor: "#E7E7E7",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.date}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.empId}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.invoiceNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.partyName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.grandTotal}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE",
                      fontSize: "13px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "7px",
                    }}
                    // onClick={() => handleStatusClick(row)}
                    onClick={() => tabIndex === 0 ? handleStatusClick(row) : handleTelecallerStatusClick(row)}
                  >
                    
                    <span
                      style={{
                        backgroundColor: row.status === "confirm" ? "#0093E9" : "#FF914D",
                        backgroundImage: row.status === "confirm" 
                          ? "linear-gradient(135deg, #0093E9, #80D0C7)"
                          : "linear-gradient(135deg, #FF914D, #FF6E40)",
                        padding: "9px 15px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        fontSize: "15px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                        color: "#FFFFFF",
                        display: "inline-block",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {row.status === "confirm" ? "Closed" : "Open"}
                    </span>
                  </TableCell>

                  <TableCell style={{ border: '1px solid #ACB4AE', fontSize: '15px', textAlign: 'center', }}>
                  <Button variant="contained" style={{color:'white', backgroundColor:"#6ACB7D", fontWeight:'bold', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",}} onClick={() => handlePaymentsClick(row)}>Payments</Button>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredQuotations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />


         {/* Dialog for Payments */}
         <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Make Payment for Invoice {selectedRow?.invoiceNumber}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', marginTop: '15px' }}>
          <TextField
            label="Amount Paid"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            variant="outlined"
            fullWidth
            error={!!errors.paymentAmount}
            helperText={errors.paymentAmount}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Payment Method"
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
            variant="outlined"
            fullWidth
            error={!!errors.payMethod}
            helperText={errors.payMethod}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
          />
          <TextField
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.paymentDate}
            helperText={errors.paymentDate}
          />

        </div>
        <TextField
          label="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          variant="outlined"
          fullWidth
          error={!!errors.transactionId}
          helperText={errors.transactionId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handlePayment} color="primary" variant="contained">Submit</Button>
      </DialogActions>
        </Dialog>

        <ToastContainer />
      </CardContent>
    </Card>
  );
}