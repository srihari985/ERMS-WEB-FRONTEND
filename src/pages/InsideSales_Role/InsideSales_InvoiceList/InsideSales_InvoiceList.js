import React, { useState, useEffect } from "react";
import {
  Table, Typography, TableBody, TableCell, MenuItem, Select, TableContainer, TableHead, TableRow, Paper,FormHelperText, Grid,Button, InputLabel, FormControl, Card, CardContent, CardHeader, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";  // For toast messages, ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';
import { FaRupeeSign } from "react-icons/fa"; // For Rupee icon
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Import the dayjs adapter
import { useAuth } from "../../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function InsideSales_InvoiceList() {
  const navigate = useNavigate();

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dateRange, setDateRange] = useState("last365Days");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [techOptions, setTechOptions] = useState([]);
  const { telId, userId:telecallerId } = useAuth();

  // Modal states
  const [open, setOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    purpose: '',
    noOfTechReq: '',
    mobileNumber: '',
    contactPersonName: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [totalPaidAmount,setTotalPaidAmount]=useState(0)
  const staticDay = "01";
  const staticMonth = "01";
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');



  
  // Fetch API data on component mount
  useEffect(() => {
    const fetchTechOptions = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/telecaller/getListOf/OpTechLead/ids`);
        if (response.ok) {
          const data = await response.json();
          setTechOptions(data); // Assuming API returns an array of technician options
        } else {
          console.error('Failed to fetch technician options');
        }
      } catch (error) {
        console.error('Error fetching technician options:', error);
      }
    };

    fetchTechOptions();
  }, [baseUrl]);




  // Fetch data
  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/invoice/getAll/telecaller/${telId}`);
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
            (q) => new Date(q.date).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          filteredData = filteredData.filter(
            (q) =>
              new Date(q.date).toDateString() ===
              yesterday.toDateString()
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

    // Apply search filter based on empId or partyName
    if (searchQuery) {
      filteredData = filteredData.filter(
        (q) =>
          q.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.partyName.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleStatusClick = (row) => {
    navigate('/InsideSales_InvoiceTemplate', { state: { invoiceData: row } });
  };

  // Open modal for Ticket Assignment
  const handleTicketAssign = (row) => {
    setSelectedTicket(row); 
    console.log("ia m tick row FID details :"+ row.fId)
    console.log("ia m tick row SID details :"+ row.telId)
    console.log("ia m tick row PARTYNAME details :"+ row.partyName)
   
    setOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  // Generate a range of years (e.g., from 2000 to the current year)
  const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Handle Year Change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Handle Month Change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };


// API Call function for year, month, and/or telecallerId
const handleDateAPI = async (year, month, telecallerId) => {
  let endpoint = '';

  // Check if both year and month are provided to call the month-based API
  if (year && month) {
    const date = `${year}-${String(month).padStart(2, '0')}-${staticDay}`; // Format YYYY-MM-DD with day as static "01"
    endpoint = `${baseUrl}/api/v1/telecaller/totalPaidInMonth/${date}/${telecallerId}`;
  } 
  // Check if only the year is provided to call the year-based API
  else if (year && !month) {
    const date = `${year}-${staticMonth}-${staticDay}`; // Format YYYY-MM-DD with day as static "01"
    endpoint = `${baseUrl}/api/v1/telecaller/totalPaidInYear/${date}/${telecallerId}`;
  } 
  // If no date components are provided, call the telecallerId-only API
  else if (!year && !month && telecallerId) {
    endpoint = `${baseUrl}/api/v1/telecaller/totalPaid/${telecallerId}`;
  } else {
    console.error("Invalid date selection or missing telecallerId");
    return;
  }

  // Call the appropriate API based on the endpoint
  try {
    const response = await fetch(endpoint, { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      setTotalPaidAmount(data); // Handle data from the response
      console.log("API called successfully:", endpoint);
    } else {
      console.error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Trigger API call based on different conditions
useEffect(() => {
  if (telecallerId && selectedYear && selectedMonth) {
    // Condition 3: telecallerId, year & month
    handleDateAPI(selectedYear, selectedMonth, telecallerId);
  } else if (telecallerId && selectedYear) {
    // Condition 2: telecallerId & year (without month)
    handleDateAPI(selectedYear, null, telecallerId);
  } else if (telecallerId) {
    // Condition 1: Only telecallerId
    handleDateAPI(null, null, telecallerId);
  }
}, [selectedYear, selectedMonth, telecallerId]);


  // Validate the form inputs
  const validate = () => {
    let tempErrors = {};
    if (!ticketData.purpose) tempErrors.purpose = 'Purpose is required';
    if (!ticketData.noOfTechReq) tempErrors.noOfTechReq = 'Number of Technicians is required';
    if (!ticketData.mobileNumber || ticketData.mobileNumber.length !== 10)
      tempErrors.mobileNumber = 'Valid 10-digit Mobile Number is required';
    if (!ticketData.contactPersonName) tempErrors.contactPersonName = 'Contact Person Name is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submit (POST request)
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors.");
      return;
    }
  
    // Creating a new FormData object
    const formData = new FormData();
    formData.append("purpose", ticketData.purpose);
    formData.append("noOfTechReq", ticketData.noOfTechReq);
    formData.append("mobileNumber", ticketData.mobileNumber);
    formData.append("contactPersonName", ticketData.contactPersonName);
  
    try {
      const response = await fetch(`${baseUrl}/api/ticket/save/telecaller/${selectedTicket.fId}/${ticketData.techLeadIds}`, {
        method: "POST",
        body: formData,  // Sending form data as body
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response
  
        // Check for the "status" field in response
        if (responseData.status === "ticketRaise") {
          setTicketData(prevData => ({
            ...prevData,
            status: "ticketRaise"  // Update the status to display "Ticket Raised"
          }));
        }
  
        toast.success('Ticket assigned successfully!', {
          position: "top-right",
          autoClose: 1000,
        });
        setOpen(false);
  
        // Reset form fields after successful submission
        setTicketData({ purpose: '', noOfTechReq: '', mobileNumber: '', contactPersonName: '', status: responseData.status === "ticketRaised" ? "Ticket Raised" : ticketData.status });
      } else {
        throw new Error("Failed to assign ticket");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };
  
  

  const handlePaidClick = () => {
    navigate("/InsideSales_PaidInvoiceList"); // Change '/PaidList' to the route of your target component
  };

  const handleUnpaidClick = () => {
    navigate("/InsideSales_UnPaidInvoiceList"); // Change '/UnpaidList' to the route of your target component
  };

  return (
    <Card style={{ padding: "20px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", marginTop: "5.3%", marginLeft: "15px", marginRight: "15px" }}>
      <CardHeader title={<Typography variant="h4" style={{ fontWeight: "bold", textAlign: "left" }}>Invoice</Typography>} />
     
      {/* Top Cards for Total Sales, Paid, and Unpaid */}
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={4}>
            <Card style={{ backgroundColor: "#e3f2fd", textAlign: "center" }}>
              <CardContent>
                <Typography style={{ fontWeight: "bold", fontSize: "21px" }}>
                  Total Sales
                </Typography>
                <Typography variant="h5" style={{ marginTop: "10px" }}>
                  <FaRupeeSign /> {totalPaidAmount.grandTotal}
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
                  <FaRupeeSign /> {totalPaidAmount.totaPaid}
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
                  <FaRupeeSign /> {totalPaidAmount.unPaid}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
     
      <CardContent>
      <LocalizationProvider dateAdapter={AdapterDayjs}> {/* Wrap with LocalizationProvider */}
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

          <TextField label="Search by Emp ID or Party Name" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '280px' }} />

          <div>
                {/* Year Selector */}
                <TextField
                  select
                  label="Select Year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  style={{ width: '150px', marginRight: '20px' }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Month Selector */}
                <TextField
                  select
                  label="Select Month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  style={{ width: '150px' }}
                  disabled={!selectedYear} // Disable month selection until year is selected
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </TextField>

              
              </div>
        </div>
      </div>
    </LocalizationProvider>

        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["S.No", "Date", "Emp Id", "Invoice Number", "Party Name", "Amount", "Status", "Ticket Assign"].map((header) => (
                  <TableCell key={header} style={{ fontWeight: "bold", border: "1px solid #ACB4AE", fontSize: "17px", textAlign: "center", backgroundColor: "#A1F4BD" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.date}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.empId}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.invoiceNumber}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.partyName}</TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>{row.grandTotal}</TableCell>
                  
                  
                  <TableCell
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "13px",
                        textAlign: "center",
                        cursor: "pointer",
                        padding: "7px",
                        transition: "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={() => handleStatusClick(row)}
                    >
                      <span
                        style={{
                          backgroundColor: ticketData.status === "Closed" ? "#0093E9" : ticketData.status === "ticketRaise" ? "#FFD700" : "#FF914D",
                          backgroundImage: ticketData.status === "Closed"
                            ? "linear-gradient(135deg, #0093E9, #80D0C7)"  // Blue gradient for "Closed"
                            : ticketData.status === "ticketRaise"
                            ? "linear-gradient(135deg, #FFD700, #FFDF00)"  // Yellow gradient for "Ticket Raised"
                            : "linear-gradient(135deg, #FF914D, #FF6E40)",  // Orange gradient for "Open"
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
                        {ticketData.status === "notConfirm" ? "Closed" : ticketData.status === "ticketRaise" ? "Ticket Raised" : "Open"}
                      </span>
                    </TableCell>




                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    <Button variant="contained" color="primary" onClick={() => handleTicketAssign(row)}>Assign</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filteredQuotations.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} />

        {/* Modal for Ticket Assignment */}
        <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="md"  // Sets the width of the modal to medium
    >
      <DialogTitle>Assign Ticket</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="dense"
              name="contactPersonName"
              label="Contact Person Name"
              value={ticketData.contactPersonName}
              onChange={handleChange}
              error={!!errors.contactPersonName}
              helperText={errors.contactPersonName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="dense"
              name="mobileNumber"
              label="Mobile Number"
              value={ticketData.mobileNumber}
              onChange={handleChange}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="dense"
              name="noOfTechReq"
              label="Number of Technicians Required"
              value={ticketData.noOfTechReq}
              onChange={handleChange}
              error={!!errors.noOfTechReq}
              helperText={errors.noOfTechReq}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" error={!!errors.techLeadIds}>
              <InputLabel>Select TechLead Id</InputLabel>
              <Select
                name="techLeadIds"
                value={ticketData.techLeadIds}
                onChange={handleChange}
              >
                {techOptions.map((tech) => (
                   <MenuItem key={tech.id} value={tech.id}>
                   {`${tech.firstname} ${tech.lastname} (${tech.oTechnicalLeadId})`} {/* Format: "firstname lastname (ID)" */}
                 </MenuItem>
                ))}
              </Select>
              {errors.techLeadIds && <FormHelperText>{errors.techLeadIds}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
              <TextField
                  fullWidth
                  margin="dense"
                  name="purpose"
                  label="Purpose"
                  value={ticketData.purpose}
                  onChange={handleChange}
                  error={!!errors.purpose}
                  helperText={errors.purpose}
                  multiline  // Enable multiline text field (textarea)
                  rows={3}   // Specify the number of visible rows
                />
          </Grid>
      
      
       
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
    <ToastContainer />
      </CardContent>
    </Card>
  );
}