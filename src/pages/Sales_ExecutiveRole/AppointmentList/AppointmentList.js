import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../AuthProvider';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const AppointmentList = () => {
  // State variables
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { userId: salesId } = useAuth();
  const [formValues, setFormValues] = useState({
    date: '',
    time: '',
    companyName: '',
    personName: '',
    mobileNumber: '',
    address: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch appointments from API when component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/appointment/getAll/${salesId}`);
        
        // Log response status for debugging
        console.log('Response Status:', response.status);
        console.log('Response OK?', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          
          // Sort the data by date in descending order (most recent first)
          const sortedAppointments = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setAppointments(sortedAppointments);  // Update the appointments state
        } else {
          toast.error('Failed to fetch appointments.');
        }
      } catch (error) {
        console.error('Fetch Error:', error);  // Log errors for debugging
        toast.error('Network error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [salesId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      date: date,
    }));
  };

  // Toggle status button between "Open" and "Closed"
  const toggleStatus = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status =
      updatedAppointments[index].status === 'Open' ? 'Closed' : 'Open';
    setAppointments(updatedAppointments);
  };

  // Submit new appointment
  const handleSubmit = async () => {
    setSubmitLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/appointment/save/${salesId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      console.log("Response Status:", response.status);
      console.log("Response OK?", response.ok);

      if (response.status === 200) {
        toast.success('Appointment created successfully!', {
          autoClose: 1000,
        });
        setNewAppointmentOpen(false);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error('Network error. Please try again later.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle search filter
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle table pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={2}>
      <Card
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
          marginTop: '4%',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" color="primary" fontWeight="bold">
            Appointment List
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setNewAppointmentOpen(true)}
            sx={{ boxShadow: 2 }}
          >
            New Appointment
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search by company Name or Date"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#1976d2',
              },
              '&:hover fieldset': {
                borderColor: '#1565c0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            width: '20%',
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Date', 'Time', 'Company Name', 'Person Name', 'Mobile Number', 'Address',].map((header) => (
                  <TableCell
                    key={header}
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      border: '1px solid #ACB4AE',
                      textAlign: 'center',
                      backgroundColor: '#A1F4BD',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment, index) => (
                    <TableRow key={index}>
                      {['date', 'time', 'companyName', 'personName', 'mobileNumber', 'address'].map((field) => (
                        <TableCell
                          key={field}
                          sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}
                        >
                          {appointment[field]}
                        </TableCell>
                      ))}
                      {/* <TableCell>
                        <Button
                          variant="contained"
                          color={appointment.status === 'Open' ? 'success' : 'error'}
                          onClick={() => toggleStatus(index)}
                          sx={{ minWidth: 80 }}
                        >
                          {appointment.status}
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <CircularProgress color="primary" />
                      <Typography variant="body2" color="textSecondary" mt={1}>
                        No data available
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <Dialog open={newAppointmentOpen} onClose={() => setNewAppointmentOpen(false)}>
        <DialogTitle>Create New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formValues.date}
                  onChange={handleDateChange}
                  renderInput={(props) => <TextField {...props} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                name="time"
                value={formValues.time}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                name="companyName"
                value={formValues.companyName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Person Name"
                name="personName"
                value={formValues.personName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formValues.mobileNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAppointmentOpen(false)} color="primary">Cancel</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default AppointmentList;
