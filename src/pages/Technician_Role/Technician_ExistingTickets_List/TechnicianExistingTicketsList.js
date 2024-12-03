import React, { useState, useEffect } from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Box, Card, CardContent,IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

const TechnicianExistingTicketsList = () => {
  // Example ticket data for demonstration (you can replace this with real API calls)
  const [tickets, setTickets] = useState([]);
  const navigate=useNavigate()


  // Simulate fetching new tickets (replace with API call if needed)
  useEffect(() => {
    const fetchNewTickets = () => {
      // This data could be fetched from an API based on technician's ID
      const data = [
        { id: 1, ticketNo: 'T001', date: '2024-09-23', customername: 'John Doe', issues: 'Network issue', status: 'New' },
        { id: 2, ticketNo: 'T002', date: '2024-09-24', customername: 'Jane Smith', issues: 'Hardware failure', status: 'New' },
        { id: 3, ticketNo: 'T003', date: '2024-09-25', customername: 'Alan Walker', issues: 'Software bug', status: 'New' },
      ];
      setTickets(data);
    };
    fetchNewTickets();
  }, []);

  return (
    <Box sx={{ padding: 3, marginTop:"45px" }}>
     
      {/* Background card with white color */}
      <Card sx={{ backgroundColor: 'white', padding: 3, marginTop: 2 }}>
      <IconButton onClick={() => navigate('/TechnicianDashboard')} sx={{ color: '#2e2a54' }}>
          <KeyboardBackspaceIcon fontSize="large" />
        </IconButton>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold" marginTop="8px">
        Existing Tickets List
      </Typography>
      
        <CardContent>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#A1F4BD', textAlign: 'center' }}>
                    Sl No
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#A1F4BD', textAlign: 'center' }}>
                    Ticket No
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#A1F4BD', textAlign: 'center' }}>
                    Date
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#A1F4BD', textAlign: 'center' }}>
                    Customer Details
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#A1F4BD', textAlign: 'center' }}>
                    Issues
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '15px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#A1F4BD', textAlign: 'center' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tickets.map((ticket, index) => (
                  <TableRow key={ticket.id}>
                    <TableCell style={{ border: '1px solid #ACB4AE', textAlign: 'center', fontSize: '14px' }}>{index + 1}</TableCell>
                    <TableCell style={{ border: '1px solid #ACB4AE', textAlign: 'center', fontSize: '14px' }}>{ticket.ticketNo}</TableCell>
                    <TableCell style={{ border: '1px solid #ACB4AE', textAlign: 'center', fontSize: '14px' }}>{ticket.date}</TableCell>
                    <TableCell style={{ border: '1px solid #ACB4AE', textAlign: 'center', fontSize: '14px' }}>{ticket.customername}</TableCell>
                    <TableCell style={{ border: '1px solid #ACB4AE', textAlign: 'center', fontSize: '14px' }}>{ticket.issues}</TableCell>
                    <TableCell style={{ border: '1px solid #ACB4AE', textAlign: 'center', fontSize: '14px' }}>{ticket.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TechnicianExistingTicketsList;