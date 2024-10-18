import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MenuItem, TextField, Button, Grid } from '@mui/material';
import { useAuth } from '../../AuthProvider';
import Swal from 'sweetalert2';

const roles = ['MANAGER',"SALE_MANAGER", 'SALES', 'TECHNICIAN' , 'TELECALLER'];

// Validation Schema using Yup
const validationSchema = Yup.object({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  
});

const AdminManagerRegister = () => {
  const { userId, token } = useAuth(); // Access userId from AuthContext

  console.log('I am admin user USER admin id: ' + userId); // Log userId
  console.log('I am admin MANAGER jwt token: ' + token);

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Form values:', values); // Log form values for debugging
    setSubmitting(true);
    try {
      const managetoken = token

      const response = await fetch(
        `http://localhost:8081/api/v1/admin/register/manager/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${managetoken}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error('Failed to register');
        throw new Error(errorData.error_message || 'Failed to register');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      alert('Registration successful');
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleSubmit = async (values, { setSubmitting }) => {
  //   console.log('Form values:', values); // Log form values for debugging
  //   setSubmitting(true);
  //   try {
  //     const managetoken = token;
  //     let apiUrl = '';
  
  //     // Switch case based on role
  //     switch (values.role) {
  //       case 'MANAGER':
  //         apiUrl = `http://localhost:8081/api/v1/admin/register/manager/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
  //         break;
  //       case 'SALE_MANAGER':
  //         apiUrl = `http://localhost:8081/api/v1/management/register/saleManager/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
  //         break;
  //       case 'TECHNICIAN':
  //         apiUrl = `http://localhost:8081/api/v1/saleManagement/register/technician/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
  //         break;
  //       case 'SALES':
  //         apiUrl = `http://localhost:8081/api/v1/saleManagement/register/sales/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
  //         break;
  //       case 'TELECALLER':
  //         apiUrl = `http://localhost:8081/api/v1/saleManagement/register/telecaller/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
  //         break;
  //       default:
  //         throw new Error('Invalid role selected');
  //     }
  
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${managetoken}`,
  //       },
  //       body: JSON.stringify(values),
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error_message || 'Failed to register');
  //     }
  
  //     const data = await response.json();
  //     console.log('Registration successful:', data);
  
  //     // Show success notification using Swal
  //     Swal.fire({
  //       title: 'Success!',
  //       text: 'Registration successful',
  //       icon: 'success',
  //       confirmButtonText: 'OK'
  //     });
  //   } catch (error) {
  //     console.error('Error:', error.message);
  
  //     // Show error notification using Swal
  //     Swal.fire({
  //       title: 'Error!',
  //       text: `Registration failed: ${error.message}`,
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
        backgroundColor: '#f0f0f0',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          width: '97.9%',
        }}
      >
        <h2>Admin Manager Registration</h2>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            role: '',
           
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
                    name="firstname"
                    as={TextField}
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.firstname}
                  />
                  <ErrorMessage name="firstname" component="div" style={{ color: 'red' }} />
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
                  <ErrorMessage name="lastname" component="div" style={{ color: 'red' }} />
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
                  <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
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
                  <ErrorMessage name="role" component="div" style={{ color: 'red' }} />
                </Grid>

               
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', padding: '10px 0' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#007bff', color: '#fff' }}
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

export default AdminManagerRegister;
