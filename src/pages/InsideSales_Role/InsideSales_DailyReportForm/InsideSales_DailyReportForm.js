import React, { useState } from 'react';
import { TextField, Button, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../AuthProvider';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema using YUP
const validationSchema = Yup.object({
  name: Yup.string().required('Employee Name is required'),
  totalVisits: Yup.number()
    .required('Total Visits is required')
    .positive('Visits must be positive'),
  requirements: Yup.string().required('Requirements are required'),
  additionalComments: Yup.string().required('Additional comments are required'),
});

const InsideSales_DailyReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sId = localStorage.getItem("sId");
  const navigate = useNavigate(); // Initialize useNavigate

  // Formik hook


  const formik = useFormik({
    initialValues: {
      name: '',
      totalVisits: '',
      requirements: '',
      additionalComments: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      setIsSubmitting(true);
  
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/dailyReport/save/${sId}`, {
          method: 'POST',
          body: formData,
        });
  
        console.log("Response Status:", response.status);
        const responseText = await response.text(); // Read response text once
        console.log("Response Text:", responseText);
  
        if (response.ok) {
          console.log("Showing success toast");
          // Custom success message
          toast.success(`Success! ${responseText}`, {
            position: 'top-right',
            autoClose: 2000,
          });
          // Delay navigation to allow toast to show
          setTimeout(() => {
            navigate('/InsideSales_DailyReportList');
          }, 1000);
        } else {
          console.error('Error details:', responseText);
          // Custom error message
          toast.error(`Failed to save. Reason: ${responseText}`, {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // General error message
        toast.error('Error submitting form. Please check your network and try again.', {
          position: 'top-right',
          autoClose: 2000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  
  
  
  
  

  return (
    <Card sx={{ marginTop: '70px', marginLeft: '20px', marginRight: '20px' }}>
      <CardContent>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/InsideSales_DailyReportList')} sx={{ marginRight: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Sales Daily Report Form</Typography>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                variant="outlined"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Visits"
                type="number"
                variant="outlined"
                name="totalVisits"
                value={formik.values.totalVisits}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.totalVisits && Boolean(formik.errors.totalVisits)}
                helperText={formik.touched.totalVisits && formik.errors.totalVisits}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Requirements"
                variant="outlined"
                name="requirements"
                multiline
                rows={3}
                value={formik.values.requirements}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.requirements && Boolean(formik.errors.requirements)}
                helperText={formik.touched.requirements && formik.errors.requirements}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Comments"
                variant="outlined"
                multiline
                rows={3}
                name="additionalComments"
                value={formik.values.additionalComments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.additionalComments && Boolean(formik.errors.additionalComments)}
                helperText={formik.touched.additionalComments && formik.errors.additionalComments}
                fullWidth
              />
            </Grid>
          </Grid>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button
              type="submit"
              variant="contained"
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </form>
        <ToastContainer />
      </CardContent>
    </Card>
  );
};

export default InsideSales_DailyReportForm;