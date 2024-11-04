import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Button, TextField,IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TechnicianDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [quotationCount, setQuotationCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [customerList, setCustomerList] = useState(0);
  const [quotations, setQuotations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setQuotationCount(5);
    setInvoiceCount(5);
    setAmount(17500);
    setCustomerList(5);

    const initialQuotations = [
        { id: 1, ticketNo: 'T001', date: '2024-09-01', customername: 'John Doe', issues: 'Urgent delivery required', status: 'Pending' },
        { id: 2, ticketNo: 'T002', date: '2024-09-02', customername: 'Jane Smith', issues: 'Include additional warranty', status: 'Completed' },
        { id: 3, ticketNo: 'T003', date: '2024-09-03', customername: 'Alice Johnson', issues: 'Gift wrapping needed', status: 'In Progress' },
        { id: 4, ticketNo: 'T004', date: '2024-09-04', customername: 'Robert Brown', issues: 'Express shipping', status: 'Completed' },
        { id: 5, ticketNo: 'T005', date: '2024-09-05', customername: 'Michael Davis', issues: 'Include invoice', status: 'Pending' },
    ];
    setQuotations(initialQuotations);
  }, []);

  const handleQuotationClick = () => {
    setView('quotations');
  };

  const handleBackClick = () => {
    setView('dashboard');
  };
  

  const Achievements = () => (
    <Card sx={{ height: '100%'}}>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
          Tickets Graph
        </Typography>
  
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary"  fontWeight="bold">Tickets</Typography>
          <Box position="relative" display="flex" alignItems="center">
            <LinearProgress
              variant="determinate"
              value={25}
              sx={{
                height: '16px',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'lightgray',
                '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
              }}
            />
            <Box
              position="absolute"
              left="50%"
              top="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant="body2" color="white">
                25%
              </Typography>
            </Box>
          </Box>
        </Box>
  
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary"  fontWeight="bold">Remaining Tickets</Typography>
          <Box position="relative" display="flex" alignItems="center">
            <LinearProgress
              variant="determinate"
              value={50}
              sx={{
                height: '16px',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'lightgray',
                '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
              }}
            />
            <Box
              position="absolute"
              left="50%"
              top="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant="body2" color="white">
                50%
              </Typography>
            </Box>
          </Box>
        </Box>
  
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary"  fontWeight="bold">Completed Tickets</Typography>
          <Box position="relative" display="flex" alignItems="center">
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: '16px',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'lightgray',
                '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
              }}
            />
            <Box
              position="absolute"
              left="50%"
              top="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant="body2" color="White">
                75%
              </Typography>
            </Box>
          </Box>
        </Box>
  
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" fontWeight="bold">Incentives</Typography>
          <Box position="relative" display="flex" alignItems="center">
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: '16px',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'lightgray',
                '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
              }}
            />
            <Box
              position="absolute"
              left="50%"
              top="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant="body2" color="white">
                100%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
  
  const QuotationList = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex">
        <IconButton onClick={handleBackClick} color="primary" aria-label="back to dashboard">
            <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold" marginTop="8px" >
          Tickets List
        </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>Sl No</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Ticket No</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Date</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Customer Details</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Issues</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {quotations.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.id}</TableCell>
                        <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.ticketNo}</TableCell>
                        <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.date}</TableCell>
                        <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.customername}</TableCell>
                        <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.issues}</TableCell>
                        <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.status}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  

  return (
    <Box p={3} marginTop={8}>
      {view === 'dashboard' ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
              onClick={handleQuotationClick}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{quotationCount} New Tickets</Typography>
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
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{invoiceCount} Excisting Tickets</Typography>
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
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{amount} Pending Tickets</Typography>
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
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{customerList} Completed Tickets</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={isExpanded ? 6 : 9}>
            {/* <QuotationList /> */}
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center" fontWeight="bold">
                  Tickets List
                </Typography>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>Sl No</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Ticket No</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Date</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Customer Details</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Issues</TableCell>
                            <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center'  }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotations.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.id}</TableCell>
                                <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.ticketNo}</TableCell>
                                <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.date}</TableCell>
                                <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.customername}</TableCell>
                                <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.issues}</TableCell>
                                <TableCell style={{border: "1px solid #ACB4AE",textAlign:'center', fontSize: '14px'}}>{row.status}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={isExpanded ? 6 : 3}>
            <Achievements />
          </Grid>
          {/* <Grid item xs={12} sm={isExpanded ? 6 : 9}>
            <QuotationList />
          </Grid> */}
        </Grid>
      
      ) :  view === 'quotations' ? (
        <QuotationList />
      ) : null}
    </Box>
  );
};

export default TechnicianDashboard;