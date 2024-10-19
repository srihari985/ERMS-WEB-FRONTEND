import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { MenuItem, TextField, Button, Grid } from '@mui/material';
import swal from 'sweetalert';
import { useAuth } from '../../AuthProvider';

const roles = ['ADMIN', 'MANAGER', 'SALES', 'TECHNICIAN'];

// Validation Schema using Yup
const validationSchema = Yup.object({
  organizationId: Yup.string().required('Organization ID is required'),
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
});

const OrganizationAdminRegister = () => {
  const { userId } = useAuth(); // Access userId from AuthContext

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Submitting admin details:", values);

      const response = await fetch(
        `http://192.168.29.219:8083/api/auth/organize/register/admin/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Admin Registration Data:', data);
        swal('Success', `${values.role} Registration Successful!`, 'success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error_message || 'Failed to register');
      }
    } catch (error) {
      console.error('Error:', error.message);
      swal('Error', `Registration failed: ${error.message}`, 'error');
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '5%',
      backgroundColor: '#f0f0f0',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        width: '97.9%',
      }}>
        <h2>Organization Admin Register</h2>
        <Formik
          initialValues={{
            organizationId: userId || '',
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
                <Grid item xs={6}>
                  <Field
                    name="organizationId"
                    as={TextField}
                    label="Organization ID"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.organizationId}
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

export default OrganizationAdminRegister;
