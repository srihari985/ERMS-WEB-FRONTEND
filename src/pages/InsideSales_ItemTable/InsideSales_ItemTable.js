import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, Button, TextField, MenuItem, Select, InputLabel, FormControl,
  Card, CardContent, Box, Radio, RadioGroup, FormControlLabel, Modal,IconButton,Typography,Grid
} from '@mui/material';

import { Add, Delete,  KeyboardBackspace as KeyboardBackspaceIcon  } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const InsideSales_ItemTable = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Track the list of items from the backend
  const [selectedItemsInTable, setSelectedItemsInTable] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Modal state

  // State to capture form input values
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: '',
    price: '',
    stock: '',
    measuringUnit: 'PCS',
    gstInIn: '', // Added gstInIN field
  });

  // Fetch items from the backend when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://192.168.29.199:8080/api/addlist/getAll');
        setItems(response.data); // Set the fetched items to the state
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleAddItems = () => {
    navigate('/InsideSales_QuotationForm', { state: { selectedItems: selectedItemsInTable } });
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
  const handleSaveNewItem = async () => {
    const newItemData = {
      name: newItem.name,
      category: newItem.category || '-',
      price: newItem.price || '-',
      stock: newItem.stock || '-',
      gstInIN: newItem.gstInIN || 'None', // Capture gstInIN value
    };

    try {
      // Send POST request to your backend API
      const response = await axios.post('http://192.168.29.199:8080/api/addlist/save', newItemData);

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

  return (
    <Card sx={{ marginTop: 12, marginRight: "15px", marginLeft: "15px" }}>
      <Grid item container alignItems="center" xs >
            <IconButton onClick={() => navigate('/InsideSales_QuotationForm')} sx={{ color: '#2e2a54' }}>
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="h4" gutterBottom>
              Item Table
            </Typography>
          </Grid>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField label="Search Items" variant="outlined" size="small" />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Select Category</InputLabel>
            <Select label="Select Category">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={10}>Category 1</MenuItem>
              <MenuItem value={20}>Category 2</MenuItem>
              <MenuItem value={30}>Category 3</MenuItem>
            </Select>
          </FormControl>
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
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>STOCK</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>PRICE</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItemsInTable.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code || '-'}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell> <Button
                    variant="contained"
                    color="secondary">add</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" onClick={handleAddItems}>
            Add Selected Items
          </Button>

          <Button variant="outlined" onClick={handleCreateNewItem}>
            Create New Item
          </Button>
        </Box>
      </CardContent>

      {/* Modal for Create New Item */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="create-new-item-modal"
        aria-describedby="form-to-create-new-item"
      >
        <Box  sx={{
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
          }}>
          <h2 id="create-new-item-modal">Create New Item</h2>
          {/* Form similar to the image you provided */}
          <FormControl fullWidth margin="normal">
            <RadioGroup row>
              <FormControlLabel value="Product" control={<Radio />} label="Product" />
              <FormControlLabel value="Service" control={<Radio />} label="Service" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              <MenuItem value="Category 1">Category 1</MenuItem>
              <MenuItem value="Category 2">Category 2</MenuItem>
              <MenuItem value="Category 3">Category 3</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Item Name"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sales Price"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
           
          
          {/* gstInIN dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>GSTIN</InputLabel>
            <Select
              label="GstIN"
              name="gstInIn"
              value={newItem.gstInIn}
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Select gstInIn</em></MenuItem>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Exempted">Exempted</MenuItem>
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

          <TextField
            label="HSN NO"
            name="HsnNo"
            value={newItem.stock}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="Description"
            value={newItem.stock}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveNewItem}>
              Save Item
            </Button>
          </Box>
        </Box>
      </Modal>

    </Card>
  );
};

export default InsideSales_ItemTable;