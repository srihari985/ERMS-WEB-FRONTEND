import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().required('Address is required'),
  role: Yup.string().required('Role is required'),
  // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// Role options
const roles = ['ORGANIZATION', 'User', 'Manager'];

// Main component
const OrganizationForm = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme
  const { setorgId } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
  
      // Construct the API URL with the parameters (without encoding)
      const apiUrl = `http://192.168.29.219:8083/api/auth/organize/register/organization?name=${values.name}&email=${values.email}&address=${values.address}&role=${values.role}`;
                      
      // Send the request with query parameters
      const response = await fetch(apiUrl, {
        method: 'POST',
      });
  
      if (response.ok) {
        navigate('/');
        Swal.fire({
          icon: 'success',
          title: 'Organization created successfully',
        });
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to create organization',
        text: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div style={{
      backgroundImage: 'url(https://img.freepik.com/premium-photo/abstract-background-design-images-wallpaper-ai-generated_643360-136650.jpg)', // Replace with your image URL
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh', // Full height
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(4),
        borderRadius: "12px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(5px)",
        maxWidth: "500px",
        width: "100%",
      }}>
        <Typography variant="h2" gutterBottom style={{ textAlign: 'center', color: 'white',paddingBottom:'10px' }}>
          Create Organization
        </Typography>
        <Formik
          initialValues={{ name: '', 
                          email: '', 
                          address: '', 
                          role: '', 
                          // password: '' 
                        }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: '10px' }}>
                <Field name="name">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Name"
                      variant="filled"
                      style={{ backgroundColor: 'white',width:'400px',borderRadius:'5px' }} // Ensure background is white
                    />
                  )}
                </Field>
                <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      variant="filled"
                      style={{ backgroundColor: 'white' ,borderRadius:'5px' }} // Ensure background is white
                    />
                  )}
                </Field>
                <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Field name="address">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      variant="filled"
                      style={{ backgroundColor: 'white',borderRadius:'5px'  }} // Ensure background is white
                    />
                  )}
                </Field>
                <ErrorMessage name="address" component="div" style={{ color: 'red' }} />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Field name="role">
                  {({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Role"
                      variant="filled"
                      style={{ backgroundColor: 'white',borderRadius:'5px'  }} // Ensure background is white
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
                <ErrorMessage name="role" component="div" style={{ color: 'red' }} />
              </div>

              {/* <div style={{ marginBottom: '10px' }}>
                <Field name="password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      type="password"
                      variant="filled"
                      style={{ backgroundColor: 'white',borderRadius:'5px'  }} // Ensure background is white
                    />
                  )}
                </Field>
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
              </div> */}

              <div style={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="text"
                  color="primary"
                  disabled={isSubmitting}
                  style={{ marginTop: '30px',
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    backgroundColor: "#53CDB0",width:'400px'  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default OrganizationForm;
