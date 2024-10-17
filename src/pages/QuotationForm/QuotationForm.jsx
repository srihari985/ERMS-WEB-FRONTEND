import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Button, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Card, CardContent
} from '@mui/material';
import { Add, Bloodtype, Delete, KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { Box } from '@mui/system';



const QuotationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItems, setSelectedItems] = useState([]);
  const { EmployeeRegId } = useAuth();
  const [fId, setFid] = useState('');
  const [editMode, setEditMode] = useState({});
  // const [party, setParty] = useState(null);
  const [selectedParty1, setSelectedParty] = useState([]);
  const selectedParty = location.state?.selectedParty; // The whole party object

  // States for showing input fields
  const [showNotes, setShowNotes] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);

  // States for round-off and grand total
  const [roundOff, setRoundOff] = useState(0);
  const [grandTotal, setGrandTotal] = useState(150000); // Initial grand total
  const [showRoundOffField, setShowRoundOffField] = useState(false); // Show/Hide Round Off TextField

  // States for bank details and authorized signature
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
  });

  const [authorizedSignature, setAuthorizedSignature] = useState('');

  // State for Invoice & Payment Details
  const [quotationPrefix, setQuotationPrefix] = useState("MT/QO/24-25/");
  const [quotationNumber, setQuotationNumber] = useState("91");
  const [quotationDate, setQuotationDate] = useState("2024-09-05");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [dueDate, setDueDate] = useState("2024-10-05");
  const [poNo, setPoNo] = useState("");
  const [lut, setLut] = useState("");


  // Fetch party details by ID
  const fetchPartyById = async () => {

    try {
      const response = await fetch(`http://localhost:8080/api/addparty/getparty/${selectedParty.adId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedParty(data); // Set party details
        localStorage.setItem('party', JSON.stringify(data)); // Save party to localStorage
        console.log('party added successfully');
      } else {
        console.error('Failed to fetch party details');
      }

    } catch (error) {
      console.error('Error fetching party details:', error);
    }
  };

  useEffect(() => {
    // Load party and selectedItems from localStorage
    const savedItems = localStorage.getItem('selectedItems');
    const savedParty = localStorage.getItem('party');

    if (savedItems) {
      setSelectedItems(JSON.parse(savedItems));
    }

    // if (savedParty) {
    //   setParty(JSON.parse(savedParty));
    // }

    // Load any new data from location.state
    if (location.state?.selectedItems) {
      setSelectedItems(location.state.selectedItems);
    }

    // Check if new party data is passed from AddParty
    if (location.state?.selectedParty) {
      fetchPartyById(location.state.selectedParty.id); // Fetch party details by ID
    }
  }, [location.state]);

  const handleSubmit = async () => {
    // Check if selectedParty is defined
    if (!selectedParty || !selectedParty.adId) {
      alert('Please select a party before submitting the form.');
      return;
    }

    // Collect all the form field data excluding party data
    const quotationData = {
      quotationDate,
      paymentTerms,
      dueDate,
      poNo,
      lut,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/form/save/${selectedParty.adId}/${EmployeeRegId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData), // Send collected form data as JSON
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response data
        console.log('I am fId :' + responseData.fId);
        setFid(responseData.fId);
        // Navigate to another page or show success message
        // navigate('/');
      } else {
        console.error('Failed to submit quotation');
      }
    } catch (error) {
      console.error('Error submitting the quotation:', error);
    }
  };

  const handleAddItemClick = () => {
    navigate('/ItemTable');
  };

  const handleNavigate = () => {
    navigate('/AddParty');
  };

  const handleChangeParty = () => {
    navigate('/addparty');
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index][field] = value;
    setSelectedItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
  };

  const toggleEditMode = (index, field) => {
    setEditMode((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [field]: !prevState[index]?.[field]
      }
    }));
  };

  const handleRoundOffChange = (value) => {
    setRoundOff(parseFloat(value) || 0);
    setGrandTotal(150000 + parseFloat(value)); // Adjust grand total based on round off
  };

  const handleAddRoundOff = () => {
    setShowRoundOffField(true);
  };

  const handleReduceRoundOff = () => {
    setShowRoundOffField(true);
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleAuthorizedSignatureChange = (value) => {
    setAuthorizedSignature(value);
  };

  const handleFieldBlur = (fieldSetter) => {
    fieldSetter(false);
  };
  return (
    <Card style={{
      margin: '20px', marginTop: '6%', backgroundColor: '#f0f7fc',
      // marginRight: '10px',
      marginLeft: '20px',
    }}>

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid container alignItems="center" spacing={2}>
          <Grid item container alignItems="center" xs sx={{ marginTop: '10px' }}>
            <IconButton onClick={() => navigate('/SalesQuationList')} sx={{ color: '#2e2a54' }}>
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="h4" gutterBottom sx={{ marginTop: '7px' }}>
              Quotation Form
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <CardContent sx={{
        border: '2px solid #bfbdbd',  // Add a solid border with custom color
        borderRadius: '8px',          // Optional: to give a rounded border look
        // overflow: 'auto',
        // marginTop: '10px',
        margin: '10px',
        minHeight: '100vh',
        

      }}>
        <Grid container spacing={1} >
          
          {/* Bill To Section */}
          <Grid item xs={12} md={4}>
            <Grid container display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              
              <Button
                
                onClick={handleChangeParty}
                size="small"
                style={{
                  color: 'black',
                  border: '2px dashed skyblue', // Dashed border with sky blue color
                  width: '120px', // Set desired width
                  height: '40px', // Set desired height
                  display: 'flex', // Enable flexbox for centering
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                }}
              >
                Add Party
              </Button>

            </Grid>
                <Typography variant="h5" fontWeight="bold">Bill To</Typography>
                {selectedParty1 ? (
                  
                  <Paper sx={{ padding: '46px', width: '90%' }}>
                    
                    <Grid container >
                      
                      <Grid item xs={12}>
                        <Typography sx={{ fontSize: '1rem' }}><strong>Billing Name:</strong>{selectedParty1.customerName}</Typography>
                        <Typography sx={{ fontSize: '1rem' }}><strong>Mobile Number:</strong> {selectedParty1.mobileNumber}</Typography>
                        <Typography sx={{ fontSize: '1rem' }}><strong>Billing Address:</strong> {selectedParty1.billingAddress}</Typography>
                        <Typography sx={{ fontSize: '1rem' }}><strong>GSTIN:</strong> {selectedParty1.gstIn}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ) : (
                  <Paper
                    sx={{
                      border: '2px dashed #90caf9',
                      padding: '20px',
                      width: '100%',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={handleNavigate}
                  >
                    <Typography color="secondary">+ Add Party</Typography>
                  </Paper>
                )}
              </Grid>

              {/* Ship To Section */}
              <Grid item xs={12} md={3} >
                <Typography variant="h5" mt={7} fontWeight="bold">Ship To</Typography>
                <Paper sx={{ padding: '3%', width: '100%' ,height:'66%'}}>
                  <Grid container spacing={2} >
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '1rem', marginBottom: '3px',paddingTop:'15%' }}><strong>Shipping Name:</strong> {selectedParty1 ? selectedParty1.customerName : 'N/A'}</Typography>
                      <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}><strong>Shipping Address:</strong> {selectedParty1 ? selectedParty1.shippingAddress : 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            
              <Box
  sx={{
 
    
    
    borderRight: '2px solid #bfbdbd',  // Vertical line on the right side
    height: '400px',             // Height to display the vertical line
  }}
  style={{ width: '100% !important', height: '200px !important' }}  // Enforce width and height
>
  {/* Box content */}
</Box>





          {/* Combined Invoice and Payment Details Section */}
          <Grid item xs={12} md={4} sx={{
            border: '2px solid #bfbdbd',  // Add a solid border with custom color
            borderRadius: '8px',          // Optional: to give a rounded border look
            // overflow: 'auto',
            marginTop: '10px',
            padding: '10px ',
            marginBottom:'5px',
            marginLeft:'7%'

          }}>
            <Typography variant="h6" mb={2}><strong>Invoice & Payment Details</strong></Typography>
            <Grid container spacing={1}>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emp Id"
                  value="MAP-102"
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd', // TextField background color
                      borderRadius: '16px', // Add border radius here
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quotation Prefix"
                  value={quotationPrefix}
                  onChange={(e) => setQuotationPrefix(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd', // TextField background color
                      borderRadius: '16px', // Add border radius here
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quotation Number"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd', // TextField background color
                      borderRadius: '16px', // Add border radius here
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quotation Date"
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd', // TextField background color
                      borderRadius: '16px', // Add border radius here
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Terms (Days)"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd', // TextField background color
                      borderRadius: '16px', // Add border radius here
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd', // TextField background color
                      borderRadius: '16px', // Add border radius here
                    },
                  }}
                />
              </Grid>



              <Grid container justifyContent="right" sx={{ marginTop: '1px', marginLeft: '1px' }}>
                <Button variant="contained" color="success" sx={{ marginTop: '10px' }} onClick={handleSubmit} >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>




          <Box
            sx={{
              // width: '100%',        // For setting the width
              borderBottom: '2px solid #bfbdbd',
              paddingTop: '20px',
            }}
            style={{ width: '100% !important' }}  // Enforce the width with !important
          >
            {/* Box content */}
          </Box>

        {/* Item Table */}
        <Grid item xs={12} marginTop={'20px'}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>No</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Items</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>HSN</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>QTY</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Price/Item</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Discount</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>gstIn</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Amount</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'name')}>
                      {editMode[index]?.name ? (
                        <TextField

                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'name')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.name}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'code')}>
                      {editMode[index]?.code ? (
                        <TextField

                          value={item.code}
                          onChange={(e) => handleItemChange(index, 'code', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'code')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.code}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'stock')}>
                      {editMode[index]?.stock ? (
                        <TextField

                          type="number"
                          value={item.stock}
                          onChange={(e) => handleItemChange(index, 'stock', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'stock')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.stock}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'price')}>
                      {editMode[index]?.price ? (
                        <TextField

                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'price')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.price}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'discount')}>
                      {editMode[index]?.discount ? (
                        <TextField

                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'discount')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.discount}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'gstIn')}>
                      {editMode[index]?.gstIn ? (
                        <TextField

                          type="number"
                          value={item.gstIn}
                          onChange={(e) => handleItemChange(index, 'gstIn', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'gstIn')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.gstIn}</Typography>
                      )}
                    </TableCell>
                    <TableCell>{item.stock * item.price}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteItem(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleAddItemClick} sx={{ marginTop: '10px' }} variant="contained" color="primary">
            <Add /> Add Item
          </Button>
        </Grid>

        {/* Additional Charges */}

        <Grid item xs={12} sx={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            {showNotes ? (
              <TextField

                label="Notes"

                onBlur={() => handleFieldBlur(setShowNotes)}
                autoFocus
              />
            ) : (
              <Button color="secondary" onClick={() => setShowNotes(true)} size='large' sx={{ fontSize: '1rem', marginLeft: '29px' }}>+ Add Notes</Button>
            )}
          </Grid>

          {/* Terms and Conditions */}
          <Grid item xs={12}>
            {showTerms ? (
              <TextField

                label="Terms and Conditions"
                onBlur={() => handleFieldBlur(setShowTerms)}
                autoFocus
              />
            ) : (
              <Button color="secondary" onClick={() => setShowTerms(true)} size='large' sx={{ fontSize: '1rem', marginLeft: '29px' }}>+ Add Terms and Conditions</Button>
            )}
          </Grid>
          <Grid container spacing={2} justifyContent="flex-end" >
            {showAdditionalCharges ? (
              <TextField

                label="Additional Charges"
                onBlur={() => handleFieldBlur(setShowAdditionalCharges)}
                autoFocus
              />
            ) : (
              <Button color="secondary" onClick={() => setShowAdditionalCharges(true)} size='large' sx={{ fontSize: '1rem' }}>+ Add Additional Charges</Button>
            )}
          </Grid>

          {/* Discount */}
          <Grid item xs={12} sx={{ marginTop: '2px' }}>
            <Grid container spacing={2} justifyContent="flex-end">
              {showDiscount ? (
                <TextField

                  label="Discount"
                  onBlur={() => handleFieldBlur(setShowDiscount)}
                  autoFocus
                />
              ) : (
                <Button color="secondary" onClick={() => setShowDiscount(true)} size='large' sx={{ fontSize: '1rem', marginRight: '79px' }}>+ Add Discount</Button>
              )}
            </Grid>

            {/* Notes */}




            {/* Round Off and Grand Total */}
            <Grid item xs={12} sx={{ marginTop: '20px', fontSize: '1rem', marginRight: '25px' }}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Typography variant="h6">Round Off: {roundOff}</Typography>
                <Button variant="outlined" color="success" onClick={handleAddRoundOff} sx={{ marginRight: 1 }}>
                  Add
                </Button>
                <Button variant="outlined" color="error" onClick={handleReduceRoundOff}>
                  Reduce
                </Button>
                {showRoundOffField && (
                  <TextField

                    label="Enter Round Off"
                    type="number"
                    onBlur={(e) => {
                      handleRoundOffChange(e.target.value);
                      setShowRoundOffField(false); // Hide the field after input
                    }}
                    autoFocus
                  />
                )}
              </Grid>



              <Grid item xs={12} sx={{ marginTop: '20px' }} marginRight={'30px'}>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Typography variant="h5">Grand Total: ₹ {grandTotal}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>



        < Grid xs={12} sm={6} marginLeft={'39px'}>
          <Button color="secondary" onClick={() => navigate('/SelectBankAccount')} size='large'>+ Add Bank Details</Button>

          <Typography sx={{ fontSize: '1.2rem' }}>Account Number: </Typography>
          <Typography sx={{ fontSize: '1.2rem' }}>IFSC Code: </Typography>
          <Typography sx={{ fontSize: '1.2rem' }}>Bank & Branch Name: </Typography>
          <Typography sx={{ fontSize: '1.2rem' }}>Account Holder Name: </Typography>



          <Button variant="text" color="error">
            Remove Bank Account
          </Button>
        </Grid>
        {/* Authorized Signature Section */}
        <Grid container justifyContent="flex-end" style={{ marginTop: '2px' }}>
          <Grid item xs={3} style={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '1rem', marginRight: '77px' }}>For My Company</Typography>
            <Typography style={{ marginTop: '40px', fontSize: '1rem', marginRight: '50px' }}>Authorized Signatory</Typography>
          </Grid>
        </Grid>
        {/* Submit Button */}
        <Grid container justifyContent="left" sx={{ marginTop: '20px', marginLeft: '35px' }}>
          {/* <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit Quotation
          </Button> */}
        </Grid>

      </CardContent>
    </Card>
  );
};

export default QuotationForm;