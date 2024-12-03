import React, {  useState , useEffect} from "react";
// import { ColorModeContext } from "../../theme";
import {
  useTheme,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  styled,
  Typography,
  Avatar,
  Divider,
  alpha,
} from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchIcon from "@mui/icons-material/Search";
import HttpsIcon from "@mui/icons-material/Https";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useProSidebar } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// Styled MenuItem for profile, change password, and sign out
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.main,
  },
}));

const Topbar = ({ showSearchInput, userAvatar }) => {
  const theme = useTheme();
  // const colorMode = useContext(ColorModeContext);
  const { toggleSidebar, broken, rtl } = useProSidebar();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
 
  const { resetAuth,firstName,companyName , role,userId} = useAuth();
  const [profileImage, setProfilePic] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // LOG OUT
  const handleSignOut = async () => {
    const token = localStorage.getItem("token");
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Clear only the specific items you want to remove
      localStorage.removeItem("token");
      localStorage.removeItem("loginEmail");
      localStorage.removeItem("email");
      localStorage.removeItem("sId");
      localStorage.removeItem("role");
      localStorage.removeItem("fId");

      resetAuth();
      navigate("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // const Role = localStorage.getItem("role");
  // Fetch Profile
  // const fetchProfilePic = async () => {
  //   try {
  //     const response = await fetch(`${baseUrl}/api/v1/sales/getProfile/${userId}`);
  //     const data = await response.json();

  //     if (data && data.profilePic) {
  //       setProfilePic(data.profilePic);  // Directly set the base64 string for profilePic
  //     } else {
  //       console.error("Profile pic data is not available");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching profile picture:", error);
  //   }
  // };
  const Role = localStorage.getItem("role");

// Define API endpoints for each role
const roleApiEndpoints = {
  
  ORGANIZATION: `${baseUrl}/api/auth/organize/getProfile/${userId}`,
  ADMIN: `${baseUrl}/api/v1/admin/getProfile/${userId}`,
  ACCOUNTS: `${baseUrl}/api/v1/accounts/getProfile/${userId}`,
  HUMAN_RESOURCES: `${baseUrl}/api/v1/humanResources/getProfile/${userId}`,
  MANAGER: `${baseUrl}/api/v1/management/getProfile/${userId}`,
  SALE_MANAGER: `${baseUrl}/api/v1/saleManagement/getProfile/${userId}`,
  OPERATION_TECH_LEAD: `${baseUrl}/api/v1/operationTechLead/getProfile/${userId}`,
  SALES: `${baseUrl}/api/v1/sales/getProfile/${userId}`,
  TECHNICIAN: `${baseUrl}/api/v1/technician/getProfile/${userId}`,
  TELECALLER: `${baseUrl}/api/v1/telecaller/getProfile/${userId}`,
};

const fetchProfilePic = async () => {
  try {
    // Get the API endpoint for the current role
    const apiEndpoint = roleApiEndpoints[Role];

    if (!apiEndpoint) {
      console.error("Unknown role, unable to fetch profile picture");
      return;
    }

    const response = await fetch(apiEndpoint);
    const data = await response.json();

    // Determine whether to set the profile picture or company logo
    if (data) {
      if (data.profilePic) {
        setProfilePic(data.profilePic); // Set the profile picture for other roles
      } else if (data.companyLogo) {
        setProfilePic(data.companyLogo); // Set the company logo for the organization
      } else {
        console.error("Neither profilePic nor companyLogo is available in the response");
      }
    } else {
      console.error("No data received from the API");
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
  }
};




  useEffect(() => {
    fetchProfilePic();
  }, []);



  const handleProfile = () => {
    switch (Role) {
      case "SALES":
        navigate("/SalesProfile");
        break;
      case "ORGANIZATION":
        navigate("/OrganizationProfile");
        break;
      case "ADMIN":
        navigate("/Admin_Profile");
        break;
      case "ACCOUNTS":
        navigate("/Accounts_Profile");
        break;
      case "TELECALLER":
        navigate("/InsideSales_Profile");
        break;
      case "TECHNICIAN":
        navigate("/Technician_Profile");
        break;
      case "OPERATION_TECH_LEAD":
        navigate("/TechLead_Profile");
        break;
      case "SALE_MANAGER":
        navigate("/SalesManagerProfile");
        break;
      case "HUMAN_RESOURCES":
        navigate("/HR_Profile");
        break;
      case "MANAGER":
        navigate("/Manager_Profile");
        break;
      default:
        console.warn("Unknown role:", Role);
        break;
    }
  
    handleMenuClose();
  };
  

  const handleChangePassword = () => {
    navigate("/ChangePassword");
    handleMenuClose();
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        backgroundColor: theme.palette.background.default,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "10px 24px",
        height: "64px",
        width: "100vw", // Full viewport width
        transition: "background-color 0.3s",
      }}
    >
      <Box display="flex" alignItems="center">
        {broken && !rtl && (
          <IconButton sx={{ marginRight: "12px" }} onClick={() => toggleSidebar()}>
            <MenuOutlinedIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        )}
        {showSearchInput && (
          <Box
            display="flex"
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.grey[100],
              borderRadius: 2,
              padding: "4px 12px",
              boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
              width: "400px",
              maxWidth: "100%",
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
            />
          </Box>
        )}
      </Box>
      
      <Box display="flex" alignItems="center">
        {/* Welcome Text */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          sx={{ marginRight: "15px" }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Hello!
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" ,color:"#E44C68", fontSize:'18px'}}>
           {role === "ORGANIZATION" ? companyName : firstName}

          </Typography>
        </Box>

        {/* Profile Icon Button with Avatar */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: alpha(theme.palette.primary.light, 0.2),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.light, 0.4),
            },
            borderRadius: "50%",
            padding: "5px",
            transition: "background-color 0.3s",
          }}
        >
          <Avatar
            alt="User Avatar"
            src={profileImage ? `data:image/jpeg;base64,${profileImage}` : ""} 
            sx={{ width: 38, height: 38 }}
          />
        </IconButton>

        {/* Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
              borderRadius: "12px",
              padding: "8px",
              minWidth: "200px",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{ padding: "8px", fontWeight: "bold", textAlign: "center" }}
          >
            Account
          </Typography>
          <Divider sx={{ margin: "8px 0" }} />

          <StyledMenuItem onClick={handleProfile}>
            <AccountCircleIcon
              sx={{ marginRight: 1, color: theme.palette.primary.main, fontSize: "20px" }}
            />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Profile
            </Typography>
          </StyledMenuItem>

          <StyledMenuItem onClick={handleChangePassword}>
            <HttpsIcon
              sx={{ marginRight: 1, color: theme.palette.secondary.main, fontSize: "20px" }}
            />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Change Password
            </Typography>
          </StyledMenuItem>

          <Divider sx={{ margin: "8px 0" }} />
          <StyledMenuItem onClick={handleSignOut}>
            <ExitToAppIcon
              sx={{ marginRight: 1, color: theme.palette.error.main, fontSize: "20px" }}
            />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Sign Out
            </Typography>
          </StyledMenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;