import React, { useState, useEffect } from 'react';
import {Typography, Grid, Card, CardMedia, CardContent, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';

const TechnicianTrainingSession = () => {
  const [videos, setVideos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Helper function to convert YouTube and Google Drive links to embeddable format
  const formatVideoLink = (url) => {
    // For YouTube links
    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&\n?#]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // For Google Drive links
    const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)\/?/;
    const driveMatch = url.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // Return original URL if no match is found
    return url;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/manager/training/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
  
        const data = await response.json();
        
        // Filter videos with contentType="CommonVideos"
        const filteredData = data.filter(video => video.contentType === "TechnicianVideos");
  
        // Format video links before setting them in state
        const formattedData = filteredData.map(video => ({
          ...video,
          trainingLink: formatVideoLink(video.trainingLink),
        }));
  
        setVideos(formattedData);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error("Failed to load videos. Please try again later.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };
  
    fetchVideos();
  }, []);
  

  // Handle opening the menu
  const handleMenuOpen = (event, videoId) => {
    setAnchorEl(event.currentTarget);
    setSelectedVideoId(videoId);
  };

  // Handle closing the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVideoId(null);
  };

  // Handle delete action with API call
  const handleDelete = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/training/${selectedVideoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      setVideos(videos.filter((video) => video.id !== selectedVideoId));
      toast.success("Video deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error("Failed to delete video. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      handleMenuClose();
    }
  };

  return (
    <div>
      <Card 
        style={{
          marginTop: '72px',
          marginLeft: '20px',
          marginRight: '20px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <div>
          <h1>Training Sessions</h1>
        </div>
       
        <Grid container spacing={4}>
          {videos.map((video ,index) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card 
                style={{
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
                  height: '100%', 
                  width: '90%', 
                  marginLeft: '20px',
                  borderRadius: '15px' // Adding border radius to inside cards
                }}
              >
                <CardMedia
                  component="iframe"
                  src={video.trainingLink}
                  title={video.id}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ height: '200px', borderRadius: '15px 15px 0 0' }} // To round the top of the video
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft:'14px' }}>
                  <Typography variant="h4">Video {index + 1}</Typography>
                  <IconButton
                    aria-label="more"
                    aria-controls={`menu-${video.id}`}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, video.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`menu-${video.id}`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedVideoId === video.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </div>

                <CardContent>
                  <Typography variant="h5">{video.title}</Typography>
                  <Typography variant="h3" color="black">
                    {video.contentName}
                  </Typography>
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </div>
  );
};

export default TechnicianTrainingSession;
