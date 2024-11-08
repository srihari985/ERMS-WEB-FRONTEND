import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../../AuthProvider";
import Swal from "sweetalert2";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
// import * as XLSX from "xlsx";
// import XLSX from 'xlsx-style';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  startTime: Yup.string().required("Start Time is required"),
  startReading: Yup.number()
    .required("Start Reading is required")
    .positive("Must be positive"),
  endTime: Yup.string().required("End Time is required"),
  endReading: Yup.number()
    .required("End Reading is required")
    .positive("Must be positive")
    .moreThan(
      Yup.ref("startReading"),
      "End Reading must be greater than Start Reading"
    ),
  totalKm: Yup.number()
    .required("Total KM is required")
    .positive("Must be positive"),
  petrolChargePerKm: Yup.number()
    .required("Petrol Charge Per Km is required")
    .positive("Must be positive"),
  additionalComments: Yup.string().max(
    400,
    "Additional Comments must not exceed 400 characters"
  ),
  // choosePetrolInvoiceBill: Yup.mixed()
    
  //   .test(
  //     "fileType",
  //     "Invalid file type. Only JPG, PNG, or PDF are allowed.",
  //     (value) => {
  //       if (!value) return true; // If no file is uploaded, it's valid
  //       const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
  //       return validFileTypes.includes(value.type);
  //     })
    // .test("fileSize", "File size must be less than 100KB", (value) => {
    //   if (!value) return true; // If no file is uploaded, it's valid
    //   return value.size <= 100 * 1024; // Check if file size is less than 100KB
    // }),
});

