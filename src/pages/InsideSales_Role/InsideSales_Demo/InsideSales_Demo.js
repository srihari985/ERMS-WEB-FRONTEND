import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik, Field, Form } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useAuth } from "../../../AuthProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const baseUrl = process.env.REACT_APP_API_BASE_URL;

// Validation schema using Yup for Step 1
const validationSchema = Yup.object().shape({
  contactPerson: Yup.string()
    .required("Contact Person is required")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only alphabets are allowed for the contact person"
    )
    .min(3, "Contact Person must be at least 3 characters long")
    .max(50, "Contact Person must not exceed 50 characters"),

  contactNumber: Yup.string()
    .required("Contact Number is required")
    .matches(/^[0-9]+$/, "Only numbers are allowed for contact number")
    .min(10, "Contact Number must be at least 10 digits")
    .max(15, "Contact Number must not exceed 15 digits"),

  companyName: Yup.string()
    .required("Company Name is required")
    .min(2, "Company Name must be at least 2 characters long")
    .max(100, "Company Name must not exceed 100 characters"),

  emailid: Yup.string()
    .required("Email ID is required")
    .email("Invalid email format"),

  address: Yup.string()
    .required("Address is required")
    .max(400, "Address must not exceed 200 characters"),

  gstIn: Yup.string()
    .required("GSTIN is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    ),
});

// Validation schema for Step 4 feedback form
const feedbackValidationSchema = Yup.object({
  requirements: Yup.string().required("Requirements are required"),
  feedback: Yup.string().required("Feedback is required"),
});

