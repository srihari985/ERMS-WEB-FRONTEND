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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function TechnicianTicketsHistory() {
  const navigate = useNavigate();

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const { userId: technicianId } = useAuth();


  // Fetch data
  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticketAssign/getAll/${technicianId}`);
      const data = await response.json();
      setQuotations(data);
      setFilteredQuotations(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

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
            (q) => new Date(q.startDate).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) =>
              new Date(q.startDate).toDateString() ===
              yesterday.toDateString()
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

    // Apply search filter based on empId or partyName
    if (searchQuery) {
      filteredData = filteredData.filter(
        (q) =>
          q.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Set filtered data
    setFilteredQuotations(filteredData);
  };

  // Apply filters whenever dateRange or searchQuery changes
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
            Total Tickets
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
              label="Search by Company Name or Invoice Number"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '280px' }} // Adjust width if needed
            />
          </div>
        </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["S.No", "Company Name", "Invoice Number", "Ticket Number", "Start Date", "End Date", "Status"].map((header) => (
                  <TableCell
                    key={header}
                    style={{
                      fontWeight: "bold",
                      border: "1px solid #ACB4AE",
                      fontSize: "17px",
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
              {filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                    {row.ticketNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.startDate}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.endDate ? row.endDate : "N/A"}
                </TableCell>
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
                        backgroundColor: row.status === "ticketClose" ? "#EA6B6D" : "#FF914D", // Base colors for status
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
                      {row.status === "ticketClose" ? "Closed" : "Open"}
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
    </Card>
  );
}