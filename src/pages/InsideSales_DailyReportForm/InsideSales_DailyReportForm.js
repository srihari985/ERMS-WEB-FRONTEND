import React, { useState } from 'react';
import { TextField, Button, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: '70px',
  marginLeft: '20px',
  marginRight: '20px',
  padding: '20px',
  backgroundColor: "white",
  boxShadow: theme.shadows[3],
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(2),
}));

const InsideSales_DailyReportForm = () => {
  const [formValues, setFormValues] = useState({
    empId: '',
    date: '',
    totalVisits: '',
    requirements: '',
    comments: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <StyledCard>
      <CardContent>
        <div style={{ marginBottom: "40px", textAlign: 'center' }}>
          <h3>Inside Sales Daily Report Form</h3>
        </div>

        <form>
          <Grid container spacing={3}>
            {/* Employee ID and Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                variant="outlined"
                name="empId"
                value={formValues.empId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                name="date"
                value={formValues.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Total Visits */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Calls"
                type="number"
                variant="outlined"
                name="totalVisits"
                value={formValues.totalVisits}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Requirements */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Requirements"
                variant="outlined"
                name="requirements"
                value={formValues.requirements}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Additional Comments */}
            <Grid item xs={12}>
              <TextField
                label="Additional Comments"
                variant="outlined"
                multiline
                rows={3}
                name="comments"
                value={formValues.comments}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <ButtonContainer>
            <Button
              type="submit"
              variant="contained"
              style={{ padding: "10px 20px", backgroundColor: "#007bff", width: "8%", color: '#fff', fontWeight: 'bold' }}
            >
              Submit
            </Button>
          </ButtonContainer>
        </form>
      </CardContent>
    </StyledCard>
  );
};

export default InsideSales_DailyReportForm;
