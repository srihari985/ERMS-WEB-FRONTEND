import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TablePagination, Button } from '@mui/material';
import { Call as CallIcon } from '@mui/icons-material';

const InsideSalesCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]); // State to store filtered data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dummy data
  const rows = [
    { id: 1, date: '2024-10-01', companyName: 'Company A', mobile: '1234567890', email: 'emailA@example.com', callOption: <CallIcon />, status: 'Completed' },
    { id: 2, date: '2024-10-02', companyName: 'Company B', mobile: '0987654321', email: 'emailB@example.com', callOption: <CallIcon />, status: 'Pending' },
    { id: 3, date: '2024-10-03', companyName: 'Company C', mobile: '1122334455', email: 'emailC@example.com', callOption: <CallIcon />, status: 'In Progress' },
    { id: 4, date: '2024-10-04', companyName: 'Company D', mobile: '6677889900', email: 'emailD@example.com', callOption: <CallIcon />, status: 'Completed' },
    { id: 5, date: '2024-10-05', companyName: 'Company E', mobile: '2233445566', email: 'emailE@example.com', callOption: <CallIcon />, status: 'Pending' },
    { id: 6, date: '2024-10-06', companyName: 'Company F', mobile: '4455667788', email: 'emailF@example.com', callOption: <CallIcon />, status: 'In Progress' },
  ];

  // Handle search term input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Handle search filtering when "Get" button is clicked
  const handleSearch = () => {
    const filteredData = rows.filter(row =>
      row.companyName.toLowerCase().includes(searchTerm) || row.date.includes(searchTerm)
    );
    setFilteredRows(filteredData); // Update filtered rows
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card style={{ margin: '20px', marginTop: '5%', padding: '20px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Typography variant="h5" component="div" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Inside Sales CRM
        </Typography>

        <div>
          {/* Search Bar */}
          <TextField
            label="Search by Company Name or Date"
            variant="outlined"
            style={{ marginBottom: '20px', width: '30%' }}
            onChange={handleSearchInputChange}
          />
          <Button
            style={{ color: '#fff', backgroundColor: 'blue',  width: '80px',  // Adjust width
                height: '50px',  // Adjust height
                marginLeft: '10px',
                fontSize: '16px',  }}
            onClick={handleSearch} // Trigger search on button click
          >
            Get
          </Button>
        </div>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>S.No</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Company Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Mobile Number</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Call Option</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredRows.length > 0 ? filteredRows : rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.companyName}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.mobile}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.email}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                    <IconButton>{row.callOption}</IconButton>
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredRows.length > 0 ? filteredRows.length : rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25,50]}
        />
      </CardContent>
    </Card>
  );
};

export default InsideSalesCRM;