const InsideSales_Demo = () => {
  const [step, setStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedHardware, setSelectedHardware] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState("");

  const [pdfPath, setPdfPath] = useState(""); // State to store the PDF path
  const [pptData, setPptData] = useState([]); // Store data from API

  const [isSaving, setIsSaving] = useState(false);
  const [demoVideo, setDemoVideo]=useState('')
  const { telId } = useAuth();

  //POST Feedback Form
  const handleFeedbackSubmit = async (values) => {
   
    setIsSaving(true); // Set loading state to true
    try {
      const baseUrl=process.env.REACT_APP_API_BASE_URL
      const response = await fetch(
        `${baseUrl}/api/telecaller/feedback/save/${telId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // Send data as JSON
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok"); // Handle non-2xx responses
      }

      const data = await response.json(); // Parse the JSON response

      // Show success alert with SweetAlert
      
      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your feedback has been submitted successfully submitted.",
        timer: 3000, // 3 seconds
        showConfirmButton: false,
      });

      // Wait for 3 seconds and then show the second popup with a button
      setTimeout(() => {
        Swal.fire({
          icon: "info",
          title: "Next Step",
          text: "Click the button to proceed to the next step.",
          confirmButtonText: "Go to Next Step",
        }).then((result) => {
          if (result.isConfirmed) {
            setStep(5); // Go to next step when user clicks the button
          }
        });
      }, 3000);
    } catch (error) {
      // Show error alert with SweetAlert
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong!",
        icon: "error",
      });
    } finally {
      setIsSaving(false); // Reset loading state
    }
  };


  //POST -website FEED BACK
  const handleSubmitWebsiteFeedback = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create a new FormData instance
      const formData = new FormData();
      
      // Append each field from `values` to `formData`
      for (const key in values) {
        formData.append(key, values[key]);
      }
  
      const response = await fetch(`${baseUrl}/api/telecaller/websiteFeedback/save/${telId}`, {
        method: 'POST',
        body: formData, // Send as form data
      });
  
      if (response.ok) {
        // Handle successful response
        toast.success('Feedback submitted successfully!', { autoClose: 2000 });
        
        // Reset the form fields after successful submission
        resetForm();
      } else {
        // Handle server errors
        toast.error('Failed to submit feedback.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Network error: Failed to submit feedback.');
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };
  


  //GET Videos URLS
  // const fetchDemoVideos = async () => {
  //   try {
  //     const response = await fetch(`${baseUrl}/api/videos/getAll`);
  //     const data = await response.json();

  //     // If the data is an array, find the video with id: 4 (Google Drive link)
  //     if (data && Array.isArray(data)) {
  //       const videoWithId4 = data.find(video => video.id === 1); // Select the video with id 4
  //       if (videoWithId4) {
  //         const embedLink = convertToEmbedLink(videoWithId4.link); // Convert the link to embeddable format
  //         setDemoVideo(embedLink); // Set the embed link in the state
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching videos:", error);
  //   }
  // };
  const fetchDemoVideos = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/manager/videos/getAll`);
      const data = await response.json();
  
      // If the data is an array, find the video with the highest ID
      if (data && Array.isArray(data) && data.length > 0) {
        const latestVideo = data.reduce((max, video) => (video.id > max.id ? video : max), data[0]);
        
        // Convert the latest video's link to an embeddable format
        const embedLink = convertToEmbedLink(latestVideo.link);
        setDemoVideo(embedLink); // Set the embed link in the state
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };
  

  // Convert to embeddable link for both YouTube and Google Drive
  const convertToEmbedLink = (url) => {
    const youtubeShortLink = "https://youtu.be/";
    const youtubeWatchLink = "https://www.youtube.com/watch?v=";
    const googleDriveLink = "https://drive.google.com/file/d/";

    if (url.includes(youtubeShortLink)) {
      // Convert short YouTube link
      const videoId = url.split(youtubeShortLink)[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes(youtubeWatchLink)) {
      // Convert watch YouTube link
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes(googleDriveLink)) {
      // Convert Google Drive link
      const fileId = url.split(googleDriveLink)[1].split("/view")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url; // Return original URL if not a YouTube or Google Drive link
  };

  useEffect(() => {
    fetchDemoVideos();
  }, []);


  

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPdfPath(""); // Clear the PDF display when tab changes
  };

  const handleHardwareSelect = (event) => {
    setSelectedHardware(event.target.value);
  };

  const handleSoftwareSelect = (event) => {
    setSelectedSoftware(event.target.value);
  };




//GET PDF 
 // Fetch data from API when component mounts
 useEffect(() => {
  const fetchPptData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/manager/ppt/getAll`);
      const data = await response.json();
      setPptData(data); // Store the data in state
    } catch (error) {
      console.error("Error fetching data:", error);
      // Swal.fire({
      //   title: "Error",
      //   text: "Error fetching presentation data.",
      //   icon: "error",
      //   confirmButtonText: "OK",
      // });
    }
  };

  fetchPptData();
}, []);


  // Function to handle the Get button click and set the PDF path
  // Handle the GET click for fetching PDF links
  const handleGetClick = () => {
    let selectedContent;

    if (selectedTab === 0) {
      // Hardware tab
      selectedContent = pptData.find(
        (item) => item.contentType === "hardware" && item.contentName.toLowerCase() === selectedHardware.toLowerCase()
      );
    } else if (selectedTab === 1) {
      // Software tab
      selectedContent = pptData.find(
        (item) => item.contentType === "software" && item.contentName.toLowerCase() === selectedSoftware.toLowerCase()
      );
    }

    if (selectedContent) {
      setPdfPath(selectedContent.pptLink); // Set the PDF link from the API response
    } else {
      Swal.fire({
        title: "Error",
        text: "No PDF file available for the selected content.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setPdfPath("");
    }
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
    width: "100%",
    margin: "50px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow effect
    backgroundColor: "#fff",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      {/* Step 1: Contact Form */}
      {step === 1 && (
        <section style={cardStyle}>
          <div style={{ marginBottom: "30px" }}>
            <h2>Contact Form</h2>
          </div>
          <div>
            <Formik
              initialValues={{
                contactPerson: "",
                contactNumber: "",
                companyName: "",
                emailid: "",
                address: "",
                gstIn: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                
                const baseUrl=process.env.REACT_APP_API_BASE_URL
                // Construct URL with form values
                const url = `${baseUrl}/api/telecaller/contactForm/save/${telId}?contactPerson=${values.contactPerson}&contactNumber=${values.contactNumber}&companyName=${values.companyName}&emailId=${values.emailid}&address=${values.address}&gstIn=${values.gstIn}`;

                try {
                  // Perform the fetch POST request
                  const response = await fetch(url, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values), // Sending the form values as JSON
                  });

                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }

                  const data = await response.json(); // Parse JSON response if needed
                  console.log("Success:", data);

                  // First SweetAlert2 for success message
                  Swal.fire({
                    icon: "success",
                    title: "Submitted!",
                    text: "Your contact form has been successfully submitted.",
                    timer: 1000, // 1 seconds
                    showConfirmButton: false,
                  });

                  // Wait for 1 seconds and then show the second popup with a button
                  setTimeout(() => {
                    Swal.fire({
                      icon: "info",
                      title: "Next Step",
                      text: "Click the button to proceed to the next step.",
                      confirmButtonText: "Go to Next Step",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setStep(2); // Go to next step when user clicks the button
                      }
                    });
                  }, 1000); // Wait for 1 seconds before showing the second alert
                } catch (error) {
                  console.error("Error:", error); // Handle any errors here
                  // You can also display error messages to the user if needed
                } finally {
                  setSubmitting(false); // Stop the loading state
                }
              }}

              // onSubmit={async (values, { setSubmitting }) => {
              //   setSubmitting(true);
              
              //   const baseUrl = process.env.REACT_APP_API_BASE_URL;
              //   const url = `${baseUrl}/api/contactForm/save/${telId}?contactPerson=${values.contactPerson}&contactNumber=${values.contactNumber}&companyName=${values.companyName}&emailId=${values.emailid}&address=${values.address}&gstIn=${values.gstIn}`;
              
              //   try {
              //     const response = await fetch(url, {
              //       method: "POST",
              //       headers: {
              //         "Content-Type": "application/json",
              //       },
              //       body: JSON.stringify(values), // Sending the form values as JSON
              //     });
              
              //     if (!response.ok) {
              //       throw new Error("Network response was not ok");
              //     }
              
              //     const data = await response.json(); // Parse JSON response if needed
              //     console.log("Success:", data);
              
              //     // First SweetAlert2 for success message with countdown
              //     let countdown = 3; // Initial countdown time in seconds
              //     let countdownInterval; // Declare countdownInterval in the outer scope
              
              //     Swal.fire({
              //       icon: "success",
              //       title: "Submitted!",
              //       html: `Your contact form has been successfully submitted. <br><br> Please wait for the next step in <strong id="countdown">${countdown}</strong>...`,
              //       timer: 3000, // 3 seconds
              //       showConfirmButton: false,
              //       timerProgressBar: true,
              //       didOpen: () => {
              //         // Ensure the dialog has fully opened before starting the countdown
              //         const countdownElement = Swal.getHtmlContainer().querySelector("#countdown");
              
              //         // Check if the countdown element exists
              //         if (countdownElement) {
              //           countdownInterval = setInterval(() => {
              //             countdown -= 1;
              //             countdownElement.textContent = countdown; // Safely update the countdown text
              //           }, 1000);
              //         }
              
              //         Swal.showLoading(); // Optional: show loading spinner
              //       },
              //       willClose: () => {
              //         clearInterval(countdownInterval); // Clear interval when closing
              //       },
              //     });
              
              //     // Wait for 3 seconds and then show the second popup with a button
              //     setTimeout(() => {
              //       Swal.fire({
              //         icon: "info",
              //         title: "Next Step",
              //         text: "Click the button to proceed to the next step.",
              //         confirmButtonText: "Go to Next Step",
              //       }).then((result) => {
              //         if (result.isConfirmed) {
              //           setStep(2); // Go to next step when user clicks the button
              //         }
              //       });
              //     }, 3000); // Wait for 3 seconds before showing the second alert
              //   } catch (error) {
              //     console.error("Error:", error); // Handle any errors here
              //     Swal.fire({
              //       icon: 'error',
              //       title: 'Error',
              //       text: 'There was a problem submitting the form. Please try again later.',
              //     });
              //   } finally {
              //     setSubmitting(false); // Stop the loading state
              //   }
              // }}
              
              
              
              
              
            >
              {({ errors, touched, isSubmitting }) => (
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
                        helperText={
                          touched.contactPerson ? errors.contactPerson : ""
                        }
                        error={
                          touched.contactPerson && Boolean(errors.contactPerson)
                        }
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
                        helperText={
                          touched.contactNumber ? errors.contactNumber : ""
                        }
                        error={
                          touched.contactNumber && Boolean(errors.contactNumber)
                        }
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
                        helperText={
                          touched.companyName ? errors.companyName : ""
                        }
                        error={
                          touched.companyName && Boolean(errors.companyName)
                        }
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
                        helperText={touched.emailid ? errors.emailid : ""}
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
                        helperText={touched.address ? errors.address : ""}
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
                        helperText={touched.gstIn ? errors.gstIn : ""}
                        error={touched.gstIn && Boolean(errors.gstIn)}
                      />
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "16px",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#41CECA",
                        color: "black",
                        fontWeight: "bold",
                      }}
                      disabled={isSubmitting} // Disable the button when submitting
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress
                            size={24}
                            color="inherit"
                            style={{ marginRight: "8px" }}
                          />
                          Submiting...
                        </>
                      ) : (
                        "Submit"
                      )}
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
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ArrowBackIcon
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => setStep(1)}
              />
              <h1 style={{ margin: 0 }}>Demo Video Screen</h1>
            </div>
          </div>
          <div style={{ marginLeft: "20px", marginRight: "20px" }}>
            <iframe
              style={{ objectFit: "cover" }} // Ensures the video fills the iframe
              width="100%"
              height="600"
              src={demoVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div
            style={{ display: "flex", justifyContent: "end", marginTop: "8px" }}
          >
            <Button
              variant="contained"
              onClick={() => setStep(3)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#41CECA",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Next
            </Button>
          </div>
        </section>
      )}

      {/* //newely aded code */}
      {step === 3 && (
       <section style={cardStyle}>
       {step === 3 && (
         <>
           <div style={{ marginBottom: "20px" }}>
             <div style={{ display: "flex", alignItems: "center" }}>
               <ArrowBackIcon
                 style={{ cursor: "pointer", marginRight: "10px" }}
                 onClick={() => setStep(2)}
               />
               <h1 style={{ margin: 0 }}>Introduction PPT</h1>
             </div>
           </div>
 
           <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Hardware and Software Tabs">
             <Tab label="Hardware" style={{ fontWeight: "bold" }} />
             <Tab label="Software" style={{ fontWeight: "bold" }} />
           </Tabs>
 
           {/* Hardware Tab Content */}
           {selectedTab === 0 && (
             <div style={{ marginTop: "20px" }}>
               <FormControl fullWidth variant="outlined" style={{ width: "30%", paddingRight: "20px" }}>
                 <InputLabel id="hardware-select-label">Select Hardware</InputLabel>
                 <Select
                   labelId="hardware-select-label"
                   value={selectedHardware}
                   onChange={handleHardwareSelect}
                   label="Select Hardware"
                 >
                   {/* <MenuItem value="CCTV">CCTV</MenuItem>
                   <MenuItem value="Biometric">Biometric</MenuItem>
                   <MenuItem value="Network">Network</MenuItem>
                   <MenuItem value="Laptops">Laptops</MenuItem>
                   <MenuItem value="Desktop">Desktop</MenuItem>
                   <MenuItem value="Switches">Switches</MenuItem>
                   <MenuItem value="Routers">Routers</MenuItem> */}

                   {/* Dynamically generate MenuItem elements for hardware content */}
                    {pptData
                      .filter((item) => item.contentType === "hardware")
                      .map((item) => (
                        <MenuItem key={item.id} value={item.contentName}>
                          {item.contentName}
                        </MenuItem>
                      ))}
                 </Select>
               </FormControl>
               <Button
                 variant="contained"
                 onClick={handleGetClick}
                 style={{ padding: "10px 20px", backgroundColor: "#41CECA", color: "black", fontWeight: "bold" }}
               >
                 Get
               </Button>
 
               {/* Conditionally render the Hardware PDF */}
               {pdfPath && (
                 <div style={{ marginTop: "20px" }}>
                   <iframe id="pdf-iframe" src={pdfPath} width="100%" height="600px" title="Hardware Presentation" />
                   <Button
                     variant="contained"
                     onClick={() => handleFullScreen("pdf-iframe")}
                     style={{ backgroundColor: "#28a745", color: "#fff", marginTop: "10px" }}
                   >
                     Full Screen
                   </Button>
                 </div>
               )}
             </div>
           )}
 
           {/* Software Tab Content */}
           {selectedTab === 1 && (
             <div style={{ marginTop: "20px" }}>
               <FormControl fullWidth variant="outlined" style={{ width: "30%", paddingRight: "20px" }}>
                 <InputLabel id="software-select-label">Select Software</InputLabel>
                 <Select
                   labelId="software-select-label"
                   value={selectedSoftware}
                   onChange={handleSoftwareSelect}
                   label="Select Software"
                 >
                   {/* <MenuItem value="Inventory">Inventory</MenuItem>
                   <MenuItem value="HRBP">HRBP</MenuItem>
                   <MenuItem value="ERMS">ERMS</MenuItem> */}

                    {/* Dynamically generate MenuItem elements for software content */}
                    {pptData
                      .filter((item) => item.contentType === "software")
                      .map((item) => (
                        <MenuItem key={item.id} value={item.contentName}>
                          {item.contentName}
                        </MenuItem>
                      ))}
                 </Select>
               </FormControl>
               <Button
                 variant="contained"
                 onClick={handleGetClick}
                 style={{ padding: "10px 20px", backgroundColor: "#41CECA", color: "black", fontWeight: "bold" }}
               >
                 Get
               </Button>
 
               {/* Conditionally render the Software PDF */}
               {pdfPath && (
                 <div style={{ marginTop: "20px" }}>
                   <iframe id="pdf-iframe" src={pdfPath} width="100%" height="600px" title="Software Presentation" />
                   <Button
                     variant="contained"
                     onClick={() => handleFullScreen("pdf-iframe")}
                     style={{ backgroundColor: "#28a745", color: "#fff", marginTop: "10px" }}
                   >
                     Full Screen
                   </Button>
                 </div>
               )}
             </div>
           )}
 
           <div style={{ display: "flex", justifyContent: "end", marginTop: "16px" }}>
             <Button
               variant="contained"
               onClick={() => setStep(4)}
               style={{ padding: "10px 20px", backgroundColor: "#41CECA", color: "black", fontWeight: "bold" }}
             >
               Next
             </Button>
           </div>
         </>
       )}
     </section>
      )}

      {/* Step 4: Feedback Form */}
      {step === 4 && (
        <section style={cardStyle}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ArrowBackIcon
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => setStep(3)}
              />
              <h1 style={{ margin: 0 }}>Feedback Form</h1>
            </div>
          </div>
          <Formik
            initialValues={{
              requirements: "",
              feedback: "",
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
                      helperText={
                        touched.requirements ? errors.requirements : ""
                      }
                      error={
                        touched.requirements && Boolean(errors.requirements)
                      }
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
                      helperText={touched.feedback ? errors.feedback : ""}
                      error={touched.feedback && Boolean(errors.feedback)}
                    />
                  </Grid>
                </Grid>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#41CECA",
                      color: "black",
                      fontWeight: "bold",
                    }}
                    disabled={isSaving} // Disable button while saving
                  >
                    {isSaving ? "Submiting..." : "Submit & Next"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      )}





      {step === 5 && (
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
           hrbpAppFb: '',
           inventoryFb: '',
           ermsFb: '',
           erp: '',
         }}
         onSubmit={handleSubmitWebsiteFeedback}
       >
         {({ errors, touched, isSubmitting }) => (
           <Form>
             <Grid container spacing={2}>
               {/* Application HRBP - Dropdown */}
               <Grid item xs={12}>
                 <FormControl fullWidth variant="outlined">
                   <InputLabel>Application HRBP</InputLabel>
                   <Field
                     as={Select}
                     name="hrbpAppFb"
                     label="Application HRBP"
                     error={touched.hrbpAppFb && Boolean(errors.hrbpAppFb)}
                   >
                     <MenuItem value="explained">Explained</MenuItem>
                     <MenuItem value="notExplained">Not Explained</MenuItem>
                     <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                   </Field>
                   {touched.hrbpAppFb && errors.hrbpAppFb && (
                     <div style={{ color: 'red', marginTop: '8px' }}>{errors.hrbpAppFb}</div>
                   )}
                 </FormControl>
               </Grid>

               {/* inventoryFb - Dropdown */}
               <Grid item xs={12}>
                 <FormControl fullWidth variant="outlined">
                   <InputLabel>inventoryFb</InputLabel>
                   <Field
                     as={Select}
                     name="inventoryFb"
                     label="inventoryFb"
                     error={touched.inventoryFb && Boolean(errors.inventoryFb)}
                   >
                     <MenuItem value="explained">Explained</MenuItem>
                     <MenuItem value="notExplained">Not Explained</MenuItem>
                     <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                   </Field>
                   {touched.inventoryFb && errors.inventoryFb && (
                     <div style={{ color: 'red', marginTop: '8px' }}>{errors.inventoryFb}</div>
                   )}
                 </FormControl>
               </Grid>

               {/* ermsFb - Dropdown */}
               <Grid item xs={12}>
                 <FormControl fullWidth variant="outlined">
                   <InputLabel>ermsFb</InputLabel>
                   <Field
                     as={Select}
                     name="ermsFb"
                     label="ermsFb"
                     error={touched.ermsFb && Boolean(errors.ermsFb)}
                   >
                     <MenuItem value="explained">Explained</MenuItem>
                     <MenuItem value="notExplained">Not Explained</MenuItem>
                     <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                   </Field>
                   {touched.ermsFb && errors.ermsFb && (
                     <div style={{ color: 'red', marginTop: '8px' }}>{errors.ermsFb}</div>
                   )}
                 </FormControl>
               </Grid>

               {/* erp - Dropdown */}
               <Grid item xs={12}>
                 <FormControl fullWidth variant="outlined">
                   <InputLabel>erp</InputLabel>
                   <Field
                     as={Select}
                     name="erp"
                     label="erp"
                     error={touched.erp && Boolean(errors.erp)}
                   >
                     <MenuItem value="explained">Explained</MenuItem>
                     <MenuItem value="notExplained">Not Explained</MenuItem>
                     <MenuItem value="customerNotAvailable">Customer Not Available</MenuItem>
                   </Field>
                   {touched.erp && errors.erp && (
                     <div style={{ color: 'red', marginTop: '8px' }}>{errors.erp}</div>
                   )}
                 </FormControl>
               </Grid>

               {/* Buttons */}
               <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <Button
                   type="submit"
                   variant="contained"
                   style={{
                     padding: '10px 20px',
                     backgroundColor: '#007bff',
                     width: '13%',
                     color: '#fff',
                     fontWeight: 'bold',
                     marginTop: '16px',
                   }}
                   disabled={isSubmitting}
                 >
                   {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                 </Button>
                 <ToastContainer />
               </Grid>
             </Grid>
           </Form>
         )}
       </Formik>
     </section>
     
      
      )}
    </div>
  );
};

export default InsideSales_Demo;