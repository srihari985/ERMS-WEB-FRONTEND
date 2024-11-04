import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

// Dummy data for admins
const adminData = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Super Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Moderator' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Admin' }
];

const AdminDashboard = () => {
  return (
    <Box sx={{ width: '100%', mt: 8, p: 2 }}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h3" fontWeight="bold" style={{textAlign:"center"}} component="div" gutterBottom>
            Admin Dashboard
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell  style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '14px', border: '1px solid #ACB4AE', textAlign: 'center', backgroundColor: '#A1F4BD' }}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminData.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{admin.id}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{admin.name}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{admin.email}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>{admin.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
