import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2'; // Import SweetAlert2

const InsideSales_VideosUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    link: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object
    const data = new FormData();
    data.append('title', formData.title);
    data.append('link', formData.link);

    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(`${baseUrl}/api/videos/save/link`, {
        method: 'POST',
        body: data,  // Send FormData object
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Form submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: 'Error submitting form. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
    <Card style={styles.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Submit Your Details
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Title"
            variant="outlined"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            style={styles.textField}
          />
          <TextField
            label="Link"
            variant="outlined"
            name="link"
            value={formData.link}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            style={styles.textField}
          />
          <Button
            type="submit"
            variant="contained"
            
            style={styles.submitButton}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
    
    </>
    
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    marginTop:'13%',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)', // Slightly larger shadow
    width: '90%', // 90% width for smaller screens
    maxWidth: '500px', // Max width for larger screens
     // Center card horizontally with margin
    minHeight: '450px', // Ensuring card has sufficient height
    marginLeft:'28%',
    marginRight:'20%'
  },
  textField: {
    marginBottom: '20px', // Adds space between text fields
  },
  submitButton: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '16px', // Slightly larger font for the button
    height: '50px', // Increased height for a prominent button
    backgroundColor:'#3f51b5'
  },
};

export default InsideSales_VideosUpload;
