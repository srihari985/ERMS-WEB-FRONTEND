import React, { useState, useEffect } from 'react';
import { ArrowBack } from '@mui/icons-material'; // Ensure you have Material Icons installed
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import './MaterialRequest.css'; // Import your CSS file

const SalesMaterialRequest = () => {
  const [partyName, setPartyName] = useState('');
  const [quotationNo, setQuotationNo] = useState('');
  const [data, setData] = useState([]);
  const [currentSection, setCurrentSection] = useState(1); // Track current section
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // Automatically fetch data when the component mounts
  useEffect(() => {
    handleGetData(); // Fetch data initially
  }, []); // Empty dependency array ensures this runs only once

  const handleGetData = () => {
    // Fetch the data based on party name and quotation number
    const dummyData = [
      { slNo: 1, item: 'Item A', quantity: 10, deliveryDate: '2024-09-15' },
      { slNo: 2, item: 'Item B', quantity: 5, deliveryDate: '2024-09-20' },
      { slNo: 3, item: 'Item C', quantity: 20, deliveryDate: '2024-09-22' },
      { slNo: 4, item: 'Item D', quantity: 15, deliveryDate: '2024-09-25' },
      { slNo: 5, item: 'Item E', quantity: 8, deliveryDate: '2024-09-30' },
      { slNo: 6, item: 'Item F', quantity: 12, deliveryDate: '2024-10-02' },
      // Add more dummy data here if needed
    ];
    setData(dummyData);
  };

  const handleSubmit = () => {
    alert('Table Data Submitted');
    // Handle submission logic
  };

  const handleNext = () => {
    setCurrentSection(2); // Move to section 2
  };

  const handleBack = () => {
    setCurrentSection(1); // Navigate back to section 1
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
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
      }}
    >
      {currentSection === 1 && (
        <>
          <div>
            <h3>Sales Material Request</h3>
          </div>

          {/* Add a table for the dummy data */}
          <div
            style={{
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: "20px",
            }}
          >
            <TableContainer>
              <Table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                  marginBottom: '20px',
                  fontSize: '14px',
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>S.No</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Item</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Quantity</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date of Delivery</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.slNo}>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.slNo}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.item}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.quantity}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.deliveryDate}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>Approved</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25,50]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNext}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {currentSection === 2 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <ArrowBack style={{ fontSize: '24px', color: 'black' }} />
            </button>
            <h3 style={{ marginLeft: '10px' }}>Material Request</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', marginBottom: '40px' }}>
            <input
              type="text"
              placeholder="Add Party Name"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              style={{
                marginRight: '10px',
                padding: '10px',
                width: '200px',
                maxWidth: '100%',
              }}
            />
            <input
              type="text"
              placeholder="Quotation No"
              value={quotationNo}
              onChange={(e) => setQuotationNo(e.target.value)}
              style={{
                marginRight: '10px',
                padding: '10px',
                width: '200px',
                maxWidth: '100%',
              }}
            />
            <button
              onClick={handleGetData}
              style={{
                padding: '5px 20px',
                backgroundColor: '#093947',
                height: '40px',
                width: '70px',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: "pointer"
              }}
            >
              Get
            </button>
          </div>

          {/* Full Table Section */}
          <div
            style={{
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: "20px",
            }}
          >
            <TableContainer>
              <Table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                  marginBottom: '20px',
                  fontSize: '14px',
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>S.No</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Item</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Quantity</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date of Delivery</TableCell>
                    <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.slNo}>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.slNo}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.item}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.quantity}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.deliveryDate}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>Approved</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25,50]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesMaterialRequest;
