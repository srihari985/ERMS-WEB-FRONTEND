import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Box,
  IconButton,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const QuickQuotationSettings = () => {
  const [quotationPrefix, setQuotationPrefix] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState(3);
  const [isEnabled, setIsEnabled] = useState(true);

  const navigate = useNavigate();

  const handleSave = () => {
    console.log({ quotationPrefix, sequenceNumber, isEnabled });
  };

  const handleNavigate = () => {
    navigate('/quotationform');
  };

  return (
    <Card
      sx={{
        maxWidth: 650,
        padding: 4,
        boxShadow: 3,
        margin: 'auto',
        marginTop: 20,
        backgroundColor: '#c9c9c7', // Background color
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: '#2e2a54' }} // Title color
          >
            Quick Quotation Settings
          </Typography>
          <IconButton onClick={handleNavigate} sx={{ color: '#d32f2f' }}> {/* Icon color */}
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
        <Grid>
          <Typography variant="h6" gutterBottom sx={{ color: '#72b3ad' }}>
            quotationPrefix and sequenceNumber
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#1e88e5', // Switch thumb color when enabled
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#1e88e5', // Switch track color when enabled
                  },
                }}
              />
            }
            label=""
            sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}
          />
        </Grid>
        {isEnabled && (
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Prefix"
              value={quotationPrefix}
              onChange={(e) => setQuotationPrefix(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#e3f2fd', // TextField background color
                },
                '& label.Mui-focused': {
                  color: '#1e88e5', // Label color when focused
                },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                  borderColor: '#1e88e5', // Border color when focused
                },
              }}
            />
            <TextField
              label="Sequence Number"
              value={sequenceNumber}
              onChange={(e) => setSequenceNumber(e.target.value)}
              type="number"
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#e3f2fd', // TextField background color
                },
                '& label.Mui-focused': {
                  color: '#1e88e5', // Label color when focused
                },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                  borderColor: '#1e88e5', // Border color when focused
                },
              }}
            />
          </Box>
        )}

        {isEnabled && (
          <Typography variant="body2">
            Quotation Number: {sequenceNumber}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => console.log('Cancel')}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1e88e5', // Save button color
            '&:hover': {
              backgroundColor: '#1565c0', // Save button hover color
            },
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </CardActions>
    </Card>
  );
};

const App = () => {
  return (
    <div>
      <QuickQuotationSettings />
    </div>
  );
};

export default App;