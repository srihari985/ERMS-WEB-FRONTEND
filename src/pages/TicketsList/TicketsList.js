import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TicketsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [formValues, setFormValues] = useState({
    date: '',
    worksiteAddress: '',
    contactPerson: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technicianAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emailId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const handleGetData = async () => {
    try {
      const response = await fetch('https://api.example.com/technicians', {  // Use your actual API endpoint here
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleActionClick = (row) => {
    setSelectedTechnician(row);
    setFormValues({
      date: '',
      worksiteAddress: '',
      contactPerson: row.technicianName,  // Pre-filling the contact person field with technician's name
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedTechnician(null);
  };

  const handleSubmitDialog = async () => {
    try {
      const response = await fetch('https://api.example.com/tickets', {  // Use your actual API endpoint here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        alert(`Form Submitted with: 
          Date: ${formValues.date}, 
          Worksite Address: ${formValues.worksiteAddress}, 
          Contact Person: ${formValues.contactPerson}`);
        handleClose();
      } else {
        alert('Failed to submit the form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    alert('Table Data Submitted');
    // Handle additional submission logic
  };
  const handleCreateQuotation = () => {
    navigate("/TicketAssignForm"); // Navigate to the create quotation page
  };

  return (
    <div
      style={{
        marginTop: '72px',
        marginLeft: '20px',
        marginRight: '20px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => navigate('/dashboard')} sx={{ color: '#2e2a54' }}>
          <KeyboardBackspaceIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5" component="h3" sx={{ marginLeft: 2 }}>
          Technicians List
        </Typography>
       </Box>
      {/* Button aligned to the right */}
      <Box display="flex" justifyContent="flex-end" marginY={2}>
        <Button
          variant="contained"
          onClick={handleCreateQuotation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#41CECA',
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          Create Ticket
        </Button>
      </Box>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            marginRight: '20px',
            padding: '15px',
            width: '200px',
            maxWidth: '29%',
          }}
        />
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>S.No</th>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>Technician Name</th>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>Technician Address</th>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>Contact Number</th>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>Role</th>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>Email Id</th>
              <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#c9c9c7' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.sNo}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.technicianName}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.technicianAddress}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.Role}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.emailId}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleActionClick(row)}
                  >
                    Assign Ticket
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog for Form */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Technician Form</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: '16px',
            backgroundColor: '#f5f5f5'
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formValues.date}
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="none"
            name="worksiteAddress"
            label="Worksite Address"
            type="text"
            variant="outlined"
            value={formValues.worksiteAddress}
            onChange={handleFormChange}
          />
          <TextField
            margin="none"
            name="contactPerson"
            label="Contact Person"
            type="text"
            variant="outlined"
            value={formValues.contactPerson}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitDialog} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Submit Button for Table */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        Submit
      </Button>
    </div>
  );
};

export default TicketsList;
