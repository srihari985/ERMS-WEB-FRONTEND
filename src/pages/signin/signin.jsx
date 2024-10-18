import React, { useState } from "react";
import { Button, TextField, Typography, Container, Link, MenuItem, FormControl, Select, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik } from "formik"; 
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "../../AuthProvider";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { setUserId, setToken, setSId } = useAuth();

  const roles = [
    { value: 'ORGANIZATION', label: 'ORGANIZATION' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'SALE_MANAGER', label: 'SALE_MANAGER' },
    { value: 'TECHNICIAN', label: 'TECHNICIAN' },
    { value: 'SALES', label: 'SALES' },
    { value: 'TELECALLER', label: 'TELECALLER' },
  ];

  const handleLogin = async () => {
    setLoading(true); 
    try {
      let apiUrl = '';
      const role = formik.values.role;

      switch (role) {
        case 'ORGANIZATION':
          apiUrl = `http://localhost:8081/api/auth/organize/authenticate?email=${email}&password=${password}&role=${role}`;
          break;    
        case 'ADMIN':
        case 'MANAGER':
        case 'SALE_MANAGER':
        case 'TECHNICIAN':
        case 'SALES':
        case 'TELECALLER':
          apiUrl = `http://localhost:8081/api/v1/auth/authenticate?email=${email}&password=${password}`;
          break;
        default:
          setError("Invalid role selected.");
          return;
      }

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const result = await response.json();

      if (response.ok) {
        if (role === 'ORGANIZATION') {
          setUserId(result.organizationId);
          localStorage.setItem("role", role);
          navigate("/OrganizationDashboard");
          Swal.fire({ icon: "success", title: "Login successful!", text: `Welcome, ${role}!` });
        } else {
          const { access_token: token } = result;
          if (token) {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            switch (userRole) {
              case "ADMIN":
                setUserId(decodedToken.adminId); 
                setToken(token);
                break;
              case "MANAGER":
                setUserId(decodedToken.managerId);
                setToken(token);
                break;
              case "SALE_MANAGER":
                setUserId(decodedToken.saleManagerId); 
                setToken(token);
                break;
              case "TECHNICIAN":
                setUserId(decodedToken.technicianId); 
                setToken(token);
                break;
              case "SALES":
                setUserId(decodedToken.salesId); 
		    setSId(decodedToken.sId); 
                setToken(token);
                break;
              case "TELECALLER":
                setUserId(decodedToken.salesId);
                setToken(token);
                break;
              default:
                throw new Error("Invalid role.");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", userRole);

           	
            // Navigate based on the role
            if (userRole === "ADMIN") {
              navigate("/AdminDashboard");
            }
            else if (userRole === "MANAGER") {
              navigate("/ManagerDashboard");
            }
            else if (userRole === "SALE_MANAGER") {
              navigate("/SalesManagerDashboard");
            }
             else if (userRole === "TECHNICIAN") {
              navigate("/TechnicianDashboard");
            } 
            else if (userRole === "SALES") {
              navigate("/dashboard");
            }
            else if (userRole === "TELECALLER") {
              navigate("/InsideSales_Dashboard");
            }
           
            else {
              throw new Error("Invalid role. Please contact the administrator.");
            }
            Swal.fire({ icon: "success", title: "Login successful!", text: `Welcome, ${userRole}!`});
          } else {
            setError("Access token is missing. Please contact the administrator.");
          }
        }
      } else {
        setError(result.message || "Invalid credentials");
      }
      setLoading(false)
    } catch (error) {
      setError("Failed to login.");
      setLoading(false)
    }
  };

  const formik = useFormik({
    initialValues: { role: '' },
    onSubmit: () => handleLogin(),
  });

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url('https://marketing.cochraneco.com/wp-content/uploads/2022/02/consumer-portal-1024x614.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <Container component="main" maxWidth="xs" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px",
        borderRadius: "12px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(5px)",
        maxWidth: "500px",
        width: "100%"
      }}>
        <Typography variant="h2" align="center" style={{ color: "white" }}>
          Sign In
        </Typography>
        <form style={{ width: "100%", marginTop: "32px" }} onSubmit={formik.handleSubmit}>
          <label style={{ color: "white", marginBottom: "8px", display: "block" }}>Email:</label>
          <TextField
            variant="filled"
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "16px", backgroundColor: "rgba(255, 255, 255, 0.85)", borderRadius: "5px" }}
            InputProps={{ style: { color: "black" } }}
          />
          <label style={{ color: "white", marginBottom: "8px", display: "block" }}>Password:</label>
          <TextField
            variant="filled"
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "16px", backgroundColor: "rgba(255, 255, 255, 0.85)", borderRadius: "5px" }}
            InputProps={{ style: { color: "black" } }}
          />
          <label style={{ color: "white", marginBottom: "8px", display: "block" }}>Role:</label>
          <FormControl fullWidth variant="filled" style={{ backgroundColor: '#f7fffe', marginBottom: "16px" }}>
            <Select
              value={formik.values.role}
              onChange={formik.handleChange}
              name="role"
              displayEmpty
              renderValue={(selected) => !selected ? 'Select Role' : roles.find((role) => role.value === selected)?.label}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ margin: "24px 0 16px", color: "#FFFFFF", fontWeight: "bold", backgroundColor: "#53CDB0",padding:'10px' }}
            disabled={loading} 
          >
            {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Sign In"}
          </Button>
          {error && <Typography variant="body2" color="error">{error}</Typography>}
        </form>
        <Typography align="center" style={{ color: "white", marginTop: "16px" }}>
          Not registered yet?
          <Link
            onClick={() => navigate("/OrganizationForm")}
            style={{ color: "#fff", fontWeight: "bold", cursor: "pointer", paddingLeft: '6px' }}
          >
            Create an account
          </Link>
        </Typography>
      </Container>
    </div>
  );
};

export default SignIn;
