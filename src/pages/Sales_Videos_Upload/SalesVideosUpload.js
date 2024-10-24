import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2'; // Import SweetAlert2

const SalesVideosUpload = () => {
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
      const response = await fetch('http://192.168.29.219:8080/api/videos/save/link', {
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={styles.submitButton}
            fullWidth
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%', // Full width of the card
    margin: '50px auto',
    maxWidth: '600px', // Set a max width for responsiveness
    marginTop: '5%',
  },
  submitButton: {
    marginTop: '15px',
    padding: '10px',
  },
};

export default SalesVideosUpload;