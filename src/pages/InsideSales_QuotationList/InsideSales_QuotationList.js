import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation

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

export default function InsideSales_QuotationList() {
  const navigate = useNavigate(); // For navigation

  // States for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Show 5 rows per page by default

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page number to 0 when rows per page change
  };

  const handleCreateQuotation = () => {
    navigate("/InsideSales_QuotationForm"); // Navigate to the create quotation page
  };

  // Pagination logic
  const paginatedQuotations = quotations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            Quotation List
          </Typography>
        }
      />
      <CardContent>
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

            {/* Status Dropdown */}
            <FormControl
              fullWidth
              variant="outlined"
              style={{ minWidth: "200px" }}
            >
              <InputLabel>Show Open Quotation</InputLabel>
              <Select defaultValue="open" label="Show Open Quotation">
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Create Quotation Button */}
          <Button
            variant="contained"
           
            onClick={handleCreateQuotation}
            style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
          >
            Create Quotation
          </Button>
        </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", 
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
                    border: "1px solid #ACB4AE", 
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Quotation Number
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    border: "1px solid #ACB4AE", 
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
                    border: "1px solid #ACB4AE", 
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
                    border: "1px solid #ACB4AE", 
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
                    border: "1px solid #ACB4AE", 
                    fontSize: "17px",
                    textAlign: "center",
                    backgroundColor: "#A1F4BD",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedQuotations.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE", 
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {row.date}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE", 
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {row.number}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE", 
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {row.party}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE", 
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {row.dueIn}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE", 
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {row.amount}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE", 
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          row.status === "Open" ? "#FFEEAA" : "#C0C0C0",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={quotations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        />
      </CardContent>
    </Card>
  );
}
