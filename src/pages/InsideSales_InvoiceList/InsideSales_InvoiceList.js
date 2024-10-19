import React, { useState, useMemo } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Card,
  CardContent,
  CardHeader,
  TablePagination,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaRupeeSign } from "react-icons/fa"; // For Rupee icon


// Sample data for the table
const quotations = [
  {
    date: "11 Sep 2024",
    number: "MT/QO/24-253",
    party: "ITP DIGITAL SOLUTIONS PVT LTD",
    dueIn: "-",
    amount: "₹ 31,978",
    status: "Open",
  },
  {
    date: "11 Sep 2024",
    number: "MT/QO/24-25/94",
    party: "Imerys Minerals (I) Pvt Ltd – Unit Bhadrachalam",
    dueIn: "30 Days",
    amount: "₹ 21,830",
    status: "Open",
  },
  {
    date: "10 Sep 2024",
    number: "MT/QO/24-25/93",
    party: "Gaian Consultants-Offshore Development Center",
    dueIn: "29 Days",
    amount: "₹ 15,97,450",
    status: "Open",
  },
  {
    date: "10 Sep 2024",
    number: "MT/QO/24-25/92",
    party: "AIM Consultants Pvt.Ltd.",
    dueIn: "29 Days",
    amount: "₹ 800",
    status: "Open",
  },
  {
    date: "09 Sep 2024",
    number: "MT/QO/24-25/91",
    party: "IMERYS CERAMICS INDIA PRIVATE LIMITED",
    dueIn: "5 Days",
    amount: "₹ 5,66,400",
    status: "Open",
  },
  {
    date: "05 Sep 2024",
    number: "MT/QO/24-25/90",
    party: "Qualitus Pharma Solutions",
    dueIn: "24 Days",
    amount: "₹ 17,700",
    status: "Open",
  },
  {
    date: "04 Sep 2024",
    number: "MT/QO/24-25/89",
    party: "FIRST SOURCE LABORATORY SOLUTIONS LLP",
    dueIn: "-",
    amount: "₹ 95,500",
    status: "Open",
  },
];

export default function InsideSales_InvoiceList() {
  const navigate = useNavigate(); // For navigation

  // States for pagination and search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Show 5 rows per page by default
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");

  // Filter data based on search term
  const filteredQuotations = useMemo(
    () =>
      quotations.filter((quotation) =>
        Object.values(quotation).some(
          (value) =>
            value.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "open"
              ? quotation.status === "Open"
              : quotation.status === "Closed")
        )
      ),
    [searchTerm, statusFilter]
  );

  // Handle pagination
  const paginatedQuotations = filteredQuotations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page number to 0 when rows per page change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleCreateQuotation = () => {
    navigate("/QuotationForm"); // Navigate to the create quotation page
  };

  const handlePaidClick = () => {
    navigate("/InsideSales_PaidInvoiceList"); // Change '/PaidList' to the route of your target component
  };

  const handleUnpaidClick = () => {
    navigate("/InsideSales_UnPaidInvoiceList"); // Change '/UnpaidList' to the route of your target component
  };


  return (
    <Card
      style={{
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "6.3%",
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
            Inside Sale Invoice
          </Typography>
        }
      />
      <CardContent>
        {/* Top Cards for Total Sales, Paid, and Unpaid */}
        <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#e3f2fd", textAlign: "center" }}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Total InsideSales
                </Typography>
                <Typography variant="h5" style={{ marginTop: "10px" }}>
                  <FaRupeeSign /> 30,00,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#e8f5e9", textAlign: "center",cursor:'pointer' }}
                  onClick={handlePaidClick}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Paid
                </Typography>
                <Typography style={{ marginTop: "10px" }}>
                  <FaRupeeSign /> 20,00,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#ffebee", textAlign: "center",cursor:'pointer' }}
                  onClick={handleUnpaidClick}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Unpaid
                </Typography>
                <Typography variant="h5" style={{ marginTop: "10px" }}>
                  <FaRupeeSign /> 10,00,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Create Quotation Button */}
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
            <TextField
              label="Last 365 Days"
              type="date"
              defaultValue="2023-09-11"
              InputLabelProps={{ shrink: true }}
              style={{ width: "100%" }} // Add full width
            />

            {/* Search Field */}
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: "100%" }}
            />

            {/* Status Dropdown */}
            <FormControl
              fullWidth
              variant="outlined"
              style={{ minWidth: "200px" }}
            >
              <InputLabel>Show Open Quotation</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusChange}
                label="Show Open Quotation"
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Create Quotation Button */}
          {/* <Button
            variant="contained"
            onClick={handleCreateQuotation}
            style={{
              padding: "10px 20px",
              backgroundColor: "#41CECA",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Create Quotation
          </Button>
        

        {/* Table */}
        </div>
        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Number
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Party Name
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Due In
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Amount
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", // Border on all sides
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedQuotations.map((quotation, index) => (
                <TableRow key={index}>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    {quotation.date}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    {quotation.number}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    {quotation.party}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    {quotation.dueIn}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    {quotation.amount}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    {quotation.status}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center", border: "1px solid #ACB4AE" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Handle view document logic
                      }}
                    >
                      View Document
                    </Button>
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