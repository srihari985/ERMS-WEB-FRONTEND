import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, RadioGroup, FormControlLabel, Radio, Button, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InsideSales_AddBankDetails = () => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  const handleDone = () => {
    if (selectedAccount) {
      const selectedBankDetails = bankAccounts.find(account => account.accountNumber === selectedAccount);
      // Navigate to QuotationForm and pass the selected account details
      navigate('/QuotationForm', { state: { selectedBankDetails } });
    }
  };

  const bankAccounts = [
    {
      id: 1,
      accountNumber: '8886700051',
      bankName: 'Axis BANK',
      balance: '₹47082.48',
      details: 'ACC No: 8886700051@HDFCBANK',
      ifsc: 'IFSC: UTIB0003061'
    },
    {
      id: 2,
      accountNumber: '50200057328051',
      bankName: 'Canara BANK',
      balance: '₹418030.9',
      details: 'ACC No: 50200057328051',
      ifsc: 'IFSC: CNRB0008316'
    }
  ];

  return (
    <Card style={{ maxWidth: '600px', margin: '20px auto', padding: '10px', marginTop: '190px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Select Bank Account
        </Typography>
        <RadioGroup value={selectedAccount} onChange={handleChange}>
          {bankAccounts.map((account) => (
            <div key={account.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <FormControlLabel
                key={account.id}
                value={account.accountNumber}
                control={<Radio />}
                label={
                  <div>
                    <Typography variant="body1">
                      {`${account.accountNumber}@${account.bankName}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {account.details}
                    </Typography>
                  </div>
                }
              />
              <Typography variant="body1" style={{ marginLeft: 'auto' }}>
                {account.balance}
              </Typography>
              {account.ifsc && (
                <Typography variant="body2" style={{ marginLeft: '10px' }} color="textSecondary">
                  {account.ifsc}
                </Typography>
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          style={{ backgroundColor: '#3f51b5', color: '#fff' }}
          onClick={handleDone}
          disabled={!selectedAccount}
        >
          DONE
        </Button>
      </CardActions>
    </Card>
  );
};

export default InsideSales_AddBankDetails;