import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Typography,
  Paper,
  Container,
  IconButton,
  TextField,
  TablePagination
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SalesDailyReportList = () => {
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState({ requirements: '', additionalComments: '' }); // Store both fields
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);  // State to store fetched data
  const navigate = useNavigate();

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl=process.env.REACT_APP_API_BASE_URL
        const response = await fetch(`${baseUrl}/api/dailyReport/getAll`); // Replace with your API endpoint
        if (response.ok) {               
          const result = await response.json();
          setData(result);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty array to run only once on component mount

  const handleOpen = (requirements, additionalComments) => {
    setSelectedComment({ requirements, additionalComments });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter and paginate data
  const filteredData = data.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.date.toLowerCase().includes(searchTerm.toLowerCase()) // Search by name or date
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="false" sx={{ padding: 2 }}>
      <Card sx={{ width: '100%', backgroundColor: 'white', marginTop: "58px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '13px' }}>
            Daily Report List
          </Typography>

          {/* Flex container for search and button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 23, marginTop: 25 }}>
            <TextField
              label="Search by Name or Date"
              variant="outlined"
              onChange={handleSearch}
              value={searchTerm}
              sx={{ width: '30%' }}
            />
            <Button
              variant="contained"
              style={{ padding: "10px 20px", backgroundColor: "#007bff", color: '#fff', fontWeight: 'bold' }}
              onClick={() => navigate('/SalesDailyReportForm')}
            >
              Daily Report Form
            </Button>
          </div>

          <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['S.No', 'Name', 'Date', 'No. of Visits', 'Actions'].map((header) => (
                    <TableCell key={header} sx={{ border: '1px solid #ACB4AE', padding: '12px', fontSize: '18px', textAlign: 'center', fontWeight: 'bold', backgroundColor: "#A1F4BD", }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.sNo}>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {row.date}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {row.totalVisits}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: '#7D4DDD' }}
                        onClick={() => handleOpen(row.requirements, row.additionalComments)}  // Pass both fields
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Container maxWidth="md">
          <Paper sx={{ padding: 3, marginTop: '8%', position: 'relative', borderRadius: '12px', boxShadow: 24 }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-title" variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
              Report Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Requirements:</strong>
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 2, p: 3, backgroundColor: '#f5f5f5',fontSize:"16px", borderRadius: '4px', border: '1px solid #ddd' }}>
              {selectedComment.requirements}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Additional Comments:</strong>
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 2, p: 3, backgroundColor: '#f5f5f5',fontSize:"16px", borderRadius: '4px', border: '1px solid #ddd' }}>
              {selectedComment.additionalComments}
            </Typography>
          </Paper>
        </Container>
      </Modal>
    </Container>
  );
};

export default SalesDailyReportList;