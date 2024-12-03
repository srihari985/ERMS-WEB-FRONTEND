import React, { useState, useEffect } from "react";
import {Table, Typography,TableBody,Skeleton ,CircularProgress,TableCell,MenuItem,Select,TableContainer,TableHead,TableRow,Paper,Button,InputLabel,FormControl,Card,CardContent,CardHeader,TablePagination,TextField,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';



const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function TechnicianToolsRequestList() {
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

  // Fetch data
  const fetchNewTicketsList = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/toolsRequest/getByTechnician/${technicianId}`);
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
            (q) => new Date(q.date).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.date).toDateString() === yesterday.toDateString()
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

    // Apply search filter based on technicianId or companyName
    if (searchQuery) {
      filteredData = filteredData.filter(
        (q) =>
          q.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.date.toLowerCase().includes(searchQuery.toLowerCase())
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
            Tools Request List
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
              label="Search by Date or Item Name"
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
            {["S.No", "Item Name","Date", "Quantity", "Price", "Total Amount","Status"].map((header) => (
              <TableCell
                key={header}
                style={{
                  fontWeight: "bold",
                  border: "1px solid #ACB4AE",
                  fontSize: "15px",
                  textAlign: "center",
                  backgroundColor: "#DDDCDC",
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
                    {row.itemName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.date}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.quantity}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.price}
                  </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center", padding: '10px',maxHeight: "50px",}}>
                     {row.totalAmount}
                    </TableCell>
                  {/* <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.status === "reqRaise" ? "Closed" : "Open"}
                  </TableCell> */}

                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE",
                      fontSize: "13px",
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "2px",
                      transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    // onClick={() => handleStatusClick(row)}
                  >
                    <span
                      style={{
                        backgroundColor: row.status === "confirm" ? "#0093E9" : "#FF914D",
                        backgroundImage: row.status === "confirm"
                          ? "linear-gradient(135deg, #0093E9, #80D0C7)"
                          : "linear-gradient(135deg, #FF914D, #FF6E40)",
                        padding: "12px 15px",
                        color: "white",
                        fontSize: "13px",
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
                      {row.status === "reqRaise" ? "Open" : "Closed"}
                    </span>
                  </TableCell>
                
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
       
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