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
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Close as CloseIcon, FileDownload as FileDownloadIcon, SimCardDownload as SimCardDownloadIcon, PictureAsPdf as PictureAsPdfIcon, FilePresent as FilePresentIcon,ExpandMore as ExpandMoreIcon  } from '@mui/icons-material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const TechLead_DailyReportList = () => {
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState({ requirements: '', additionalComments: '' }); // Store both fields
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);  // State to store fetched data
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl=process.env.REACT_APP_API_BASE_URL
        const response = await fetch(`${baseUrl}/api/operationTechLead/dailyReport/getAll`); // Replace with your API endpoint
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    handleCloseMenu();
    if (format === 'Excel') exportToExcel();
    else if (format === 'PDF') exportToPDF();
    else if (format === 'JSON') exportToJSON();
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daily Report");
  
    // Define the columns with headers
    worksheet.columns = [
      { header: 'S.No', key: 'sNo', width: 5 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'No. of Visits', key: 'totalVisits', width: 15 },
      { header: 'Requirements', key: 'requirements', width: 35 },
      { header: 'Additional Comments', key: 'additionalComments', width: 35 },
    ];
  
   
  
    // Add data to the worksheet
    data.forEach((item, index) => {
      const row = worksheet.addRow({
        sNo: index + 1,
        name: item.name,
        date: item.date,
        totalVisits: item.totalVisits,
        requirements: item.requirements,
        additionalComments: item.additionalComments
      });
    });

     // Apply sky blue background color to header row
     worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        fillType: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF87CEEB' }, // Sky blue background color
      };
      cell.font = { bold: true }; // Make headers bold
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Daily_Report.xlsx');
  };
  
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [['S.No', 'Name', 'Date', 'No. of Visits' , "Requirements" , "Additional Comments"]],
      body: data.map((item, index) => [
        index + 1,
        item.name,
        item.date,
        item.totalVisits,
        item.requirements,
        item.additionalComments
      ]),
    });
    doc.save('Daily_Report.pdf');
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'Daily_Report.json');
  };










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
          {/* <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '13px' }}>
            Daily Report List
          </Typography> */}
           <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
                  <Box display="flex" alignItems="center">
                    
                    <Typography variant="h3" component="h3" sx={{ marginLeft: 2 }}>
                    Daily Report List
                    </Typography>
                  </Box>

                  <Box display="flex" gap={2} alignItems="center">
                  <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleClick}>
                    Export
                  </Button>
                  <Menu
                    anchorEl={anchorEl} // Use anchorEl to control menu visibility
                    open={Boolean(anchorEl)} // Open the menu if anchorEl is not null
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => handleExport("Excel")}>
                      <ListItemIcon><SimCardDownloadIcon /></ListItemIcon>
                      <ListItemText primary="Excel" sx={{ fontWeight: 'bold' }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleExport("PDF")}>
                      <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                      <ListItemText primary="PDF" sx={{ fontWeight: 'bold' }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleExport("JSON")}>
                      <ListItemIcon><FilePresentIcon /></ListItemIcon>
                      <ListItemText primary="JSON" sx={{ fontWeight: 'bold' }} />
                    </MenuItem>
                  </Menu>
                </Box>

            </Box>



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
              onClick={() => navigate('/TechLead_DailyReportForm')}
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

export default TechLead_DailyReportList;