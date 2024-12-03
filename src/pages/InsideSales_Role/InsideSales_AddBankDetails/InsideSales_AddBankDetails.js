import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  TextField,
  Grid,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'; // Import SweetAlert2 for confirmation
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';


const InsideSales_AddBankDetails = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [formValues, setFormValues] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
    branchName: '',
  });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch bank accounts from API on component mount
  const fetchBankAccounts = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/telecaller/bankdetails/getAll`);
      const data = await response.json();
      console.log("selected response details :", data);
      if (Array.isArray(data)) {
        setBankAccounts(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setBankAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setBankAccounts([]);
    }
  };

  useEffect(() => {
    fetchBankAccounts(); // Fetch data on component mount
  }, []);

  const handleChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the field
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate account number (only numbers, length between 8 to 18 digits)
    const accountNumberRegex = /^\d{8,18}$/;
    if (!formValues.accountNumber) {
      newErrors.accountNumber = 'Account Number is required.';
    } else if (!accountNumberRegex.test(formValues.accountNumber)) {
      newErrors.accountNumber = 'Account Number must be between 8 to 18 digits.';
    }

    // Validate IFSC code (first 4 letters, followed by 7 digits)
    const ifscCodeRegex = /^[A-Za-z]{4}\d{7}$/;
    if (!formValues.ifscCode) {
      newErrors.ifscCode = 'IFSC Code is required.';
    } else if (!ifscCodeRegex.test(formValues.ifscCode)) {
      newErrors.ifscCode = 'IFSC Code must be 11 characters long with 4 letters followed by 7 digits.';
    }

    // Validate bank name
    if (!formValues.bankName) {
      newErrors.bankName = 'Bank Name is required.';
    }

    // Validate account holder name
    const accountHolderRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    if (!formValues.accountHolderName) {
      newErrors.accountHolderName = 'Account Holder Name is required.';
    } else if (!accountHolderRegex.test(formValues.accountHolderName)) {
      newErrors.accountHolderName = 'Account Holder Name can only contain letters and spaces.';
    }

    // Validate branch name
    if (!formValues.branchName) {
      newErrors.branchName = 'Branch Name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };


  //Bank Details Submit button
  const handleSubmit = async () => {
    if (!validateForm()) return; // Only proceed if validation is successful

    setIsLoading(true); // Step 2: Set loading state to true

    try {
      const response = await fetch(`${baseUrl}/api/telecaller/bankdetails/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        await fetchBankAccounts(); // Refresh bank accounts after submission
        toast.success('Bank Details Saved successfully!', {
          position: 'top-right', // Correct usage of position
          autoClose: 2000, // Display for 2 seconds
        });
        setFormValues({
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          accountHolderName: '',
          branchName: '',
        });
      } else {
        // const errorMessage = await response.text();

        // Show error toast notification
        toast.error('Failed to save. Please try again.', {
          position: 'top-right', // Correct usage of position
          autoClose: 2000, // Display for 2 seconds
        });
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting the quotation. Please try again later.', {
        position: 'top-right', // Correct usage of position
        autoClose: 2000, // Display for 2 seconds
      });
    } finally {
      setIsLoading(false); // Step 2: Reset loading state
    }
  };

  // const handleDelete = async (bdId) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "Do you want to delete this bank account?",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const baseUrl = process.env.REACT_APP_API_BASE_URL
  //         const response = await fetch(`${baseUrl}/api/bankdetails/${bdId}`, {
  //           method: 'DELETE',
  //         });
  //         if (response.ok) {
  //           Swal.fire('Deleted!', 'Bank account has been deleted.', 'success');
  //           await fetchBankAccounts(); // Refresh the bank accounts list
  //           setSelectedAccount(''); // Clear selected account after deletion
  //         } else {
  //           console.error('Error deleting bank account:', response.statusText);
  //         }
  //       } catch (error) {
  //         console.error('Error:', error);
  //       }
  //     }
  //   });
  // };

  const handleDelete = async (bdId) => {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this bank account?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    // If the user confirms, proceed with the fetch request
    if (result.isConfirmed) {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/telecaller/bankdetails/${bdId}`, {
          method: 'DELETE',
        });

        // Check the response and show appropriate toast notifications
        if (response.ok) {
          await fetchBankAccounts(); // Refresh the bank accounts list
          setSelectedAccount(''); // Clear selected account after deletion

          // Show success toast notification after successful deletion

          toast.success('Bank account has been deleted successfully!', {
            position: 'top-right', // Correct usage of position
            autoClose: 2000, // Display for 2 seconds
          });
        } else {
          // Handle the error and show toast
          // const errorMessage = await response.text();
          // toast.error(`Error deleting bank account: ${errorMessage || 'Unknown error.'}`);

          // Show error toast notification
          toast.error('Error deleting bank account. Please try again.', {
            position: 'top-right', // Correct usage of position
            autoClose: 2000, // Display for 2 seconds
          });
        }
      } catch (error) {
        console.error('Error:', error);

        toast.error('Error deleting bank account.. Please try again later.', {
          position: 'top-right', // Correct usage of position
          autoClose: 2000, // Display for 2 seconds
        });
      }
    }
  };
  const handleDone = () => {
    if (selectedAccount) {
      const selectedBankDetails = bankAccounts.find(account => account.accountNumber === selectedAccount);
      console.log("Selected bank details:", selectedBankDetails);

      // Store the selected bank details in local storage
      localStorage.setItem("selectedBankDetails", JSON.stringify(selectedBankDetails));

      navigate('/InsideSales_QuotationForm', { state: { selectedBankDetails } });
    }
  };


  return (
    <Card style={{ width: '98%', margin: '20px auto', padding: '10px', marginTop: '6%' }}>
      <CardContent>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid container alignItems="center" spacing={2}>
          <Grid item container alignItems="center" xs sx={{ marginTop: '10px' }}>
            <IconButton onClick={() => navigate('/InsideSales_QuotationForm')} sx={{ color: '#2e2a54' }}>
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="h4" gutterBottom sx={{ marginTop: '7px', fontWeight:'bold', marginBottom:'10px' }}>
              Add Bank Details
            </Typography>
          </Grid>
        </Grid>
      </Grid>

        {/* Bank Account Form Fields */}
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
            <TextField
              label="Account Number"
              name="accountNumber"
              type="number"
              value={formValues.accountNumber}
              onChange={handleFormChange}
              fullWidth
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={formValues.ifscCode}
              onChange={handleFormChange}
              fullWidth
              error={!!errors.ifscCode}
              helperText={errors.ifscCode}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
            <TextField
              label="Bank Name"
              name="bankName"
              type="text"
              value={formValues.bankName}
              onChange={handleFormChange}
              fullWidth
              error={!!errors.bankName}
              helperText={errors.bankName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Account Holder Name"
              name="accountHolderName"
              type="text"
              value={formValues.accountHolderName}
              onChange={handleFormChange}
              fullWidth
              error={!!errors.accountHolderName}
              helperText={errors.accountHolderName}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
            <TextField
              label="Branch Name"
              name="branchName"
              type="text"
              value={formValues.branchName}
              onChange={handleFormChange}
              fullWidth
              error={!!errors.branchName}
              helperText={errors.branchName}
            />
          </Grid>
        </Grid>

        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#3f51b5', color: '#fff' }}
            onClick={handleSubmit}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? "Loading..." : "Submit"} {/* Step 3: Conditional rendering */}
          </Button>
        </CardActions>

        {/* Displaying List of Bank Accounts with Radio Buttons */}
        <RadioGroup value={selectedAccount} onChange={handleChange} style={{ marginTop: '20px' }}>
          {Array.isArray(bankAccounts) && bankAccounts.map((account) => (
            <div key={account.id} style={{ marginBottom: '16px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <FormControlLabel
                value={account.accountNumber}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
                      {account.bankName}
                    </div>
                    <div style={{ color: '#FF9800', fontSize: '16px' }}>
                      Account No: {account.accountNumber}
                    </div>
                  </div>
                }
              />
            </div>
          ))}
        </RadioGroup>


        {/* Card Actions */}
        <CardActions style={{ justifyContent: 'start', marginTop: '20px' }}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#3f51b5', color: '#fff' }}
            onClick={handleDone}
            disabled={!selectedAccount}
          >
            ADD TO QUOTATION FORM
          </Button>
          {selectedAccount && (
            <IconButton color="error" onClick={() => {
              const selectedAccountData = bankAccounts.find(account => account.accountNumber === selectedAccount);
              if (selectedAccountData) {
                console.log('Deleting account:', selectedAccountData.bdId);
                handleDelete(selectedAccountData.bdId); // Use the bdId from the selected account
              }
            }}>
              <DeleteIcon style={{ marginLeft: '17px', fontSize: '28px' }} />
            </IconButton>
          )}
        </CardActions>

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </CardContent>
    </Card>

  );
};

export default InsideSales_AddBankDetails;
