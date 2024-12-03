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
  TablePagination,Menu,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";
// import * as XLSX from "xlsx"; // For Excel export
import ExcelJS from "exceljs";
import jsPDF from "jspdf"; // For PDF export
import "jspdf-autotable"; // For PDF table generation

// Fetch URL
const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function InsideSales_QuotationList() {
  const navigate = useNavigate();

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const {setquotationDetails}=useAuth()
  const { telId  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);


  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const isExportMenuOpen = Boolean(exportAnchorEl);

  // Fetch data
  const fetchQuotations = async () => {
    setIsLoading(true); // Start loading before fetching
    try {
      const response = await fetch(`${baseUrl}/api/telecaller/quotationList/${telId }/getAll`);
      if (response.ok) {
        const data = await response.json();
        setQuotations(data); // Update quotations state
        setFilteredQuotations(data); // Update filtered quotations state
      } else {
        console.error("Error fetching quotations:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setIsLoading(false); // Stop loading after fetch is done
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  
  const applyFilters = () => {
    let filteredData = [...quotations];
  
    console.log("Initial Quotations:", quotations);
    console.log("Date Range Selected:", dateRange);
  
    // Apply date range filter
    const now = new Date();
    if (dateRange) {
      switch (dateRange) {
        case "today":
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate).toDateString() === now.toDateString()
          );
          console.log("Filtered Data after 'today':", filteredData);
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate).toDateString() === yesterday.toDateString()
          );
          console.log("Filtered Data after 'yesterday':", filteredData);
          break;
        case "lastWeek":
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate) >= lastWeek
          );
          console.log("Filtered Data after 'lastWeek':", filteredData);
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredData = filteredData.filter(
            (q) => new Date(q.quotationDate) >= lastMonth
          );
          console.log("Filtered Data after 'lastMonth':", filteredData);
          break;
        default:
          break;
      }
    }
  
    // Final output of filtered quotations
    setFilteredQuotations(filteredData);
    console.log("Final Filtered Quotations:", filteredData);
  };
  
  // Call applyFilters whenever dateRange changes
  useEffect(() => {
    applyFilters();
  }, [dateRange]);
  

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusClick = (row) => {
    // Navigate to the QuotationTemplate and pass the row data via state
    navigate('/InsideSales_QuotationTemplate', { state: { quotationData: row } });
  };




  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const exportToExcel = () => {
    const filteredData = filteredQuotations.map(({ quotationDate, quotationNumber, customerName, dueDate, grandTotal, status }) => ({
        quotationDate,  // match the key to the column header key
        quotationNumber,
        customerName,
        dueDate,
        grandTotal,
        status: status === "confirm" ? "Closed" : "Open", // Transform status value
    }));

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Quotations");

    // Add header row
    worksheet.columns = [
        { header: "Quotation Date", key: "quotationDate", width: 15 },
        { header: "Quotation Number", key: "quotationNumber", width: 20 },
        { header: "Party Name", key: "customerName", width: 25 },
        { header: "Due Date", key: "dueDate", width: 15 },
        { header: "Amount", key: "grandTotal", width: 15 },
        { header: "Status", key: "status", width: 15 },
    ];

    // Add rows with data
    filteredData.forEach((data) => worksheet.addRow(data));

    // Apply styles to headers
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }; // Set font to bold
        cell.alignment = { horizontal: "center" }; // Center align header text
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "87CEEB" }, // Sky blue color
        };
    });

    // Write the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "QuotationList.xlsx";
        link.click();
    });

    handleExportClose();
};




  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Quotations", 14, 10);
    doc.autoTable({
      head: [["Quotation Date", "Quotation Number", "Party Name", "Due Date", "Amount", "Status"]],
      body: filteredQuotations.map((row) => [
        row.quotationDate,
        row.quotationNumber,
        row.customerName,
        row.dueDate,
        row.grandTotal,
        row.status === "confirm" ? "Closed" : "Open",
      ]),
    });
    doc.save("QuotationsList.pdf");
    handleExportClose();
  };

  const exportToJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredQuotations, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "QuotationList.json";
    link.click();
    handleExportClose();
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" style={{ fontWeight: "bold", textAlign: "left" }}>
            Quotation List
          </Typography>
          <Button variant="contained" onClick={handleExportClick}>
            Export
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={isExportMenuOpen}
            onClose={handleExportClose}
          >
            <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
            <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
            <MenuItem onClick={exportToJSON}>Export to JSON</MenuItem>
          </Menu>
        </div>
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
            <FormControl fullWidth variant="outlined" style={{width:'280px'}}>
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

          {/* Create Quotation Button */}
          <Button
            variant="contained"
            onClick={() => navigate("/InsideSales_QuotationForm")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#41CECA",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Create Quotation
          </Button>
        </div>

        {/* Table */}
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
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={6} style={{ textAlign: "center", padding: "20px",fontSize:'20px' }}>
            Loading...
          </TableCell>
        </TableRow>
      ) : filteredQuotations.length === 0 ? (
        <TableRow>
          <TableCell colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
            No data available
          </TableCell>
        </TableRow>
      ) : (
        filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                fontSize: "15px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => handleStatusClick(row)}
            >
              <span
                style={{
                  backgroundColor: row.status === "accounts" ? "#C0C0C0" : "#FFEEAA",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                }}
              >
                {row.status === "accounts" ? "Closed" : "Open"}
              </span>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>

  {/* Pagination */}
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