import React, { useState, useEffect } from "react";
import {Table, Typography,TableBody,Skeleton ,CircularProgress,TableCell,MenuItem,Select,TableContainer,TableHead,TableRow,Paper,Button,InputLabel,FormControl,Card,CardContent,CardHeader,TablePagination,TextField,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";
import { toast, ToastContainer } from 'react-toastify';

import TicketDialog from "./TicketDialog";



const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function TechnicianNewTickets() {
  const navigate = useNavigate();

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const { userId: technicianId } = useAuth();
  const [loading, setLoading] = useState(true); // Loading state
  const skeletonRows = 5; // Number of skeleton rows
  const skeletonCols = 8; // Number of columns
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Fetch data
  const fetchNewTicketsList = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticketAssign/getById/${technicianId}`);
      console.log("Response Status:", response.status); // Log the status code
  
      if (response.ok) { // Check if the response is successful
        const data = await response.json();
        console.log("Fetched Data:", data); // Log the data after conversion
  
        // If it's a single object, put it in an array to make it iterable
        const quotationsArray = Array.isArray(data) ? data : [data];
        setQuotations(quotationsArray); // Set the state as an array
        setFilteredQuotations(quotationsArray); // Set the filtered quotations as an array
      } else {
        console.error("Failed to fetch data. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setQuotations([]); // Reset quotations on error
      setFilteredQuotations([]); // Reset filtered quotations on error
    }
  };
  

  useEffect(() => {
    fetchNewTicketsList();
    setTimeout(() => {
      setLoading(false); // Set loading to false after data is fetched
    }, 10); // 2-second delay
  }, [technicianId]); // Re-run when technicianId changes

  const applyFilters = () => {
    if (!Array.isArray(quotations)) return; // Guard clause for non-array quotations

    let filteredData = [...quotations]; // Copy quotations to avoid mutation

    const now = new Date();

    // Apply date range filter
    if (dateRange) {
      switch (dateRange) {
        case "today":
          filteredData = filteredData.filter(
            (q) => new Date(q.startDate).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.startDate).toDateString() === yesterday.toDateString()
          );
          break;
        case "lastWeek":
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          filteredData = filteredData.filter(
            (q) => new Date(q.startDate) >= lastWeek
          );
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.startDate) >= lastMonth
          );
          break;
        default:
          break;
      }
    }

    // Apply search filter based on technicianId or companyName
    if (searchQuery) {
      filteredData = filteredData.filter(
        (q) =>
          q.technicianId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    console.log("Filtered Data:", filteredData); // Log filtered data

    // Set the filtered data
    setFilteredQuotations(filteredData);
  };

  // Apply filters whenever dateRange or searchQuery changes
  useEffect(() => {
    applyFilters();
  }, [dateRange, searchQuery, quotations]); // Re-run filters when quotations change

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  

  const handleStatusClick = (row) => {
    setSelectedRowData(row)
    setDialogOpen(true); // Open dialog on status click
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
  };
  

  //navigating to Material Request
  const handleMaterialClick = (row) => {
    navigate('/TechnicianMaterialRequest', { state: { row } });
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
      <CardHeader
        title={
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", textAlign: "left" }}
          >
            New Tickets
          </Typography>
        }
      />
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
      <Table>
        <TableHead>
          <TableRow>
            {["S.No", "Company Name", "Invoice Number", "Technician Id", "Address", "Start Date", "End Date", "Status", "Actions","Material Request"].map((header) => (
              <TableCell
                key={header}
                style={{
                  fontWeight: "bold",
                  border: "1px solid #ACB4AE",
                  fontSize: "12px",
                  textAlign: "center",
                  backgroundColor: "#A1F4BD",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from(new Array(skeletonRows)).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from(new Array(skeletonCols)).map((_, colIndex) => (
                    <TableCell key={colIndex} style={{ padding: "10px", textAlign: "center" }}>
                      <Skeleton variant="rectangular" height={25} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : // Render actual data here if not loading
              filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.companyName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.invoiceNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.technicianId}
                  </TableCell>
                                      <TableCell 
                      style={{ 
                        border: "1px solid #ACB4AE", 
                        fontSize: "15px", 
                        textAlign: "center", 
                        padding: '10px',
                        maxHeight: "50px",  // Control the visible area
                        overflow: "hidden",  // Hide overflow visually
                      }}
                    >
                      <div 
                        style={{
                          maxHeight: "50px",  // Control the height of the content area
                          overflowY: "auto",  // Enable vertical scrolling
                          whiteSpace: "normal",  // Allow text to wrap
                          wordBreak: "break-word",  // Ensure long words break correctly
                        }}
                      >
                        {row.address.substring(0, 15)}{/* Display first 30 characters */}
                        <span>{row.address.length > 30 ? row.address.substring(30) : ''}</span> {/* Remaining text scrollable */}
                      </div>
                    </TableCell>



                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.startDate}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.endDate ? row.endDate : "N/A"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.status === "confirm" ? "Closed" : "Open"}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE",
                      fontSize: "13px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "2px",
                      transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    onClick={() => handleStatusClick(row)}
                  >
                    <span
                      style={{
                        backgroundColor: row.status === "confirm" ? "#0093E9" : "#FF914D",
                        backgroundImage: row.status === "confirm"
                          ? "linear-gradient(135deg, #0093E9, #80D0C7)"
                          : "linear-gradient(135deg, #FF914D, #FF6E40)",
                        padding: "10px 11px",
                        color: "white",
                        fontSize: "8px",
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
                      close Ticket
                    </span>
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE",
                      fontSize: "13px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "2px",
                      transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    onClick={() => handleMaterialClick(row)}
                  >
                    <span
                      style={{
                        backgroundColor: row.status === "confirm" ? "#0093E9" : "#FF914D",
                        backgroundImage: row.status === "confirm"
                          ? "linear-gradient(135deg, #0093E9, #80D0C7)"
                          : "linear-gradient(135deg, #FF914D, #FF6E40)",
                        padding: "10px 11px",
                        color: "white",
                        fontSize: "8px",
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
                      Material 
                    </span>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TicketDialog open={dialogOpen} onClose={handleCloseDialog}  rowData={selectedRowData}/>
       
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredQuotations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
      <ToastContainer/>

    </Card>
  );
}