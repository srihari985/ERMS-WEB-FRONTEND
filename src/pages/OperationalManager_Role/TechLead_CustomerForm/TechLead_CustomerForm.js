import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify styles
import { useAuth } from '../../../AuthProvider';

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const TechLead_CustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const { oTLId } = useAuth();

  // Validation schema
  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
    contactPersonName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, 'Only alphabets and spaces are allowed')
      .required('Contact Person Name is required'),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, 'Mobile Number must be 10 digits')
      .required('Mobile Number is required'),
      noOfTechReq: Yup.number()
      .positive('Must be a positive number')
      .integer('Must be an integer')
      .required('Number of Technicians is required'),
    address: Yup.string().required('Address is required'),
    purpose: Yup.string().required('Purpose is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('companyName', values.companyName);
    formData.append('contactPersonName', values.contactPersonName);
    formData.append('mobileNumber', values.mobileNumber);
    formData.append('noOfTechReq', values.noOfTechReq);
    formData.append('address', values.address);
    formData.append('purpose', values.purpose);

    try {
      const response = await fetch(`${baseUrl}/api/ticket/save/OpTL/${oTLId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Assuming you get a response text like "Your form was successfully submitted."
        const responseText = await response.text();
        toast.success(`Customer Form Submitted Successfully! `, {
          position: 'top-right',
          autoClose: 2000,
        });
        resetForm();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to submit Customer Form`, {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again later.', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        marginTop: '5%',
        marginLeft: '10px',
        marginRight: '10px',
        padding: '20px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <ToastContainer />
      <CardContent>
        <Typography
          variant="h4"
          align="left"
          style={{ paddingBottom: '20px', fontWeight: 'bold' }}
        >
          Customer Request Form
        </Typography>
        <Formik
          initialValues={{
            companyName: '',
            contactPersonName: '',
            mobileNumber: '',
            noOfTechReq: '',
            address: '',
            purpose: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty, touched, errors }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="companyName"
                    label="Company Name"
                    variant="outlined"
                    fullWidth
                    error={touched.companyName && !!errors.companyName}
                    helperText={<ErrorMessage name="companyName" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="contactPersonName"
                    label="Contact Person Name"
                    variant="outlined"
                    fullWidth
                    error={touched.contactPersonName && !!errors.contactPersonName}
                    helperText={<ErrorMessage name="contactPersonName" />}
                  />
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="mobileNumber"
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    error={touched.mobileNumber && !!errors.mobileNumber}
                    helperText={<ErrorMessage name="mobileNumber" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="noOfTechReq"
                    label="No. of Technicians Required"
                    type="number"
                    variant="outlined"
                    fullWidth
                    error={touched.noOfTechReq && !!errors.noOfTechReq}
                    helperText={<ErrorMessage name="noOfTechReq" />}
                  />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={touched.address && !!errors.address}
                    helperText={<ErrorMessage name="address" />}
                  />
                </Grid>

                {/* Row 4 */}
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="purpose"
                    label="Purpose"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={touched.purpose && !!errors.purpose}
                    helperText={<ErrorMessage name="purpose" />}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading} // Disable only when loading
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default TechLead_CustomerForm;
