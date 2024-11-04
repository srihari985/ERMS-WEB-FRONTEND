import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Button, TextField } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../AuthProvider";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Import the icon
import ReceiptIcon from '@mui/icons-material/Receipt'; 
import PersonIcon from '@mui/icons-material/Person'; 
import BuildIcon from '@mui/icons-material/Build'; // Technician Icon
import AssignmentIcon from '@mui/icons-material/Assignment'; // Ticket Icon

// Fetch URL
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const SalesDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [quotationCount, setQuotationCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [customerList, setCustomerList] = useState(0);
  const [quotations, setQuotations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state
  const navigate = useNavigate();
  const { sId } = useAuth();


  useEffect(() => {
    // Fetch data from the API
    const fetchQuotations = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/quotationList/quotationDetailsBySaleId/${sId}`);
        const data = await response.json();
        setQuotations(data);  // Set API data to quotations state
        setQuotationCount(data.length);  // Update count based on fetched data
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    // Set static values for demo
    setInvoiceCount(5);
    setAmount(17500);
    setCustomerList(5);

    fetchQuotations();
  }, []);

  const handleQuotationClick = () => {
    navigate("/SalesQuationList")
  };

  

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
  
  



  const QuotationList = () => {
    const [hoveredRow, setHoveredRow] = useState(null);
  
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
           
            Quotation List
          </Typography>
  
          <TableContainer
            component={Paper}
            sx={{
              marginTop: 2,
              maxHeight: 400,
              overflowY: 'auto',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: 2,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Customer Name', 'Quotation Date', 'Quotation No', 'Due In', 'Amount'].map((heading, index) => (
                    <TableCell
                      key={index}
                      style={{
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: '#fff',
                        backgroundColor: '#3f51b5',
                        textAlign: 'center',
                        padding: '10px',
                        border: '1px solid #d6d6d6',
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
  
              <TableBody>
                {quotations.map((row, index) => (
                  <TableRow
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f4f6f8' : '#fff',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell style={{ textAlign: 'center', border: '1px solid #d6d6d6', padding: '12px', fontSize: '15px' }}>
                      {row.customerName}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center', border: '1px solid #d6d6d6', padding: '12px', fontSize: '15px' }}>
                      {row.quotationDate}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center', border: '1px solid #d6d6d6', padding: '12px', fontSize: '15px' }}>
                      {row.quotationNumber}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center', border: '1px solid #d6d6d6', padding: '12px', fontSize: '15px' }}>
                      {row.dueDate}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center', border: '1px solid #d6d6d6', padding: '12px', fontSize: '15px' }}>
                      {row.grandTotal}
                    </TableCell>
                    
                  </TableRow>
                ))}
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
          onClick={handleQuotationClick}
        >
          <CardContent sx={{ textAlign: 'center' }}>
          <InsertDriveFileIcon sx={{ fontSize: '30px', marginRight: '10px', color:'white' }} />
            <Typography variant="h6">{quotationCount} Quotations</Typography>
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
          onClick={() => navigate('/SalesInvoiceList')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: '30px', marginRight: '10px' }} />
            <Typography variant="h6">{invoiceCount} Invoices</Typography>
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
          onClick={() => navigate('/TicketsList')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: '30px', marginLeft: '10px' }} />
            <Typography variant="h6">{amount} Tickets</Typography>
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
          <CardContent sx={{ textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: '30px', marginRight: '10px' }} />
            <Typography variant="h6">{customerList} Customer List</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={isExpanded ? 6 : 9}>
        <QuotationList />
      </Grid>
      <Grid item xs={12} sm={isExpanded ? 6 : 3}>
        <Achievements />
      </Grid>
    </Grid>
  ) : view === 'quotations' ? (
    <QuotationList />
  ) : null}
</Box>

  );
};

export default SalesDashboard;