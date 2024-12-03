import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material';
import { Call as CallIcon } from '@mui/icons-material';
import { FaWhatsapp } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InsideSalesCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const rows = [
    { id: 1, date: '2024-10-01', companyName: 'Company A', mobile: '1234567890', email: 'emailA@example.com', callOption: <CallIcon />, whatsapp: <FaWhatsapp />, status: 'Completed' },
    { id: 2, date: '2024-10-02', companyName: 'Company B', mobile: '0987654321', email: 'emailB@example.com', callOption: <CallIcon />, whatsapp: <FaWhatsapp />, status: 'Pending' },
    // More rows here...
  ];

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSearch = () => {
    const filteredData = rows.filter(row =>
      row.companyName.toLowerCase().includes(searchTerm) || row.date.includes(searchTerm)
    );
    setFilteredRows(filteredData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validExtensions = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    if (file && validExtensions.includes(file.type)) {
      setSelectedFile(file);
      setFileError(''); // Clear any previous error
    } else {
      setSelectedFile(null);
      setFileError("Only Excel files are allowed. Please upload a valid Excel file.");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload/excel`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setSelectedFile(null);
      } else {
        throw new Error("File upload failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card style={{ margin: '20px', marginTop: '5%', padding: '20px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Typography variant="h5" component="div" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Inside Sales CRM
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginRight: '10px', marginBottom: '20px' }}>
          <TextField
            label="Search by Company Name or Date"
            variant="outlined"
            style={{ width: '260px' }}
            onChange={handleSearchInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            style={{ marginLeft: '10px', height: '56px' }}
          >
            Get
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <TextField
            type="file"
            accept=".xlsx, .xls"
            InputLabelProps={{ shrink: true }}
            label="Excel Upload"
            onChange={handleFileChange}
            style={{ width: '30%' }}
            error={!!fileError} // If there is an error, set error to true
            helperText={fileError} // Display the error message below the field
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFileUpload}
            style={{ marginLeft: '10px', height: '56px' }}
          >
            Upload Excel
          </Button>
        </div>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Company Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Mobile</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Call Option</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Whatsapp</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredRows.length > 0 ? filteredRows : rows).map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.companyName}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.mobile}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.email}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}><IconButton>{row.callOption}</IconButton></TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}><IconButton>{row.whatsapp}</IconButton></TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default InsideSalesCRM;

