import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid, MenuItem, Box, Typography, Container, Tabs, Tab } from '@mui/material';

const TechnicianFoodTravelAllowance = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle Travel Allowance form submission
  const handleTravelSubmit = (event) => {
    event.preventDefault();
    console.log('Travel Allowance form submitted');
  };

  // Handle Food Allowance form submission
  const handleFoodSubmit = (event) => {
    event.preventDefault();
    console.log('Food Allowance form submitted');
  };

  return (
    // <Container maxWidth="lg" sx={{ padding: 0, margin: 0 }}>
      <Card
        sx={{
          // width: '100%',
          backgroundColor: 'white',
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
          marginTop: '88px',
          position:'relative',
          marginLeft:'20px',
          marginRight:'20px'
        }}
      >
        <Typography sx={{ marginBottom: 2, fontWeight: 'bold', fontSize: '20px' }}>
          Food & Travel Allowance Form
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ marginBottom: 3 }}
        >
          <Tab label="Travel Allowance" />
          <Tab label="Food Allowance" />
        </Tabs>
        <CardContent>
          {selectedTab === 0 && (
            <form onSubmit={handleTravelSubmit}>
              <Grid container spacing={2}>
                {/* Travel Allowance Fields */}
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Employee ID" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Customer Name" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Travel From" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Travel To" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Travel Type"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="bus">Bus</MenuItem>
                    <MenuItem value="train">Train</MenuItem>
                    <MenuItem value="bike">Bike</MenuItem>
                    <MenuItem value="flight">Flight</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                    <MenuItem value="car">Car</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="number" label="No. of Days" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="number" label="Travel Cost" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button variant="contained" style={{ padding: "10px 20px", backgroundColor:"#41CECA",width:"8%", color:'black', fontWeight:'bold' }} type="submit">
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}

          {selectedTab === 1 && (
            <form onSubmit={handleFoodSubmit}>
              <Grid container spacing={2}>
                {/* Food Allowance Fields */}
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Customer Name" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="number" label="No. of Persons" variant="outlined" required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Allowance Type"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    <MenuItem value="lunch">Lunch</MenuItem>
                    <MenuItem value="dinner">Dinner</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="number" label="Cost" variant="outlined" required />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button variant="contained" style={{ padding: "10px 20px", backgroundColor:"#41CECA",width:"8%", color:'black', fontWeight:'bold' }} type="submit">
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
    // </Container>
  );
};

export default TechnicianFoodTravelAllowance;