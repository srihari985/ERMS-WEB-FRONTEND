import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Button, TextField } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../../AuthProvider";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Import the icon
import ReceiptIcon from '@mui/icons-material/Receipt'; 
import PersonIcon from '@mui/icons-material/Person'; 
import BuildIcon from '@mui/icons-material/Build'; // Technician Icon
import AssignmentIcon from '@mui/icons-material/Assignment'; // Ticket Icon
import { GlobalStyles } from "@mui/system";

// Fetch URL
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const OperationalManagerDashboard = () => {
  const [view, setView] = useState('dashboard');
 
  const [amount, setAmount] = useState(0);
  const [customerList, setCustomerList] = useState(0);
  const [quotations, setQuotations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state
  const navigate = useNavigate();
  const {oTLId : OtechLeadId, userId: techLeadId,setCount } = useAuth();

  const [quotationsCount, setQuotationsCount] = useState(0); //Quotations Count
  const [invoiceCount, setInvoiceCount] = useState(0); //Quotations Count
  const [totalTicketCount, setTotalTicketCount] = useState(0); //Total Count
  const [totalCustomersCount, setTotalCustomersCountt] = useState(0); //Total Count
  const [isLoading, setIsLoading] = useState(false);


  // useEffect(() => {
  //   // Fetch data from the API
  //   const fetchQuotations = async () => {
  //     try {
  //       // const response = await fetch(`${baseUrl}/api/quotationList/quotationDetailsBySaleId/${sId}`);
  //       const response = await fetch(`${baseUrl}/api/ticketAssign/getById/${userId}`);
  //       const data = await response.json();
  //       setQuotations(data);  // Set API data to quotations state
  //     } catch (error) {
  //       console.error("Failed to fetch quotations:", error);
  //     } finally {
  //       setLoading(false);  // Stop loading
  //     }
  //   };

  //   fetchQuotations();
  // }, []);

  // /api/ticketAssign/getById/${techLeadId}
  const fetchNewTicketsList = async () => {
    try {                                     
      const response = await fetch(`${baseUrl}/api/ticket/openNewTicket/${OtechLeadId}`);
      console.log("Response Status:", response.status); // Log the status code
  
      if (response.ok) { // Check if the response is successful
        const data = await response.json();
        console.log("Fetched Data:", data); // Log the data after conversion
  
        // If it's a single object, put it in an array to make it iterable
        const quotationsArray = Array.isArray(data) ? data : [data];
        setQuotations(quotationsArray); // Set the state as an array
        // setFilteredQuotations(quotationsArray); // Set the filtered quotations as an array
      } else {
        console.error("Failed to fetch data. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setQuotations([]); // Reset quotations on error
      // setFilteredQuotations([]); // Reset filtered quotations on error
    }
  };



  //New Tickets Count
  const fetchNewTicketsCount = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/operationTechLead/countNewTickets/${OtechLeadId}`);
      const data = await response.json();
      setQuotationsCount(data)
      setCount(data)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }; 
  //Total Tickets Count
  const fetchTotalCount = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/operationTechLead/getTotalTickets/count/${OtechLeadId}`);
      const data = await response.json();
      setInvoiceCount(data)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  }; 

    //Fetch Completed Count
    const fetchCompletedTicketCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/operationTechLead/getCompletedTickets/count/${techLeadId}`);
        const data = await response.json();
        setTotalTicketCount(data)
      } catch (error) {
        console.error("Error fetching quotations:", error);
      }
    };  

   //Fetch Total Customers Count
   const fetchTotalCustomersCount = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/contactForm/customerList/count/${techLeadId}`);
      const data = await response.json();
      setTotalCustomersCountt(data)
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };
  


  useEffect(() => {
    fetchNewTicketsCount();
    fetchTotalCount();
    fetchCompletedTicketCount();
    fetchTotalCustomersCount();
    fetchNewTicketsList();
    
  }, []);





  //navigate to Quotaions list
  const handleQuotationClick = () => {
    navigate("/SalesQuationList")
  };

  // const handleStatusClick = (row) => {
  //   // Navigate to the QuotationTemplate and pass the row data via state
  //   navigate('/QuotationTemplate', { state: { quotationData: row } });
  // };
  

  const Achievements = () => (
    <Card
      sx={{
        height: '100%',
        boxShadow: 5,
        borderRadius: '16px',
        padding: 2,
        background: 'linear-gradient(135deg, #f5f7fa, #e1e5ee)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 10,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Achievements
        </Typography>
  
        {/* Progress Bars */}
        {[
          { label: 'Target', value: 25, colors: ['#6a1b9a', '#ab47bc'] },
          { label: 'Remaining Target', value: 50, colors: ['#1976d2', '#42a5f5'] },
          { label: 'Completed Target', value: 75, colors: ['#388e3c', '#66bb6a'] },
          { label: 'Incentives', value: 100, colors: ['#ff9800', '#ffc107'] },
        ].map((item, index) => (
          <Box key={index} mb={3}>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 1 }}
            >
              {item.label}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{
                height: '16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                transition: 'width 0.6s ease',
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${item.colors[0]}, ${item.colors[1]})`,
                  borderRadius: '8px',
                },
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
  
  



  const NewTicketsList = () => {
    return (
      <Card
        sx={{
          height: '100%',
          boxShadow: 4,
          borderRadius: '16px',
          backgroundColor: '#f7fafc',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 8,
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{
              color: '#333',
              fontWeight: 'bold',
              fontSize: '24px',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
           
            New Tickets
          </Typography>
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

  
          <TableContainer component={Paper} style={{ maxHeight: '450px', overflowY: 'auto' }} className="custom-sidebar-scrollbar">
          <Table  stickyHeader>
            <TableHead>
              <TableRow>
                {["S.NO","Company Name", "Invoice Number","Ticket No", "Employee Id", "Address", "StartDate","Status"].map((header) => (
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
                  <TableCell colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                      {row.companyName}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                      {row.invoiceNumber || "N/A"}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.ticketNumber}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                      {/* {row.technicianId} */}
                      {row.salesId || row.telecallerId || row.oTechnicalLeadId}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                      {row.address}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                      {row.date}
                    </TableCell>
                    {/* <TableCell style={{ border: "1px solid #ACB4AE", fontSize: "15px", textAlign: "center" }}>
                    {row.endDate ? row.endDate : "N/A"}
                    </TableCell> */}
                    <TableCell
                      style={{
                        border: "1px solid #ACB4AE",
                        fontSize: "15px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      // onClick={() => handleStatusClick(row)}
                    >
                      <span
                        style={{
                          backgroundColor: row.status === "confirm" ? "#C0C0C0" : "#FFEEAA",
                          padding: "5px 10px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {row.status === "confirm" ? "Closed" : "Open"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

        </TableContainer>
        </CardContent>
      </Card>
    );
  };
  

  

  return (
    <Box p={3} mt={8} sx={{ backgroundColor: '#f0f4f7', minHeight: '100vh' }}>
  {view === 'dashboard' ? (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <Card
          sx={{
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6a1b9a, #ab47bc)',
            color: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
            },
          }}
          onClick={() => navigate('/TechLeadTicketsRequest')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
          <InsertDriveFileIcon sx={{ fontSize: '30px', marginRight: '10px', color:'white' }} />
            <Typography variant="h6">New Tickets</Typography>
            <Box
            sx={{
            width: '42px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#A670C5', // Gradient background
            color: 'white',
            borderRadius: '50%',  // Fully rounded
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
            fontSize: '18px',  // Adjust font size for the count
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft:'10px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',  // Slightly larger on hover
              boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',  // Increase shadow on hover
            },
          }}
        >
          {quotationsCount}
        </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card
          sx={{
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
            },
          }}
          onClick={() => navigate('/TechLeadTicketsHistory')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: '30px', marginRight: '10px' }} />
            <Typography variant="h6">Total Tickets</Typography>
            <Box
            sx={{
            width: '42px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#6697E6', // Gradient background
            color: 'white',
            borderRadius: '50%',  // Fully rounded
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
            fontSize: '18px',  // Adjust font size for the count
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft:'10px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',  // Slightly larger on hover
              boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',  // Increase shadow on hover
            },
          }}
        >
          {invoiceCount}
        </Box>
            
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card
          sx={{
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
            color: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
            },
          }}
          onClick={() => navigate('/TechLead_CompletedTickets')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: '30px', marginLeft: '10px' }} />
            <Typography variant="h6">Completed Tickets</Typography>
            <Box
            sx={{
            width: '42px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#9ADB81', // Gradient background
            color: 'white',
            borderRadius: '50%',  // Fully rounded
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
            fontSize: '18px',  // Adjust font size for the count
            fontWeight: 'bold',
            cursor: 'pointer',
            marginLeft:'40px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',  // Slightly larger on hover
              boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',  // Increase shadow on hover
            },
          }}
        >
          {totalTicketCount}
        </Box>
           
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
  <Card
    sx={{
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #ff8f00, #ffca28)',
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
      },
    }}
    onClick={() => navigate('/ListCustomer')}
  >
    <CardContent
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px', // Add space between icon, text, and count
      }}
    >
      <PersonIcon sx={{ fontSize: '30px', color: 'white' }} />
      <Typography variant="h6">Customer List</Typography>
      <Box
        sx={{
          width: '42px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F4D452', // Gradient background
          color: 'white',
          borderRadius: '50%', // Fully rounded
          boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
          fontSize: '18px', // Adjust font size for the count
          fontWeight: 'bold',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.1)', // Slightly larger on hover
            boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)', // Increase shadow on hover
          },
        }}
      >
        {totalCustomersCount}
      </Box>
    </CardContent>
  </Card>
</Grid>

      <Grid item xs={12} sm={isExpanded ? 6 : 9}>
        <NewTicketsList />
      </Grid>
      <Grid item xs={12} sm={isExpanded ? 6 : 3}>
        <Achievements />
      </Grid>
    </Grid>
  ) : view === 'quotations' ? (
    <NewTicketsList />
  ) : null}
</Box>

  );
};

export default OperationalManagerDashboard;