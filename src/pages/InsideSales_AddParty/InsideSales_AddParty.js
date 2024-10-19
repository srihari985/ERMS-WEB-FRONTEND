import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Checkbox, FormControlLabel, 
  Grid, Box, Typography, MenuItem, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow ,IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon

import axios from 'axios'; // Importing axios
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useAuth } from '../../AuthProvider';


const states = [
  { label: 'State 1', value: 'state1' },
  { label: 'State 2', value: 'state2' },
  // Add more states as needed
];

const InsideSales_AddParty = () => {
  // const [parties, setParties] = useState([]); // State to hold the list of parties
  const [showForm, setShowForm] = useState(false); // Toggle for showing the form
  const {EmployeeRegId} =useAuth();
  console.log('i am sid '+ EmployeeRegId)
  const [formData, setFormData] = useState({
  

    customerName: '',
    mobileNumber: '',
    billingAddress: '',
    state: '',
    pincode: '',
    city: '',
    shippingSameAsBilling: false,
    shippingAddress: '',
    shippingState: '',
    shippingPincode: '',
    shippingCity: '',
    gstIn: ''
  });

  const [showgstInField, setShowgstInField] = useState(false); // State to manage GSTIN field visibility
  const [parties, setParties] = useState([
    {
      adId: 1,
      customerName: 'John Doe',
      mobileNumber: '1234567890',
      billingAddress: '123 Main St, City A',
    },
    {
      adId: 2,
      customerName: 'Jane Smith',
      mobileNumber: '0987654321',
      billingAddress: '456 Elm St, City B',
    },
    {
      adId: 3,
      customerName: 'Bob Johnson',
      mobileNumber: '1122334455',
      billingAddress: '789 Pine St, City C',
    }
  ]); // State to hold the list of parties
  

  const navigate = useNavigate();

  // useEffect to fetch the existing parties from the server
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await axios.get('http://192.168.29.60:8080/api/addparty/getAll');
        setParties(response.data); // Set the fetched parties
 
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchParties(); // Call the function to fetch parties
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === "shippingSameAsBilling" && checked) {
      setFormData(prevState => ({
        ...prevState,
        shippingAddress: prevState.billingAddress,
        shippingState: prevState.state,
        shippingPincode: prevState.pincode,
        shippingCity: prevState.city
      }));
    } else if (name === "shippingSameAsBilling" && !checked) {
      setFormData(prevState => ({
        ...prevState,
        shippingAddress: '',
        shippingState: '',
        shippingPincode: '',
        shippingCity: ''
      }));
    }
  };
  
  const handleSubmit = async () => {
    console.log(formData);

    if (formData.customerName) {
      try {
        // POST request to your backend API
        const response = await axios.post(`http://192.168.29.60:8080/api/addparty/save/${EmployeeRegId}`, formData);
        console.log('Server Response:', response.data);

        // Update the list of parties with the new one
        setParties(prev => [...prev, formData]);

        // Reset form fields
        setFormData({
          customerName: '',
          mobileNumber: '',
          billingAddress: '',
          state: '',
          pincode: '',
          city: '',
          shippingSameAsBilling: false,
          shippingAddress: '',
          shippingState: '',
          shippingPincode: '',
          shippingCity: '',
          gstIn: ''
        });

        // Hide the form after submission
        setShowForm(false);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      console.log('Customer name is required.');
    }
  };

  const togglegstInField = () => {
    setShowgstInField(!showgstInField); // Toggle visibility of the GSTIN field
  };

  const handleAddPartyClick = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleAddToQuotation = (party) => {
    navigate('/InsideSales_QuotationForm', { state: { selectedParty: party } }); // Navigate to Quotation Form with party details
  };

  const handleDelete = async (adId) => {

    console.log('i am adid '+adId);
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this party?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete request to your backend API
          await axios.delete(`http://192.168.29.60:8080/api/addparty/${adId}`);
          
          // Remove the deleted party from the state
          
          setParties(parties.filter(party => party.adId !== adId));

          Swal.fire('Deleted!', 'The party has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting party:', error);
          Swal.fire('Error!', 'There was an error deleting the party.', 'error');
        }
      }
    });
  };

  const handleBack = () => {
    navigate("/InsideSales_QuotationForm"); // Navigates back to the previous page
  };

  return (
    <Card sx={{ maxWidth: 1400, margin: '80px auto', padding: 2 }}>
      <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <IconButton onClick={handleBack} style={{ marginRight: '5px' }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h4" sx={{ fontWeight:'bold' }}> Inside Sales Party List</Typography>
          </div>
       
        
        {/* Table to display the added parties */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Mobile Number</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Billing Address</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Action</TableCell> {/* New column for action */}
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Delete</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {parties.map((party, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{party.customerName}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{party.mobileNumber}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{party.billingAddress}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAddToQuotation(party)} // When clicked, add to quotation
                  >
                    Add
                  </Button>
                </TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(party.adId)} // Delete party by id
                    sx={{ color: 'red' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Button to add a new party */}
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddPartyClick}>
          + Add New Party
        </Button>

        {/* Show form when the button is clicked */}
        {showForm && (
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Create New Party</Typography>

            {/* Form Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Enter Name"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  error={!formData.customerName}
                  helperText={!formData.customerName ? 'This field is mandatory' : ''}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Enter Mobile Number"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Billing Address</Typography>
          <TextField
            label="Enter Billing Address"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                fullWidth
              >
                {states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Enter Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enter City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Button onClick={togglegstInField} color="primary" sx={{ mt: 2 }}>
            {showgstInField ? '- Remove gstIn' : '+ Add gstIn (Optional)'}
          </Button>

          {showgstInField && (
            <TextField
              label="Enter GSTIN"
              name="gstIn"
              value={formData.gstIn}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.shippingSameAsBilling}
                onChange={handleChange}
                name="shippingSameAsBilling"
              />
            }
            label="Shipping address same as billing address"
            sx={{ mt: 2 }}
          />

          {!formData.shippingSameAsBilling && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Shipping Address</Typography>
              <TextField
                label="Enter Shipping Address"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />

               <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="State"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    fullWidth
                  >
                    {states.map((state) => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Enter Pincode"
                    name="shippingPincode"
                    value={formData.shippingPincode}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Enter City"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </>
          )}
            
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
              Save Party
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InsideSales_AddParty;
