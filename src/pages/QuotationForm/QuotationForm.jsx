import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Button, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Card, CardContent, TablePagination, Divider
} from '@mui/material';
import { Add, Delete, KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { Box } from '@mui/system';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import Swal from 'sweetalert2';


const baseUrl = process.env.REACT_APP_API_BASE_URL

const QuotationForm = () => {
  // const sid = localStorage.getItem("sId")
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMode, setEditMode] = useState({});
  // const [party, setParty] = useState(null);
  const [selectedParty, setSelectedParty] = useState([]);
  const { EmployeeRegId, AdId, sId, setFid, itId, fId, quotationDetails } = useAuth();

  const [tableData, setTableData] = useState([]); // State to store fetched table data

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // States for showing input fields
  const [showNotes, setShowNotes] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [items, setItems] = useState([]);


  // States for bank details and authorized signature
  const [bankDetails, setBankDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //Set Total Amount
  const [amount, setTotalAmount] = useState("")


  const [invoiceData, setInvoiceData] = useState({
    quotationDate: '',
    paymentTerms: '',
    dueDate: ''
  });

  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(''); // <-- Initialize state
  const [description, setDescription] = useState(''); // <-- Initialize state

 




  //GRAND TOTAL
  const [grandTotal, setGrandTotal] = useState(0);

  //After INvoice Post Method
  const [responseData, setResponseData] = useState({
    quotationNumber: '',
    // quotationDate: '',
    // paymentTerms: '',
    // dueDate: '',
  });

  //Bank Details
  useEffect(() => {
    // Get bank details from local storage when the component mounts
    const storedBankDetails = localStorage.getItem("selectedBankDetails");

    // Check if storedBankDetails exists
    if (storedBankDetails) {
      try {
        const parsedDetails = JSON.parse(storedBankDetails); // Parse the stored string back into an object
        setBankDetails(parsedDetails); // Update state with parsed details
      } catch (error) {
        console.error("Failed to parse bank details from localStorage:", error);
      }
    } else {
      console.log("No bank details found in localStorage.");
    }
  }, []); // Empty dependency array means this effect runs once on mount


  // BILL TO SHIP TO GET METHOD
  // BILL TO SHIP TO GET METHOD (First API call)
// Fetch data from the first API
const fetchPartyById = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/addParty/getPartyById/${AdId}`);
    if (response.ok) {
      const data = await response.json();
      setSelectedParty(prevState => ({
        ...prevState,
        ...data, // Merge the new data with the previous state
      }));
    }
  } catch (error) {
    console.error('Error fetching party data:', error);
  }
};

// Fetch data from the second API
const fetchAnotherPartyById = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/quotationList/getByIdAddPartyDetailsOnFid/${quotationDetails.adId}`);
    if (response.ok) {
      const data = await response.json();
      setSelectedParty(prevState => ({
        ...prevState,
        ...data, // Merge the new data with the previous state
      }));
    }
  } catch (error) {
    console.error('Error fetching another party data:', error);
  }
};

useEffect(() => {
  fetchPartyById();
  fetchAnotherPartyById();
}, [AdId, quotationDetails.adId]);


  // Calculate the number of days between quotationDate and dueDate
const calculatePaymentTerms = (quotationDate, dueDate) => {
  if (quotationDate && dueDate) {
    const date1 = new Date(quotationDate);
    const date2 = new Date(dueDate);
    const timeDifference = date2 - date1;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Only update if the difference is positive (valid date range)
    setInvoiceData((prevData) => ({
      ...prevData,
      paymentTerms: daysDifference > 0 ? daysDifference : ''
    }));
  }
};
// Handle Quotation Date change
const handleQuotationDateChange = (e) => {
  const newQuotationDate = e.target.value;
  setInvoiceData((prevData) => ({
    ...prevData,
    quotationDate: newQuotationDate
  }));
  calculatePaymentTerms(newQuotationDate, invoiceData.dueDate);
};

