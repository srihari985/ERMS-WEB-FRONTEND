import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import swal from 'sweetalert';
import SearchIcon from '@mui/icons-material/Search';

const ServiceRequest = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formValues, setFormValues] = useState({
    companyName: '',
    contactPerson: '',
    mobileNumber: '',
    emailId: '',
    category: '',
    issue: '',
    date: '',
    time: '',
  });
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    const newTicketNumber = Math.floor(Math.random() * 1000000);
    swal("Ticket Submitted!", `Your ticket number is ${newTicketNumber}`, "success");
    setFormValues({
      companyName: '',
      contactPerson: '',
      mobileNumber: '',
      emailId: '',
      category: '',
      issue: '',
      date: '',
      time: '',
    });
  };

  const handleSearch = () => {
    const mockDetails = {
      ticketNumber,
      assignedField: 'Network Issue',
      time: '10:00 AM',
      date: '2024-11-20',
      assignedToTechLead: 'John Doe',
      techLeadDate: '2024-11-20',
      assignedToTechnician: 'Jane Smith',
      technicianDate: '2024-11-20',
      technicianDetails: 'Tech ID: T1234, Experience: 5 years',
      issue: 'Unable to access network',
      status: 'Open',
    };
    setTicketDetails(mockDetails);
  };

  return (
    <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, mt: 10 ,marginLeft:'10px',marginRight:'10px' }}>
      <Tabs value={tabValue} onChange={handleTabChange} >
        <Tab sx={{fontWeight:'bold',fontSize:'13px'}} label="New Ticket" />
        <Tab sx={{fontWeight:'bold',fontSize:'13px'}} label="Ticket Status" />
      </Tabs>

      {tabValue === 0 && (
        <Box mt={2}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            Raise New Ticket
          </Typography>
          <Grid container spacing={2}>
            {['companyName', 'contactPerson', 'mobileNumber', 'emailId', 'category', 'issue', 'date', 'time'].map((field) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  label={field === 'mobileNumber' ? 'Mobile Number' : field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formValues[field]}
                  onChange={handleFormChange}
                  variant="outlined"
                  select={field === 'category'}
                  type={field === 'date' || field === 'time' ? field : 'text'}
                >
                  {field === 'category' && ['cctv', 'laptops', 'biometric'].map((category) => (
                    <MenuItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      )}
      
      {tabValue === 1 && (
        <Box mt={2}>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            Ticket Status
          </Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <TextField
              label="Ticket Number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Get
            </Button>
          </Box>
          {ticketDetails ? (
            <Box mt={2} p={2} borderRadius={2} bgcolor="#f4f4f4" boxShadow={1}>
              <Box mb={2} p={2} borderRadius={2} bgcolor="#ffffff" boxShadow={1}>
                <Typography variant="subtitle1"><strong>Ticket Assigned Field:</strong> {ticketDetails.assignedField}</Typography>
              </Box>
              <Box mb={2} p={2} borderRadius={2} bgcolor="#ffffff" boxShadow={1}>
                <Typography variant="subtitle1"><strong>Time:</strong> {ticketDetails.time}</Typography>
                <Typography variant="subtitle1"><strong>Date:</strong> {ticketDetails.date}</Typography>
              </Box>
              <Box mb={2} p={2} borderRadius={2} bgcolor="#ffffff" boxShadow={1}>
                <Typography variant="subtitle1"><strong>Assigned to Tech Lead:</strong> {ticketDetails.assignedToTechLead} on {ticketDetails.techLeadDate}</Typography>
              </Box>
              <Box mb={2} p={2} borderRadius={2} bgcolor="#ffffff" boxShadow={1}>
                <Typography variant="subtitle1"><strong>Assigned to Technician:</strong> {ticketDetails.assignedToTechnician} on {ticketDetails.technicianDate}</Typography>
                <Typography variant="subtitle1"><strong>Technician Details:</strong> {ticketDetails.technicianDetails}</Typography>
              </Box>
              <Box mb={2} p={2} borderRadius={2} bgcolor="#ffffff" boxShadow={1}>
                <Typography variant="subtitle1"><strong>Issue:</strong> {ticketDetails.issue}</Typography>
              </Box>
              <Box p={2} borderRadius={2} bgcolor="#ffffff" boxShadow={1}>
                <Typography variant="subtitle1"><strong>Status:</strong> {ticketDetails.status}</Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No ticket details available,Search By Your Ticket No.
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default ServiceRequest;
