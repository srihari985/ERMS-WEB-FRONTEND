import React, { useState,useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';
import * as Yup from 'yup'; // For form validation
import { toast, ToastContainer } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for Toast
import { useAuth } from '../../../AuthProvider';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const TicketDialog = ({ open, onClose,rowData }) => {
    const navigate=useNavigate()
  const [step, setStep] = useState(1);
  const { userId: technicianId } = useAuth();
  const [newData,setNewData]=useState([])
   // Effect to set the form values when rowData is received
   useEffect(() => {
    if (rowData) {
        setNewData(rowData); // Populate form with rowData
    }
  }, [rowData]);


  const [formValues, setFormValues] = useState({
    
    date: '',
    custName: '',
    ticketNo: '',
    poWork: '',
    status: '',
    comments: '',
    extraWork: '',
    serviceFeedback: ''
  });

  const [errors, setErrors] = useState({});

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    empid: Yup.string().required('Employee ID is required'),
    date: Yup.date().required('Date is required'),
    custName: Yup.string().required('Customer Name is required'),
    ticketNo: Yup.string().required('Ticket No. is required'),
    poWork: Yup.string().required('PO Work is required'),
    status: Yup.string().required('Status is required'),
    comments: Yup.string().required('Comments are required'),
    extraWork: Yup.string(),
    serviceFeedback: Yup.string()
  });

//   const validateForm = async () => {
//     try {
//       await validationSchema.validate(formValues, { abortEarly: false });
//       setErrors({});
//       return true;
//     } catch (validationErrors) {
//       const newErrors = {};
//       validationErrors.inner.forEach((error) => {
//         newErrors[error.path] = error.message;
//       });
//       setErrors(newErrors);
//       return false;
//     }
//   };

  const handleNext = async () => {
    
        setStep(2); // Move to the next step
    
};

  const handleBack = () => {
    setStep(1); // Go back to the first step
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    // Proceed to submit the form if valid
    const requestBody = { ...formValues };

    try {
        // Send data to the server using fetch POST method with JSON body
        const response = await fetch(`${baseUrl}/api/CustomerFeedback/save/${technicianId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indicate you're sending JSON
            },
            body: JSON.stringify(requestBody), // Convert the object to a JSON string
        });

        if (response.ok) {
            toast.success('Feed back Form submitted successfully', {
                autoClose: 1000, // Toast auto-dismiss after 3 seconds
            });
            setStep(2); // Move to step 2 after submission
        } else {
            toast.error('Failed to submit Feed Back Form', {
                autoClose: 1000, // Toast auto-dismiss after 3 seconds
            });
        }
    } catch (error) {
        toast.error('Error submitting the Feed back Form', {
            autoClose: 1000, // Toast auto-dismiss after 3 seconds
        });
        console.error('Error submitting the form', error);
    }
};


  //Close Ticket POST method 
  const handleTicketSubmit = async () => {
    // Use native confirmation dialog
    const isConfirmed = window.confirm(`You are about to close the ticket ${newData.ticketNumber}. Are you sure?`);
  
    if (isConfirmed) {
      try {
        // Create FormData
        const formData = new FormData();
        formData.append("ticketNumber", newData.ticketNumber);
        formData.append("status", "Close"); // Send "Close" as status
  
        // Post request with fetch
        const response = await fetch(`${baseUrl}/api/v1/technician/close/${technicianId}`, {
          method: "POST",
          body: formData,
        });
  
        console.log("Response status:", response.status);
  
        // If the response is OK (status 200-299), show success toast
        if (response.ok) {
          toast.success('Ticket Closed successfully.', {
            position: 'top-right',
            autoClose: 2000,
          });
          navigate('/TechnicianNewTickets')
          
        } else {
          // If response is not OK, show error toast
          toast.error('Failed to Close Ticket.', {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      } catch (error) {
        // Handle any fetch/network errors
        console.error("Error closing ticket:", error);
  
        // Show error toast
        toast.error('Failed to Close Ticket.', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    }
  };
  
  

  return (
    <>
      {/* Toast container to display toast messages */}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        {step === 1 ? (
          <>
            <DialogTitle>Ticket Information</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Customer Name"
                    name="custName"
                    value={formValues.custName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.custName}
                    helperText={errors.custName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Ticket No."
                    name="ticketNo"
                    value={formValues.ticketNo}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.ticketNo}
                    helperText={errors.ticketNo}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="PO Work"
                    name="poWork"
                    value={formValues.poWork}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.poWork}
                    helperText={errors.poWork}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Status"
                    name="status"
                    value={formValues.status}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.status}
                    helperText={errors.status}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Comments"
                    name="comments"
                    value={formValues.comments}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.comments}
                    helperText={errors.comments}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Extra Work"
                    name="extraWork"
                    value={formValues.extraWork}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.extraWork}
                    helperText={errors.extraWork}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Service Feedback"
                    name="serviceFeedback"
                    value={formValues.serviceFeedback}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.serviceFeedback}
                    helperText={errors.serviceFeedback}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNext} color="secondary">
                Skip
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            {/* Step 2: Confirmation page */}
            <DialogTitle style={{ backgroundColor: '#f5f5f5', color: '#333', padding: '20px' }}>
                    Close The Ticket
                    </DialogTitle>
                    <DialogContent style={{ padding: '20px', backgroundColor: '#fafafa' }}>
                    <p style={{ color: '#555', fontSize: '16px' }}>
                        You want to close this ticket <span style={{color:'red', fontWeight:'bold'}}>{newData.ticketNumber}</span>?
                    </p>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'space-between', padding: '20px', backgroundColor: '#fff' }}>
                    <div>
                        <Button
                        onClick={onClose}
                        color="secondary"
                        style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            '&:hover': {
                            backgroundColor: '#d32f2f',
                            },
                            marginRight:"15px"
                        }}
                        >
                        Cancel
                        </Button>
                        <Button
                        onClick={handleBack}
                        color="primary"
                        style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                            backgroundColor: '#1565c0',
                            },
                        }}
                        >
                        Back
                        </Button>
                    </div>
                    <Button
                        onClick={handleTicketSubmit}
                        color="primary"
                        style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                        }}
                    >
                        Submit
                    </Button>
                    </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TicketDialog;