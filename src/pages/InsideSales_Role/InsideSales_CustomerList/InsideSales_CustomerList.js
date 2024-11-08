import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton, Box, Typography, Modal, Button, TableCell, TextField, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { useAuth } from '../../../AuthProvider';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';


const baseUrl = process.env.REACT_APP_API_BASE_URL;

const InsideSales_CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const { sId } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu anchor
  const [newCustomer, setNewCustomer] = useState({
    contactPerson: '',
    contactNumber: '',
    companyName: '',
    emailid: '',
    gstIn: '',
    address: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Change this to adjust rows per page

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({}); // to hold the data for editing
  const [customerId, setCustomerId]=useState('')
  const navigate = useNavigate();

  const handleOpen = (row) => {
    setSelectedRow(row);
    setCustomerId(row.cId)
    setEditData(row); // pre-fill the edit form
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setEditData({});
  };

  //Handle Delete
  const handleDelete = async (cId) => {
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
        const response = await fetch(`${baseUrl}/api/contactForm/delete/${cId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Optionally: refresh data or remove the deleted item from your state
          toast.success('Customer deleted successfully!', { autoClose: 2000 });
          handleGetData();
        } else {
          console.error('Failed to delete item');
          toast.error('Failed to delete Customer.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error deleting Customer.');
      }
    }
  };


  //Edit Customer Details
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/contactForm/update/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        // Optionally: refresh data or update the edited item in your state
        toast.success('Customer Details Updated successfully!', { autoClose: 2000 });
        handleGetData();
        handleClose(); // Close the modal after update
      } else {
        console.error('Failed to update item');
        toast.error('Failed to Update Customer Details.');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Error Update Customer Details.');
    }
  };



  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      (item.companyName && item.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.contactPerson && item.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.contactNumber && item.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.emailid && item.emailid.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);


  // GET Method to retrieve customer data
  const handleGetData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/contactForm/getAll`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } else {
        swal("Error", "Failed to fetch customer data.", "error");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // POST Method to add a new customer
  const handleCustomerSubmit = async () => {
    try {
      const { contactPerson, contactNumber, companyName, emailid, gstIn, address } = newCustomer;

      const response = await fetch(`${baseUrl}/api/contactForm/save/${sId}?contactPerson=${contactPerson}&contactNumber=${contactNumber}&companyName=${companyName}&emailId=${emailid}&address=${address}&gstIn=${gstIn}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        swal("Success", "Customer details submitted successfully!", "success");
        setOpenDialog(false);
        handleGetData(); // Call GET method to refresh the data
      } else {
        swal("Error", "Failed to add customer.", "error");
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      swal("Error", "An unexpected error occurred.", "error");
    }
  };

  const handleAddCustomer = () => {
    setNewCustomer({
      contactPerson: '',
      contactNumber: '',
      companyName: '',
      emailid: '',
      gstIn: '',
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };


  // Handle dropdown menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    if (format === 'Excel') {
      exportToExcel();
    } else if (format === 'PDF') {
      exportToPDF();
    } else if (format === 'JSON') {
      exportToJSON();
    }
    handleMenuClose();
  };

  //Export To Excel
  const exportToExcel = () => {
    // Map to filter out unwanted fields (cId, salesId)
    const filteredFields = filteredData.map(({ cId, contactPerson, contactNumber, companyName, emailId, address, gstIn }) => ({
      cId,
      contactPerson,
      contactNumber,
      companyName,
      emailId,
      address,
      gstIn
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredFields); // Use the filtered data

    // Define column widths
    worksheet['!cols'] = [
      { wch: 10 },  // cId
      { wch: 20 },  // contactPerson
      { wch: 15 },  // contactNumber
      { wch: 25 },  // companyName
      { wch: 30 },  // emailId
      { wch: 40 },  // address
      { wch: 15 },  // gstIn
    ];

    // Example: Set cell alignment for header row
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1']; // Adjust according to the number of columns
    headerCells.forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          },
          font: {
            bold: true,
            color: { rgb: "FFFFFF" }
          },
          fill: {
            fgColor: { rgb: "black" } // Set background color for headers (blue)
          }
        };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

    // Write the file
    XLSX.writeFile(workbook, 'CustomerList.xlsx');
  };

//Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Customer List', 20, 10);
    doc.autoTable({
      head: [['S.No', 'Contact Person', 'Contact Number', 'Email Id', 'GSTIN No', 'Company Name', 'Address']],
      body: filteredData.map((item, index) => [
        index + 1,
        item.contactPerson,
        item.contactNumber,
        item.emailId,
        item.gstIn,
        item.companyName,
        item.address
      ]),
    });
    doc.save('CustomerList.pdf');
  };

  //Export to JSON
  const exportToJSON = () => {
    const jsonData = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CustomerList.json';
    a.click();
    URL.revokeObjectURL(url);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/InsideSales_Dashboard')} sx={{ color: '#2e2a54' }}>
            <KeyboardBackspaceIcon fontSize="large" />
          </IconButton>
          <Typography variant="h3" component="h3" sx={{ marginLeft: 2 }}>
            Customer List
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <Button variant="outlined" onClick={handleMenuClick} startIcon={<FileDownloadIcon />}>
            Export
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {/* <MenuItem onClick={() => handleExport('Excel')} startIcon={<FileDownloadIcon />}>Excel</MenuItem> */}
            <MenuItem onClick={() => handleExport('Excel')}>
              <ListItemIcon>
                <SimCardDownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Excel" sx={{ fontWeight: 'bold' }} />
            </MenuItem>
            {/* <MenuItem onClick={() => handleExport('PDF')}>PDF</MenuItem> */}
            <MenuItem onClick={() => handleExport('PDF')}>
              <ListItemIcon>
                <PictureAsPdfIcon />
              </ListItemIcon>
              <ListItemText primary="PDF" sx={{ fontWeight: 'bold' }} />
            </MenuItem>
            {/* <MenuItem onClick={() => handleExport('JSON')}>JSON</MenuItem> */}
            <MenuItem onClick={() => handleExport('JSON')}>
              <ListItemIcon>
                <FilePresentIcon />
              </ListItemIcon>
              <ListItemText primary="JSON" sx={{ fontWeight: 'bold' }} />
            </MenuItem>
          </Menu>
        </Box>




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
          <Button variant="contained" style={{color:"white", backgroundColor:"#5ACEAA", fontWeight:'bold'}} onClick={handleAddCustomer}>
            Add New Customer
          </Button>
        </Box>
      </Box>

      <ToastContainer />

      {/*Table data*/}
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
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>S.No</th>
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Company Name</th>
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Contact Person</th>
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Contact Number</th>
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Email Id</th>
           
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Address</th>
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>GSTIN No</th>
    
            <th style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <tr key={row.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{index + 1 + page * rowsPerPage}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.companyName}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactPerson}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactNumber}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.emailId}</td>
  
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.address}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.gstIn}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
               
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
                      <Button
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
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(row.cId)}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*// Modal Component*/}
      <Modal open={open} onClose={handleClose}>
    <div style={{ 
        padding: '20px', 
        background: 'white', 
        margin: 'auto', 
        marginTop: '100px', 
        width: '80%', // Adjusted to fit better in the viewport
        maxWidth: '800px', // Added max-width for larger screens
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        outline: 'none'
    }}>
        <h2 style={{ color: '#333', textAlign: 'center' }}>Edit Row</h2>
        
        {/* Flexbox Container for Fields */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '20px' }}>
            <TextField
                label="Contact Person"
                value={editData.contactPerson || ''}
                onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })}
                variant="outlined"
                style={{ flex: '1 1 48%', margin: '5px' }} // Adjusting flex properties
            />
            <TextField
                label="Contact Number"
                value={editData.contactNumber || ''}
                onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                variant="outlined"
                style={{ flex: '1 1 48%', margin: '5px' }} // Adjusting flex properties
            />
            <TextField
                label="Email Id"
                value={editData.emailId || ''}
                onChange={(e) => setEditData({ ...editData, emailId: e.target.value })}
                variant="outlined"
                style={{ flex: '1 1 48%', margin: '5px' }} // Adjusting flex properties
            />
            <TextField
                label="GSTIN No"
                value={editData.gstIn || ''}
                onChange={(e) => setEditData({ ...editData, gstIn: e.target.value })}
                variant="outlined"
                style={{ flex: '1 1 48%', margin: '5px' }} // Adjusting flex properties
            />
            <TextField
                label="Company Name"
                value={editData.companyName || ''}
                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                variant="outlined"
                style={{ flex: '1 1 48%', margin: '5px' }} // Adjusting flex properties
            />
            <TextField
                label="Address"
                value={editData.address || ''}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                variant="outlined"
                style={{ flex: '1 1 48%', margin: '5px' }} // Adjusting flex properties
            />
        </div>
        
        {/* Button Container */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
                onClick={handleEditSubmit} 
                color="primary" 
                variant="contained" 
                style={{ margin: '10px 0' }}>
                Update
            </Button>
            <Button 
                onClick={handleClose} 
                color="secondary" 
                variant="outlined" 
                style={{ margin: '10px 0' }}>
                Cancel
            </Button>
        </div>
    </div>
</Modal>

      {/* Pagination Component */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Customer Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle variant='h3'>New Customer Details</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Contact Person" name="contactPerson" value={newCustomer.contactPerson} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Contact Number" name="contactNumber" value={newCustomer.contactNumber} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Company Name" name="companyName" value={newCustomer.companyName} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Email ID" name="emailid" value={newCustomer.emailid} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="GSTIN No" name="gstIn" value={newCustomer.gstIn} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Address" name="address" value={newCustomer.address} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="secondary">Cancel</Button>
          <Button onClick={handleCustomerSubmit} variant="contained" color="secondary">Add Customer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InsideSales_CustomerList;