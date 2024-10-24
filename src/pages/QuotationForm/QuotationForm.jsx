import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Button, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Card, CardContent,TablePagination
} from '@mui/material';
import { Add, Bloodtype, Delete, KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { Box } from '@mui/system';

const QuotationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState({});
  // const [party, setParty] = useState(null);
  const [selectedParty1, setSelectedParty] = useState([]);
  const { EmployeeRegId, selectedParty, sId ,setFid , itId} = useAuth();
  console.log("selected party adid :" + selectedParty);
  const [tableData, setTableData] = useState([]); // State to store fetched table data
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);



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

  const [invoiceData, setInvoiceData] = useState({
    quotationDate: '',
    paymentTerms: '',
    dueDate: ''
  });
  

 



  // Fetch party details by ID
  const fetchPartyById = async () => {

    try {
      const response = await fetch(`http://192.168.29.219:8080/api/addParty/getPartyById/${selectedParty}`);
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
    fetchPartyById()

  }, []);


  const handleSubmit = async () => {
    setIsSaving(true);
    console.log("Invoice Details:", invoiceData); // Log to check data before submission
    try {
      const response = await fetch(`http://192.168.29.219:8080/api/form/save/${selectedParty}/${sId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData), // Send the entire invoiceData object
      });
     
      
      if (response.ok) {
       
        const responseData = await response.json();
        setFid(responseData.fid);
      } else {
        console.error('Failed to submit quotation');
      }
    } catch (error) {
      console.error('Error submitting the quotation:', error);
    }
    finally {
      setIsSaving(false); // Stop showing "Saving..." text after submission is done
    }
  };


   
const getFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Extracts only the 'YYYY-MM-DD' part
};
  
  const fetchTableData = async () => {
    try {
      const saleDate = getFormattedDate();
      const sId = localStorage.getItem("sId");
      const response = await fetch(`http://192.168.29.219:8080/api/itemSalesTable/getSelectedItems/${sId}/${saleDate}?itemIds=${itId}`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setTableData(data); // Store the fetched data in the state
      } else {
        console.error('Failed to fetch table data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  useEffect(() => {
    fetchTableData(); // Fetch data when the component mounts
  }, []);
  

  
  

  


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setInvoiceData((prevState) => {
      // Update the state with the new values
      const updatedData = {
        ...prevState,
        [name]: value
      };
      
      // Calculate payment terms (days) if both dates are selected
      if (name === 'quotationDate' || name === 'dueDate') {
        const quotationDate = new Date(name === 'quotationDate' ? value : updatedData.quotationDate);
        const dueDate = new Date(name === 'dueDate' ? value : updatedData.dueDate);
  
        if (quotationDate && dueDate && !isNaN(quotationDate) && !isNaN(dueDate)) {
          const paymentTermsDays = Math.ceil((dueDate - quotationDate) / (1000 * 60 * 60 * 24)); // Calculate days difference
          updatedData.paymentTerms = paymentTermsDays; // Update payment terms in the state
        }
      }
  
      return updatedData;
    });
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


  
   // Pagination change handlers
   const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        border: '2px solid #2e2a54',  // Add a solid border with custom color
        borderRadius: '8px',          // Optional: to give a rounded border look
        margin: '15px',

      }}>
        <Grid container spacing={1}
       
        >

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

              <Card sx={{ padding: '3%', width: '95%', height: '66%',paddingTop:'8%'}}>

                <Grid container >

                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: '1rem' }}><strong>Billing Name:</strong><span style={{ marginLeft: '35px' }}>{selectedParty1.customerName}</span></Typography>
                    <Typography sx={{ fontSize: '1rem' }}><strong>Mobile Number:</strong><span style={{ marginLeft: '17px' }}>{selectedParty1.mobileNumber}</span></Typography>
                    <Typography sx={{ fontSize: '1rem' }}><strong>GSTIN:</strong><span style={{ marginLeft: '83px' }}>{selectedParty1.gstIn}</span></Typography>
                    <Typography sx={{ fontSize: '1rem' }}><strong>Billing Address:</strong><span style={{ marginLeft: '20px' }}>{selectedParty1.billingAddress}</span></Typography>
                   
                  </Grid>

                </Grid>
              </Card>
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
            <Card sx={{ padding: '3%', width: '120%', height: '66%' ,paddingTop: '9%'}}>
              <Grid container spacing={2} >
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}><strong>Shipping Name:</strong><span style={{ marginLeft: '32px' }}>{selectedParty1 ? selectedParty1.customerName : 'N/A'}</span></Typography>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}><strong>Shipping Address:</strong> <span style={{ marginLeft: '15px' }}>{selectedParty1 ? selectedParty1.shippingAddress : 'N/A'}</span></Typography>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}><strong>Shipping Pincode:</strong><span style={{ marginLeft: '17px' }}>{selectedParty1 ? selectedParty1.shippingPincode : 'N/A'}</span></Typography>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}><strong>Shipping State:</strong> <span style={{ marginLeft: '33px' }}>{selectedParty1 ? selectedParty1.shippingState : 'N/A'}</span></Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>



          {/* Combined Invoice and Payment Details Section */}
          <Grid item xs={12} md={4} sx={{
            border: '2px solid #bfbdbd',  // Add a solid border with custom color
            borderRadius: '8px',          // Optional: to give a rounded border look
            // overflow: 'auto',
            marginTop: '10px',
            padding: '10px ',
            marginBottom: '5px',
            marginLeft: '7%'

          }}>
            <Typography variant="h6" mb={2}><strong>Invoice & Payment Details</strong></Typography>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quotation Date"
                  type="date"
                  name="quotationDate" // Added name attribute
                  value={invoiceData.quotationDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true,sx: { fontWeight: 'bold' } }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd',
                      borderRadius: '16px',
                      width:'90%',
                      
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  name="dueDate" // Added name attribute
                  value={invoiceData.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true ,sx: { fontWeight: 'bold' } }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd',
                      borderRadius: '16px',
                      width:'90%'
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payment Terms (Days)"
                  name="paymentTerms" // Added name attribute
                  value={invoiceData.paymentTerms}
                  InputLabelProps={{ shrink: true ,sx: { fontWeight: 'bold' } }}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e3f2fd',
                      borderRadius: '16px',
                      width:'90%'
                    },
                  }}
                />
              </Grid>

              <Grid container justifyContent="right" sx={{ marginTop: '1px', marginLeft: '1px' }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginTop: '10px' }}
                  onClick={handleSubmit}
                  disabled={isSaving} // Disable the button while saving
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </Grid>

            </Grid>


           </Grid>
          </Grid>

        {/* Item Table */}
        <Grid item xs={12} marginTop={'20px'}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>No</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Items</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>HSN</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>QTY</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Price/Item</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Discount</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>GSTIN</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Amount</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.saleDate}</TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'name')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.name ? (
                        <TextField

                          value={item.items}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'name')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.items}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'code')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.code ? (
                        <TextField

                          value={item.hsn}
                          onChange={(e) => handleItemChange(index, 'code', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'code')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.hsn}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'qty')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.qty ? (
                        <TextField

                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'qty')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.qty}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'price')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.price ? (
                        <TextField

                          type="number"
                          value={item.priceItem}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'price')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.priceItem}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'discount')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
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
                    <TableCell onClick={() => toggleEditMode(index, 'gstIn')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.gstIn ? (
                        <TextField

                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, 'gstIn', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'gstIn')}
                          autoFocus
                        />
                      ) : (
                        <Typography>{item.tax}</Typography>
                      )}
                    </TableCell>
                    {/* <TableCell>{item.qty * item.price}</TableCell> */}
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.amount}</TableCell> 
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      <IconButton onClick={() => handleDeleteItem(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
            rowsPerPageOptions={[5, 10, 25,50]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

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