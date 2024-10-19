import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton, Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const ListCustomer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // state to control dialog visibility
  const [newCustomer, setNewCustomer] = useState({
    contactPerson: '',
    contactNumber: '',
    companyName: '',
    emailId: '',
    GSTIN:'',
    address: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const handleGetData = () => {
    const mockData = [
      { sNo: 1, companyName: "Tech Solutions Ltd.", companyAddress: "123 Silicon Valley, CA, USA", contactPersonName: "John Doe", contactNumber: "+1-234-567-890", emailId: "johndoe@techsolutions.com" },
      { sNo: 2, companyName: "Innovatech Industries", companyAddress: "456 Innovation Blvd, NY, USA", contactPersonName: "Jane Smith", contactNumber: "+1-987-654-321", emailId: "janesmith@innovatech.com" },
      { sNo: 3, companyName: "Global Ventures Pvt. Ltd.", companyAddress: "789 Global St, London, UK", contactPersonName: "George Martin", contactNumber: "+44-1234-567-890", emailId: "georgem@globalventures.com" },
      { sNo: 4, companyName: "NextGen Technologies", companyAddress: "101 NextGen Ave, Sydney, Australia", contactPersonName: "Emily Johnson", contactNumber: "+61-9876-543-210", emailId: "emilyj@nextgentech.com" },
      { sNo: 5, companyName: "Future Innovations LLC", companyAddress: "202 Innovation Road, Berlin, Germany", contactPersonName: "Michael Brown", contactNumber: "+49-321-654-987", emailId: "michaelb@futureinnovations.com" }
    ];
    setData(mockData);
    setFilteredData(mockData);
  };

  const handleSubmit = () => {
    alert('Table Data Submitted');
  };

  const handleAddCustomer = () => {
    // Reset form
    setNewCustomer({
      contactPerson: '',
      contactNumber: '',
      companyName: '',
      emailId: '',
      address: ''
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  // handleCustomerSubmit function with SweetAlert
const handleCustomerSubmit = () => {
  console.log("New Customer Data:", newCustomer);
  setOpenDialog(false);

  // Logic to handle customer submission (like sending data to backend)

  // Display SweetAlert for successful submission
  swal({
    title: "Success",
    text: "Customer details submitted successfully!",
    icon: "success",
    button: "OK",
  });
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
          Customer List
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '200px' }}
        />
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert('Export Clicked')}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddCustomer} // open dialog
          >
            Add Customer
          </Button>
        </Box>
      </Box>

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
            <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>S.No</th>
            <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Company Name</th>
            <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Company Address</th>
            <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Contact Person Name</th>
            <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Contact Number</th>
            <th style={{ color: 'black', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Email Id</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.sNo}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.companyName}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.companyAddress}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactPersonName}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.emailId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          sx={{ padding: '10px 20px' }}
        >
          Submit
        </Button>
      </Box>

      {/* Customer Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle variant='h3'>New Customer Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Contact Person"
            name="contactPerson"
            value={newCustomer.contactPerson}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            name="contactNumber"
            value={newCustomer.contactNumber}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Company Name"
            name="companyName"
            value={newCustomer.companyName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email ID"
            name="emailId"
            value={newCustomer.emailId}
            onChange={handleInputChange}
          />
           <TextField
            fullWidth
            margin="normal"
            label="GSTIN No"
            name="GSTIN"
            value={newCustomer.GSTIN}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={newCustomer.address}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="secondary">Cancel</Button>
          <Button onClick={handleCustomerSubmit} variant="contained" color="secondary" >Add Customer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListCustomer;