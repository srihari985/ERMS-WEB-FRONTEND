import React from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Grid, Card, CardContent } from '@mui/material';

const TechnicianPetrolAllowance = () => {
  const formik = useFormik({
    initialValues: {
      startTime: '',
      startReading: '',
      endTime: '',
      endReading: '',
      totalKm: '',
      petrolChargeKm: '',
      additionalcomments: '',
      petrolbillsinvoice: null, // For file input
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('startTime', values.startTime);
      formData.append('startReading', values.startReading);
      formData.append('endTime', values.endTime);
      formData.append('endReading', values.endReading);
      formData.append('totalKm', values.totalKm);
      formData.append('petrolChargeKm', values.petrolChargeKm);
      formData.append('additionalcomments', values.additionalcomments);
      formData.append('petrolbillsinvoice', values.petrolbillsinvoice);

      try {
        const response = await fetch('https://your-api-endpoint.com/petrol-allowance', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit the form');
        }

        alert('Daily report submitted!');
      } catch (error) {
        alert('There was an error submitting your request.');
      }
    },
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

  return (
    <Card sx={{ marginTop: '88px', marginLeft: '20px', marginRight: '20px' }}>
      <CardContent>
        <div style={{ marginBottom: "40px" }}>
          <h3>Petrol Allowance</h3>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Start Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="startTime"
                name="startTime"
                label="Start Time"
                type="text"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                required
                inputProps={{ step: 300 }} // 5 min intervals
              />
            </Grid>

            {/* Start Reading */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="startReading"
                name="startReading"
                type="number"
                label="Start Reading"
                value={formik.values.startReading}
                onChange={formik.handleChange}
                required
              />
            </Grid>

            {/* End Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="endTime"
                name="endTime"
                label="End Time"
                type="text"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                required
                inputProps={{ step: 300 }}
              />
            </Grid>

            {/* End Reading */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="endReading"
                name="endReading"
                type="number"
                label="End Reading"
                value={formik.values.endReading}
                onChange={formik.handleChange}
                required
               
              />
            </Grid>

            {/* Total KM */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="totalKm"
                name="totalKm"
                type="number"
                label="Total KM"
                value={formik.values.totalKm}
                onChange={formik.handleChange}
                required
              />
            </Grid>

            {/* Petrol Charge Per KM */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="petrolChargeKm"
                name="petrolChargeKm"
                type="number"
                label="Petrol Charge Per Km"
                // value={formik.values.petrolChargeKm}
                value='3'
                onChange={formik.handleChange}
                required
              />
            </Grid>

            {/* Additional Comments */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="additionalcomments"
                name="additionalcomments"
                label="Additional Comments"
                multiline
                rows={3}
                value={formik.values.additionalcomments}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Petrol Bill Invoice */}
            <Grid item xs={12} sm={6}>
              <div style={{ position: 'relative', width: '100%' }}>
                <label
                  htmlFor="petrolbillsinvoice"
                  style={labelStyle}
                >
                  Choose Petrol Bill Invoice
                </label>
                <input
                  id="petrolbillsinvoice"
                  name="petrolbillsinvoice"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    formik.setFieldValue('petrolbillsinvoice', event.currentTarget.files[0]);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    paddingTop:"18px",
                    padding: '13px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    height: '56px', // Adjust to match TextField height
                  }}
                />
              </div>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button style={{ padding: "10px 20px", backgroundColor:"#41CECA",width:"8%", color:'black', fontWeight:'bold' }} variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TechnicianPetrolAllowance;