import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, Button, TextField, MenuItem, Select, InputLabel, FormControl,
  Card, CardContent, Box, Radio, RadioGroup, FormControlLabel, Modal,IconButton,Typography,Grid,TablePagination
} from '@mui/material';

import { Add, Delete,  KeyboardBackspace as KeyboardBackspaceIcon  } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthProvider';



const ItemTable = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Track the list of items from the backend
  const [selectedItemsInTable, setSelectedItemsInTable] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Modal state
  const { fId , sId, setitId} = useAuth();
  console.log("I am item table fid :" + fId)
  console.log("I am item table sid :" + sId)
  



  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);


  // State to capture form input values
  const [newItem, setNewItem] = useState({
    items: '',
    hsn: '',
    qty: '',
    priceItem: '',
    discount: '',
    tax: '',
    amount: '',
  });

  // Fetch items from the backend when the component mounts
  // Fetch items by form ID
const fetchItemsByFormId = async () => {

  try {
    const response = await fetch(`http://192.168.29.219:8083/api/itemstable/getAllForms`);
    if (response.ok) {                                     
      const data = await response.json();
      setItems(data); // Set the fetched items to the state
      localStorage.setItem('items', JSON.stringify(data)); // Save items to localStorage
      console.log('Items fetched successfully');
    } else {
      console.error('Failed to fetch items');
    }
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

useEffect(() => {
  // Load items from localStorage
  const savedItems = localStorage.getItem('items');
  
  if (savedItems) {
    setItems(JSON.parse(savedItems));
  }
  fetchItemsByFormId(); // Fetch items by form ID
}, []);


 
const getFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Extracts only the 'YYYY-MM-DD' part
};


const handleAddItems = async (items) => {
  try {
    // Get the current date in 'YYYY-MM-DD' format
    const saleDate = getFormattedDate();
    const sId = localStorage.getItem("sId");

    // Add the saleDate to each item in the selected items
    const itemsWithSaleDate = selectedItemsInTable.map(item => ({
      ...item,
      saleDate: saleDate, // Add the current saleDate
    }));

    const response = await fetch(`http://192.168.29.219:8083/api/itemSalesTable/saveitems/${fId}/${sId}`, {
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
        console.log("itIds: ", itIds); // Log the extracted itIds
      } else {
        console.log("No itId found in selected items.");
      }

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

  // Save new item and add it to the items list
  const handleSubmit = async () => {
    const newItemData = {
      items: newItem.items || '-',
      hsn: newItem.hsn || '-',
      qty: newItem.qty || '-',
      priceItem: newItem.priceItem || '-',
      discount: newItem.discount || '-',
      tax: newItem.tax || 'None',  // Capture tax (GSTIN) value
      amount: newItem.amount || '-', 
    };
  
    try {
      // Send POST request to your backend API
      const response = await fetch(`http://192.168.29.219:8083/api/itemstable/saveitems/${fId}`, {
        method: 'POST',                 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemData),
      });
  
      if (response.status === 201) {
        // On successful response, add new item to the table
        setItems((prevItems) => [...prevItems, newItemData]);
        handleCloseModal(); // Close the modal after saving
      } else {
        console.error('Failed to create item');
      }
    } catch (error) {
      console.error('Error while creating item:', error);
    }
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
            <TextField label="Search Items" variant="outlined" size="small" />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150,marginLeft:'10px' }}>
              <InputLabel>Select Category</InputLabel>
              <Select label="Select Category">
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={10}>Category 1</MenuItem>
                <MenuItem value={20}>Category 2</MenuItem>
                <MenuItem value={30}>Category 3</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <Button variant="outlined" onClick={handleCreateNewItem} sx={{marginRight:'8px'}}>
              Create New Item
            </Button>
          </div>
          
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>
                  <Checkbox />
                </TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>ITEM NAME</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>HSN</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Quantity</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>PRICE</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItemsInTable.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.items}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.hsn || '-'}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.qty}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{item.amount}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}> <Button
                    variant="contained"
                    color="secondary">add</Button></TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25,50]}
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
      transform: 'translate(-50%, -50%)', // Center the modal
      width: '80%', // Set modal width (adjust this for laptop screen size)
      maxWidth: '600px', // Max width to keep the modal from becoming too wide
      bgcolor: 'background.paper',
      borderRadius: '8px',
      boxShadow: 24,
      p: 4,
    }}
  >
    <h2 id="create-new-item-modal">Create New Item</h2>

    {/* Item Name */}
    <TextField
      label="Item Name"
      name="items"
      value={newItem.items}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />

    {/* HSN No */}
    <TextField
      label="HSN No"
      name="hsn"
      value={newItem.hsn}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />

    {/* Quantity */}
    <TextField
      label="Quantity"
      name="qty"
      value={newItem.qty}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />

    {/* Price per Item */}
    <TextField
      label="Price per Item"
      name="priceItem"
      value={newItem.priceItem}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />

    {/* Discount */}
    <TextField
      label="Discount"
      name="discount"
      value={newItem.discount}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />

    {/* Tax (Dropdown) */}
    <FormControl fullWidth margin="normal">
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
      </Select>
    </FormControl>

    {/* Amount */}
    <TextField
      label="Amount"
      name="amount"
      value={newItem.amount}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />

    <Box mt={2} display="flex" justifyContent="flex-end">
      <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
        Cancel
      </Button>
      <Button variant="contained" onClick={handleSubmit}>
        Save Item
      </Button>
    </Box>
  </Box>
      </Modal>


    </Card>
  );
};

export default ItemTable;