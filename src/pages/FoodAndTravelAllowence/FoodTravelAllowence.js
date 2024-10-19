import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Formik, Form, Field } from 'formik';

const TravelAllowanceForm = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFirstCard, setShowFirstCard] = useState(true);
  const [showFormCard, setShowFormCard] = useState(false);
  // const [travelAllowanceData, setTravelAllowanceData] = useState([]);
  // const [foodAllowanceData, setFoodAllowanceData] = useState([]);

  // Initialize with dummy data
  const [travelAllowanceData, setTravelAllowanceData] = useState([
    {
      employeeId: 'E001',
      date: '2024-10-01',
      customerName: 'Customer A',
      travelFrom: 'Location X',
      travelTo: 'Location Y',
      travelType: 'Business',
      numberOfDays: 3,
      travelCost: '$300'
    },
    {
      employeeId: 'E002',
      date: '2024-10-02',
      customerName: 'Customer B',
      travelFrom: 'Location Y',
      travelTo: 'Location Z',
      travelType: 'Personal',
      numberOfDays: 2,
      travelCost: '$150'
    },
    {
      employeeId: 'E003',
      date: '2024-10-03',
      customerName: 'Customer C',
      travelFrom: 'Location A',
      travelTo: 'Location B',
      travelType: 'Business',
      numberOfDays: 1,
      travelCost: '$100'
    },
  ]);

  const [foodAllowanceData, setFoodAllowanceData] = useState([
    {
      date: '2024-10-01',
      customerName: 'Customer A',
      numberOfPersons: 10,
      foodCost: '$200'
    },
    {
      date: '2024-10-02',
      customerName: 'Customer B',
      numberOfPersons: 5,
      foodCost: '$75'
    },
    {
      date: '2024-10-03',
      customerName: 'Customer C',
      numberOfPersons: 8,
      foodCost: '$120'
    },
  ]);

   // Pagination states for Travel Allowance
   const [travelPage, setTravelPage] = useState(0);
   const [travelRowsPerPage, setTravelRowsPerPage] = useState(5);
 
   // Pagination states for Food Allowance
   const [foodPage, setFoodPage] = useState(0);
   const [foodRowsPerPage, setFoodRowsPerPage] = useState(5);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle navigation to the form card
  const handleNextClick = () => {
    setShowFirstCard(false);
    setShowFormCard(true);
  };

  // Handle back navigation to the table card
  const handleBackClick = () => {
    setShowFormCard(false);
    setShowFirstCard(true);
  };

  // Handle submission of travel allowance form
  const handleTravelSubmit = (values, { resetForm }) => {
    setTravelAllowanceData([...travelAllowanceData, values]);
    console.log('Travel Data Submitted:', values);
    resetForm(); // Reset form fields
    handleBackClick(); // Navigate back to the table view
  };

  // Handle submission of food allowance form
  const handleFoodSubmit = (values, { resetForm }) => {
    setFoodAllowanceData([...foodAllowanceData, values]);
    console.log('Food Data Submitted:', values);
    resetForm(); // Reset form fields
    handleBackClick(); // Navigate back to the table view
  };

  // Handle change in pagination for Travel Allowance
  const handleTravelChangePage = (event, newPage) => {
    setTravelPage(newPage);
  };

  const handleTravelChangeRowsPerPage = (event) => {
    setTravelRowsPerPage(parseInt(event.target.value, 10));
    setTravelPage(0);
  };

  // Handle change in pagination for Food Allowance
  const handleFoodChangePage = (event, newPage) => {
    setFoodPage(newPage);
  };

  const handleFoodChangeRowsPerPage = (event) => {
    setFoodRowsPerPage(parseInt(event.target.value, 10));
    setFoodPage(0);
  };

  return (
    <Container maxWidth='false' sx={{ padding: 0, margin: 0 }}>
      {showFirstCard && (
        <Card
          sx={{
            width: '100%',
            backgroundColor: 'white',
            padding: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            boxShadow: 3,
            marginTop: '80px',
          }}
        >
          <Typography sx={{ marginBottom: 2, fontWeight: 'bold', fontSize: '20px' }}>
            Travel and Food Allowance List
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ marginBottom: 3 }}
          >
            <Tab label="Travel Allowance" />
            <Tab label="Food Allowance" />
          </Tabs>

          <CardContent>
            {selectedTab === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Typography variant="h4">Travel Allowance List</Typography>
                  <Button
                    variant="contained"
                    style={{ padding: "10px 20px", backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
                    onClick={handleNextClick}
                  >
                    Travel Allowance Form
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Employee ID</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Customer Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel From</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel To</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>No. of Days</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Travel Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {travelAllowanceData.slice(travelPage * travelRowsPerPage, travelPage * travelRowsPerPage + travelRowsPerPage).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.employeeId}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.customerName}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelFrom}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelTo}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelType}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.numberOfDays}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelCost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25,50]}
                  component="div"
                  count={travelAllowanceData.length}
                  rowsPerPage={travelRowsPerPage}
                  page={travelPage}
                  onPageChange={handleTravelChangePage}
                  onRowsPerPageChange={handleTravelChangeRowsPerPage}
                />
              </>
            )}

            {selectedTab === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Typography variant="h4">Food Allowance List</Typography>
                  <Button
                    variant="contained"
                    style={{ padding: "10px 20px", backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
                    onClick={handleNextClick}
                  >
                    Food Allowance Form
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Customer Name</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>No. of Persons</TableCell>
                        <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Food Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {foodAllowanceData.slice(foodPage * foodRowsPerPage, foodPage * foodRowsPerPage + foodRowsPerPage).map((row, index) => (
                        <TableRow key={index}>
                          
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.customerName}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.numberOfPersons}</TableCell>
                          <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.foodCost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25,50]}
                  component="div"
                  count={foodAllowanceData.length}
                  rowsPerPage={foodRowsPerPage}
                  page={foodPage}
                  onPageChange={handleFoodChangePage}
                  onRowsPerPageChange={handleFoodChangeRowsPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {showFormCard && (
        <Card
          sx={{
            width: '100%',
            backgroundColor: 'white',
            padding: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            boxShadow: 3,
            marginTop: '80px',
          }}
        >
         
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <IconButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ marginLeft: 1, fontWeight: 'bold', fontSize: '20px' }}>
              Travel and Food Allowance Form
            </Typography>
          </Box>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ marginBottom: 3 }}
          >
            <Tab label="Travel Allowance" />
            <Tab label="Food Allowance" />
          </Tabs>

          <Formik
            initialValues={{
              employeeId: '',
              date: '',
              customerName: '',
              travelFrom: '',
              travelTo: '',
              travelType: '',
              numberOfDays: '',
              travelCost: ''
            }}
            onSubmit={selectedTab === 0 ? handleTravelSubmit : handleFoodSubmit}
          >
            {({ handleChange, values }) => (
              <Form>
                {selectedTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="employeeId"
                        label="Employee ID"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={values.employeeId}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="date"
                        label="Date"
                        variant="outlined"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        value={values.date}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="customerName"
                        label="Customer Name"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={values.customerName}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="travelFrom"
                        label="Travel From"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={values.travelFrom}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="travelTo"
                        label="Travel To"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={values.travelTo}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="travelType"
                        label="Travel Type"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={values.travelType}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="numberOfDays"
                        label="No. of Days"
                        variant="outlined"
                        type="number"
                        fullWidth
                        onChange={handleChange}
                        value={values.numberOfDays}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="travelCost"
                        label="Travel Cost"
                        variant="outlined"
                        type="number"
                        fullWidth
                        onChange={handleChange}
                        value={values.travelCost}
                      />
                    </Grid>
                  </Grid>
                )}

                {selectedTab === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="date"
                        label="Date"
                        variant="outlined"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        value={values.date}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="customerName"
                        label="Customer Name"
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                        value={values.customerName}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="numberOfPersons"
                        label="No. of Persons"
                        variant="outlined"
                        type="number"
                        fullWidth
                        onChange={handleChange}
                        value={values.numberOfPersons}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="foodCost"
                        label="Food Cost"
                        variant="outlined"
                        type="number"
                        fullWidth
                        onChange={handleChange}
                        value={values.foodCost}
                      />
                    </Grid>
                  </Grid>
                )}

                <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
                  <Button type="submit" variant="contained"  style={{ backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }} >
                    Submit
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Card>
      )}
    </Container>
  );
};

export default TravelAllowanceForm;
