import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function AccountsQuotationList() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [telecallerQuotations, setTelecallerQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const { setquotationDetails } = useAuth();
  const { sId } = useAuth();

  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/quotationList/getAll`);
      const data = await response.json();
      setQuotations(data);
      setFilteredQuotations(data);
    } catch (error) {
      console.error("Error fetching sales quotations:", error);
    }
  };

  const fetchTelecallerQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/telecaller/quotationList/getAll`);
      const data = await response.json();
      setTelecallerQuotations(data);
      setFilteredQuotations(data);
    } catch (error) {
      console.error("Error fetching telecaller quotations:", error);
    }
  };

  useEffect(() => {
    if (tabIndex === 0) fetchQuotations();
    else fetchTelecallerQuotations();
  }, [tabIndex]);

  const applyFilters = () => {
    const now = new Date();
    let filteredData = tabIndex === 0 ? [...quotations] : [...telecallerQuotations];

    if (dateRange) {
      switch (dateRange) {
        case "today":
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate).toDateString() === yesterday.toDateString()
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
    setFilteredQuotations(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [dateRange, tabIndex]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusClick = (row) => {
    navigate('/AccountsQuotationTemplate', { state: { quotationData: row } });
  };

  const handleTelecallerStatusClick = (row) => {
    navigate('/AccountsTelecallerQuotationTemplate', { state: { quotationData: row } });
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
      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
        <Tab sx={{fontWeight:'bold',fontSize:'13px'}} label="Sales Quotations" />
        <Tab sx={{fontWeight:'bold',fontSize:'13px'}} label="Telecaller Quotations" />
      </Tabs>
      <CardContent>

         {/* Conditional Title Based on Tab Index */}
         <Typography variant="h4" style={{ marginBottom: "10px",textAlign:'center',fontWeight:'bold' }}>
          {tabIndex === 0 ? "Sales Quotation List" : "Telecaller Quotation List"}
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
        </div>
        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["Date", "Quotation Number", "Party Name", "Due In", "Amount", "Status"].map((header) => (
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
                    {row.quotationDate}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.quotationNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.customerName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.dueDate}
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
                      transition: "background-color 0.3s ease, transform 0.2s ease",
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredQuotations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CardContent>
    </Card>
  );
}
