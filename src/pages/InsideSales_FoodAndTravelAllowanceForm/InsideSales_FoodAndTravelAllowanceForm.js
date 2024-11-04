import React, { useState , useEffect} from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InsideSales_FoodAndTravelAllowance = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFirstCard, setShowFirstCard] = useState(true);
  const [showFormCard, setShowFormCard] = useState(false);
  const [travelAllowanceData, setTravelAllowanceData] = useState([]);
  const [foodAllowanceData, setFoodAllowanceData] = useState([]);
  const sId = localStorage.getItem("sId");

  const [searchDate, setSearchDate] = useState('');
  const [foodsearchDate, setFoodSearchDate] = useState('');
  


   // Pagination states for Travel Allowance
   const [travelPage, setTravelPage] = useState(0);
   const [travelRowsPerPage, setTravelRowsPerPage] = useState(5);
 
   // Pagination states for Food Allowance
   const [foodPage, setFoodPage] = useState(0);
   const [foodRowsPerPage, setFoodRowsPerPage] = useState(5);


   const fetchTravelAllowanceData = async () => {
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/travelAllowance/getAll`);
      const data = await response.json();
      setTravelAllowanceData(data);
    } catch (error) {
      console.error('Error fetching travel allowance data:', error);
    }
  };

  const fetchFoodAllowanceData = async () => {
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/foodAllowance/getAll`);
      const data = await response.json();                     
      setFoodAllowanceData(data);
    } catch (error) {
      console.error('Error fetching food allowance data:', error);
    }
  };

  useEffect(() => {
    fetchTravelAllowanceData();
    fetchFoodAllowanceData(); // Fetch food allowance data on component mount
  }, []);


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
 

  const handleTravelSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
  
    // Function to format date as "DD-MM-YYYY"
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('date', formatDate(values.date));
      formData.append('customerName', values.customerName);
      formData.append('travelFrom', values.travelFrom);
      formData.append('travelTo', values.travelTo);
      formData.append('travelType', values.travelType);
      formData.append('noOfDays', values.noOfDays);
      formData.append('travelCost', values.travelCost);
  
      const response = await fetch(`${baseUrl}/api/travelAllowance/save/${sId}`, {
        method: 'POST',
        body: formData,
      });
  
      // Log the response status and response text for debugging
      console.log("Response Status:", response.status);
  
      // Check if the response is OK (status code in the range 200-299)
      if (response.ok) {
        const responseText = await response.text(); // Read the response as text
        console.log("Response Text:", responseText); // Log the response text for debugging
  
        // Assuming a successful response contains a success message
        toast.success('Form Submitted successfully.', {
          position: 'top-right',
          autoClose: 2000,
        });
  
        // Fetch updated travel allowance data
        await fetchTravelAllowanceData();
      } else {
        // If not a successful response, get the response text for error handling
        const errorText = await response.text(); // Read the response text for error handling
        console.error('Error details:', errorText);
        toast.error(`Error submitting Travel data: ${errorText}`, {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Log the error stack for more details
      console.error('Network or Server Error:', error);
      toast.error('A network error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      resetForm();
      handleBackClick(); // Navigate back to the table view
      setSubmitting(false);
    }
  };
  
  

  // Handle submission of food allowance form
 

  const handleFoodSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true); // Set submitting to true
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      // Create a FormData object
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('date', values.date);
      formData.append('customerName', values.customerName);
      formData.append('noOfPersons', values.noOfPersons);
      formData.append('foodCost', values.foodCost);
  
      const response = await fetch(`${baseUrl}/api/foodAllowance/save/${sId}`, {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
      });
  
      // Log the response status for debugging
      console.log("Response Status:", response.status);
  
      // Check if the response is OK (status code in the range 200-299)
      if (response.ok) {
        const responseText = await response.text(); // Read the response as text
        console.log("Response Text:", responseText); // Log the response text for debugging
  
        // Assuming a successful response contains a success message
        toast.success('Food Form submitted successfully.', {
          position: 'top-right',
          autoClose: 2000,
        });
  
        // Fetch updated food allowance data
        await fetchFoodAllowanceData();
      } else {
        // If not a successful response, get the response text for error handling
        const errorText = await response.text(); // Read the response text for error handling
        console.error('Error details:', errorText);
        toast.error(`Error submitting food form: ${errorText}`, {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Log the error stack for more details
      console.error('Network or Server Error:', error);
      toast.error('A network error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      resetForm(); // Reset form fields
      handleBackClick(); // Navigate back to the table view
      setSubmitting(false); // Set submitting to false
    }
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
      <ToastContainer/>
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
                      {/* Search Field */}
                      <TextField
                        label="Search by Date"
                        variant="outlined"
                        onChange={(e) => setSearchDate(e.target.value)} // state to hold the search date
                        sx={{ marginBottom: 2,width:'25%' }}
                        InputLabelProps={{ shrink: true }}
                      />

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
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Sl No</TableCell>
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
                            {travelAllowanceData  
                              .filter(row => {
                                const dateToSearch = searchDate.trim(); // User's search input
                                const formattedDate = row.date.trim(); // Date from backend in "YYYY-MM-DD"
                  
                                // If search input is empty, show all rows
                                if (!dateToSearch) return true;
                  
                                // Check if the formattedDate contains the search date
                                return formattedDate.includes(dateToSearch); // Allow partial matches (like day '24')
                              })
                              .slice(travelPage * travelRowsPerPage, travelPage * travelRowsPerPage + travelRowsPerPage)
                              .map((row, index) => (
                                <TableRow key={index}>
                                  {/* Serial Number */}
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                                    {travelPage * travelRowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.customerName}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelFrom}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelTo}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelType}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.noOfDays}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.travelCost}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
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
                    
                      {/* Search Field */}
                          <TextField
                            label="Search by Date"
                            variant="outlined"
                            onChange={(e) => setFoodSearchDate(e.target.value)} // Update the search date state
                            sx={{ marginBottom: 2,width:'25%' }}
                            InputLabelProps={{ shrink: true }}
                          />

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
                              {/* Replacing Employee Name with Sl No */}
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Sl No</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Date</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Customer Name</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>No. of Persons</TableCell>
                              <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Food Cost</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {foodAllowanceData
                              .filter(row => {
                                const dateToSearch = foodsearchDate.trim(); // User's search input
                                const formattedDate = row.date.trim(); // Date from backend in "YYYY-MM-DD"
                  
                                // If search input is empty, show all rows
                                if (!dateToSearch) return true;
                  
                                // Check if the formattedDate contains the search date
                                return formattedDate.includes(dateToSearch); // Allow partial matches (like day '24')
                              })
                              .slice(foodPage * foodRowsPerPage, foodPage * foodRowsPerPage + foodRowsPerPage)
                              .map((row, index) => (
                                <TableRow key={index}>
                                  {/* Serial Number Column */}
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                                    {foodPage * foodRowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.date}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.customerName}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.noOfPersons}</TableCell>
                                  <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{row.foodCost}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
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

    {/* Formik for Travel Allowance */}
    {selectedTab === 0 && (
      <Formik
        initialValues={{
          name: '',
          date: '',
          customerName: '',
          travelFrom: '',
          travelTo: '',
          travelType: '',
          noOfDays: '',
          travelCost: '',
        }}
        onSubmit={handleTravelSubmit}
      >
        {({ handleChange, values, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  name="name"
                  label="Employee Name"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={values.name}
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
                  name="noOfDays"
                  label="No. of Days"
                  variant="outlined"
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={values.noOfDays}
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
              <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
                  disabled={isSubmitting} // Disable the button while submitting
                >
                  Submit Travel
                </Button>
              </Box>
            
          </Form>
        )}
      </Formik>
    )}

    {/* Formik for Food Allowance */}
    {selectedTab === 1 && (
      <Formik
        initialValues={{
          name:'',
          date: '',
          customerName: '',
          noOfPersons: '',
          foodCost: '',
        }}
        onSubmit={handleFoodSubmit}
      >
        {({ handleChange, values, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Employee Name"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    value={values.name}
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
                  name="noOfPersons"
                  label="No. of Persons"
                  variant="outlined"
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={values.noOfPersons}
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

              <Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
                  disabled={isSubmitting} // Disable the button while submitting
                >
                  Submit Food
                </Button>
              </Box>
           
          </Form>
        )}
      </Formik>
    )}
  </Card>
)}


    </Container>
  );
};

export default InsideSales_FoodAndTravelAllowance;