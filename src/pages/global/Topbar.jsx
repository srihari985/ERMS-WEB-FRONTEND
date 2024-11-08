import React, { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
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
  const colorMode = useContext(ColorModeContext);
  const { toggleSidebar, broken, rtl } = useProSidebar();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
 
  const { resetAuth,firstName,companyName , role} = useAuth();
  console.log("i am top bar company role :" + role)
  console.log("i am top bar company name :" + companyName)

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

      resetAuth();
      navigate("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
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
            src={"https://th.bing.com/th/id/OIP.tDDv7tCw0z6OoNI7YTcuQQHaHa?rs=1&pid=ImgDetMain"}
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