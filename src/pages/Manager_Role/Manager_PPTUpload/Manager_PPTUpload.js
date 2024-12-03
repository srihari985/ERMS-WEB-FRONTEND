import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { toast ,ToastContainer} from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

const Manager_PPTUpload = () => {
  const [formData, setFormData] = useState({
    contentName: '',
    contentType: '',
    pptLink: '', // Assuming you have this field
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
    data.append('contentName', formData.contentName); // Append contentName
    data.append('contentType', formData.contentType); // Append contentType
    data.append('pptLink', formData.pptLink); // Append pptLink
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL; // Use your API base URL
      const response = await fetch(`${baseUrl}/api/manager/ppt/upload`, {
        method: 'POST',                                  
        body: data,  // Send the FormData object
      });
  
      // Check if the response is OK (2xx status codes)
      const result = await response.text(); // Parse response as plain text
  
      console.log('Response from server:', result);
  
      if (response.ok) {
        // Show success toast message
        toast.success(result, {
          position: "top-right",
          autoClose: 2000,
        });
  
        // Reset form fields
        setFormData({
          contentName: '',
          contentType: '',
          pptLink: ''
        });
  
      } else {
        throw new Error(result || 'Error submitting data');
      }
    } catch (error) {
      // Show error toast message
      toast.error(error.message || 'Error submitting form. Please try again.', {
        position: "top-right",
        autoClose: 2000,
      });
  
      console.error('Error submitting form:', error);
    }
  };
  
  
  
  

  return (
    <Card style={styles.card}>
      <CardContent>
      <Typography variant="h4" gutterBottom style={styles.title}>
            Submit Your Document Link
          </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Content Name"
            variant="outlined"
            name="contentName"
            value={formData.contentName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            style={styles.textField}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Content Type</InputLabel>
            <Select
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              label="Content Type"
            >
              <MenuItem value="software">Software</MenuItem>
              <MenuItem value="hardware">Hardware</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="PPT Link"
            variant="outlined"
            name="pptLink"
            value={formData.pptLink}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            style={styles.textField}
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
          <ToastContainer />
        </form>
      </CardContent>
    </Card>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    marginTop: '13%',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)', 
    width: '90%', 
    maxWidth: '500px',
    minHeight: '450px',
    marginLeft: '28%',
    marginRight: '20%',
  },
  title: {
    color: '#3f51b5',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textField: {
    marginBottom: '20px',
  },
  submitButton: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '16px',
    height: '50px',
    backgroundColor:'#3f51b5'
  },
};

export default Manager_PPTUpload;