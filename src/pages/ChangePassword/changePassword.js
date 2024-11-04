import React, { useState } from 'react';
import { Card, Typography, TextField, Button, CircularProgress, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider';

const StyledCard = styled(Card)({
  width: '82.5vw',
  height: '90vh',
  marginTop: '6%',
  marginLeft:'1%',
  padding: '20px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  backgroundColor:'#E8E8E8'
});

const ContentBox = styled(Box)({
  width: '100%',
  maxWidth: '600px',
  textAlign: 'center',
  margin: 'auto',
  position: 'relative',
  top: '40%',
  transform: 'translateY(-50%)',
});

const TitleBox = styled(Box)({
  position: 'relative',
  top: 30,
  left: 0,
  marginTop: '30px',
  paddingLeft: '20px',
});

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {loginEmail } = useAuth();
  console.log("i am ChangePassword email :"+loginEmail)

  const handleChangePassword = async () => {
    setLoading(true);
    try {
        const baseUrl=process.env.REACT_APP_API_BASE_URL
      const url = `${baseUrl}/api/users/change-password?email=${loginEmail}&oldPassword=${oldPassword}&newPassword=${newPassword}`;
                           
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: null, // No need for body as parameters are in the URL
      });
  
      const contentType = response.headers.get('content-type');
      
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text(); // Handle plain text response
      }
  
      if (response.ok) {
        // Show success notification
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Your password has been changed successfully.',
        });
      } else {
        // Directly use the plain text response in the error case
        console.log("i am error : "+result)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result || 'There was a problem changing your password.',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Show error notification for network or unexpected errors
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem changing your password. Please try again later.',
      });
    } finally {
      setLoading(false);
      // Reset password fields
      setOldPassword('');
      setNewPassword('');
    }
  };
  
  

  const toggleOldPasswordVisibility = () => setShowOldPassword(prev => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev);

  return (
    <StyledCard >
      <TitleBox>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Change Password
        </Typography>
      </TitleBox>
      <ContentBox >
        <Box mb={2} textAlign="left">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Old Password:
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your old password"
            variant="outlined"
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Button onClick={toggleOldPasswordVisibility} sx={{ marginTop: '8px' }}>
            
          </Button>
        </Box>
        <Box mb={3} textAlign="left">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            New Password:
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your new password"
            variant="outlined"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={toggleNewPasswordVisibility} sx={{ marginTop: '8px' }}>
            
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={loading}
          sx={{
            width: '150px',
            height: '36px',
            backgroundColor: '#7e31ce',
            color: '#fff',
            '&:hover': { backgroundColor: '#13A9BD' },
            textAlign: 'center',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
        </Button>
      </ContentBox>
    </StyledCard>
  );
};

export default ChangePassword;