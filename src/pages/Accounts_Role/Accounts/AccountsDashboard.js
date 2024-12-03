import React, { useState ,useEffect} from 'react';
import { Notifications, AccountCircle } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../../AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { textAlign } from '@mui/system';
import {
  Table, Typography, TableBody, TableCell, MenuItem, Select, TableContainer, TableHead, TableRow, Paper, Grid,Button, InputLabel, FormControl, Card, CardContent, CardHeader, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { toast,ToastContainer } from "react-toastify";  // For toast messages, ensure you have react-toastify installed
import 'react-toastify/dist/ReactToastify.css';
import { FaRupeeSign } from "react-icons/fa"; // For Rupee icon
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Import the dayjs adapter\



const baseUrl = process.env.REACT_APP_API_BASE_URL;
const AccountsDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0); //Quotations Count
  const {setAccCount} = useAuth();
  const navigate = useNavigate();

  // newely code
  
  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { sId, userId:salesId } = useAuth();

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
    navigate('/SalesInvoiceTemplate', { state: { invoiceData: row } });
  };

  // Open modal for Ticket Assignment
  const handleTicketAssign = (row) => {
    setSelectedTicket(row); 
    console.log("ia m tick row FID details :"+ row.fId)
    console.log("ia m tick row SID details :"+ row.sId)
    console.log("ia m tick row PARTYNAME details :"+ row.partyName)
   
    setOpen(true);
  };







  const getTodayPaidAmount = async () => {
    try {
      // Get today's date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
  
      // Construct the API endpoint with today's date in the required format
      const apiEndpoint = `${baseUrl}/api/v1/accounts/totalThisMonthPaidInYear/${year}-${month}-${day}`;
  
      // Fetch the data from the API
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Failed to fetch total paid amount for today');
      }
  
      // Parse the response data
      const data = await response.json();
      setTotalPaidAmount(data);
      console.log('Total paid amount for today:', data);
  
      // You can use the fetched data in your component
      // e.g., set it to state if you are using React
      // setTotalPaidAmount(data);
  
    } catch (error) {
      console.error('Error fetching total paid amount:', error);
    }
  };

  useEffect(() => {
    getTodayPaidAmount();
  }, []);
  

  // Handle form input changes
  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  // Generate a range of years (e.g., from 2000 to the current year)
  const years = Array.from({ length: 25 }, (_, i) => dayjs().year() - i);
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



  const handleDateRangeChange = (e) => {
    const selectedValue = e.target.value;
    setDateRange(selectedValue);
  
    let apiUrl = "";
    const today = new Date();
  
    // Helper function to format the date with leading zeros
    const formatWithLeadingZero = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is 2 digits
      const day = date.getDate().toString().padStart(2, '0'); // Ensure day is 2 digits
      return `${year}-${month}-${day}`;
    };
  
    let formattedDate = formatWithLeadingZero(today);
  
    switch (selectedValue) {
      case "today":
        apiUrl = `${baseUrl}/api/v1/accounts/totalTodayPaidInYear/${formattedDate}`;
        break;
      case "yesterday":
        // const yesterday = new Date(today);
        // yesterday.setDate(today.getDate() - 1);
        // formattedDate = formatWithLeadingZero(yesterday);
        apiUrl = `${baseUrl}/api/v1/accounts/totalYesterdayPaidInYear/${formattedDate}`;
        break;
      case "lastWeek":
        // const lastWeek = new Date(today);
        // lastWeek.setDate(today.getDate() - 7);
        // formattedDate = formatWithLeadingZero(lastWeek);
        apiUrl = `${baseUrl}/api/v1/accounts/totalLastWeekPaidInYear/${formattedDate}`;
        break;
      case "CurrentMonth":
        // For the current month, no need to change the month
        // const currentMonth = new Date(today);
        // formattedDate = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-01`; // Start of the current month
        apiUrl = `${baseUrl}/api/v1/accounts/totalThisMonthPaidInYear/${formattedDate}`;
        break;
      case "lastMonth":
        // For the last month, we need to subtract one month
        // const lastMonth = new Date(today);
        // lastMonth.setMonth(today.getMonth() - 1);
        // formattedDate = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, '0')}-01`; // Start of the last month
        apiUrl = `${baseUrl}/api/v1/accounts/totalLastMonthPaidInYear/${formattedDate}`;
        break;
      case "last6Months":
        // const last6Months = new Date(today);
        // last6Months.setMonth(today.getMonth() - 6);
        // formattedDate = formatWithLeadingZero(last6Months);
        apiUrl = `${baseUrl}/api/v1/accounts/totalLastSixMonthsPaidInYear/${formattedDate}`;
        break;
      case "last365Days":
        // const lastYear = new Date(today);
        // lastYear.setFullYear(today.getFullYear() - 1);
        // formattedDate = formatWithLeadingZero(lastYear);
        apiUrl = `${baseUrl}/api/v1/accounts/totalLastListPaidInYear/${formattedDate}`;
        break;
      case "CurrentFinancialYear":
        // const currentYear = today.getFullYear();
        apiUrl = `${baseUrl}/api/v1/accounts/totalCurrentFinancialPaid/${formattedDate}`; // Assuming financial year starts from April
        break;
      case "PreviousFinancialYear":
        // const previousYear = today.getFullYear() - 1;
        apiUrl = `${baseUrl}/api/v1/accounts/totalPreviousFinancialPaid/${formattedDate}`;
        break;
      default:
        break;
    }
  
    // Fetch API call
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Assuming the API returns the total paid amount in the `totalPaid` field
        setTotalPaidAmount(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  









  return (
    <div style={{ display: 'flex' }}>
      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px', backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9' }}>

        {/* Dashboard Cards */}
        <Grid container spacing={3} style={{ marginTop: '30px' }}>
  <Grid item xs={12} sm={2.4}> {/* Adjusted to fit 5 items in a row */}
    <Card style={cardStyles} onClick={() => navigate('/AccountsInvoiceList')}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={titleStyle}>
          Total Sales
        </Typography>
        <Typography variant="h6" style={valueStyle}>
          {totalPaidAmount.grandTotal || '0'}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={2.4}> {/* Adjusted to fit 5 items in a row */}
    <Card style={cardStyles} onClick={() => navigate('/AccountsInvoiceList')}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={titleStyle}>
          Total Purchase
        </Typography>
        <Typography variant="h6" style={valueStyle}>
          {invoiceCount}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={2.4}> {/* Adjusted to fit 5 items in a row */}
    <Card style={cardStyles} onClick={() => navigate('/Accounts_PaidList')}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={titleStyle}>
          Paid
        </Typography>
        <Typography variant="h6" style={valueStyle}>
          {totalPaidAmount.totaPaid || '0'}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={2.4}> {/* Adjusted to fit 5 items in a row */}
    <Card style={cardStyles} onClick={() => navigate('/Accounts_UnPaidList')}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={titleStyle}>
          Unpaid
        </Typography>
        <Typography variant="h6" style={valueStyle}>
          {totalPaidAmount.unPaid || '0'}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* New Grid for Expenses */}
  <Grid item xs={12} sm={2.4}> {/* Adjusted to fit 5 items in a row */}
    <Card style={cardStyles} onClick={() => navigate('/Accounts_ExpensesList')}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={titleStyle}>
          Expenses
        </Typography>
        <Typography variant="h6" style={valueStyle}>
          {totalPaidAmount.expenses || '0'} {/* Replace with the actual expenses value */}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
        </Grid>



      

      {/* newely added code */}
      <CardContent>
      <LocalizationProvider dateAdapter={AdapterDayjs}> {/* Wrap with LocalizationProvider */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <FormControl fullWidth variant="outlined" style={{ width: '280px' }}>
          <InputLabel>Date Range</InputLabel>
          <Select value={dateRange} onChange={handleDateRangeChange} label="Date Range">
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="lastWeek">Last Week</MenuItem>
            <MenuItem value="CurrentMonth">Current Month</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
            <MenuItem value="last6Months">Last 6 Months</MenuItem>
            <MenuItem value="last365Days">Last 365 Days</MenuItem>
            <MenuItem value="CurrentFinancialYear">Current Financial Year</MenuItem>
            <MenuItem value="PreviousFinancialYear">Previous Financial Year</MenuItem>
          </Select>
        </FormControl>

          {/* <TextField label="Search by Emp ID or Party Name" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '280px' }} /> */}

          {/* <div>
               
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
              </div> */}
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

      
    <ToastContainer />
      </CardContent>

      </div>
    </div>
  );
};

// Styles

const cardStyles = {
  background: 'linear-gradient(135deg, #3f51b5 30%, #1de9b6 90%)',
  color: '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
  transition: 'transform 0.3s',
  textAlign:'center',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
  },
};

const titleStyle = {
  fontWeight: 'bold',
  fontSize: '24px',
  color: '#fff',
};

const valueStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#fff',
};

const chartContainerStyle = {
  marginTop: '30px',
  padding: '20px',
  borderRadius: '15px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
};

const chartTitleStyle = {
  fontWeight: '600',
  fontSize: '20px',
  color: '#1976d2',
};

export default AccountsDashboard;