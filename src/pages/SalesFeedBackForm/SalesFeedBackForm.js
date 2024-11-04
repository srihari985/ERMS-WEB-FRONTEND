import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Card, CardContent, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import { defaultMargin } from '@nivo/core';

const SalesFeedbackForm = () => {
  const [showNextCard, setShowNextCard] = useState(false);

  // Feedback form submission handler
  const handleSubmitFeedback = (values, { setSubmitting }) => {
    console.log('Feedback Form submitted:', values);
    setSubmitting(false);
    setShowNextCard(true); // Show the next card after form submission
  };

  // Website feedback form submission handler
  const handleSubmitWebsiteFeedback = (values, { setSubmitting }) => {
    console.log('Feedback Form submitted:', values);
    setSubmitting(false);
    Swal.fire({
      title: 'Success!',
      text: 'Feedback Submitted Successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  // Handler to navigate back to the first card
  const handlePrevious = () => {
    setShowNextCard(false);
  };

  return (
    <Card
      sx={{
        backgroundColor: 'white',
        padding: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
        boxShadow: 3,
        marginTop: '88px',
        marginLeft: '20px',
        marginRight: '20px',
      }}
    >
      <CardContent>
        {!showNextCard ? (
          <>
            <h2 >Fill Out Your Feedback</h2>
            <Formik
              initialValues={{
                empid: '',
                date: '',
                custName: '',
                // ticketNo: '',
                poWork: '',
                status: '',
                comments: '',
                extraWork: '', 
                serviceFeedback: '', 
              }}
              onSubmit={handleSubmitFeedback}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="empid"
                        as={TextField}
                        label="Employee ID"
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="date"
                        as={TextField}
                        type="date"
                        label="Date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="custName"
                        as={TextField}
                        label="Customer Name"
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <Field
                        name="ticketNo"
                        as={TextField}
                        label="Ticket No"
                        fullWidth
                        variant="outlined"
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="poWork"
                        as={TextField}
                        label="PO Work"
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Status</InputLabel>
                        <Field
                          as={Select}
                          name="status"
                          label="Status"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="extraWork"
                        as={TextField}
                        label="Extra Work"
                        fullWidth
                        variant="outlined"
                        // multiline
                        // rows={3}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        name="serviceFeedback"
                        as={TextField}
                        label="Service Feedback"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ padding: "10px 20px", backgroundColor:"#007bff",width:"8%", color:'#fff', fontWeight:'bold', marginTop: '16px' }}
                       
                        disabled={isSubmitting}
                      >
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
            <h2>Website Feedback</h2>
            <Formik
              initialValues={{
                websiteFeedback: '',
                ApplicationHRBP: '',
                Inventory: '',
                ERMS: '',
                ERP: '',
              }}
              onSubmit={handleSubmitWebsiteFeedback}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Website Feedback</InputLabel>
                        <Field
                          as={Select}
                          name="websiteFeedback"
                          label="Website Feedback"
                        >
                          <MenuItem value="explained">Explained</MenuItem>
                          <MenuItem value="notExplained">Not Explained</MenuItem>
                          <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Application HRBP</InputLabel>
                        <Field
                          as={Select}
                          name="ApplicationHRBP"
                          label="Application HRBP"
                        >
                          <MenuItem value="explained">Explained</MenuItem>
                          <MenuItem value="notExplained">Not Explained</MenuItem>
                          <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Inventory</InputLabel>
                        <Field
                          as={Select}
                          name="Inventory"
                          label="Inventory"
                        >
                          <MenuItem value="explained">Explained</MenuItem>
                          <MenuItem value="notExplained">Not Explained</MenuItem>
                          <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>ERMS</InputLabel>
                        <Field
                          as={Select}
                          name="ERMS"
                          label="ERMS"
                        >
                          <MenuItem value="explained">Explained</MenuItem>
                          <MenuItem value="notExplained">Not Explained</MenuItem>
                          <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>ERP</InputLabel>
                        <Field
                          as={Select}
                          name="ERP"
                          label="ERP"
                        >
                          <MenuItem value="explained">Explained</MenuItem>
                          <MenuItem value="notExplained">Not Explained</MenuItem>
                          <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="contained"
                        style={{ padding: "10px 20px", backgroundColor:"#007bff",width:"8%", color:'#fff', fontWeight:'bold', marginTop: '16px' }}
                     
                        onClick={handlePrevious}
                      >
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ padding: "10px 20px", backgroundColor:"#007bff",width:"13%", color:'#fff', fontWeight:'bold',marginTop: '16px' }}
                       
                        disabled={isSubmitting}
                      >
                        Submit Feedback
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesFeedbackForm;