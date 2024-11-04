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
  fontSize: 18,
  fontWeight: "bold",
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  transition: "background-color 0.2s, color 0.2s",

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

const Topbar = ({ showSearchInput, userAvatar }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggleSidebar, broken, rtl } = useProSidebar();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { resetAuth } = useAuth();

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
      
      localStorage.removeItem("token"); // Remove the token
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
        backgroundColor: "#ffffff", // Add a background color
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for elevation
        padding: "10px 20px", // Padding for spacing
        width: "100%", // Set width to 100vw
        margin: 0, // Ensure there’s no margin
      }}
    >
      <Box display="flex" alignItems="center">
        {broken && !rtl && (
          <IconButton sx={{ margin: "0 6px" }} onClick={() => toggleSidebar()}>
            <MenuOutlinedIcon sx={{ color: "#555" }} />
          </IconButton>
        )}
        {showSearchInput && (
          <Box
            display="flex"
            backgroundColor="#f7f7f7"
            p={0.5}
            borderRadius={1}
            sx={{ boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)" }}
          >
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
            <IconButton type="button">
              <SearchIcon sx={{ color: "#555" }} />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center">
        {/* Profile Icon Button with Avatar */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: "#e3f2fd",
            "&:hover": { backgroundColor: "#bbdefb" },
            borderRadius: "50%",
            padding: "10px",
            display: "inline-block", // Ensure it doesn't take full width
          }}
        >
          <Avatar
            alt="User Avatar"
            src={userAvatar}
            sx={{ width: 28, height: 28 }}
          />
        </IconButton>

        {/* Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
              sx={{ marginRight: 1, color: "#1976d2", fontSize: "20px" }}
            />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Profile
            </Typography>
          </StyledMenuItem>

          <StyledMenuItem onClick={handleChangePassword}>
            <HttpsIcon
              sx={{ marginRight: 1, color: "#9c27b0", fontSize: "20px" }}
            />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Change Password
            </Typography>
          </StyledMenuItem>

          <Divider sx={{ margin: "8px 0" }} />
          <StyledMenuItem onClick={handleSignOut}>
            <ExitToAppIcon
              sx={{ marginRight: 1, color: "#d32f2f", fontSize: "20px" }}
            />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Sign Out
            </Typography>
          </StyledMenuItem>
        </Menu>

        {/* Responsive Menu Icon (if sidebar is broken and RTL layout) */}
        {broken && rtl && (
          <IconButton
            sx={{
              margin: "0 6px",
              backgroundColor: "#fafafa",
              "&:hover": { backgroundColor: "#f0f0f0" },
              padding: "10px",
            }}
            onClick={() => toggleSidebar()}
          >
            <MenuOutlinedIcon sx={{ color: "#555", fontSize: "28px" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