const PetrolAllowance = () => {
  const [showForm, setShowForm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const { sId } = useAuth();


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch table data
  const fetchTableData = async () => {
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(
        `${baseUrl}/api/perolAllowance/getBySalesId/${sId}`
      ); // Replace with your actual API endpoint
      const data = await response.json();

      // Check if response is an array or a single object
      const formattedData = Array.isArray(data) ? data : [data];

      setTableData(formattedData); // Set table data as an array (even if it's one object)
      console.log("Fetched petrol table data:", formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchTableData();
  }, []);

  // Filter table data based on the search query
  const filteredData = tableData.filter((row) =>
    row.date.includes(searchQuery)
  );

  //POST Method
  const formik = useFormik({
    initialValues: {
      startTime: "",
      startReading: "",
      endTime: "",
      endReading: "",
      totalKm: "",
      petrolChargePerKm: "",
      additionalComments: "",
      choosePetrolInvoiceBill: null,
    },
    validationSchema, // Assuming you have defined a validation schema
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      setIsSubmitting(true); // Start loading state
      try {
        const baseUrl=process.env.REACT_APP_API_BASE_URL
        const response = await fetch(
          `${baseUrl}/api/perolAllowance/save/${sId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          // await Swal.fire({
          //   icon: "success",
          //   title: "Success",
          //   text: "Form submitted successfully",
          // });
          toast.success('Form submitted successfully.', {
            position: 'top-right',
            autoClose: 2000,
          });
          setTimeout(() => {
            setShowForm(false); 
          }, 2000);

          fetchTableData(); // Refresh table data after submission
          formik.resetForm(); // Reset the form
          // Hide form after submission
        } else if (!values.choosePetrolInvoiceBill) {
          toast.error('Please select a petrol invoice bill before submitting.', {
            position: 'top-right',
            autoClose: 2000,
          });
          return; // Prevent form submission
        }
        
        else {
          // await 
          // Swal.fire({
          //   icon: "error",
          //   title: "Error",
          //   text: "Failed to submit the form",
          // });
          toast.error('Failed to submit the form.', {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // await 
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: "An error occurred while submitting the form",
        // });
        toast.error('An error occurred while submitting the form.', {
          position: 'top-right',
          autoClose: 2000,
        });
      } finally {
        setIsSubmitting(false); // Stop loading state
      }
    },
  });


  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PetrolAllowance");

    // Define columns with headers that match your actual data properties, including "Sl. No"
    worksheet.columns = [
        { header: 'Sl. No', key: 'slNo', width: 10 }, // Serial number column
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Start Time', key: 'startTime', width: 15 },
        { header: 'End Time', key: 'endTime', width: 15 },
        { header: 'Start Reading', key: 'startReading', width: 15 },
        { header: 'End Reading', key: 'endReading', width: 15 },
        { header: 'Total KM', key: 'totalKm', width: 15 },
        { header: 'Petrol Charge per KM', key: 'petrolChargePerKm', width: 20 },
        { header: 'Additional Comments', key: 'additionalComments', width: 25 },
        
        // Add more columns if needed based on your data properties
    ];

    // Add data rows to the worksheet with "Sl. No" as a sequential number
    data.forEach((item, index) => {
        worksheet.addRow({
            slNo: index + 1, // Increment serial number starting from 1
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            startReading: item.startReading,
            endReading: item.endReading,
            totalKm: item.totalKm,
            petrolChargePerKm: item.petrolChargePerKm,
            additionalComments: item.additionalComments,
           
            // Map additional properties as needed
        });
    });

    // Style the header row with sky blue background
    worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '87CEEB' }, // Sky blue color
        };
        cell.font = { bold: true };
    });

    // Save the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "PetrolAllowanceData.xlsx");
};
  
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text("Petrol Allowance Data", 14, 10);
    
    const tableData = data.map((row, index) => [
      index + 1, 
      row.date || '', // Ensure the date field exists
      row.startTime || '', 
      row.startReading || '', 
      row.endTime || '', 
      row.endReading || '', 
      row.totalKm || '', 
      row.petrolChargePerKm || '', 
      row.additionalComments || '',
    ]);
  
    doc.autoTable({
      head: [["Sl No", "Date", "Start Time", "Start Reading", "End Time", "End Reading", "Total Km", "Petrol Charge Per Km", "Comments"]],
      body: tableData,
    });
    
    doc.save("PetrolAllowanceData.pdf");
  };
  
  const exportToJSON = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PetrolAllowanceData.json";
    link.click();
  };
  
  const handleExport = (format) => {
    const data = filteredData.map(row => ({
      date: row.date,
      startTime: row.startTime,
      startReading: row.startReading,
      endTime: row.endTime,
      endReading: row.endReading,
      totalKm: row.totalKm,
      petrolChargePerKm: row.petrolChargePerKm,
      additionalComments: row.additionalComments,
    }));
  
    switch (format) {
      case "Excel":
        exportToExcel(data);
        break;
      case "PDF":
        exportToPDF(data);
        break;
      case "JSON":
        exportToJSON(data);
        break;
      default:
        break;
    }
  };
  




  return (
    <div>
      {showForm ? (
        <Card
          sx={{ marginTop: "5.5%", marginLeft: "20px", marginRight: "20px" }}
        >
          <CardContent>
            <div
              style={{
                display: "flex.",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <IconButton onClick={handleBack} style={{ marginRight: "10px" }}>
                <ArrowBackIcon />
              </IconButton>
              <h3 style={{ margin: 0 }}>Petrol Allowance</h3>
            </div>
              <ToastContainer/>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="startTime"
                    name="startTime"
                    label="Start Time"
                    type="text"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    error={!!formik.errors.startTime}
                    helperText={formik.errors.startTime}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="startReading"
                    name="startReading"
                    type="number"
                    label="Start Reading"
                    value={formik.values.startReading}
                    onChange={formik.handleChange}
                    error={!!formik.errors.startReading}
                    helperText={formik.errors.startReading}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="endTime"
                    name="endTime"
                    label="End Time"
                    type="text"
                    value={formik.values.endTime}
                    onChange={formik.handleChange}
                    error={!!formik.errors.endTime}
                    helperText={formik.errors.endTime}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="endReading"
                    name="endReading"
                    type="number"
                    label="End Reading"
                    value={formik.values.endReading}
                    onChange={formik.handleChange}
                    error={!!formik.errors.endReading}
                    helperText={formik.errors.endReading}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="totalKm"
                    name="totalKm"
                    type="number"
                    label="Total KM"
                    value={formik.values.totalKm}
                    onChange={formik.handleChange}
                    error={!!formik.errors.totalKm}
                    helperText={formik.errors.totalKm}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="petrolChargePerKm"
                    name="petrolChargePerKm"
                    type="number"
                    label="Petrol Charge Per Km"
                    value={formik.values.petrolChargePerKm}
                    onChange={formik.handleChange}
                    error={!!formik.errors.petrolChargePerKm}
                    helperText={formik.errors.petrolChargePerKm}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="additionalComments"
                    name="additionalComments"
                    label="Additional Comments"
                    multiline
                    rows={3}
                    value={formik.values.additionalComments}
                    onChange={formik.handleChange}
                    error={!!formik.errors.additionalComments}
                    helperText={formik.errors.additionalComments}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <label
                      htmlFor="choosePetrolInvoiceBill"
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        position: "absolute",
                        top: "-10px",
                        left: "10px",
                        backgroundColor: "white",
                        padding: "0 5px",
                      }}
                    >
                      Choose Petrol Bill Invoice
                    </label>
                    <input
                      id="choosePetrolInvoiceBill"
                      name="choosePetrolInvoiceBill"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "choosePetrolInvoiceBill",
                          event.currentTarget.files[0]
                        );
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        paddingTop: "18px",
                        padding: "13px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        height: "56px",
                      }}
                    />
                    {formik.errors.choosePetrolInvoiceBill && (
                      <div style={{ color: "red" }}>
                        {formik.errors.choosePetrolInvoiceBill}
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting} // Disable the button when submitting
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{ marginTop: "5.5%", marginLeft: "20px", marginRight: "20px" }}
        >
          <CardContent>
            {/* <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0 }}>Petrol Allowance List</h2>
            </div> */}
            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="20px" marginBottom="20px">
        <Box display="flex" alignItems="center">
          
          <Typography variant="h3" component="h3" sx={{ marginLeft: 2 }}>
          Petrol Allowance List
          </Typography>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
      <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleClick}>
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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













            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <TextField
                fullWidth
                label="Search by Date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
                sx={{ marginBottom: "20px", width: "30%" }}
              />
              <Button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                variant="contained"
                onClick={handleNext}
              >
                Petrol Allowance Form
              </Button>
            </div>

            <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Sl No</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Date</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Start Time</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Start Reading</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>End Time</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>End Reading</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Total KM</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Petrol Charge Per Km</TableCell>
        <TableCell style={{ fontWeight: "bold", fontSize: "14px", border: "1px solid #ACB4AE", textAlign: "center", backgroundColor: "#A1F4BD" }}>Additional Comments</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Array.isArray(filteredData) && filteredData.length > 0 ? (
        filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
          <TableRow key={row.id} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
            {/* Row-wise TableCells */}
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{index + 1}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.date}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.startTime}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.startReading}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.endTime}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.endReading}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.totalKm}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.petrolChargePerKm}</TableCell>
            <TableCell sx={{ border: "1px solid #ddd", padding: "8px", textAlign: "center", fontSize: "15px" }}>{row.additionalComments}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={9} style={{ textAlign: "center" }}>
            No data available
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 30, 50]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PetrolAllowance;
