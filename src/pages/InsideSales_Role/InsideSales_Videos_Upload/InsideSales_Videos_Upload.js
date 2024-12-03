import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../AuthProvider";

const InsideSales_VideosUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    contentName: '',  // Add contentName to the initial state
    trainingLink: ''   // Add trainingLink to the initial state
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const { telId } = useAuth();
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    // Reset form when tab changes, but maintain the structure of formData
    setFormData({
      ...formData,
      title: newValue === 0 ? '' : formData.title,
      link: newValue === 0 ? '' : formData.link,
      contentName: newValue === 1 ? '' : formData.contentName, // reset for contentName only on tab 1
      trainingLink: newValue === 1 ? '' : formData.trainingLink // reset for trainingLink only on tab 1
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submit starts
    
    const data = new FormData();
    if (currentTab === 0) {
      data.append('title', formData.title);
      data.append('link', formData.link);
    } else {
      data.append('contentName', formData.contentName);
      data.append('trainingLink', formData.trainingLink);
    }

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const endpoint = currentTab === 0 ? '/api/videos/save/link' : `/api/telecaller/training/save/${telId}`;
      const response = await fetch(`${baseUrl}${endpoint}`, {         
        method: 'POST',
        body: data,
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Parse the response
      const result = await response.text();
      
      // Check for errors in the response content
      if (result.error) { // Assuming your API returns { error: "message" } on failure
        throw new Error(result.error);
      }

      toast.success("Video uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      // Clear form fields after success
      setFormData({
        title: '',
        link: '',
        contentName: '',
        trainingLink: ''
      });
    } catch (error) {
      toast.error("Error uploading video. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Reset loading to false when submit completes
    }
};


  return (
    <Card style={styles.card}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {currentTab === 0 ? 'Upload Demo Video' : 'Upload Training Session Video'}
        </Typography>

        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Upload Demo Video" />
          <Tab label="Upload Training Session Videos" />
        </Tabs>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label={currentTab === 0 ? "Title" : "Content Name"}
            variant="outlined"
            name={currentTab === 0 ? "title" : "contentName"}
            value={currentTab === 0 ? formData.title : formData.contentName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            style={styles.textField}
          />
          <TextField
            label={currentTab === 0 ? "Link" : "Training Link"}
            variant="outlined"
            name={currentTab === 0 ? "link" : "trainingLink"}
            value={currentTab === 0 ? formData.link : formData.trainingLink}
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
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Submit'}
          </Button>
        </form>
      </CardContent>
      
      <ToastContainer />
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
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textField: {
    marginBottom: '20px',
  },
  submitButton: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '16px',
    height: '50px',
    backgroundColor: '#3f51b5',
  },
};

export default InsideSales_VideosUpload;
