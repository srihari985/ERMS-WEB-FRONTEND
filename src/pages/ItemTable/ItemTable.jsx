import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, Button, TextField, MenuItem, Select, InputLabel, FormControl,
  Card, CardContent, Box, Radio, RadioGroup, FormControlLabel, Modal, IconButton, Typography, Grid, TablePagination
} from '@mui/material';

import {KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';


const baseUrl = process.env.REACT_APP_API_BASE_URL;

const ItemTable = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Track the list of items from the backend
  const [selectedItemsInTable, setSelectedItemsInTable] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Modal state
  const { fId, sId, setitId, setSelectedAddItems, AdId } = useAuth();
  const [loading, setLoading] = useState(false);


  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  //search fields
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);


  // State to capture form input values
  const [newItem, setNewItem] = useState({
    items: '',
    hsn: '',
    qty: '',
    priceItem: '',
    discount: '',
    category: '',
    description: '',
    tax: '',
    amount: '',
  });


  // Fetch items by form ID
  const fetchItemsByFormId = async () => {

    try {
      const response = await fetch(`${baseUrl}/api/itemstable/getAllForms`);
      if (response.ok) {
        const itemsData = await response.json();
        setItems(itemsData); // Set the fetched items to the state
        
        console.log('Items fetched successfully');

        // Extract unique categories
        const uniqueCategories = [...new Set(itemsData.map(item => item.category))];
        setCategoryOptions(uniqueCategories);

      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    
    fetchItemsByFormId(); // Fetch items by form ID
  }, []);



  const getFormattedDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Extracts only the 'YYYY-MM-DD' part
  };

  //Selected  Itmes for 
  const handleAddItems = async (items) => {
    try {
      // Get the current date in 'YYYY-MM-DD' format
      const saleDate = getFormattedDate();
      // const sId = localStorage.getItem("sId");
      // const fid = localStorage.getItem("fid");

      // Add the saleDate to each item in the selected items
      const itemsWithSaleDate = selectedItemsInTable.map(item => ({
        ...item,
        saleDate: saleDate, // Add the current saleDate
      }));
      console.log("Selected Items in table:", itemsWithSaleDate);

      const response = await fetch(`${baseUrl}/api/itemSalesTable/saveitems/${AdId}/${fId}/${sId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemsWithSaleDate), // Use the updated items with saleDate
      });

      if (response.ok) {
        // Extract the itId from the selected items
        const itIds = itemsWithSaleDate.map(item => item.itId); // Extract all itIds

        // If you only want to set the first itId or handle multiple:
        if (itIds.length > 0) {
          setitId(itIds); // Assuming setitId is a state setter
          console.log("itIds:", itIds); // Log the extracted itIds
        } else {
          console.log("No itId found in selected items.");
        }

        setSelectedAddItems(itemsWithSaleDate);
        console.log("Selected Items:", selectedItemsInTable);

        // Store the posted data in localStorage before navigating


        // Navigate to QuotationForm
        navigate('/QuotationForm');
      } else {
        console.error('Failed to post selected items');
      }
    } catch (error) {
      console.error('Error while posting selected items:', error);
    }
  };




  const handleCheckboxChange = (item) => {
    setSelectedItemsInTable((prevItems) => {
      if (prevItems.includes(item)) {
        return prevItems.filter((i) => i !== item);
      }
      return [...prevItems, item];
    });
  };

  const handleCreateNewItem = () => {
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const newItemData = {
      items: newItem.items || '-',
      hsn: newItem.hsn || '-',
      qty: newItem.qty || '-',
      priceItem: newItem.priceItem || '-',
      discount: newItem.discount || '-',
      category: newItem.category || '-',
      description: newItem.description || '-',
      tax: newItem.tax || 'None', // Capture tax (GSTIN) value
      amount: newItem.amount || '-',
    };

    try {
      setLoading(true); // Set loading state to true
      // const fid = localStorage.getItem("fid");

      // Send POST request to your backend API
      const response = await fetch(`${baseUrl}/api/itemstable/saveitems/${fId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemData),
      });

      if (response.status === 201) {
        // On successful response, close modal
        handleCloseModal();

        // Show success toast message
        toast.success('Item saved successfully!', { autoClose: 2000 });

        // Call the GET request after POST is successful
        // const fetchItemsResponse = await fetch(`${baseUrl}/api/itemstable/getAllForms`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (fetchItemsResponse.ok) {
        //   const itemsData = await fetchItemsResponse.json();
        //   // Handle the fetched data (e.g., set it to the state)
        //   setItems(itemsData); // Assuming you have setItems function to update your items list
        // } else {
        //   console.error('Failed to fetch items after POST');
        //   toast.error('Failed to fetch items after saving.'); // Show error toast
        // }
        fetchItemsByFormId();

      } else {
        console.error('Failed to create item');
        toast.error('Failed to create item.'); // Show error toast
      }
    } catch (error) {
      console.error('Error while creating item:', error);
      toast.error('Network error: Failed to create item.'); // Show error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };




   //Handle Delete
   const handleDelete = async (itId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/api/itemstable/${itId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Optionally: refresh data or remove the deleted item from your state
          toast.success('Item deleted successfully!', { autoClose: 2000 });
          fetchItemsByFormId();
        } else {
          console.error('Failed to delete item');
          toast.error('Failed to delete Item.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error deleting Item.');
      }
    }
  };



  //search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredItems = items
    .filter(item =>
      item.items.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? item.category === selectedCategory : true)
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <Card sx={{ marginTop: 12, marginRight: "15px", marginLeft: "15px" }}>
      <Grid item container alignItems="center" xs >
        <IconButton onClick={() => navigate('/QuotationForm')} sx={{ color: '#2e2a54' }}>
          <KeyboardBackspaceIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Item Table
        </Typography>
      </Grid>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <div>
            <TextField label="Search Items" variant="outlined" size="small" value={searchQuery} onChange={handleSearchChange} />
           
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150, ml: 2 }}>
              <InputLabel>Select Category</InputLabel>
              <Select
                label="Select Category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {categoryOptions.map((category, index) => (
                  <MenuItem key={index} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Button variant="outlined" onClick={handleCreateNewItem} sx={{ marginRight: '8px' }}>
              Create New Item
            </Button>
          </div>

        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>
                  Select
                </TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>ITEM NAME</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>ITEM ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>HSN</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Quantity</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>PRICE</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Category</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Description</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE", textAlign: 'center', backgroundColor: "#A1F4BD", }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItemsInTable.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.items}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.itId}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.hsn || '-'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.qty}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.priceItem}</TableCell>

                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.category}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.description}</TableCell>

                  {/* <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}> <Button
                    variant="contained"
                    color="secondary">add</Button></TableCell> */}

                <TableCell
                      style={{
                        textAlign: 'center',
                        border: '1px solid #d6d6d6',
                        padding: '12px',
                        fontSize: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                      }}
                    >
                      {/* <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpen(row)}
                        sx={{
                          fontSize: '12px',
                          padding: '5px 10px',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#536dfe'
                        }}
                      >
                        add
                      </Button> */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(item.itId)}
                        sx={{
                          fontSize: '12px',
                          padding: '5px 10px',
                          transition: 'all 0.3s ease',
                          // backgroundColor: hoveredRow === index ? '#ff6b6b' : '#f44336',
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>



          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'start', mt: 2 }}>
          <Button variant="contained" onClick={() => handleAddItems(items)}>
            Add Selected Items
          </Button>
         
          <ToastContainer />
        </Box>
      </CardContent>

      {/* Modal for Create New Item */}


      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="create-new-item-modal"
        aria-describedby="form-to-create-new-item"
        sx={{ overflow: 'auto' }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="create-new-item-modal">Create New Item</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                name="items"
                value={newItem.items}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="HSN No"
                name="hsn"
                value={newItem.hsn}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                name="qty"
                value={newItem.qty}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price per Item"
                name="priceItem"
                value={newItem.priceItem}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount"
                name="discount"
                value={newItem.discount}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tax</InputLabel>
                <Select
                  label="Tax"
                  name="tax"
                  value={newItem.tax}
                  onChange={handleInputChange}
                >
                  <MenuItem value=""><em>Select GSTIN</em></MenuItem>
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Exempted">Exempted</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                  <MenuItem value="gstIn@0%">gstIn@0%</MenuItem>
                  <MenuItem value="gstIn@0.1%">gstIn@0.1%</MenuItem>
                  <MenuItem value="gstIn@0.25%">gstIn@0.25%</MenuItem>
                  <MenuItem value="gstIn@3%">gstIn@3%</MenuItem>
                  <MenuItem value="gstIn@5%">gstIn@5%</MenuItem>
                  <MenuItem value="gstIn@12%">gstIn@12%</MenuItem>
                  <MenuItem value="gstIn@18%">gstIn@18%</MenuItem>
                  <MenuItem value="gstIn@28%">gstIn@28%</MenuItem>
                  {/* Additional options here */}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                value={newItem.amount}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>

         <Box mt={2} display="flex" justifyContent="flex-end">
      <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
        Cancel
      </Button>
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Save Item'}
      </Button>
     
    </Box>  
        </Box>
      </Modal>


    </Card>
  );
};

export default ItemTable;