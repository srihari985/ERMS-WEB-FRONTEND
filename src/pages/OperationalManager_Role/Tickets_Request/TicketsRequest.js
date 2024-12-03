import React, { useState, useEffect } from "react";
import {
  Table, Typography, TableBody, TableCell, MenuItem, Select,Box, TableContainer, TableHead, TableRow, Paper, Button, InputLabel, FormControl, Card, CardContent, CardHeader, TablePagination, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../AuthProvider";
import Swal from "sweetalert2"; // Import SweetAlert2
import { GlobalStyles } from "@mui/system";
import { CircularProgress } from '@mui/material'; // Import CircularProgress



const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function TechLeadTicketsRequest() {
  const navigate = useNavigate();

  // States
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState([]); // Selected technicians
  const [openModal, setOpenModal] = useState(false); // For modal
  const [currentTicket, setCurrentTicket] = useState(null); // Current selected ticket
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState("last365Days");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [phoneNumbers, setPhoneNumbers] = useState({});
  const [employees, setEmployees] = useState([]); 
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const {oTLId : OtechLeadId, userId: techLeadId}=useAuth()
  const [isLoading, setIsLoading] = useState(false); // Loading state

  

  // Fetch data
  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/ticket/openNewTicket/${OtechLeadId}`);
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
      console.log("i am date: "+dateRange)
      switch (dateRange) {
        case "today":
          filteredData = filteredData.filter(
            (q) => new Date(q.date).toDateString() === now.toDateString()
          );
          break;
        case "yesterday":
          const yesterday = new Date(now);
          console.log("Yserday date :"+yesterday )
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
          q.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Handle Assign Ticket button click
  const handleAssignClick = (ticket) => {
    setCurrentTicket(ticket);
    setOpenModal(true); // Open modal
    fetchEmployees();
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedTechnicians([]); // Reset technician selection
  };

  // Handle technician selection
  const handleEmployeeChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedEmployees(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handlePhoneChange = (employeeId, phone) => {
    setPhoneNumbers((prevPhones) => ({
      ...prevPhones,
      [employeeId]: phone,
    }));
  };


  //Fetching Technicians List
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/technician/getAll`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // useEffect(() => {
  //   fetchEmployees();
  // }, []);


  // Ticket assignment to Technician
  const handleSubmitAssignment = async () => {
    if (selectedEmployees.length === 0) {
      toast.warn('Please select at least one employee', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
     // Set loading to true when starting the request
    setIsLoading(true);
    // Create an array of selected employees
    const assignedEmployees = selectedEmployees.map((employeeId) => {
      const selectedEmployee = employees.find((emp) => emp.technicianId === employeeId);
      if (selectedEmployee) {
        return {
          id: selectedEmployee.id,
          firstname: selectedEmployee.firstname,
          lastname: selectedEmployee.lastname,
          technicianId: selectedEmployee.technicianId,
        };
      }
      // If no employee is found, return null or handle the case appropriately
      return null;
    }).filter(employee => employee !== null); // Filter out any null values if no employee was found
  
    if (assignedEmployees.length === 0) {
      toast.warn('No valid employees found', {
        position: "top-right",
        autoClose: 2000,
      });
      setIsLoading(false); // Stop loading if validation fails
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/api/ticketAssign/${currentTicket.tId}/${techLeadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the header to send JSON data
        },
        body: JSON.stringify(assignedEmployees), // Convert the data to JSON format
      });
  
      if (response.ok) {
        toast.success('Ticket assigned successfully!', {
          position: "top-right",
          autoClose: 1000,
        });
        handleModalClose();
        fetchQuotations();
      } else {
        toast.error('Failed to assign ticket', {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error('An error occurred while assigning the ticket', {
        position: "top-right",
        autoClose: 3000,
      });
    }finally {
      // Stop loading when the request finishes
      setIsLoading(false);
    }

  };
  
  


  // const handleStatusClick = (row) => {
  //   navigate('/AccountsInvoiceTemplate', { state: { invoiceData: row } });
  // };



   // Function to handle closing the ticket
   const handleCloseTicket = async (row) => {
    // Show confirmation dialog before closing the ticket
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to close ticket ${row.ticketNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!',
      cancelButtonText: 'No, cancel',
    });
  
    // If user confirms, proceed with closing the ticket
    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        formData.append("ticketNumber", row.ticketNumber);  // Append ticketNumber to the FormData
  
        const response = await fetch(`${baseUrl}/api/v1/operationTechLead/close/${techLeadId}`, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          toast.success("Ticket closed successfully!", {
            position: "top-right",
            autoClose: 1000,
          });
          fetchQuotations();
        } else {
          throw new Error("Failed to close the ticket.");
        }
      } catch (error) {
        toast.error(error.message || "Failed to close the ticket.", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } else {
      toast.info("Ticket close action was cancelled.", {
        position: "top-right",
        autoClose: 1000,
      });
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
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", textAlign: "left" }}
          >
            Tickets Requests
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
              label="Company Name or Invoice Number or Ticket Number"
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
                {["S.No", "Company Name", "Contact Person Name", "Date", "Ticket Number", "Invoice Number", "No Of Tech Req", "Status", "Actions", "Close Tickets"].map((header) => (
                  <TableCell
                    key={header}
                    style={{
                      fontWeight: "bold",
                      border: "1px solid #ACB4AE",
                      fontSize: "17px",
                      textAlign: "center",
                      backgroundColor: "#E5E9E9",
                      color: 'black'
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
                    {row.contactPersonName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.ticketNumber}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {/* {row.invoiceNumber} */}
                    {row.invoiceNumber ? row.invoiceNumber : "N/A"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.noOfTechReq}
                  </TableCell>
                  <TableCell
                    style={{
                      border: "1px solid #ACB4AE",
                      fontSize: "15px",
                      textAlign: "center",
                      color: row.status === "ticketRaise" ? "green" : "orange",fontWeight:'bold'
                    }}
                  >
                      {row.status === "ticketRaise" ? "Ticket Raised" : "Ticket Assigned"}
                  </TableCell>
                  {/* <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      style={{ backgroundColor: '#80B0B9' }}
                      onClick={() => handleAssignClick(row)}
                      disabled={row.status === "confirm"} // Disable the button if status is "Ticket Assigned"
                    >
                      {row.status === "ticketRaise" ? "Assign Ticket" : "Ticket Assigned"} 
                    </Button>
                  </TableCell>
                 
                  <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#FF0000", color: "white" }}
                      onClick={() => handleCloseTicket(row)}
                    >
                     
                      {row.status === "ticketRaise" ? "Disabled" : "Close Ticket"}
                    </Button>
                  </TableCell> */}
                <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
  <Button
    variant="outlined"
    style={{
      backgroundColor: row.status === "ticketRaise" ? "#80B0B9" : "lightgray",
      whiteSpace: "nowrap", // Prevent text wrapping
      padding: "6px 12px", // Adjust padding to fit text properly
      fontSize: "14px", // Ensure text size fits within the button
    }}
    onClick={() => handleAssignClick(row)}
    disabled={row.status !== "ticketRaise"}
  >
    {row.status === "ticketRaise" ? "Assign Ticket" : "Ticket Assigned"}
  </Button>
</TableCell>

<TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
  <Button
    variant="contained"
    style={{
      backgroundColor: row.status === "ticketAssigned" ? "#FF0000" : "lightgray",
      color: "white",
      whiteSpace: "nowrap", // Prevent text wrapping
      padding: "6px 12px", // Adjust padding to fit text properly
      fontSize: "14px", // Ensure text size fits within the button
    }}
    onClick={() => handleCloseTicket(row)}
    disabled={row.status !== "ticketAssigned"}
  >
    Close Ticket
  </Button>
</TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredQuotations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Modal for Assigning Technicians */}
        <Dialog 
            open={openModal}
            onClose={handleModalClose}
            maxWidth="md"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                minHeight: '500px',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)', // Deeper shadow
                backgroundColor: '#f4f4f9',
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: '1.85rem',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#1e88e5',
                borderBottom: '2px solid #eee',
                paddingBottom: '10px',
              }}
            >
              Assign Ticket to Technicians
            </DialogTitle>

            

            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mt: 2,
              }}
            >
              <GlobalStyles
            styles={{
              '.custom-sidebar-scrollbar': {
                scrollbarWidth: 'thin', // For Firefox
                scrollbarColor: 'grey #e0e0e0',
              },
              '.custom-sidebar-scrollbar::-webkit-scrollbar': {
                width: '6px', // For WebKit-based browsers
              },
              '.custom-sidebar-scrollbar::-webkit-scrollbar-track': {
                background: '#f1f1f1', // Track color
              },
              '.custom-sidebar-scrollbar::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey', // Thumb color
                borderRadius: '10px',
              },
              '.custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
          />
              <FormControl fullWidth>
                <Select
                  multiple
                  value={selectedEmployees}
                  onChange={handleEmployeeChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Select Employees</em>; // Placeholder when no selection
                    }
                    return employees
                      .filter((employee) => selected.includes(employee.technicianId))
                      .map((emp) => `${emp.firstname} ${emp.lastname} (${emp.technicianId})`)
                      .join(', ');
                  }}
                  sx={{
                    minHeight: '60px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#673ab7',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e88e5',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 220, // Limit dropdown height to make it scrollable
                        overflowY: 'auto', // Enable vertical scrolling
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                      },
                      className: 'custom-sidebar-scrollbar',
                    },
                  }}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.technicianId} value={employee.technicianId} >
                      <Checkbox checked={selectedEmployees.indexOf(employee.technicianId) > -1} />
                      <ListItemText primary={`${employee.firstname} ${employee.lastname} (${employee.technicianId})`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>

            <DialogActions
              sx={{
                display: 'flex',
                justifyContent: 'space-between', // Align Cancel and Assign buttons at the left and right
                padding: '16px 24px',
                mt: 2, // Add space between dropdown and buttons
              }}
            >
              <Button
                onClick={handleModalClose}
                variant="outlined"
                sx={{
                  borderColor: '#e91e63', // Custom pink border color for cancel button
                  color: '#e91e63', // Custom pink text color
                  '&:hover': {
                    backgroundColor: '#fce4ec', // Light pink background on hover
                  },
                }}
              >
                Cancel
              </Button>

              {/* <Button
                onClick={handleSubmitAssignment}
                variant="contained"
                sx={{
                  backgroundColor: '#1e88e5', // Blue color for assign button
                  '&:hover': {
                    backgroundColor: '#1565c0', // Darker blue on hover
                  },
                }}
              >
                Assign
              </Button> */}
              <Button
                onClick={handleSubmitAssignment}
                variant="contained"
                sx={{
                  backgroundColor: '#1e88e5', // Blue color for assign button
                  '&:hover': {
                    backgroundColor: '#1565c0', // Darker blue on hover
                  },
                }}
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Display loader
                ) : (
                  'Assign' // Button text when not loading
                )}
              </Button>

            </DialogActions>
          </Dialog>


          {/* <ToastContainer /> */}

      </CardContent>
      <ToastContainer />
    </Card>
  );
}