import React, { useState } from 'react';
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

// Sample data
const data = [
  { sNo: 1, employeeId: 'E001', name: 'John Doe', date: '2024-09-14', noOfVisits: 5, requirements: 'Report', comments: 'Needs review' },
  { sNo: 2, employeeId: 'E002', name: 'Jane Smith', date: '2024-09-14', noOfVisits: 3, requirements: 'Approval', comments: 'Approved' },
  { sNo: 3, employeeId: 'E003', name: 'Alice Johnson', date: '2024-09-14', noOfVisits: 2, requirements: 'Follow-up', comments: 'Pending' },
  { sNo: 4, employeeId: 'E004', name: 'Bob Brown', date: '2024-09-14', noOfVisits: 4, requirements: 'Update', comments: 'Completed' },
  { sNo: 5, employeeId: 'E005', name: 'Charlie Davis', date: '2024-09-14', noOfVisits: 1, requirements: 'Review', comments: 'Reviewed' },
  { sNo: 6, employeeId: 'E006', name: 'Diana Evans', date: '2024-09-14', noOfVisits: 6, requirements: 'Inspection', comments: 'Needs follow-up' },
  { sNo: 7, employeeId: 'E007', name: 'Eve Foster', date: '2024-09-14', noOfVisits: 3, requirements: 'Verification', comments: 'Verified' },
  { sNo: 8, employeeId: 'E008', name: 'Frank Green', date: '2024-09-14', noOfVisits: 5, requirements: 'Confirmation', comments: 'Confirmed' },
  { sNo: 9, employeeId: 'E009', name: 'Grace Harris', date: '2024-09-14', noOfVisits: 2, requirements: 'Documentation', comments: 'In progress' },
  { sNo: 10, employeeId: 'E010', name: 'Henry Ives', date: '2024-09-14', noOfVisits: 4, requirements: 'Analysis', comments: 'Completed' },
];

const InsideSales_DailyReportList = () => {
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleOpen = (comment) => {
    setSelectedComment(comment);
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
    row.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.comments.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="false" sx={{ padding: 2 }}>
      <Card sx={{ width: '100%', backgroundColor: 'white', marginTop:"58px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{fontWeight:'bold', fontSize:'20px', marginBottom:'13px'}}>
            Inside Sales Daily Report List
          </Typography>

          {/* Flex container for search and button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 23, marginTop:25 }}>
            <TextField
              label="Search"
              variant="outlined"
              onChange={handleSearch}
              value={searchTerm}
              sx={{ width: '30%' }}
            />
            <Button
              variant="contained"
              style={{ padding: "10px 20px", backgroundColor:"#007bff", color:'#fff', fontWeight:'bold' }}
              onClick={() => navigate('/InsideSales_DailyReportForm')}
            >
              Daily Report Form
            </Button>
          </div>

          <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['S.No', 'Employee ID', 'Name', 'Date', 'No. of Visits', 'Requirements', 'Status','Actions'].map((header) => (
                    <TableCell key={header} sx={{ border: '1px solid #ACB4AE', padding: '12px', fontSize: '18px', textAlign: 'center', fontWeight: 'bold' , backgroundColor: "#A1F4BD", }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.sNo}>
                    {Object.keys(row).map((key) => (
                      <TableCell key={key} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                        {row[key]}
                      </TableCell>
                    ))}
                    <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: '#7D4DDD' }}
                        onClick={() => handleOpen(row.comments)}
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
        <Container maxWidth="sm">
          <Paper sx={{ padding: 2, marginTop: 8, position: 'relative' }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
              Comments
            </Typography>
            <Typography id="modal-description" sx={{ whiteSpace: 'pre-line' }}>
              {selectedComment}
            </Typography>
          </Paper>
        </Container>
      </Modal>
    </Container>
  );
};

export default InsideSales_DailyReportList;
