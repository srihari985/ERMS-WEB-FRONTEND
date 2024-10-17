import React ,{useState}from 'react';

import { TextField, Button, Grid, Card, CardContent } from '@mui/material';
// import { makeStyles } from '@material-ui/core/styles';

import { makeStyles } from '@mui/styles';
// import { Button } from '@mui/material';

// Styling for the components
const useStyles = makeStyles((theme) => ({
  card: {
    margin: 'auto',
    marginTop: '5%',
    padding: '20px',
    backgroundColor: "white",
    boxShadow: theme.shadows[3],
    maxWidth: '900px', // Limits max width to ensure structure remains consistent
    width: '100%', // Ensures it takes full width of the container
  },
  formHeader: {
    marginBottom: theme.spacing(3),
    textAlign: 'center', // Center-align form title
  },
  inputField: {
    width: "100%", // Full width for responsiveness
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  submitButton: {
    width: "150px",
  }
}));

const SalesDailyReport = () => {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    empId: '',
    date: '',
    totalVisits: '',
    requirements: '',
    comments: ''
  });


  const labelStyle = {
    fontSize: '12px', 
    color: '#666', 
    position: 'absolute', 
    top: '-10px', 
    left: '10px', 
    backgroundColor: 'white', 
    padding: '0 5px',
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card sx={{ marginTop: '70px', marginLeft: '20px', marginRight: '20px' }}>
      <CardContent>
        <div style={{ marginBottom: "40px" }}>
          <h3>Daily Report Form</h3>
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
              className={classes.inputField}
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
              className={classes.inputField}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Total Visits */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Visits"
              type="number"
              variant="outlined"
              name="totalVisits"
              value={formValues.totalVisits}
              onChange={handleChange}
              className={classes.inputField}
              fullWidth
            />
          </Grid>

          {/* Requirements */}
          <Grid item xs={12}>
            <TextField
              label="Requirements"
              variant="outlined"
              multiline
              rows={3}
              name="requirements"
              value={formValues.requirements}
              onChange={handleChange}
              className={classes.inputField}
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
              className={classes.inputField}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <div className={classes.buttonContainer}>
          <Button
            type="submit"
            
            variant="contained"
            style={{ padding: "10px 20px", backgroundColor:"#007bff",width:"8%", color:'#fff', fontWeight:'bold' }}
          >
            Submit
          </Button>
        </div>
      </form>
      </CardContent>
    </Card>
  );
};

export default SalesDailyReport;
