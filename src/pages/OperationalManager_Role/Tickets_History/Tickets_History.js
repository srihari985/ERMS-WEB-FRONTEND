import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  MenuItem,
  Tabs,
  Tab,
  Select,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  FormControl,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function TechLeadTicketsHistory() {
  const [tabIndex, setTabIndex] = useState(0);
  const [quotations, setQuotations] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [telecallerData, setTelecallerData] = useState([]);
  const [techLeadData, setTechLeadData] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { oTLId : OtechLeadId,} = useAuth();

  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/getAll/${OtechLeadId}`);
      const data = await response.json();
      setQuotations(data);

      // Filter data for tabs
      const sales = data.filter((item) => item.salesId?.startsWith("SALES"));
      const telecallers = data.filter((item) => item.telecallerId?.startsWith("TEL"));
      const techLead = data.filter((item) => item.oTechnicalLeadId?.startsWith("OTECHL"));

      setSalesData(sales);
      setTelecallerData(telecallers);
      setTechLeadData(techLead);
      setFilteredQuotations(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const applyFilters = () => {
    const now = new Date();
    let filteredData = [...quotations];

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
          filteredData = filteredData.filter((q) => new Date(q.date) >= lastWeek);
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredData = filteredData.filter((q) => new Date(q.date) >= lastMonth);
          break;
        default:
          break;
      }
    }

    // Apply search query filter
    if (searchQuery) {
      filteredData = filteredData.filter(
        (q) =>
          q.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuotations(filteredData);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dateRange, searchQuery, quotations]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCurrentTabData = () => {
    switch (tabIndex) {
      case 0:
        return salesData;
      case 1:
        return telecallerData;
      case 2:
        return techLeadData;
      default:
        return [];
    }
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
          <Typography variant="h4" style={{ fontWeight: "bold", textAlign: "left" }}>
            Tickets History
          </Typography>
        }
      />
      <CardContent>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
          <Tab sx={{ fontWeight: "bold", fontSize: "13px" }} label="Sales Tickets History" />
          <Tab sx={{ fontWeight: "bold", fontSize: "13px" }} label="Telecaller Tickets History" />
          <Tab sx={{ fontWeight: "bold", fontSize: "13px" }} label="TechLead Tickets History" />
        </Tabs>

        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="last365Days">Last 365 Days</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="lastWeek">Last 7 Days</MenuItem>
              <MenuItem value="lastMonth">Last 30 Days</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Search by Ticket, Invoice, or Company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 250 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Ticket Number", "Invoice Number", "Company Name", "Date", "Employee Id", "Status"].map(
                  (header) => (
                    <TableCell
                      align="center"
                      key={header}
                      style={{
                        fontWeight: "bold",
                        border: "1px solid #ACB4AE",
                        fontSize: "17px",
                        textAlign: "center",
                        backgroundColor: "#E5E9E9",
                        color: "black",
                      }}
                    >
                      <strong>{header}</strong>
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {getCurrentTabData()
                .filter((item) => filteredQuotations.includes(item))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.ticketNumber}>
                    <TableCell
                      align="center"
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                      }}
                    >
                      {row.ticketNumber}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                      }}
                    >
                      {row.invoiceNumber || "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                      }}
                    >
                      {row.companyName}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                      }}
                    >
                      {new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                      }}
                    >
                      {tabIndex === 0
                        ? row.salesId
                        : tabIndex === 1
                        ? row.telecallerId
                        : row.oTechnicalLeadId}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                        color: row.status === "close" ? "red" : "green",fontWeight:'bold'
                      }}
                    >
                      {/* {row.status} */}
                      {row.status === "close" ? "Closed" : row.status === "ticketRaise" ? "Ticket Raised" : row.status}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={getCurrentTabData().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
}
