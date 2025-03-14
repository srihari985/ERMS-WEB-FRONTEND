import React, { useState, useEffect } from 'react';
import {TextField,Button,Grid,Box,Typography,Card,CardContent,Table,TableBody,TableCell,TableHead,TableRow,IconButton,Dialog,DialogTitle,DialogContent,DialogActions,TablePagination,} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { useAuth } from '../../../AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const AddParty = () => {
  const { sId , setAdId} = useAuth();
  const [addPartyData, setAddPartyData] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    billingAddress: '',
    state: '',
    pincode: '',
    city: '',
    shippingAddress: '',
    shippingState: '',
    shippingPincode: '',
    shippingCity: '',
    gstIn: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0); // For TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(8); // Set the number of rows per page
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? !prevState[name] : value,
    }));
  };

 


  //POST METHOD
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/api/addParty/save/${sId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Check for a successful response (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        // Add newly created party to the top of the list
        setAddPartyData((prevData) => [response.data, ...prevData]);
  
        // Show success toast notification
        toast.success('Party Added Successfully!', {
          position: 'top-right', // Position of the toast
          autoClose: 2000, // Display for 2 seconds
        });
      } else {
        console.error('Failed to submit quotation');
  
        // Show error toast notification
        toast.error('Failed to Add Party. Please try again.', {
          position: 'top-right', // Position of the toast
          autoClose: 2000, // Display for 2 seconds
        });
      }
  
      // Reset form fields after success
      setFormData({
        customerName: '',
        mobileNumber: '',
        billingAddress: '',
        state: '',
        pincode: '',
        city: '',
        shippingAddress: '',
        shippingState: '',
        shippingPincode: '',
        shippingCity: '',
        gstIn: '',
      });
      
      setShowForm(false); // Close the dialog after saving
    } catch (error) {
      console.error('Error adding party:', error);
  
      // Show error toast notification
      toast.error('Error adding party. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };
  

  //GET ALL PARTIES
  const fetchAddPartyGetAll = async () => {
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(
        `${baseUrl}/api/addParty/getAll/${sId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAddPartyData(data);
    } catch (error) {
      console.error('Error fetching party data:', error);
    }
  };

  useEffect(() => {
    fetchAddPartyGetAll();
  }, []);


  //DELETE METHOD
  const handleDelete = async (adId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this party?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const baseUrl=process.env.REACT_APP_API_BASE_URL
          await axios.delete(`${baseUrl}/api/addParty/${adId}`);
          setAddPartyData((prevData) => prevData.filter((party) => party.adId !== adId));
          
          toast.success('Party deleted Successfully!', {
            position: 'top-right', // Position of the toast
            autoClose: 2000, // Display for 2 seconds
          });
        } catch (error) {
          console.error('Error deleting party:', error);
          
          toast.error('Error deleting the party. Please try again.', {
            position: 'top-right', // Position of the toast
            autoClose: 2000, // Display for 2 seconds
          });
        }
      }
    });
  };

 
  const handleAddToQuotation = (party) => {
    setAdId(party.adId); // Set the party in the context
    console.log("i am adid :"+party.adId)
    navigate('/QuotationForm'); // Navigate without passing state
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenDialog = () => {
    setShowForm(true);
  };

  const handleCloseDialog = () => {
    setShowForm(false);
  };

  // Calculate the current rows to display
  const currentRows = addPartyData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card sx={{ maxWidth: 1400, margin: '80px auto', padding: 2 }}>
      <CardContent>
          <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '30px', 
                justifyContent: 'space-between' 
          }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={handleBack} style={{ marginRight: '5px' }}>
                      <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Party List</Typography>
              </div>
              
              <Button
                  onClick={handleOpenDialog}
                  style={{
                      color: '#047842',
                      border: '2px dashed skyblue', // Dashed border with sky blue color
                      width: '150px', // Set desired width
                      height: '40px', // Set desired height
                      display: 'flex', // Enable flexbox for centering
                      justifyContent: 'center', // Center horizontally
                      alignItems: 'center', // Center vertically
                      marginTop: '20px',
                      fontWeight: 'bold'
                  }}
              >
                  + Add New Party
              </Button>
          </div>

          <ToastContainer />
        {/* Table to display the added parties */}
        <Table>
          <TableHead>
            <TableRow>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Sl No</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Mobile Number</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Billing Address</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Action</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.reverse().map((party, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{index+1}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{party.customerName}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{party.mobileNumber}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{party.billingAddress}</TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                  <Button variant="contained" color="secondary" onClick={() => handleAddToQuotation(party)}>
                    Add
                    
                  </Button>
                </TableCell>
                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                  <IconButton aria-label="delete" onClick={() => handleDelete(party.adId)} sx={{ color: 'red' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25,50]}
          component="div"
          count={addPartyData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0); // Reset to first page on rows per page change
          }}
        />

        {/* Dialog for adding new party */}
      



<Dialog open={showForm} 
onClose={handleCloseDialog} 
 maxWidth="md" // Change this value to 'sm', 'md', 'lg', 'xl', or a custom value
  fullWidth >
  <DialogTitle style={{fontSize:'20px',fontWeight:'bold'}}>Create New Party</DialogTitle>
  <DialogContent>
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid container item spacing={2}>
        
            <Grid item xs={6}>
              <TextField
                label="Enter Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                fullWidth
                required
                sx={{marginTop:'10px'}}
              />
            </Grid>
            <Grid item xs={6} >
              <TextField
                label="Enter Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                fullWidth
                required
                sx={{marginTop:'10px'}}
              />
            </Grid>
        </Grid>

        {/* Billing Address Section */}
        <Grid item xs={12}>
          <Typography variant="h4">Billing Address</Typography>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Address"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Shipping Address Section */}
        <Grid item xs={12}>
          <Typography variant="h4">Shipping Address</Typography>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Address"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Shipping State"
              name="shippingState"
              value={formData.shippingState}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Shipping Pincode"
              name="shippingPincode"
              value={formData.shippingPincode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Shipping City" name="shippingCity"
              value={formData.shippingCity}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
              <Grid item xs={6}>
                <TextField
                  label="GST IN"
                  name="gstIn"
                  value={formData.gstIn}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
         
      </Grid>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} style={{
                
                
                color: 'black',
                
              }}>
      Cancel
    </Button>
    <Button type="submit" onClick={handleSubmit}
            variant="contained" color="secondary">
      Save
    </Button>
  </DialogActions>
</Dialog>

      </CardContent>
    </Card>
  );
};

export default AddParty;
