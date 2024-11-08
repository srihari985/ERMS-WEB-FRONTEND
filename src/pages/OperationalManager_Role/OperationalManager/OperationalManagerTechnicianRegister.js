import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { MenuItem, TextField, Button, Grid } from '@mui/material';
import { useAuth } from '../../../AuthProvider';
import swal from 'sweetalert';

const roles = [ 'TECHNICIAN'];

// Validation Schema using Yup
const validationSchema = Yup.object({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
 
});

const OperationalManagerTechnicianRegister = () => {
  const { userId, token } = useAuth(); // Access userId from AuthContext

  console.log('I am Operationmanager tech id: ' + userId); // Log userId
  console.log('I am salesmanager tech jwt token: ' + token);
  // const userid = userId;


// const handleSubmit = async (values, { setSubmitting }) => {
//     console.log('Form values:', values); // Log form values for debugging
//     setSubmitting(true);

//     let apiUrl = '';
//     const baseUrl=process.env.REACT_APP_API_BASE_URL

//     // Use switch case to determine the API URL based on the selected role
//     switch (values.role) {
//         case 'SALES':
//             apiUrl = `${baseUrl}/api/v1/saleManagement/register/sales/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
//             break;
//         case 'TECHNICIAN':
//             apiUrl = `${baseUrl}/api/v1/saleManagement/register/technician/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
//             break;
//         case 'TELECALLER':
//             apiUrl = `${baseUrl}/api/v1/saleManagement/register/telecaller/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
//             break;                              
//         default:
//             swal('Error', 'Invalid role selected', 'error');
//             setSubmitting(false);
//             return;
//     }

//     try {
//         const managetoken = token;

//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${managetoken}`,
//             },
//             body: JSON.stringify(values),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error_message || 'Failed to register');
//         }

//         const data = await response.json();
//         console.log('Registration successful:', data);
//         swal('Success', `${values.role} Registration successful`, 'success');
//     } catch (error) {
//         console.error('Error:', error.message);
//         swal('Error', `Registration failed: ${error.message}`, 'error');
//     } finally {
//         setSubmitting(false);
//     }
// };
   
const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Form values:', values); // Log form values for debugging
    setSubmitting(true);

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    
    const apiUrl = `${baseUrl}/api/v1/operationTechLead/register/technician/${userId}?firstname=${values.firstname}&lastname=${values.lastname}&email=${values.email}&role=${values.role}`;
    try {
        const managetoken = token;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${managetoken}`,
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error_message || 'Failed to register');
        }

        const data = await response.json();
        console.log('Registration successful:', data);
        swal('Success', 'Technician Registration successful', 'success');
    } catch (error) {
        console.error('Error:', error.message);
        swal('Error', `Registration failed: ${error.message}`, 'error');
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
        <h2>Operational Manager Technician Registration</h2>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            role: '',
           
            mobileNumber:''
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

                <Grid item xs={6}>
                  <Field
                    name="mobileNumber"
                    as={TextField}
                    label="Mobile Number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    value={values.mobileNumber}
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

export default OperationalManagerTechnicianRegister;
