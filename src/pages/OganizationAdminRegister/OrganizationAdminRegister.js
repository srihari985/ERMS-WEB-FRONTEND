import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { MenuItem, TextField, Button, Grid } from '@mui/material';
import { display } from '@mui/system';

import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../AuthProvider';


const roles = ['ADMIN', 'MANAGER', 'SALES','TECHNICIAN'];

// Validation Schema using Yup
const validationSchema = Yup.object({
  organizationId: Yup.string().required('Organization ID is required'),
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string().required('Password is required'),
});

const OrganizationAdminRegister = () => {

  const { userId } = useAuth(); // Access userId from AuthContext

  console.log("I am admin user USER UMESH id: " + userId); // Log userId

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("admin details :" + values.firstname);
  setSubmitting(true);
  
  try {
    // Extract JWT token from local storage (or another secure place)
    // const token = localStorage.getItem('jwtToken');
    
    // If the token is not found, throw an error
    // if (!token) {
    //   throw new Error('No JWT token found');
    // }

    const response = await fetch(`http://localhost:8080/api/auth/organize/register/admin/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}&password=${values.password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // Add JWT token to the headers
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Admin Registration Data :', data);
      alert(`Registration Successfull`);
      // const { access_token: token } = data; // Get the access token from the response
      // console.log("admin Access token: ", token); // Log the access token
    
      // if (token) {
      //   localStorage.setItem("token", token); // Save the token in local storage
    
      // // Decode the token to get the role (assuming jwtDecode is imported)
      //   const decodedToken = jwtDecode(token);
      //   const userRole = decodedToken.adminId;
      //   console.log("i am admin id :" + userRole);
      // }
      
    }else{
      throw new Error('Failed to register');
    }

    
  } catch (error) {
    console.error('Error:', error.message);
    // Optionally, you can display a user-friendly error message
    alert(`Registration failed: ${error.message}`);
  } finally {
    setSubmitting(false);
  }
};




  return (
    <div style={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // height: '100vh',
                marginTop:'5%',
                backgroundColor: '#f0f0f0',}}>
      <div style={{ backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    width: '97.9%', }}>
        <h2>Organization Admin Register</h2>
        <Formik
          initialValues={{
            organizationId: '',
            firstname: '',
            lastname: '',
            email: '',
            role: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, values }) => (
            <Form>
              <Grid container spacing={3}>
                {/* First Row */}
                <Grid item xs={6}>
                  <Field
                    name="organizationId"
                    as={TextField}
                    label="Organization ID"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={userId}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="firstname"
                    as={TextField}
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.firstname}
                  />
                </Grid>

                {/* Second Row */}
                <Grid item xs={6}>
                  <Field
                    name="lastname"
                    as={TextField}
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.lastname}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="email"
                    as={TextField}
                    label="Email"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.email}
                  />
                </Grid>

                {/* Third Row - Role Dropdown */}
                <Grid item xs={6}>
                  <Field
                    name="role"
                    as={TextField}
                    select
                    label="Role"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.role}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="password"
                    as={TextField}
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.password}
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', padding: '10px 0', }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#007bff', color: '#fff'}}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};



export default OrganizationAdminRegister;
