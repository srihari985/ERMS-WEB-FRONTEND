import React, { useState } from 'react';
import { styled } from "@mui/material/styles";
import { Grid, TextField, Button, Tabs, Tab, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Formik, Field, Form } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

// Validation schema using Yup for Step 1
const validationSchema = Yup.object({
  contactPerson: Yup.string().required('Contact Person is required'),
  contactNumber: Yup.string().required('Contact Number is required'),
  companyName: Yup.string().required('Company Name is required'),
  emailid: Yup.string().required('Email Id is required'),
  address: Yup.string().required('Address is required'),
  gstIn: Yup.string().required('gstIn number is required'),
});

// Validation schema for Step 4 feedback form
const feedbackValidationSchema = Yup.object({
  requirements: Yup.string().required('Requirements are required'),
  feedback: Yup.string().required('Feedback is required'),
});

const App = () => {
  const [step, setStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedHardware, setSelectedHardware] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState('');
  const [pdfPath, setPdfPath] = useState(''); // State to store the PDF path

  const handleFeedbackSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    Swal.fire({
      title: 'Feedback submitted!',
      text: 'Thank you for your feedback.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPdfPath(''); // Clear the PDF display when tab changes
  };

  const handleHardwareSelect = (event) => {
    setSelectedHardware(event.target.value);
  };

  const handleSoftwareSelect = (event) => {
    setSelectedSoftware(event.target.value);
  };

  // Function to handle the Get button click and set the PDF path
  const handleGetClick = () => {
    if (selectedTab === 0) {
      // Hardware tab
      if (selectedHardware === 'CCTV') {
        setPdfPath('/pdfs/cctv.pdf');
      } else if (selectedHardware === 'Biometric') {
        setPdfPath('/pdfs/Biometric.pdf');
      } else if (selectedHardware === 'Network') {
        setPdfPath('/pdfs/network.pdf');
      } else if (selectedHardware === 'Laptops') {
        setPdfPath('/pdfs/Laptop.pdf');
      } else if (selectedHardware === 'Desktop') {
        setPdfPath('/pdfs/Desktop.pdf');
      } else if (selectedHardware === 'Switches') {
        setPdfPath('/pdfs/switches.pdf');
      } else if (selectedHardware === 'Routers') {
        setPdfPath('/pdfs/routes.pdf');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No PDF file available for the selected hardware.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setPdfPath('');
      }
    } else if (selectedTab === 1) {
      // Software tab
      if (selectedSoftware === 'Inventory') {
        setPdfPath('/pdfs/inventory.pdf');
      } else if (selectedSoftware === 'HRBP') {
        setPdfPath('/pdfs/Hrbp.pdf');
      } else if (selectedSoftware === 'HRSP') {
        setPdfPath('/pdfs/Hrbp.pdf'); // It seems both HRBP and HRSP use the same PDF
      } else if (selectedSoftware === 'ERP') {
        setPdfPath('/pdfs/erp.pdf');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No PDF file available for the selected software.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        setPdfPath('');
      }
    }
    console.log(`Selected Hardware: ${selectedHardware}`);
    console.log(`Selected Software: ${selectedSoftware}`);
  };
  
  // Full Screen Handler
const handleFullScreen = (iframeId) => {
  const iframe = document.getElementById(iframeId);
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) {
    // Firefox
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) {
    // Chrome, Safari, Opera
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    // IE/Edge
    iframe.msRequestFullscreen();
  }
};
   

  // Define styled components
  const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
  }));

  // Define inline styles
  const cardStyle = {
    width: '100%',
    margin: '50px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
    backgroundColor: '#fff',
  };

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', marginTop:'20px' }}>
      {/* Step 1: Contact Form */}
      {step === 1 && (
        <section style={cardStyle}>
          <div style={{ marginBottom: '30px' }}>
            <h2>Contact Form</h2>
          </div>
          <div>
            <Formik
              initialValues={{
                contactPerson: '',
                contactNumber: '',
                companyName: '',
                emailid: '',
                address: '',
                gstIn: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                setStep(2);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={StyledTextField}
                        name="contactPerson"
                        type="text"
                        label="Contact Person"
                        variant="outlined"
                        fullWidth
                        helperText={touched.contactPerson ? errors.contactPerson : ''}
                        error={touched.contactPerson && Boolean(errors.contactPerson)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={StyledTextField}
                        name="contactNumber"
                        type="number"
                        label="Contact Number"
                        variant="outlined"
                        fullWidth
                        helperText={touched.contactNumber ? errors.contactNumber : ''}
                        error={touched.contactNumber && Boolean(errors.contactNumber)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={StyledTextField}
                        name="companyName"
                        type="text"
                        label="Company Name"
                        variant="outlined"
                        fullWidth
                        helperText={touched.companyName ? errors.companyName : ''}
                        error={touched.companyName && Boolean(errors.companyName)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={StyledTextField}
                        name="emailid"
                        type="email"
                        label="Email ID"
                        variant="outlined"
                        fullWidth
                        helperText={touched.emailid ? errors.emailid : ''}
                        error={touched.emailid && Boolean(errors.emailid)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={StyledTextField}
                        name="address"
                        type="text"
                        label="Address"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        helperText={touched.address ? errors.address : ''}
                        error={touched.address && Boolean(errors.address)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={StyledTextField}
                        name="gstIn"
                        type="text"
                        label="gstIn"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        helperText={touched.gstIn ? errors.gstIn : ''}
                        error={touched.gstIn && Boolean(errors.gstIn)}
                      />
                    </Grid>
                  </Grid>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      )}

      {/* Step 2: Demo Video */}
      {step === 2 && (
        <section style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowBackIcon
                style={{ cursor: 'pointer', marginRight: '10px' }}
                onClick={() => setStep(1)}
              />
              <h1 style={{ margin: 0 }}>Demo Video Screen</h1>
            </div>
          </div>
          <div style={{ marginLeft: "20px", marginRight: "20px" }}>
            <iframe
              style={{ objectFit: 'cover' }} // Ensures the video fills the iframe
              width="100%"
              height="600"
              src="https://www.youtube.com/embed/VtBWOpX5k24?rel=0&autoplay=1&loop=1&playlist=VtBWOpX5k24&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '8px' }}>
            <Button
              variant="contained"
              onClick={() => setStep(3)}
              style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
            >
              Next
            </Button>
          </div>
        </section>
      )}

     
  {/* //newely aded code */}
        {step === 3 && (
          <section style={cardStyle}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ArrowBackIcon
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  onClick={() => setStep(2)}
                />
                <h1 style={{ margin: 0 }}>Introduction PPT</h1>
              </div>
            </div>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Hardware and Software Tabs">
              <Tab label="Hardware" style={{ fontWeight: 'bold' }} />
              <Tab label="Software" style={{ fontWeight: 'bold' }} />
            </Tabs>

            {/* Hardware Tab Content */}
            {selectedTab === 0 && (
              <div style={{ marginTop: '20px' }}>
                <FormControl fullWidth variant="outlined" style={{ width: '30%', paddingRight: '20px' }}>
                  <InputLabel id="hardware-select-label">Select Hardware</InputLabel>
                  <Select
                    labelId="hardware-select-label"
                    value={selectedHardware}
                    onChange={handleHardwareSelect}
                    label="Select Hardware"
                  >
                    <MenuItem value="CCTV">CCTV</MenuItem>
                    <MenuItem value="Biometric">Biometric</MenuItem>
                    <MenuItem value="Network">Network</MenuItem>
                    <MenuItem value="Laptops">Laptops</MenuItem>
                    <MenuItem value="Desktop">Desktop</MenuItem>
                    <MenuItem value="Switches">Switches</MenuItem>
                    <MenuItem value="Routers">Routers</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleGetClick}
                  style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
                >
                  Get
                </Button>

                {/* Conditionally render the Hardware Tab */}
                {pdfPath && (
                  <div style={{ marginTop: '20px' }}>
                    <iframe
                      id="pdf-iframe"
                      src={pdfPath}
                      width="100%"
                      height="600px"
                      title="Hardware Presentation"
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleFullScreen('pdf-iframe')}
                      style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        marginTop: '10px',
                      }}
                    >
                      Full Screen
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Software Tab Content */}
            {selectedTab === 1 && (
              <div style={{ marginTop: '20px' }}>
                <FormControl fullWidth variant="outlined" style={{ width: '30%', paddingRight: '20px' }}>
                  <InputLabel id="software-select-label">Select Software</InputLabel>
                  <Select
                    labelId="software-select-label"
                    value={selectedSoftware}
                    onChange={handleSoftwareSelect}
                    label="Select Software"
                  >
                    <MenuItem value="Inventory">Inventory</MenuItem>
                    <MenuItem value="HRBP">HRBP</MenuItem>
                    <MenuItem value="HRSP">HRSP</MenuItem>
                    <MenuItem value="ERP">ERP</MenuItem>
                    <MenuItem value="other">other</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleGetClick}
                  style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
                >
                  Get
                </Button>

                {/* Conditionally render the Software Tab */}
                {pdfPath && (
                  <div style={{ marginTop: '20px' }}>
                    <iframe
                      id="pdf-iframe"
                      src={pdfPath}
                      width="100%"
                      height="500px"
                      title="Software Presentation"
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleFullScreen('pdf-iframe')}
                      style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        marginTop: '10px',
                      }}
                    >
                      Full Screen
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '16px' }}>
              <Button
                variant="contained"
                onClick={() => setStep(4)}
                style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
              >
                Next
              </Button>
            </div>
          </section>
        )}

      {/* Step 4: Feedback Form */}
      {step === 4 && (
        <section style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowBackIcon
                style={{ cursor: 'pointer', marginRight: '10px' }}
                onClick={() => setStep(3)}
              />
              <h1 style={{ margin: 0 }}>Feedback Form</h1>
            </div>
          </div>
          <Formik
            initialValues={{
              requirements: '',
              feedback: '',
            }}
            validationSchema={feedbackValidationSchema}
            onSubmit={handleFeedbackSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={StyledTextField}
                      name="requirements"
                      type="text"
                      label="Requirements"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      helperText={touched.requirements ? errors.requirements : ''}
                      error={touched.requirements && Boolean(errors.requirements)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={StyledTextField}
                      name="feedback"
                      type="text"
                      label="Feedback"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      helperText={touched.feedback ? errors.feedback : ''}
                      error={touched.feedback && Boolean(errors.feedback)}
                    />
                  </Grid>
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '16px' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ padding: "10px 20px", backgroundColor:"#41CECA", color:'black', fontWeight:'bold' }}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      )}
    </div>
  );
};

export default App;
