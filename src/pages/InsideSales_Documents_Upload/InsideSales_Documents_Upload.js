import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2'; // Import SweetAlert2

const InsideSales_DocumentsUpload = () => {
  const [formData, setFormData] = useState({
    contentName: ''
  });
  const [file, setFile] = useState(null); // State for the file

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object
    const data = new FormData();
    data.append('contentName', formData.contentName); // Append contentName

    if (file) {
      data.append('uploadFile', file); // Append the file to the form data
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a file to upload.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL; // Use your API base URL
      const response = await fetch(`${baseUrl}/api/ppt/upload`, {
        method: 'POST',
        body: data,  // Send FormData object (with contentName and file)
      });

      // Check for plain text response
      const result = await response.text(); // Parse response as plain text
      
      if (response.ok && result === 'File uploaded successfully.') {
        // Show success alert if the response is OK and the message is correct
        Swal.fire({
          title: 'Success!',
          text: result, // This will display "File uploaded successfully."
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        throw new Error(result || 'Error uploading file');
      }
    } catch (error) {
      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Error submitting form. Please try again.',
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
          Submit Your Document
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
          
          {/* File Input */}
          <input 
            type="file" 
            onChange={handleFileChange} 
            required 
            style={styles.fileInput}
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
  textField: {
    marginBottom: '20px',
  },
  fileInput: {
    marginTop: '20px',
    marginBottom: '20px',
    display: 'block',
    width: '100%',
  },
  submitButton: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '16px',
    height: '50px',
    backgroundColor:'#3f51b5'
  },
};

export default InsideSales_DocumentsUpload;
