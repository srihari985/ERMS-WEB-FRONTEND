import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MenuItem, TextField, Button, Grid } from '@mui/material';
import { useAuth } from '../../AuthProvider';

const roles = ['SALE_MANAGER', 'SALES', 'TECHNICIAN',"TELECALLER"];

// Validation Schema using Yup
const validationSchema = Yup.object({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
 
});

const ManagerSalesManagerRegister = () => {
  const { userId, token } = useAuth(); // Access userId from AuthContext

  console.log('I am  manager sale id: ' + userId); // Log userId
  console.log('I am manager sale jwt token: ' + token);

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Form values:', values); // Log form values for debugging
    setSubmitting(true);
    try {
      const managetoken = token

      const response = await fetch(
        `http://192.168.29.219:8083/api/v1/management/register/saleManager/${userId}?firstname=${values.firstname}&lastname=${values.firstname}&email=${values.email}&role=${values.role}`,
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
        <h2>Manager SalesManager Registration</h2>
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

export default ManagerSalesManagerRegister;