// Handle Due Date change
const handleDueDateChange = (e) => {
  const newDueDate = e.target.value;
  setInvoiceData((prevData) => ({
    ...prevData,
    dueDate: newDueDate
  }));
  calculatePaymentTerms(invoiceData.quotationDate, newDueDate);
};

  //INVOICE POST METHOD
  const InvoiceFormHandleSubmit = async () => {
    setIsSaving(true);

    try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/form/save/${AdId}/${sId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });

        if (response.ok || response.status === 201) { // Handle both 200 and 201 responses
            const data = await response.json();
            setFid(data.fid);
            console.log("I am Today fid :" + data.fid);

            fetchInvoiceData();

            // Show success toast notification
            toast.success('Saved successfully!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } else {
            toast.error('Failed to save. Please try again.', {
                position: 'top-right',
                autoClose: 2000,
            });
        }
    } catch (error) {
        toast.error('Error submitting the quotation. Please try again later.', {
            position: 'top-right',
            autoClose: 2000,
        });
    } finally {
        setIsSaving(false);
    }
};



  //Invoice GET FEILDS
  const fetchInvoiceData = async () => {
    try {
      // const saleDate = getFormattedDate();
      const fId = localStorage.getItem("fid");
      const baseUrl = process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/form/getById/3`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setResponseData({
          quotationNumber: data.quotationNumber || '',
          quotationDate: data.quotationDate || '',
          paymentTerms: data.paymentTerms || '',
          dueDate: data.dueDate || '',
        });
      } else {
        console.error('Failed to fetch table data');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };





  const getFormattedDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts only the 'YYYY-MM-DD' part
  };


  //QUOTATION Itmes TABLE---- GET METHOD
  const fetchTableData = async () => {
    try {
      // const saleDate = getFormattedDate();
      // const fId = localStorage.getItem("fid");
      const baseUrl = process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/itemSalesTable/getfinalItems/${fId}`); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setItems(data); // Store the fetched data in the state
        fetchInvoiceData();
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



  const handleChangeParty = () => {
    navigate('/AddParty');

  };

  //GET Method for Items table based on adId,sId,fId RECENT ITEMS 
  // const fetchRecentItems = async (sId, adId, saleDate) => {
  //   try {
  //     const saleDate = getFormattedDate();
  //     const baseUrl = process.env.REACT_APP_API_BASE_URL
  //     const response = await fetch(`${baseUrl}/api/itemSalesTable/getRecentItems/${sid}/${selectedParty}/${saleDate}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (response.ok) {
  //       const recentItems = await response.json();

  //       // Store the retrieved data in local storage
  //       // localStorage.setItem('recentItems', JSON.stringify(recentItems));

  //       // Set the fetched data in the state for rendering in the table
  //       setItems(recentItems);
  //     } else {
  //       console.error('Failed to fetch recent items');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching recent items:', error);
  //   }
  // };

  // useEffect to call the fetch function on component mount or when sId, adId, or saleDate changes
  // useEffect(() => {
  //   const saleDate = getFormattedDate(); // Define saleDate inside useEffect

  //   if (sid && selectedParty && saleDate) {
  //     fetchRecentItems(sid, selectedParty, saleDate);
  //   }

  //   // // Cleanup function to clear local storage on component unmount (optional)
  //   // return () => {
  //   //   localStorage.removeItem('recentItems');
  //   // };
  // }, [sid, selectedParty]); // Run effect when sid or selectedParty changes



  //Items Table
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Recalculate amount if any of the relevant fields are updated
    if (['priceItem', 'discount', 'tax', 'qty'].includes(field)) {
      const price = parseFloat(updatedItems[index].priceItem) || 0;
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const discount = parseFloat(updatedItems[index].discount) || 0;
      const tax = parseFloat(updatedItems[index].tax) || 0;

      updatedItems[index].amount = calculateAmount(price, qty, discount, tax);
    }

    setItems(updatedItems);
  };


  //Edit mode for Item Table
  const toggleEditMode = (index, field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [index]: {
        ...prevEditMode[index],
        [field]: !prevEditMode[index]?.[field], // Toggle the field edit mode
      },
    }));
  };



  const calculateAmount = (price, qty, discount, tax) => {
    const discountAmount = (price * qty * (discount / 100)) || 0;
    const taxableAmount = (price * qty) - discountAmount;
    const taxAmount = (taxableAmount * (tax / 100)) || 0;
    return taxableAmount + taxAmount;
  };


  //UPDATE METHOD FOR ITEMS IN ITMES TABLE
  const handleUpdate = async () => {
    // Create a comma-separated string of item IDs
    const itemIds = items.map(item => item.itId).join(','); // Join IDs with commas
    console.log("Item IDs: " + itemIds);

    // Create an array to hold all item objects
    const itemDataArray = items.map(item => ({
      items: item.items,
      hsn: item.hsn,
      qty: item.qty,
      priceItem: item.priceItem,
      discount: item.discount,
      tax: item.tax,
      amount: item.amount,
      saleDate: item.saleDate,
    }));

    try {
      // const fId = localStorage.getItem("fid");
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/itemSalesTable/updateItems/${sId}/${AdId}/${fId}?itIds=${itemIds}`, {
        method: 'PATCH',
        body: JSON.stringify(itemDataArray), // Send the item data array directly
        headers: {
          'Content-Type': 'application/json', // Ensure Content-Type is JSON
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Uncomment and replace with your token if required
        },
      });

      if (response.ok) {
        // fetchRecentItems()
        const result = await response.json();
        console.log("i am total amount response :" + result)
        setTotalAmount(result)
        // Show success toast notification
        toast.success('Updated successfully!', {
          position: 'top-right', // Correct usage of position
          autoClose: 2000, // Display for 2 seconds
        });
        // Handle success (e.g., display success message)
      } else {
        toast.error('Failed to Updated. Please try again.', {
          position: 'top-right', // Correct usage of position
          autoClose: 2000, // Display for 2 seconds
        });
        console.error('Update failed', response.statusText);
        // Handle failure (e.g., display error message)
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  // Delete item function
  const handleDeleteItem = async (index) => {
    const itemId = items[index].itId; // Assuming `id` exists on each item
    console.log("i am itemID :" + itemId)

    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      // Proceed with deletion
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL
        const response = await fetch(`${baseUrl}/api/itemSalesTable/${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // If the item was successfully deleted, remove it from the UI
          const updatedItems = [...items];
          updatedItems.splice(index, 1);
          setItems(updatedItems);

          // Success alert
          Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        } else {
          // Handle error response
          Swal.fire('Error', 'There was a problem deleting the item.', 'error');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        Swal.fire('Error', 'There was a problem connecting to the server.', 'error');
      }
    }
  };


  // Function to handle drag end event
  // const handleDragEnd = (result) => {
  //   // Check if the destination is null (dropped outside the list)
  //   if (!result.destination) return;

  //   const reorderedItems = Array.from(items); // Create a copy of items
  //   const [movedItem] = reorderedItems.splice(result.source.index, 1); // Remove the dragged item
  //   reorderedItems.splice(result.destination.index, 0, movedItem); // Insert it at the new position
  //   setItems(reorderedItems); // Update the items state
  // };

  const handleFieldBlur = () => {
    // Check if both fields are filled
    if (additionalCharges && description) {
      handleSubmit1();
    }
  };

  // Handle PATCH method for Additional charges
  const handleSubmit1 = async () => {
    const data = {
      additionalCharges: additionalCharges,
      description: description
    };

    try {
      // const fid = localStorage.getItem("fid");
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/itemsTotal/update/${fId}?additionalCharges=${additionalCharges}&description=${description}`, {
        method: 'PATCH', // Use PATCH instead of POST
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setGrandTotal(result)
      console.log('PATCH successful', result);
    } catch (error) {
      console.error('PATCH failed', error);
    }
  };



  // const handleRoundOffChange = (value) => {
  //   setRoundOff(parseFloat(value) || 0);
  //   setGrandTotal(150000 + parseFloat(value)); // Adjust grand total based on round off
  // };

  // const handleAddRoundOff = () => {
  //   setShowRoundOffField(true);
  // };

  // const handleReduceRoundOff = () => {
  //   setShowRoundOffField(true);
  // };

  // const handleBankDetailsChange = (field, value) => {
  //   setBankDetails((prevDetails) => ({
  //     ...prevDetails,
  //     [field]: value,
  //   }));
  // };

  // const handleAuthorizedSignatureChange = (value) => {
  //   setAuthorizedSignature(value);
  // };

  // const handleFieldBlur = (fieldSetter) => {
  //   fieldSetter(false);
  // };



  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  //REMOVE DELETE BANK ACCOUNT DETAILS
  const handleRemoveBankAccount = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to remove this bank account?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove bank details from local storage
        localStorage.removeItem("selectedBankDetails");
        setBankDetails(null); // Clear the state
        toast.success('Bank Account Deleted successfully!', {
          position: 'top-right', // Correct usage of position
          autoClose: 2000, // Display for 2 seconds
        });
      }
    });
  };


//QUOTATION SAVING..
const handleSaveQuotation = async () => {
  // Show confirmation dialog
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, save it!',
  });

  if (!isConfirmed) {
    return; // Exit if the user cancels
  }

  setIsLoading(true); // Set loading state

  try {
    // const fId = localStorage.getItem("fid");
    const response = await fetch(`${baseUrl}/api/quotationList/createQuotation/${sId}/${AdId}/${fId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      toast.success(`Quotation saved successfully!`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } else {
      const errorText = await response.text();
      toast.error(`Failed to save quotation: ${errorText}`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  } catch (error) {
    toast.error(`Error saving quotation: ${error.message}`, {
      position: 'top-right',
      autoClose: 2000,
    });
  } finally {
    setIsLoading(false); // Reset loading state
  }
};



  return (
    <Card style={{
      margin: '20px', marginTop: '6%', backgroundColor: 'white',
      // marginRight: '10px',
      marginLeft: '20px',
    }}>
      

      <Grid container spacing={2} style={{marginTop: '2%', margin:"auto"}} alignItems="center">
      <Grid container alignItems="center" spacing={2}>
        <Grid item container alignItems="center" xs>
          <IconButton onClick={() => navigate('/SalesQuationList')} sx={{ color: '#2e2a54' }}>
            <KeyboardBackspaceIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="h4" gutterBottom sx={{ marginTop: '7px', fontWeight:'bold' }}>
            Quotation Form
          </Typography>
        </Grid>

        {/* Submit Button */}
        <Grid item style={{marginRight:'40px', marginTop:'10px'}} >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuotation}
            disabled={isLoading}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#3f51b5',
              color: '#fff',
              fontWeight:'bold',
              padding: '10px 20px',
              margin:'auto',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            {isLoading ? 'Loading...' : 'Save Quotation'}
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
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
                  border: '2px solid', 
                  width: '120px', 
                  height: '40px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                }}
              >
                Add Party
              </Button>
            </Grid>

            {/* Bill To Section */}
            <Typography variant="h5" fontWeight="bold">Bill To</Typography>
            <Card sx={{ padding: '3%', width: '95%', height: '66%', paddingTop: '8%', border: '2px dashed skyblue' }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: '1rem' }}><strong>Billing Name:</strong><span style={{ marginLeft: '35px' }}>{selectedParty?.customerName || 'N/A'}</span></Typography>
                  <Typography sx={{ fontSize: '1rem' }}><strong>Mobile Number:</strong><span style={{ marginLeft: '17px' }}>{selectedParty?.mobileNumber || 'N/A'}</span></Typography>
                  <Typography sx={{ fontSize: '1rem' }}><strong>GSTIN:</strong><span style={{ marginLeft: '83px' }}>{selectedParty?.gstIn || 'N/A'}</span></Typography>
                  <Typography sx={{ fontSize: '1rem' }}><strong>Billing Address:</strong><span style={{ marginLeft: '20px' }}>{selectedParty?.billingAddress || 'N/A'}</span></Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Ship To Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" mt={7} fontWeight="bold">Ship To</Typography>
            <Card sx={{ padding: '3%', width: '120%', height: '66%', paddingTop: '9%', border: '2px dashed skyblue' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}>
                    <strong>Shipping Name:</strong>
                    <span style={{ marginLeft: '32px' }}>{selectedParty?.customerName || 'N/A'}</span>
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}>
                    <strong>Shipping Address:</strong> 
                    <span style={{ marginLeft: '15px' }}>{selectedParty?.shippingAddress || 'N/A'}</span>
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}>
                    <strong>Shipping Pincode:</strong>
                    <span style={{ marginLeft: '17px' }}>{selectedParty?.shippingPincode || 'N/A'}</span>
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', marginBottom: '3px' }}>
                    <strong>Shipping State:</strong> 
                    <span style={{ marginLeft: '33px' }}>{selectedParty?.shippingState || 'N/A'}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>



          <ToastContainer />
          {/* Combined Invoice and Payment Details Section */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              border: '1px dashed #bfbdbd',
              borderRadius: '8px',
              marginTop: '18px',
              padding: '10px',
              marginBottom: '5px',
              marginLeft: '7%',
            }}
          >
            {/* Container Title */}
            <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold', color: '#535556' }}>
              Invoice & Payment Details
            </Typography>

            {/* Form Grid Container */}
            <Grid container spacing={2}>
              
              {/* Display Quotation Number (Non-editable field) */}
              <Grid item xs={12} marginTop={1}>
                <Typography sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#535556' }}>
                  Quotation Number
                </Typography>
                <Typography
                  sx={{
                    backgroundColor: '#F5F5F5',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  {responseData.quotationNumber || 'Not available'}
                </Typography>
              </Grid>

              {/* Quotation Date Input */}
              <Grid item xs={12} md={6} marginTop={1}>
                <Typography sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#535556' }}>
                  Quotation Date
                </Typography>
                <input
                  type="date"
                  name="quotationDate"
                  value={invoiceData.quotationDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#DEDEDF',
                  }}
                />
              </Grid>

              {/* Due Date Input */}
              <Grid item xs={12} md={6} marginTop={1}>
                <Typography sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#535556' }}>
                  Due Date
                </Typography>
                <input
                  type="date"
                  name="dueDate"
                  value={invoiceData.dueDate}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#DEDEDF',
                  }}
                />
              </Grid>

              {/* Payment Terms Input */}
              <Grid item xs={12} md={6} marginTop={1}>
                <Typography sx={{ fontWeight: 'bold', marginBottom: '5px', color: '#535556' }}>
                  Payment Terms (Days)
                </Typography>
                <input
                  type="text"
                  name="paymentTerms"
                  value={invoiceData.paymentTerms}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#DEDEDF',
                  }}
                />
              </Grid>

              {/* Save Button */}
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginTop: '10px' }}
                  onClick={InvoiceFormHandleSubmit}
                  disabled={isSaving}
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
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>NO</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>ITEMS</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>HSN</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>QTY</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>PRICE/ITEM</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>DISCOUNT IN (%)</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>TAX IN (%)</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>AMOUNT</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>DELETE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{index + 1}</TableCell>
                    {/* <TableCell onClick={() => toggleEditMode(index, 'name')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.name ? (
                        <TextField
                          value={item.items}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'name')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        <Typography>{item.items}</Typography>
                      )}
                    </TableCell> */}
                    <TableCell onClick={() => toggleEditMode(index, 'items')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.items ? (
                        <>
                          <TextField
                            value={item.items}
                            onChange={(e) => handleItemChange(index, 'items', e.target.value)}
                            onBlur={() => toggleEditMode(index, 'items')}
                            autoFocus
                          />
                          <TextField
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            onBlur={() => toggleEditMode(index, 'description')}
                            autoFocus
                            sx={{ mt: 1 }} // Optional margin for spacing between fields
                          />
                        </>
                      ) : (
                        <>
                          <Typography>{item.items}</Typography>
                          <Typography color="textSecondary">{item.description}</Typography>
                        </>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'hsn')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.hsn ? (
                        <TextField
                          value={item.hsn}
                          onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'hsn')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
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
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        <Typography>{item.qty}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'priceItem')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.priceItem ? (
                        <TextField
                          type="number"
                          value={item.priceItem}
                          onChange={(e) => handleItemChange(index, 'priceItem', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'priceItem')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
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
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        <Typography>{item.discount}</Typography>
                      )}
                    </TableCell>
                    <TableCell onClick={() => toggleEditMode(index, 'tax')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.tax ? (
                        <TextField
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                          onBlur={() => toggleEditMode(index, 'tax')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        <Typography>{item.tax}</Typography>
                      )}
                    </TableCell>
                    {/* Amount Cell */}
                    {/* <TableCell onClick={() => toggleEditMode(index, 'amount')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.amount ? (
                        <TextField
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const newAmount = Number(e.target.value);
                            handleItemChange(index, 'amount', newAmount);

                            // Get the discount percentage and tax rate
                            // const discountPercentage = item.discount || 0; // Get discount percentage
                            const taxRate = item.tax / 100; // Convert percentage to decimal

                            // // Calculate discount amount
                            // const discountAmount = newAmount * (discountPercentage / 100);

                            // // Calculate amount after discount
                            // const amountAfterDiscount = newAmount - discountAmount;

                            // // Calculate Price/Item based on amount after discount and tax
                            // const newPriceItem = amountAfterDiscount / (1 - taxRate); // Apply tax after discount
                          
                            const newPriceItem=newAmount / (1+(taxRate))


                            // Update Price/Item
                            setItems((prevItems) => {
                              const updatedItems = [...prevItems];
                              updatedItems[index] = {
                                ...updatedItems[index],
                                priceItem: newPriceItem.toFixed(2), // Set new Price/Item
                              };
                              return updatedItems;
                            });
                          }}
                          onBlur={() => toggleEditMode(index, 'amount')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        <Typography>{item.amount}</Typography>
                      )}
                    </TableCell> */}

                    <TableCell onClick={() => toggleEditMode(index, 'amount')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.amount ? (
                        <TextField
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const newAmount = Number(e.target.value);
                            handleItemChange(index, 'amount', newAmount);

                            // Get the discount percentage and tax rate
                            const taxRate = item.tax / 100; // Convert percentage to decimal

                            const newPriceItem = newAmount / (1 + taxRate);

                            // Update Price/Item
                            setItems((prevItems) => {
                              const updatedItems = [...prevItems];
                              updatedItems[index] = {
                                ...updatedItems[index],
                                priceItem: newPriceItem.toFixed(2), // Set new Price/Item
                              };
                              return updatedItems;
                            });
                          }}
                          onBlur={() => toggleEditMode(index, 'amount')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        // Calculate the amount to show before edit mode
                        <Typography>
                          {(
                            (item.priceItem * item.qty) *
                            (1 - (item.discount / 100)) *
                            (1 + (item.tax / 100))
                          ).toFixed(2)}
                        </Typography>
                      )}
                    </TableCell>





                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      <IconButton onClick={() => handleDeleteItem(index)} style={{ color: 'red' }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
            {/* Left aligned Add Item button */}
            <Button onClick={handleAddItemClick} variant="contained" color="primary">
              <Add /> Add Item
            </Button>

            {/* Right aligned Update button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#A1F4BD',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#90EFB0',
                },
              }}
              onClick={handleUpdate} // Call the update function
              disabled={isUpdating} // Disable the button while saving
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
          </Box>

        </Grid>






        {/* Sub Total */}
        <Grid item xs={12} sx={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item sx={{ textAlign: 'right', padding: '10px', borderRight: '1px solid #ccc' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: '20px' }}>Amount: ₹ {amount.amount}</Typography>
            </Grid>
            <Grid item sx={{ textAlign: 'right', padding: '10px', borderRight: '1px solid #ccc' }}>
              <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#555', fontSize: '20px' }}>Discount: ₹ {amount.totalDiscount}</Typography>
            </Grid>
            <Grid item sx={{ textAlign: 'right', padding: '10px', borderRight: '1px solid #ccc' }}>
              <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#555', fontSize: '20px' }}>Tax: ₹ {amount.totalTax}</Typography>
            </Grid>
            <Grid item sx={{ textAlign: 'right', padding: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d9534f', marginRight: '80px', fontSize: '20px' }}>Total Amount: ₹ {amount.totalAmount}</Typography>
            </Grid>
          </Grid>
        </Grid>




        {/* Additional Charges */}
        <Grid item xs={12} sx={{ marginTop: '20px' }}>
          {/* Notes and Terms and Conditions on the Left */}
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={5}>
              {showNotes ? (
                <TextField
                  label="Notes"
                  fullWidth
                  onBlur={() => handleFieldBlur(setShowNotes)}
                  autoFocus
                />
              ) : (
                <Button
                  color="secondary"
                  onClick={() => setShowNotes(true)}
                  size="large"
                  sx={{ fontSize: '1rem' }}
                >
                  + Add Notes
                </Button>
              )}
              <Grid item xs={12} sx={{ marginTop: '10px' }}>
                {showTerms ? (
                  <TextField
                    label="Terms and Conditions"
                    fullWidth
                    onBlur={() => handleFieldBlur(setShowTerms)}
                    autoFocus
                  />
                ) : (
                  <Button
                    color="secondary"
                    onClick={() => setShowTerms(true)}
                    size="large"
                    sx={{ fontSize: '1rem' }}
                  >
                    + Add Terms and Conditions
                  </Button>
                )}
              </Grid>
            </Grid>

            {/* Vertical Divider */}
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 1, height: '100%' }} />
            </Grid>

            {/* Additional Charges and Discounts on the Right */}

            <Grid item xs={5}>
              {showAdditionalCharges ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Additional Charges"
                      fullWidth
                      value={additionalCharges}
                      onChange={(e) => setAdditionalCharges(e.target.value)}  // Update state on change
                      onBlur={handleFieldBlur}  // Call handleFieldBlur on blur
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Description"
                      fullWidth
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}  // Update state on change
                      onBlur={handleFieldBlur}  // Call handleFieldBlur on blur
                    />
                  </Grid>
                </Grid>
              ) : (
                <Button
                  color="secondary"
                  onClick={() => setShowAdditionalCharges(true)}
                  size="large"
                  sx={{ fontSize: '1rem' }}
                >
                  + Add Additional Charges
                </Button>
              )}
            </Grid>


          </Grid>

          {/* Grand Total */}
          <Grid item xs={12} sx={{ marginTop: '20px', marginRight: '30px' }}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d9534f', fontSize: '25px' }}>
                Grand Total: ₹ {grandTotal.grandTotal}
              </Typography>
            </Grid>
          </Grid>

          {/* Horizontal Line */}
          <Grid item xs={12} sx={{ marginTop: '20px' }}>
            <hr style={{ border: '1px solid #ccc' }} />
          </Grid>
        </Grid>





        { /*Bank Details */}
        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
          {/* Bank Details Section */}
          <Grid item xs={12} sm={6} sx={{ paddingLeft: '39px' }}>
            {/* Header for Bank Details */}
            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px', textDecoration: 'underline', color: '#4381E6' }}>
              Bank Details
            </Typography>

            {/* Display Bank Details if available */}
            {bankDetails && ( // Check if bankDetails is not null before accessing its properties
              <>
                <Typography sx={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                  <strong>Account Number:</strong> {bankDetails.accountNumber}
                </Typography>
                <Typography sx={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                  <strong>IFSC Code:</strong> {bankDetails.ifscCode}
                </Typography>
                <Typography sx={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                  <strong>Bank & Branch Name:</strong> {bankDetails.bankName}, {bankDetails.branchName}
                </Typography>
                <Typography sx={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                  <strong>Account Holder Name:</strong> {bankDetails.accountHolderName}
                </Typography>
              </>
            )}

            {/* Container for buttons to place them side by side */}
            <Grid container spacing={2} sx={{ marginBottom: '40px' }}>
              {/* Button to Add Bank Details */}
              <Grid item>
                <Button
                  color="secondary"
                  onClick={() => navigate('/SelectBankAccount')}
                  size="large"
                  style={{ fontSize: '14px', fontWeight: 'bold' }}
                >
                  + Add Bank Details
                </Button>
              </Grid>

              {/* Button to Remove Bank Account */}

              <Grid item>
                <Button
                  variant="text"
                  color="error"
                  style={{ fontSize: '14px', fontWeight: 'bold' }}
                  onClick={handleRemoveBankAccount}
                >
                  Remove Bank Account
                </Button>

              </Grid>
            </Grid>
          </Grid>


          {/* Authorized Signature Section */}
          <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="flex-start">
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Typography sx={{ marginTop: '20px', fontSize: '1rem' }}>
                Authorized Signature for <strong>Map Technos</strong>
              </Typography>
              {/* Image at the top right */}
              <img
                src="../assets/mapStamp.jpg" // Replace with the actual path to your image
                alt="Authorized Signatory"
                style={{
                  maxWidth: '23%', // Set a maximum width for the image
                  marginBottom: '10px',
                  marginRight: '7%',
                  marginTop: '2%' // Add margin below the image
                }}
              />


            </Grid>
          </Grid>
        </Grid>


      

      </CardContent>
    </Card>
  );
};

export default QuotationForm;