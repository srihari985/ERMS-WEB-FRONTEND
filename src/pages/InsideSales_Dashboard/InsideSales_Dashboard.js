import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Button, TextField } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation, useNavigate } from 'react-router-dom';

const InsideSales_Dashboard = () => {
  const [view, setView] = useState('dashboard');
  const [quotationCount, setQuotationCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [customerList, setCustomerList] = useState(0);
  const [quotations, setQuotations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setQuotationCount(5);
    setInvoiceCount(5);
    setAmount(17500);
    setCustomerList(5);

    const initialQuotations = [
      { id: 1, customername: 'John Doe', productname: 'Product A', quantity: 10, amount: '$1500', essentialDetails: 'Urgent delivery required' },
      { id: 2, customername: 'Jane Smith', productname: 'Product B', quantity: 5, amount: '$2500', essentialDetails: 'Include additional warranty' },
      { id: 3, customername: 'Alice Johnson', productname: 'Product C', quantity: 2, amount: '$3500', essentialDetails: 'Gift wrapping needed' },
      { id: 4, customername: 'Robert Brown', productname: 'Product D', quantity: 7, amount: '$4500', essentialDetails: 'Express shipping' },
      { id: 5, customername: 'Michael Davis', productname: 'Product E', quantity: 3, amount: '$5500', essentialDetails: 'Include invoice' },
    ];
    setQuotations(initialQuotations);
  }, []);

  const handleQuotationClick = () => {
    // navigate("/SalesQuationList")
  };

  const handleBackClick = () => {
    setView('dashboard');
  };

  const handleCreateNewQuotationClick = () => {
    setView('createQuotation');
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newQuotation = {
      id: quotations.length + 1,
      customername: formData.get('customername'),
      productname: formData.get('productname'),
      quantity: formData.get('quantity'),
      amount: `${formData.get('amount')}`,
      essentialDetails: formData.get('EssentialDetails'),
    };
    setQuotations([...quotations, newQuotation]);
    setIsExpanded(true);
    setView('quotations');
  };

  const Achievements = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">Target</Typography>
          <LinearProgress
            variant="determinate"
            value={25}
            sx={{
              height: '16px',
              borderRadius: '4px',
              backgroundColor: 'lightgray',
              '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
            }}
          />
          
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">Remaining Target</Typography>
          <LinearProgress
            variant="determinate"
            value={50}
            sx={{
              height: '16px',
              borderRadius: '4px',
              backgroundColor: 'lightgray',
              '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
            }}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">Completed Target</Typography>
          <LinearProgress
            variant="determinate"
            value={75}
            sx={{
              height: '16px',
              borderRadius: '4px',
              backgroundColor: 'lightgray',
              '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
            }}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">Incentives</Typography>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              height: '16px',
              borderRadius: '4px',
              backgroundColor: 'lightgray',
              '& .MuiLinearProgress-bar': { backgroundColor: 'info.main' },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

//   const CreateQuotationForm = () => (
//     <Box p={6} marginTop={8}>
//       <Typography variant="h4" gutterBottom align="center">
//         Create New Quotation
//       </Typography>
//       <form onSubmit={handleFormSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Customer Name"
//               name="customername"
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Name" name="productname" />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Quantity" name="quantity" type="number" />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Amount" name="amount" type="number" />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField fullWidth label="Essential Details" name="EssentialDetails" multiline rows={4} />
//           </Grid>
//           <Grid item xs={12}>
//             <Button variant="contained" type="submit" fullWidth>
//               Submit
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       <Box mt={2} textAlign="center">
//         <Button variant="outlined" onClick={handleBackClick}>
//           Back to Dashboard
//         </Button>
//       </Box>
//     </Box>
//   );

  const QuotationList = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center" style={{color:'black',fontWeight:'bold'}}>
          Inside Sales List
        </Typography>

        {/* <Button onClick={() => navigate('/QuotationForm')} sx={{ color: '#2e2a54' }}> */}
        <Button>
          Create New sales list
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Customer Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD",  }}>Product Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD",  }}>Quantity</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000', border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD",  }}>Amount</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' , border: "1px solid #ACB4AE",textAlign:'center', backgroundColor: "#A1F4BD", }}>Essential Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotations.map((row) => (
                <TableRow key={row.id}>
                  <TableCell  style={{border: "1px solid #ACB4AE", fontSze: "15px",textAlign: "center"}}>{row.customername}</TableCell>
                  <TableCell style={{border: "1px solid #ACB4AE", fontSze: "15px",textAlign: "center"}} >{row.productname}</TableCell>
                  <TableCell  style={{border: "1px solid #ACB4AE", fontSze: "15px",textAlign: "center"}}>{row.quantity}</TableCell>
                  <TableCell  style={{border: "1px solid #ACB4AE", fontSze: "15px",textAlign: "center"}}>{row.amount}</TableCell>
                  <TableCell  style={{border: "1px solid #ACB4AE", fontSze: "15px",textAlign: "center"}}>{row.essentialDetails}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  

  return (
    <Box p={3} marginTop={8}>
      {view === 'dashboard' ? (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
              onClick={handleQuotationClick}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{quotationCount} Quotations</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                
              }}
            //   onClick={() => navigate('/SalesInvoiceList')}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{invoiceCount} Invoices</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            //   onClick={() => navigate('/TicketsList')}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{amount} Tickets</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
              }}
            //   onClick={() => navigate('/ListCustomer')}
              style={{ cursor: 'pointer' }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: '48px', color: 'primary.main' }} />
                <Typography variant="h6">{customerList} Customer List</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={isExpanded ? 6 : 9}>
            <QuotationList />
          </Grid>
          <Grid item xs={12} sm={isExpanded ? 6 : 3}>
            <Achievements />
          </Grid>
          {/* <Grid item xs={12} sm={isExpanded ? 6 : 9}>
            <QuotationList />
          </Grid> */}
        </Grid>
    //   )
    //    : view === 'createQuotation' ? (
    //     <CreateQuotationForm />
    //   ) :  view === 'quotations' ? (
    //     <QuotationList />

      ) : null
      }
    </Box>
  );
};

export default InsideSales_Dashboard;