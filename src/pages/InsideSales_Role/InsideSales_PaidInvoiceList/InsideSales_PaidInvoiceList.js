import React, { useState, useEffect } from "react";
import {
  IconButton,Box, Table, Typography, TableBody, TableCell, MenuItem, Select, TableContainer, TableHead, TableRow, Paper, Grid,Button, InputLabel, FormControl, Card, CardContent, CardHeader, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { toast,ToastContainer } from "react-toastify";  // For toast messages, ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';
import { FaRupeeSign } from "react-icons/fa"; // For Rupee icon
import { useAuth } from "../../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function InsideSales_PaidInvoiceList() {
  const navigate = useNavigate();

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState("");
  const { telId } = useAuth();



  // Fetch data
  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/transaction/getHistory/telecaller/${telId}`);
      const data = await response.json();
      setQuotations(data);
      setFilteredQuotations(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  // //Total Paid Amount Count
  // const fetchPaidAmountCount = async () => {
  //   try {
  //     const response = await fetch(`${baseUrl}/api/invoice/getAll/sales/${telId}`);
  //     const data = await response.json();
  //     setPaidAmountCount(data);
      
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
  //   }
  // };
  

  useEffect(() => {
    fetchQuotations();
  }, []);

  const applyFilters = () => {
    let filteredData = [...quotations];
    const now = new Date();
  
    // Apply date range filter
    if (dateRange) {
      switch (dateRange) {
        case "today":
          filteredData = filteredData.filter(
            (q) => new Date(q.paymentDate).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) =>
              new Date(q.paymentDate).toDateString() ===
              yesterday.toDateString()
          );
          break;
        case "lastWeek":
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          filteredData = filteredData.filter(
            (q) => new Date(q.paymentDate) >= lastWeek
          );
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.paymentDate) >= lastMonth
          );
          break;
        default:
          break;
      }
    }
  
    // Apply search filter based on empId, partyName, or paymentDate
    if (searchQuery) {
      filteredData = filteredData.filter((q) => {
        // Convert paymentDate to a readable string for comparison
        const paymentDateStr = new Date(q.paymentDate).toLocaleDateString();
  
        return (
          q.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          paymentDateStr.includes(searchQuery) // Search by paymentDate
        );
      });
    }
  
    // Set filtered data
    setFilteredQuotations(filteredData);
  };
  
  useEffect(() => {
    applyFilters();
  }, [dateRange, searchQuery]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <Card style={{ padding: "20px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", marginTop: "5.3%", marginLeft: "15px", marginRight: "15px" }}>
      <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/InsideSales_InvoiceList')} sx={{ color: '#2e2a54' }}>
            <KeyboardBackspaceIcon fontSize="large" />
          </IconButton>
          <Typography variant="h3" component="h3">
            Paid List
          </Typography>
        </Box>
     
     
  
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <FormControl fullWidth variant="outlined" style={{ width: '280px' }}>
              <InputLabel>Date Range</InputLabel>
              <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} label="Date Range">
                <MenuItem value="last365Days">Last 365 Days</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last Week</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="last6Months">Last 6 Months</MenuItem>
                <MenuItem value="lastYear">Last Year</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Search by Invoice No or Party Name" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '280px' }} />
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["S.No", "Contact Person Name", "Invoice Number", "Due Date", "Payment Date", "Invoice Amount", "Amount Paid", "Payment Method","Transaction ID"].map((header) => (
                  <TableCell key={header} style={{ fontWeight: "bold", border: "1px solid #ACB4AE", fontSize: "17px", textAlign: "center", backgroundColor: "#A1F4BD" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.partyName ? row.partyName : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.invoiceNumber ? row.invoiceNumber : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.dueDate ? row.dueDate : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.paymentDate ? row.paymentDate : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.grandToatal ? row.grandToatal : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.paymentAmount ? row.paymentAmount : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.payMethod ? row.payMethod : "Null"}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.transactionId ? row.transactionId : "Null"}</TableCell>
               </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filteredQuotations.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} />

      
    <ToastContainer />
      </CardContent>
    </Card>
  );
}