import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton, Box, Typography, Button, TextField, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnPaidList = () => {
  const [invoiceNumber, setInvoiceNumber] = useState(''); // State for invoice number
  const [selectedDate, setSelectedDate] = useState(''); // State for date
  const [data, setData] = useState([]); // State for original data
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [page, setPage] = useState(0); // Current page state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page state
  const navigate = useNavigate();

  useEffect(() => {
    handleGetData(); // Fetch data when the component mounts
  }, []);

  const handleGetData = () => {
    const mockData = [
      { sNo: 1, contactPersonName: "John Doe", invoiceNumber: "INV-101", invoiceDate: "2023-09-01", dueDate: "2023-09-15", invoiceAmount: "25,00,000", transactionId: "TXN99999" },
      { sNo: 2, contactPersonName: "Jane Smith", invoiceNumber: "INV-102", invoiceDate: "2023-08-15", dueDate: "2023-09-05", invoiceAmount: "18,00,000", transactionId: "TXN88888" },
      { sNo: 3, contactPersonName: "George Martin", invoiceNumber: "INV-103", invoiceDate: "2023-07-10", dueDate: "2023-07-25", invoiceAmount: "12,00,000", transactionId: "TXN77777" },
      { sNo: 4, contactPersonName: "John Doe", invoiceNumber: "INV-101", invoiceDate: "2023-09-01", dueDate: "2023-09-15", invoiceAmount: "25,00,000", transactionId: "TXN99999" },
      { sNo: 5, contactPersonName: "Jane Smith", invoiceNumber: "INV-102", invoiceDate: "2023-08-15", dueDate: "2023-09-05", invoiceAmount: "18,00,000", transactionId: "TXN88888" },
      { sNo: 6, contactPersonName: "George Martin", invoiceNumber: "INV-103", invoiceDate: "2023-07-10", dueDate: "2023-07-25", invoiceAmount: "12,00,000", transactionId: "TXN77777" },
      // Add more mock data as needed for testing pagination
    ];
    setData(mockData);
    setFilteredData(mockData); // Display the full table initially
  };

  const handleFilterData = () => {
    // Filter based on both date and invoice number
    const filtered = data.filter(item => {
      const matchesInvoiceNumber = invoiceNumber === '' || item.invoiceNumber.toLowerCase().includes(invoiceNumber.toLowerCase());
      const matchesDate = selectedDate === '' || item.invoiceDate === selectedDate;
      return matchesInvoiceNumber && matchesDate;
    });
    setFilteredData(filtered);
    setPage(0); // Reset to first page after filtering
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the current page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rows per page
    setPage(0); // Reset to first page
  };

  // Calculate the rows to display based on pagination
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <IconButton onClick={() => navigate('/SalesInvoiceList')} sx={{ color: '#2e2a54' }}>
          <KeyboardBackspaceIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h3" sx={{ marginLeft: 1, fontWeight: 'bold' }}>
          Unpaid Sales Invoice:
        </Typography>
      </Box>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '10px',
          marginBottom: '40px',
          position: 'relative',
          top: '20px',
          right: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {/* Date Filter */}
          <TextField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} // Set selected date
            InputLabelProps={{ shrink: true }}
            style={{ width: "100%" }}
          />

          {/* Invoice Number Filter */}
          <TextField
            label="Invoice Number"
            variant="outlined"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)} // Set invoice number
            style={{ width: "100%" }}
          />

          {/* GET Button */}
          <Button
            variant="contained"
            onClick={handleFilterData} // Call filtering function
            style={{
              padding: "10px 20px",
              backgroundColor: "#41CECA",
              color: "black",
              fontWeight: "bold",
            }}
          >
            GET
          </Button>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            marginLeft: '20px',
          }}
        >
          <thead>
            <tr>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>S.No</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>Contact Person Name</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>Invoice Number</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>Invoice Date</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>Due Date</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>Invoice Amount</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffebee' }}>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.sNo}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.sNo}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactPersonName}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.invoiceNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.invoiceDate}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.dueDate}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.invoiceAmount}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default UnPaidList;