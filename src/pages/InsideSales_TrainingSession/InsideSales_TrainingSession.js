import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';

const videos = [                   
                                    
  { id: 1, title: 'Video 1', url: 'https://www.youtube.com/embed/cCfeWx21QhE', description: 'Introduction to Basics' },
  { id: 2, title: 'Video 2', url: 'https://www.youtube.com/embed/rKka6t7poGI', description: 'Advanced Techniques' },
  { id: 3, title: 'Video 3', url: 'https://www.youtube.com/embed/gBArbRZ1n_M', description: 'Intermediate Training' },
  { id: 4, title: 'Video 4', url: 'https://www.youtube.com/embed/6IGv9DJqKek', description: 'Expert Tips' },
  { id: 5, title: 'Video 5', url: 'https://www.youtube.com/embed/v34CumFX9wU', description: 'Master Class' },
  { id: 6, title: 'Video 6', url: 'https://www.youtube.com/embed/yC7MsDw5VO0', description: 'Final Overview' },
  { id: 7, title: 'Video 7', url: 'https://www.youtube.com/embed/H-wQEDK7Pf0', description: 'Specialized Training' },
  { id: 8, title: 'Video 8', url: 'https://www.youtube.com/embed/SF-Fvjr7IQQ', description: 'Industry Standards' },
  { id: 9, title: 'Video 9', url: 'https://www.youtube.com/embed/iNZl61We_5s', description: 'Professional Development' },
  { id: 10, title: 'Video 10', url: 'https://www.youtube.com/embed/45c_gqG7BzY', description: 'Advanced Projects' },
  { id: 11, title: 'Video 11', url: 'https://www.youtube.com/embed/0z1vtxtNd5E', description: 'Case Studies' },
  { id: 12, title: 'Video 12', url: 'https://www.youtube.com/embed/gwxCC2Pkg9U', description: 'Conclusion' },
];

const InsideSales_TrainingSession = () => {
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
          <h1>InsideSales Training Sessions</h1>
        </div>
       
        <Grid container spacing={4}>
          {videos.map((video) => (
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
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ height: '200px', borderRadius: '15px 15px 0 0' }} // To round the top of the video
                />
                <CardContent>
                  <Typography variant="h5">{video.title}</Typography>
                  <Typography variant="h3" color="black">
                    {video.description}
                  </Typography>
                </CardContent>
                <Button
                  size="small"
                  color="primary"
                  href={video.url}
                  target="_blank"
                  style={{ margin: '16px' }}
                >
                  Watch
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </div>
  );
};

export default InsideSales_TrainingSession;
