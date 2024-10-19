import React from 'react';
import { Card, Typography, List, ListItem, ListItemText, Button, Avatar, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const admins = [
  { name: 'John Doe', email: 'john.doe@example.com' },
  { name: 'Jane Smith', email: 'jane.smith@example.com' },
  { name: 'Michael Brown', email: 'michael.brown@example.com' },
];

const OrganizationDashboard = () => {
  return (
    <Card style={{ padding: '20px', maxWidth: '500px', margin: 'auto', marginTop: '50px' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '20px' }}>
        Organization Admins
      </Typography>

      <List>
        {admins.map((admin, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Avatar style={{ marginRight: '15px', backgroundColor: '#3f51b5' }}>
                {admin.name.charAt(0)}
              </Avatar>
              <ListItemText
                primary={admin.name}
                secondary={admin.email}
                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
              />
            </ListItem>
            {index < admins.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginTop: '20px', display: 'block', width: '100%' }}
      >
        Add Admin
      </Button>
    </Card>
  );
};

export default OrganizationDashboard;
