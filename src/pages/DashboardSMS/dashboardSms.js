// src/Dashboard.js
import React from 'react';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Google, LinkedIn, Close, ExpandMore } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './dashboard.css';

const data = [
  { name: 'Collections', value: 10000, fill: '#8884d8' },
  { name: 'Fees', value: 8000, fill: '#82ca9d' },
  { name: 'Expenses', value: 5000, fill: '#ffc658' },
];

const Dashboard = () => {
  return (
    <Box p={2} marginTop={8}>
      <Grid container spacing={2}>
        {/* Cards */}
        {[
          { title: 'Students', count: '50,000' },
          { title: 'Teachers', count: '10,000' },
          { title: 'Parents', count: '15,000' },
          { title: 'Total Employees', count: '80' },
        ].map((card, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper elevation={3} className="card" sx={{width:'300px', marginRight:'15px', marginLeft:'20px'}}>
              <Typography variant="h6">{card.title}</Typography>
              <Typography variant="h4">{card.count}</Typography>
            </Paper>
          </Grid>
        ))}

        {/* Fees Collection & Expenses */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} className="card">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Fees Collection & Expenses</Typography>
              <Box>
                <IconButton><ExpandMore /></IconButton>
                <IconButton><Close /></IconButton>
              </Box>
            </Box>
            <BarChart width={450} height={350} data={data}>
              <CartesianGrid strokeDasharray="3 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Social Media Stats */}
        {/* {[
          { title: 'Like us on Facebook', count: '30,000', icon: <Facebook style={{ fontSize: 40 }} /> },
          { title: 'Follow us on Twitter', count: '13,000', icon: <Twitter style={{ fontSize: 40 }} /> },
        //   { title: 'Follow us on Google Plus', count: '9,000', icon: <Google style={{ fontSize: 40 }} /> },
          { title: 'Follow us on LinkedIn', count: '18,000', icon: <LinkedIn style={{ fontSize: 40 }} /> },
        ].map((social, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper elevation={3} className="card social-card">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{social.title}</Typography>
                  <Typography variant="h4">{social.count}</Typography>
                </Box>
                {social.icon}
              </Box>
            </Paper>
          </Grid>
        ))} */}

        {/* Event Calendar */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="card">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Event Calendar</Typography>
              <Box>
                <IconButton><ExpandMore /></IconButton>
                <IconButton><Close /></IconButton>
              </Box>
            </Box>
            <Calendar className="calendar" />
          </Paper>
        </Grid>

        {/* Notice Board */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} className="card">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Notice Board</Typography>
              <Box>
                <IconButton><ExpandMore /></IconButton>
                <IconButton><Close /></IconButton>
              </Box>
            </Box>
            <Box className="notice-board">
              {[
                'Great School management... by Jennyfar Lopez',
                'Great School management... by Killar Miller',
                'Great School management... by Jennyfar Lopez',
                'Great School management... by Mike Hussey',
              ].map((notice, index) => (
                <Typography key={index} className="notice-item">{notice}</Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} className="card">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Recent Activities</Typography>
              <Box>
                <IconButton><ExpandMore /></IconButton>
                <IconButton><Close /></IconButton>
              </Box>
            </Box>
            <Box className="recent-activities">
              {[
                'You followed Olivia Williamson',
                'You subscribed to Harold Fuller',
                'You updated your profile picture',
                'You deleted homepage.psd',
              ].map((activity, index) => (
                <Typography key={index} className="activity-item">{activity}</Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
