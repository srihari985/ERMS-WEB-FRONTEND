import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton, Box, Typography, Button, TextField, TablePagination} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InsideSales_PaidInvoiceList = () => {
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
      { 
        sNo: 1, 
        contactPersonName: "John Doe", 
        invoiceNumber: "INV-001", 
        invoiceDate: "2023-09-01", 
        dueDate: "2023-09-15", 
        paymentDate: "2023-09-10", 
        invoiceAmount: "20,00,000", 
        amountPaid: "20,00,000", 
        paymentMethod: "Credit Card", 
        transactionId: "TXN12345"
      },
      { 
        sNo: 2, 
        contactPersonName: "Jane Smith", 
        invoiceNumber: "INV-002", 
        invoiceDate: "2023-08-15", 
        dueDate: "2023-09-01", 
        paymentDate: "2023-08-25", 
        invoiceAmount: "15,00,000", 
        amountPaid: "15,00,000", 
        paymentMethod: "Bank Transfer", 
        transactionId: "TXN67890"
      },
      { 
        sNo: 3, 
        contactPersonName: "George Martin", 
        invoiceNumber: "INV-003", 
        invoiceDate: "2023-07-10", 
        dueDate: "2023-07-25", 
        paymentDate: "2023-07-20", 
        invoiceAmount: "10,00,000", 
        amountPaid: "10,00,000", 
        paymentMethod: "Cash", 
        transactionId: "TXN11111"
      },
      { 
        sNo: 1, 
        contactPersonName: "John Doe", 
        invoiceNumber: "INV-001", 
        invoiceDate: "2023-09-01", 
        dueDate: "2023-09-15", 
        paymentDate: "2023-09-10", 
        invoiceAmount: "20,00,000", 
        amountPaid: "20,00,000", 
        paymentMethod: "Credit Card", 
        transactionId: "TXN12345"
      },
      { 
        sNo: 2, 
        contactPersonName: "Jane Smith", 
        invoiceNumber: "INV-002", 
        invoiceDate: "2023-08-15", 
        dueDate: "2023-09-01", 
        paymentDate: "2023-08-25", 
        invoiceAmount: "15,00,000", 
        amountPaid: "15,00,000", 
        paymentMethod: "Bank Transfer", 
        transactionId: "TXN67890"
      },
      { 
        sNo: 3, 
        contactPersonName: "George Martin", 
        invoiceNumber: "INV-003", 
        invoiceDate: "2023-07-10", 
        dueDate: "2023-07-25", 
        paymentDate: "2023-07-20", 
        invoiceAmount: "10,00,000", 
        amountPaid: "10,00,000", 
        paymentMethod: "Cash", 
        transactionId: "TXN11111"
      }
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
        <IconButton onClick={() => navigate('/InsideSales_InvoiceList')} sx={{ color: '#2e2a54' }}>
          <KeyboardBackspaceIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h3" sx={{ marginLeft: 1, fontWeight: 'bold' }}>
          Paid Inside Sales Invoice:
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
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>S.No</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Contact Person Name</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Invoice Number</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Invoice Date</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Due Date</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Payment Date</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Invoice Amount</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Amount Paid</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Payment Method</th>
              <th style={{ color: '#000', padding: '10px', border: '1px solid #ccc', backgroundColor: '#A1F4BD' }}>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.sNo}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.contactPersonName}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.invoiceNumber}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.invoiceDate}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.dueDate}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.paymentDate}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.invoiceAmount}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.amountPaid}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{row.paymentMethod}</td>
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

export default InsideSales_PaidInvoiceList;