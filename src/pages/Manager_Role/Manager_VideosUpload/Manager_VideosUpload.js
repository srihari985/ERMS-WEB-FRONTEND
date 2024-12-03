import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Tabs, Tab, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../AuthProvider";

const Manager_VideosUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    contentName: '',
    trainingLink: '',
    contentType: '' // Added contentType to the initial state
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { telId } = useAuth();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setFormData({
      ...formData,
      title: newValue === 0 ? '' : formData.title,
      link: newValue === 0 ? '' : formData.link,
      contentName: newValue === 1 ? '' : formData.contentName,
      trainingLink: newValue === 1 ? '' : formData.trainingLink,
      contentType: newValue === 1 ? '' : formData.contentType // Reset contentType on tab 1
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
    setLoading(true);

    const data = new FormData();
    if (currentTab === 0) {
      data.append('title', formData.title);
      data.append('link', formData.link);
    } else {
      data.append('contentName', formData.contentName);
      data.append('trainingLink', formData.trainingLink);
      data.append('contentType', formData.contentType); // Add contentType to the submission
    }

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const endpoint = currentTab === 0 ? '/api/manager/videos/save/link' : `/api/manager/training/save`;
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.text();

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Video uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setFormData({
        title: '',
        link: '',
        contentName: '',
        trainingLink: '',
        contentType: ''
      });
    } catch (error) {
      toast.error("Error uploading video. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
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
          {currentTab === 1 && (
            <FormControl fullWidth margin="normal" style={styles.textField}>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={formData.contentType}
                onChange={handleChange}
                name="contentType"
                required
              >
                <MenuItem value="CommonVideos">Common Videos</MenuItem>
                <MenuItem value="TechnicianVideos">Technician Videos</MenuItem>
              </Select>
            </FormControl>
          )}
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
            disabled={loading}
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

export default Manager_VideosUpload;
