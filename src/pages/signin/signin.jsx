import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Link, 
  MenuItem, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText 
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert for notifications
import { useFormik } from "formik"; // Import useFormik
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../../AuthProvider";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url('https://img.freepik.com/premium-photo/abstract-background-design-images-wallpaper-ai-generated_643360-136650.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: '32px', // Replace theme.spacing(4)
    borderRadius: "12px",
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)", 
    backdropFilter: "blur(5px)", 
    maxWidth: "500px",
    width: "100%",
  },
  form: {
    width: "100%",
    marginTop: '32px', // Replace theme.spacing(4)
  },
  textField: {
    marginBottom: '16px', // Replace theme.spacing(2)
    "& .MuiFilledInput-root": {
      backgroundColor: "rgba(255, 255, 255, 0.85)", 
      borderRadius: "5px",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  },
  label: {
    color: "white",
    marginBottom: '8px', // Replace theme.spacing(1)
    display: "block",
  },
  submit: {
    margin: '24px 0 16px', // Replace theme.spacing(3, 0, 2)
    color: "#FFFFFF",
    fontWeight: "bold",
    backgroundColor: "#53CDB0", 
  },
  link: {
    marginTop: '16px', // Replace theme.spacing(2)
    color: "#FFFFFF",
    textAlign: "center",
    display: "block",
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserId, setToken } = useAuth();

  const roles = [
    { value: 'ORGANIZATION', label: 'ORGANIZATION' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'SALES_MANAGER', label: 'SALES MANAGER' },
    { value: 'TECHNICIAN', label: 'TECHNICIAN' },
  ];

  const handleLogin = async () => {
    try {
      let apiUrl = '';
      const role = formik.values.role;

      switch (role) {
        case 'ORGANIZATION':
          apiUrl = `http://localhost:8080/api/auth/organize/authenticate?email=${email}&password=${password}&role=${role}`;
          break;
        case 'ADMIN':
          apiUrl = `http://localhost:8080/api/v1/auth/authenticate?email=${email}&password=${password}`;
          break;
        case 'TECHNICIAN':
          apiUrl = `http://localhost:8080/api/auth/technician/authenticate?email=${email}&password=${password}`;
          break;
        case 'SALES':
          apiUrl = `http://localhost:8080/api/auth/sales/authenticate?email=${email}&password=${password}`;
          break;
        case 'MANAGER':
          apiUrl = `http://localhost:8080/api/auth/manager/authenticate?email=${email}&password=${password}`;
          break;
        default:
          setError("Invalid role selected.");
          return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        if (role === 'ORGANIZATION') {
          const organizationId = result.organizationId;
          setUserId(organizationId);
          localStorage.setItem("role", role);
          navigate("/OrganizationDashboard");
          Swal.fire({ icon: "success", title: "Login successful!", text: `Welcome, ${role}!` });
        } else {
          const { access_token: token } = result;

          if (token) {
            localStorage.setItem("token", token);
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            if (userRole === "ADMIN") {
              setUserId(decodedToken.adminId);
              setToken(token);
            } else if (userRole === "MANAGER") {
              setUserId(decodedToken.managerId);
            } else if (userRole === "TECHNICIAN") {
              setUserId(decodedToken.technicianId);
            } else if (userRole === "SALES") {
              setUserId(decodedToken.salesId);
            }

            localStorage.setItem("role", userRole);

            if (userRole === "ADMIN") {
              navigate("/AdminDashboard");
            } else if (userRole === "MANAGER") {
              navigate("/ManagerDashboard");
            } else if (userRole === "TECHNICIAN") {
              navigate("/TechnicianDashboard");
            } else if (userRole === "SALES") {
              navigate("/SalesDashboard");
            } else {
              throw new Error("Invalid role. Please contact the administrator.");
            }

            Swal.fire({ icon: "success", title: "Login successful!", text: `Welcome, ${userRole}!` });
          } else {
            setError("Access token is missing. Please contact the administrator.");
          }
        }
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Failed to login. Please try again later.");
    }
  };

  const formik = useFormik({
    initialValues: {
      role: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.role) {
        errors.role = 'Role is required';
      }
      return errors;
    },
    onSubmit: (values) => {
      handleLogin();
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      if (role === "ORGANIZATION") {
        navigate("/OrganizationDashboard");
      } else if (role === "TECHNICIAN") {
        navigate("/TechnicianDashboard");
      }
    }
  }, [navigate]);

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Typography variant="h4" align="center" style={{ color: "white" }}>
          Sign In
        </Typography>
        <div className={classes.form}>
          <label className={classes.label}>Email:</label>
          <TextField
            className={classes.textField}
            variant="filled"
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={classes.label}>Password:</label>
          <TextField
            className={classes.textField}
            variant="filled"
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className={classes.label}>Role:</label>
          <FormControl
            fullWidth
            variant="filled"
            error={!!formik.errors.role}
            style={{ backgroundColor: '#f7fffe' }}
          >
            <Select
              value={formik.values.role}
              onChange={formik.handleChange}
              name="role"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return 'Select Role'; 
                }
                return roles.find((role) => role.value === selected)?.label;
              }}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.role && <FormHelperText>{formik.errors.role}</FormHelperText>}
          </FormControl>

          <Button
            type="button"
            fullWidth
            variant="contained"
            className={classes.submit}
            onClick={formik.handleSubmit}
          >
            Sign In
          </Button>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <Typography align="center" style={{ color: "white", marginRight: '8px' }}>
            Not registered yet?
            <Link
              onClick={() => navigate("/OrganizationForm")}
              style={{ color: "#fff", fontWeight: "bold", cursor: "pointer", paddingLeft: '6px' }}
            >
              Create an account
            </Link>
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;
