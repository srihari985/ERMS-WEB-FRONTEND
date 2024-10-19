import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Grid, Card, CardContent, Table,TablePagination, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Dummy data for the table
const tableData = [
  {
    id: 1,
    startTime: '2024-10-01 08:00 AM',
    startReading: 15000,
    endTime: '2024-10-01 10:00 AM',
    endReading: 15050,
    totalKM: 50,
    petrolChargePerKm: 5,
    additionalComments: 'Routine check-up',
  },
  {
    id: 2,
    startTime: '2024-10-02 09:30 AM',
    startReading: 15050,
    endTime: '2024-10-02 11:00 AM',
    endReading: 15110,
    totalKM: 60,
    petrolChargePerKm: 5,
    additionalComments: 'Fuel refill',
  },
  {
    id: 3,
    startTime: '2024-10-03 07:45 AM',
    startReading: 15110,
    endTime: '2024-10-03 09:15 AM',
    endReading: 15180,
    totalKM: 70,
    petrolChargePerKm: 5,
    additionalComments: 'Business trip',
  },
  {
    id: 4,
    startTime: '2024-10-04 10:00 AM',
    startReading: 15180,
    endTime: '2024-10-04 12:00 PM',
    endReading: 15250,
    totalKM: 70,
    petrolChargePerKm: 5,
    additionalComments: 'Client meeting',
  },
  {
    id: 5,
    startTime: '2024-10-05 08:30 AM',
    startReading: 15250,
    endTime: '2024-10-05 10:30 AM',
    endReading: 15300,
    totalKM: 50,
    petrolChargePerKm: 5,
    additionalComments: 'Emergency visit',
  },
  {
    id: 6,
    startTime: '2024-10-06 09:00 AM',
    startReading: 15300,
    endTime: '2024-10-06 11:00 AM',
    endReading: 15380,
    totalKM: 80,
    petrolChargePerKm: 5,
    additionalComments: 'Delivery',
  },
];

const PetrolAllowance = () => {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formik = useFormik({
    initialValues: {
      startTime: '',
      startReading: '',
      endTime: '',
      endReading: '',
      totalKm: '',
      petrolChargeKm: '',
      additionalcomments: '',
      petrolbillsinvoice: null, // For file input
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('startTime', values.startTime);
      formData.append('startReading', values.startReading);
      formData.append('endTime', values.endTime);
      formData.append('endReading', values.endReading);
      formData.append('totalKm', values.totalKm);
      formData.append('petrolChargeKm', values.petrolChargeKm);
      formData.append('additionalcomments', values.additionalcomments);
      formData.append('petrolbillsinvoice', values.petrolbillsinvoice);

      try {
        const response = await fetch('https://your-api-endpoint.com/petrol-allowance', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit the form');
        }

        alert('Daily report submitted!');
      } catch (error) {
        alert('There was an error submitting your request.');
      }
    },
  });

  const labelStyle = {
    fontSize: '12px',
    color: '#666',
    position: 'absolute',
    top: '-10px',
    left: '10px',
    backgroundColor: 'white',
    padding: '0 5px',
  };

  // Function to show form on clicking "Next"
  const handleNext = () => {
    setShowForm(true);
  };

  // Function to go back to the table
  const handleBack = () => {
    setShowForm(false);
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
  

  return (
    <div>
      {showForm ? (
        <Card sx={{ marginTop: '5.5%', marginLeft: '20px', marginRight: '20px' }}>
          <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <IconButton onClick={handleBack} style={{ marginRight: '10px' }}>
              <ArrowBackIcon />
            </IconButton>

            <h3 style={{ margin: 0 }}>Petrol Allowance</h3>
          </div>


            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="startTime"
                    name="startTime"
                    label="Start Time"
                    type="text"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    required
                    inputProps={{ step: 300 }} // 5 min intervals
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="startReading"
                    name="startReading"
                    type="number"
                    label="Start Reading"
                    value={formik.values.startReading}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="endTime"
                    name="endTime"
                    label="End Time"
                    type="text"
                    value={formik.values.endTime}
                    onChange={formik.handleChange}
                    required
                    inputProps={{ step: 300 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="endReading"
                    name="endReading"
                    type="number"
                    label="End Reading"
                    value={formik.values.endReading}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="totalKm"
                    name="totalKm"
                    type="number"
                    label="Total KM"
                    value={formik.values.totalKm}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="petrolChargeKm"
                    name="petrolChargeKm"
                    type="number"
                    label="Petrol Charge Per Km"
                    value={formik.values.petrolChargeKm}
                    onChange={formik.handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="additionalcomments"
                    name="additionalcomments"
                    label="Additional Comments"
                    multiline
                    rows={3}
                    value={formik.values.additionalcomments}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <label htmlFor="petrolbillsinvoice" style={labelStyle}>
                      Choose Petrol Bill Invoice
                    </label>
                    <input
                      id="petrolbillsinvoice"
                      name="petrolbillsinvoice"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue('petrolbillsinvoice', event.currentTarget.files[0]);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        paddingTop: '18px',
                        padding: '13px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        height: '56px',
                      }}
                    />
                  </div>
                </Grid>
              </Grid>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' }} variant="contained" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ marginTop: '5.5%', marginLeft: '20px', marginRight: '20px' }}>
          <CardContent>

          <div style={{marginBottom:'20px' }}>
            <h2 style={{ margin: 0 }}>Petrol Allowance List</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-between', marginBottom: '40px' }}>
          <TextField fullWidth label="Search" sx={{ marginBottom: '20px',width:'30%' }} />

            <Button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' }} variant="contained" onClick={handleNext}>
                Petrol Allowance Form
              </Button>
          </div>
            

          <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Sl No</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Start Time</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Start Reading</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>End Time</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>End Reading</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Total KM</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Petrol Charge Per Km</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Additional Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <TableRow key={row.id}>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{index + 1}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.startTime}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.startReading}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.endTime}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.endReading}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.totalKM}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.petrolChargePerKm}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.additionalComments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
       <TablePagination
              rowsPerPageOptions={[5, 10, 30,50]} // Options for rows per page
              component="div"
              count={tableData.length} // Total number of rows
              rowsPerPage={rowsPerPage} // Current rows per page
              page={page} // Current page
              onPageChange={handleChangePage} // Page change handler
              onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
            />

            
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PetrolAllowance;
