import React, { useState } from 'react';
import { TextField, Grid, Button, Typography, Box, Card, CardContent } from '@mui/material';

const TicketAssignmentForm = () => {
  const [formValues, setFormValues] = useState({
    invoiceNumber: '',
    companyName: '',
    contactPerson: '',
    mobileNumber: '',
    address: '',
    installationDate: null,
    techniciansRequired: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    // Perform form submission logic
  };

  return (
    <Box sx={{ p: 4, marginTop: '60px' }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Ticket Assignment Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={formValues.invoiceNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formValues.companyName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Person Name"
                  name="contactPerson"
                  value={formValues.contactPerson}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formValues.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formValues.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Installation"
                  name="installationDate"
                  value={formValues.installationDate}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Number of Technicians Required"
                  name="techniciansRequired"
                  value={formValues.techniciansRequired}
                  onChange={handleInputChange}
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TicketAssignmentForm;
