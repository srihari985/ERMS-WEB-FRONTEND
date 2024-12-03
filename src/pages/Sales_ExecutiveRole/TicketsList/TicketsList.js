import React, { useState, useEffect } from "react";
import {
  Table, Typography, TableBody, TableCell, MenuItem, Select, TableContainer, TableHead, TableRow, Paper, Grid,Button, InputLabel, FormControl, Card, CardContent, CardHeader, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle,Menu,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";  // For toast messages, ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';
import { FaRupeeSign } from "react-icons/fa"; // For Rupee icon
import { useAuth } from "../../../AuthProvider";
import * as XLSX from "xlsx"; // To export to Excel (this can be replaced by ExcelJS below)
import jsPDF from "jspdf"; // To export to PDF
import "jspdf-autotable"; // To enable autoTable for jsPDF
import ExcelJS from "exceljs"; // To export to Excel using ExcelJS

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function TicketsList() {
 

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState("");
  const { sId } = useAuth();
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const [totalTicketCount, setTotalTicketCount] = useState(0); //Total Count
  const [OpenTicketCount, setOpenTicketCount] = useState(0); //Open Count
  const [closeTicketCount, setCloseTicketCount] = useState(0); //Open Count
 

  // Fetch All Tickets data
  const fetchTickets = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/ticketHistory/${sId}`);
      const data = await response.json();

      const sortedData = data.sort((a, b) => {
        // Extract the numeric part (after the last hyphen) from the ticket number
        const numA = parseInt(a.ticketNumber.split('-').pop(), 10);
        const numB = parseInt(b.ticketNumber.split('-').pop(), 10);
      
        // Compare the extracted numbers
        return numB - numA; // Descending order, largest numbers first
      });
      
      setQuotations(sortedData);
      setFilteredQuotations(sortedData);
      // setTicketData(data.status)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };  



  //Fetch Total Tickets Count
  const fetchTotalTicketCount = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/ticketHistory/count/${sId}`);
      const data = await response.json();
      setTotalTicketCount(data)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };  

  //Fetch Open Tickets Count
  const fetchOpenTicketCount = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/ticketHistory/count/ticketRaise/${sId}`);
      const data = await response.json();
      setOpenTicketCount(data)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }; 

   //Fetch Close Tickets Count
   const fetchCloseTicketCount = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/ticketHistory/count/ticketClose/${sId}`);
      const data = await response.json();
      setCloseTicketCount(data)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }; 

  useEffect(() => {
    fetchTickets();
    fetchTotalTicketCount();
    fetchOpenTicketCount();
    fetchCloseTicketCount();
  }, []);

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
              new Date(q.quotationDate).toDateString() ===
              yesterday.toDateString()
          );
          break;
        case "lastWeek":
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate) >= lastWeek
          );
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate) >= lastMonth
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
          q.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
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



  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  // Export to Excel using ExcelJS
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");
  
    // Define columns for the worksheet
    worksheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Company", key: "companyName", width: 30 },
      { header: "Ticket Number", key: "ticketNumber", width: 20 },
      { header: "Invoice Number", key: "invoiceNumber", width: 25 },
      { header: "Status", key: "status", width: 15 }
    ];
  
    // Set header styles (background color, bold text, and spacing)
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }; // Make the text bold
      cell.alignment = { horizontal: "center", vertical: "middle" }; // Align text in center
      cell.fill = { // Set background color
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" }, // Light green color (can be changed)
      };
      cell.border = { // Add borders for clarity
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  
    // Add data rows
    filteredQuotations.forEach((ticket) => {
      worksheet.addRow({
        date: ticket.date,
        companyName: ticket.companyName,
        ticketNumber: ticket.ticketNumber,
        invoiceNumber: ticket.invoiceNumber,
        status: ticket.status=== "close" ? "Ticket Closed" : "Ticket Raised",
      });
    });
  
    // Download Excel file
    await workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ticketsList.xlsx";
      link.click();
    });
  
    handleExportClose();
  };
  
  

  // Export to PDF using jsPDF and autoTable
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text("Tickets List", 20, 10);

    const tableData = filteredQuotations.map((row) => [
      row.date,
      row.companyName,
      row.ticketNumber,
      row.invoiceNumber,
      row.status === "close" ? "Ticket Closed" : "Ticket Raised",
    ]);

    doc.autoTable({
      head: [["Date", "Company", "Ticket Number", "Invoice Number", "Status"]],
      body: tableData,
    });

    doc.save("ticketsList.pdf");
    handleExportClose();
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(filteredQuotations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = 'ticketsList.json';
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', exportFileName);
    link.click();
    handleExportClose();
  };

  return (
    <Card style={{ padding: "20px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", marginTop: "5.3%", marginLeft: "15px", marginRight: "15px" }}>
      <CardHeader title={<Typography variant="h4" style={{ fontWeight: "bold", textAlign: "left" }}>Tickets List</Typography>} />
     
      {/* Top Cards for Total Sales, Paid, and Unpaid */}
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#e3f2fd", textAlign: "center" }}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Total Tickets
                </Typography>
                <Typography variant="h5" style={{ marginTop: "10px" }}>
                   {totalTicketCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#e8f5e9", textAlign: "center" }}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Open Tickets
                </Typography>
                <Typography style={{ marginTop: "10px" }}>
                  {OpenTicketCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#ffebee", textAlign: "center"}}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Closed Tickets
                </Typography>
                <Typography variant="h5" style={{ marginTop: "10px" }}>
                 {closeTicketCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
     
      <CardContent>
       <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          {/* Left Section: FormControl and TextField */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <FormControl fullWidth variant="outlined" style={{ width: "280px" }}>
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

            <TextField
              label="Invoice No & Ticket No"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "280px" }}
            />
          </div>

          {/* Right Section: Button */}
          <Button
            onClick={handleExportClick}
            variant="contained"
            color="primary"
            size="large"
          >
            Export
          </Button>

          {/* Export Options Menu */}
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
            <MenuItem onClick={exportToPdf}>Export to PDF</MenuItem>
            <MenuItem onClick={exportToJson}>Export to JSON</MenuItem>
          </Menu>
        </div>


        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["S.No", "Date", "Party Name", "Ticket Number", "Invoice Numbere", "Status"].map((header) => (
                  <TableCell key={header} style={{ fontWeight: "bold", border: "1px solid #ACB4AE", fontSize: "17px", textAlign: "center", backgroundColor: "#A1F4BD" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.date}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.companyName}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.ticketNumber}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.invoiceNumber}</TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE",
                      fontSize: "13px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "7px",
                      transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          row.status === "close"
                            ? "red" // Blue for "Closed"
                            : row.status === "ticketRaise"
                            ? "#80E44C" // Yellow for "Ticket Raised"
                            : row.status === "ticketAssigned"
                            ? "#FF914D" // Orange for "Pending"
                            : "#ACB4AE", // Default color
                        // backgroundImage:
                        //   row.status === "Closed"
                        //     ? "red" // Blue gradient for "Closed"
                        //     : row.status === "ticketRaise"
                        //     ? "linear-gradient(135deg, #FFD700, #FFDF00)" // Yellow gradient for "Ticket Raised"
                        //     : row.status === "ticketAssigned"
                        //     ? "linear-gradient(135deg, #FF914D, #FF6E40)" // Orange gradient for "Pending"
                        //     : "none",
                        padding: "9px 12px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        borderRadius: "12px",
                        display: "inline-block",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        transform: "scale(1)",
                        transition: "background 0.2s ease, transform 0.2s ease",
                      }}
                    >
                      {row.status === "ticketRaise"
                        ? "Ticket Raised"
                        : row.status === "ticketAssigned"
                        ? "Ticket Assigned"
                        : "Ticket Closed"}
                    </span>
              </TableCell>


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