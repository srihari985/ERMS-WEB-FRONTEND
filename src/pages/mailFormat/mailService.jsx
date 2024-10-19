import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import swal from "sweetalert";
import FacebookCircularProgress from "../../Buffers/AllBuffers";

const EmailForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    body: "",
    attachment: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "attachment") {
      setEmailData({ ...emailData, [e.target.name]: e.target.files[0] });
    } else {
      setEmailData({ ...emailData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("companyName", emailData.companyName);
      formData.append("toEmail", emailData.toEmail);
      formData.append("cc",emailData.cc)
      formData.append("subject", emailData.subject);
      formData.append("body", emailData.body);
      formData.append("attachment", emailData.attachment);

      const response = await fetch("http://192.168.29.223:8080/api/SoRetOrders/mailsender", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        swal("Good job!", "Email sent successfully!", "success");
       
      } else {
        swal("Bad job!", "Email Not Send!", "error");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error sending email:", error);
      swal("Server issue!", "Check server connection", "error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Send Email
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="companyNamw">
            <TextField
              fullWidth
              type="text"
              name="companyName"
              value={emailData.companyName}
              onChange={handleChange}
              label="Company Name"
              autoComplete="off"
              required
            />
          </div>
          <div className="companyNamw">
            <TextField
              fullWidth
              type="email"
              name="toEmail"
              value={emailData.toEmail}
              onChange={handleChange}
              autoComplete="off"
              label="TO Email"
              required
            />
          </div>
          <div className="companyNamw">
            <TextField
              fullWidth
              type="textarea"
              name="cc"
              value={emailData.cc}
              onChange={handleChange}
              autoComplete="off"
              label="CC Emails"
              
              required
            />
          </div>

          <div className="companyNamw">
            <TextField
              fullWidth
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              autoComplete="off"
              label="Subject"
              required
            />
          </div>
          <div className="companyNamw">
            <TextField
              fullWidth
              multiline
              rows={4}
              name="body"
              value={emailData.body}
              onChange={handleChange}
              autoComplete="off"
              label="Email Body"
              required
            />
          </div>
          {/* <input
            type="file"
            name="attachment"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.jpg,.png"
          /> */}
          <div className="buttonSend">
            <Button type="submit" fullWidth  sx={{ mt: 1 }}>
              Send Email  {loading && <FacebookCircularProgress />}
            </Button>
          </div>
        </form>
      </Box>
    </Container>
  );
};

export default EmailForm;