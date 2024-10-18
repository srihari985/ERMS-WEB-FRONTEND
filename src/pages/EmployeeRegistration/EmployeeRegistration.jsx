import React, { useState } from 'react';
import { TextField, Button, MenuItem, Card, CardContent, Typography, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import  { useAuth } from "../../AuthProvider"

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' },
  { value: 'sales lead', label: 'Sales Lead' },
];

const EmployeeRegistration = () => {
  const {setEmployeeRegId} =useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      emailId: '',
      role: '',
      manager: '',
      reportingManager: '',
      officialMailId: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Enter a valid mobile number').required('Mobile Number is required'),
      emailId: Yup.string().email('Invalid email address').required('Email is required'),
      role: Yup.string().required('Role is required'),
    }),
   
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://192.168.29.60:8080/api/sale/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
    
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
    
        const data = await response.json();
        console.log('Success:', data);
        alert('Form submitted successfully!');
        setEmployeeRegId(data.sId)
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit form!');
      }
    },
    
  });

  return (
    <Card sx={{ maxWidth: 800, margin: '90px auto', padding: 2, marginTop: '130px' }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Employee Registration</Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email ID"
                name="emailId"
                type="email"
                value={formik.values.emailId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                helperText={formik.touched.emailId && formik.errors.emailId}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Manager"
                name="manager"
                value={formik.values.manager}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.manager && Boolean(formik.errors.manager)}
                helperText={formik.touched.manager && formik.errors.manager}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Reporting Manager"
                name="reportingManager"
                value={formik.values.reportingManager}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reportingManager && Boolean(formik.errors.reportingManager)}
                helperText={formik.touched.reportingManager && formik.errors.reportingManager}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Official Mail ID"
                name="officialMailId"
                value={formik.values.officialMailId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.officialMailId && Boolean(formik.errors.officialMailId)}
                helperText={formik.touched.officialMailId && formik.errors.officialMailId}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                fullWidth
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary" >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeRegistration;
