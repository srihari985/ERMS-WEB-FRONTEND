import React, { useState, useEffect } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Collapse, Button,CircularProgress } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import './sidebar.css'

const Item = ({ title, to, icon: Icon, selected, setSelected }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <MenuItem
      active={isActive}
      onClick={() => setSelected(title)}
      icon={
        <Box sx={{ marginTop: "40px", color: isActive ? "white" : "#BCCDD5" }}>
          <Icon /> {/* Render the icon component */}
        </Box>
      }
      routerLink={<Link to={to} />} // This should be correctly passed if you're using a router like react-router-dom
      sx={{
        fontWeight: isActive ? "bold" : "normal",
        "&:hover": {
          color: "white", // Hover color
          fontWeight: "bold",
        },
        backgroundColor: "transparent !important", // Ensures background doesn't change
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "1rem",
          marginTop: "30px",
          color: isActive ? "white" : "#BCCDD5", // Apply blue color to active text
        }}
      >
        {title}
      </Typography>
    </MenuItem>
  );
};

const MyProSidebar = () => {
  const [selected, setSelected] = useState("Dashboard");
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState({ companyLogo: "", companyName: "" });
  const [loading, setLoading] = useState(true);
  const [isTicketsOpen, setTicketsOpen] = useState(false);

  // Role-based menu items
  // const role = localStorage.getItem("role") || "guest";

  // const role = localStorage.getItem("role") || "guest";
  const role = localStorage.getItem("role")   // Convert role to uppercase

console.log("User Role:", role);  // Check if role is correctly retrieved


  const roleBackgroundColor = {
    admin: "orange",
    manager: "brown",
    salesManager: "green",
    technician: "lightblue",
    guest: "#0061f7" // default color
  };


  // Fetch company info
  // useEffect(() => {
  //   const fetchCompanyInfo = async () => {
  //     try {
  //       const baseUrl=process.env.REACT_APP_API_BASE_URL
  //       const response = await fetch(`${baseUrl}/api/organisation/1`);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setCompanyInfo({
  //         companyLogo: data?.companyLogo || "",
  //         companyName: data?.companyName || "Unknown Company",
  //       });
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching company info:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchCompanyInfo();
  // }, []);

  // useEffect(() => {
  //   // Function to prevent default touch actions
  //   const preventTouch = (e) => {
  //     e.preventDefault();
  //   };

  //   // Add touch event listeners
  //   document.addEventListener('touchstart', preventTouch, { passive: false });
  //   document.addEventListener('touchmove', preventTouch, { passive: false });

  //   return () => {
  //     // Clean up the event listeners on component unmount
  //     document.removeEventListener('touchstart', preventTouch);
  //     document.removeEventListener('touchmove', preventTouch);
  //   };
  // }, []);


  // Define role-based menu items
  const menuItems = {

    ORGANIZATION: [
      <Item
        key="organizationDashboard"
        title="Organization Dash"
        to="/OrganizationDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="OrganizationAdminRegister"
        title="OrganizationAdminRegister"
        to="/OrganizationAdminRegister"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

    ],


    ADMIN: [
      <Item
        key="adminDashboard"
        title="Admin Dashboard"
        to="/AdminDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="adminManagerRegister"
        title="Manager Registration"
        to="/AdminManagerRegister"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      // Add more items for admin if needed
    ],
    ACCOUNTS: [
      <Item
        key="AccountsDashboard"
        title="Accounts Dashboard "
        to="/AccountsDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      

      // Add more items for admin if needed
    ],



    MANAGER: [
      <Item
        key="managerDashboard"
        title="Manager Dashboard"
        to="/ManagerDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="managerSalesManagerRegister"
        title="ManagerSalesManager Register"
        to="/ManagerSalesManagerRegister"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      // Add more items for manager if needed
    ],
    HUMAN_RESOURCES: [
      
      <Item
        key="Hr"
        title="HR Dashboard"
        to="/Hr"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="HrToSaleTeleTechOperRegistration"
        title="Registrations"
        to="/HrToSaleTeleTechOperRegistration"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      // Add more items for manager if needed
    ],

    SALE_MANAGER: [
      <Item
        key="salesManagerDashboard"
        title="Sales Manager Dashboard"
        to="/SalesManagerDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="SalesManagerTechnicianRegister"
        title="SalesManager Technician Register"
        to="/SalesManagerTechnicianRegister"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      // <Item
      //   key="SalesManagerSalesRegister"
      //   title="SalesManagerSalesRegister"
      //   to="/SalesManagerSalesRegister"
      //   icon={HomeOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      // <Item
      //   key="SalesManagerInsideSalesRegister"
      //   title="SalesManagerInsideSalesRegister"
      //   to="/SalesManagerInsideSalesRegister"
      //   icon={HomeOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,


      // Add more items for manager if needed
    ],
    OPERATION_TECH_LEAD: [
      <Item
        key="OperationalManagerDashboard"
        title="Dashboard"
        to="/OperationalManagerDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="OperationalManagerTechnicianRegister"
        title="Technician Register"
        to="/OperationalManagerTechnicianRegister"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      
    ],

    TECHNICIAN: [
      <Item
        key="techDashboard"
        title="Dashboard"
        to="/TechnicianDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="Invoice Template"
        title="InvoiceTemplate"
        to="/InvoiceTemplate"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="materialRequest"
        title="Material Request"
        to="/TechnicianMaterialRequest"
        icon={AssignmentOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="training section"
        title="training section"
        to="/TechnicianTrainingSection"
        icon={AssignmentOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="petrolAllowance"
        title="Petrol Allowance"
        to="/TechnicianPetrolAllowance"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="feedbackForm"
        title="Feedback Form"
        to="/TechnicianFeedbackForm"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="foodAndTravelAllowanceForm"
        title="Food & Travel"
        to="/TechnicianFoodTravelAllowance"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      // <Item
      //   key="reports"
      //   title="Reports"
      //   to="/Reports"
      //   icon={<AddShoppingCartIcon  />}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      // Tickets Section with collapsible submenu
      <MenuItem
        key="tickets"
        onClick={() => setTicketsOpen(!isTicketsOpen)} // Toggle submenu
        icon={<TaskOutlinedIcon />}
        style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
      >
        Tickets
      </MenuItem>,

      <Collapse in={isTicketsOpen} timeout="auto" unmountOnExit>
        <Item
          key="newtickets"
          title="New Tickets"
          to="/TechnicianNewTickets"
          icon={TaskOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          key="existingtickets"
          title="Existing Tickets"
          to="/TechnicianExistingTicketsList"
          icon={AssignmentOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          key="pendingtickets"
          title="Pending Tickets"
          to="/TechnicianPendingTicketsList"
          icon={AssignmentOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          key="completedtickets"
          title="Completed Tickets"
          to="/TechnicianCompletedTicketsList"
          icon={AssignmentOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
        />
      </Collapse>,
      <Item
        key="toolRequest"
        title="Tools"
        to="/TechnicianTools"
        icon={AddShoppingCartIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      // Add more items for technician if needed
    ],

    SALES: [

      <Box key="quotationFormBtn" display="flex" justifyContent="center">
        <Button
          sx={{
            backgroundColor: '#ebe6e6', // White background to match the blue dashboard
            color: '#007BFF', // Blue text color for consistency with the dashboard theme
            borderRadius: '20px', // Rounded corners
            padding: '10px 20px', // Padding for better appearance
            width: '200px', // Width to ensure button size
            textAlign: 'center', // Center text alignment
            fontWeight: 'bold', // Make the text bold
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add slight shadow for depth
            '&:hover': {
              backgroundColor: '#ffffff', // Light blue background on hover
              color: '#0056b3', // Darker blue text on hover
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // More shadow on hover
            }
          }}
          onClick={() => navigate("/QuotationForm")}
        >
          + Create Quotation
        </Button>
      </Box>,


      // <Item
      //   key="demo"
      //   title="Employee Reg"
      //   to="/EmpolyeeRegistration"
      //   icon={AddShoppingCartIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      <Item
        key="salesDashboard"
        title="Dashboard"
        to="/SalesDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="demo"
        title="Demo"
        to="/Demo"
        icon={AddShoppingCartIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="Sale Invoice"
        title="Sale Invoice"
        to="/SalesInvoiceList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="quotationList"
        title="Quotation List"
        to="/SalesQuationList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      // <Item
      //   key="materialRequest"
      //   title="Material Request"
      //   to="/SalesMaterialRequest"
      //   icon={AssignmentOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      // <Item
      //   key="InvoiceTemplate"
      //   title="Invoice"
      //   to="/InvoiceTemplate"
      //   icon={FormatListNumberedRtlIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      <Item
        key="petrolAllowance"
        title="Petrol Allowance"
        to="/PetrolAllowance"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="SalesVideosUpload"
        title="Demo Video Upload"
        to="/SalesVideosUpload"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="SalesDocumenetsUpload"
        title="PPT Upload"
        to="/SalesDocumentsUpload"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="DailyReportList"
        title="Daily Report"
        to="/SalesDailyReportList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      // <Item
      //   key="FeedbackForm"
      //   title="Feedback Form"
      //   to="/SalesFeedBackForm"
      //   icon={TaskOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,

      <Item
        key="foodAndTravelAllowanceForm"
        title="Food & Travel Allowence"
        to="/TravelAllowanceForm"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="trainingSection"
        title="Training Session"
        to="/TrainingSection"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      

      // Add more items for salesManager if needed
    ],


    TELECALLER:[

      <Box key="quotationFormBtn" display="flex" justifyContent="center">
        <Button
          sx={{
            backgroundColor: '#ebe6e6', // White background to match the blue dashboard
            color: '#007BFF', // Blue text color for consistency with the dashboard theme
            borderRadius: '20px', // Rounded corners
            padding: '10px 20px', // Padding for better appearance
            width: '200px', // Width to ensure button size
            textAlign: 'center', // Center text alignment
            fontWeight: 'bold', // Make the text bold
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add slight shadow for depth
            '&:hover': {
              backgroundColor: '#ffffff', // Light blue background on hover
              color: '#0056b3', // Darker blue text on hover
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // More shadow on hover
            }
          }}
          onClick={() => navigate("/InsideSales_QuotationForm")}
        >
          + Create Quotation
        </Button>
      </Box>,

      <Item
        key="InsideSales_Dashboard"
        title="Dashboard"
        to="/InsideSales_Dashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="InsideSales_Demo"
        title="Demo"
        to="/InsideSales_Demo"
        icon={AddShoppingCartIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="InsideSales_InvoiceList"
        title="InvoiceList"
        to="/InsideSales_InvoiceList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
      key="InsideSales_QuotationList"
      title="QuotationList"
      to="/InsideSales_QuotationList"
      icon={TaskOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
      />,
      <Item
        key="InsideSales_MaterialRequest"
        title="InsideSales MaterialRequest"
        to="/InsideSales_MaterialRequest"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="InsideSales_PetrolAllowance"
        title="Petrol Allowance"
        to="/InsideSales_PetrolAllowance"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="InsideSales_VideosUpload"
        title="Demo Video Upload"
        to="/InsideSales_VideosUpload"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="InsideSales_DocumentsUpload"
        title="Demo Docs Upload"
        to="/InsideSales_DocumentsUpload"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="InsideSales_DailyReportList"
        title="DailyReportList"
        to="/InsideSales_DailyReportList"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="InsideSales_FoodAndTravelAllowance"
        title="Food & Travel Allowence"
        to="/InsideSales_FoodAndTravelAllowance"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="InsideSales_TrainingSession"
        title="TrainingSession"
        to="/InsideSales_TrainingSession"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
      key="InsideSalesCRM"
      title="InsideSales CRM"
      to="/InsideSalesCRM"
      icon={FormatListNumberedRtlIcon}
      selected={selected}
      setSelected={setSelected}
    />,

      // <Item
      //   key="InsideSales_DailyReportForm"
      //   title="DailyReportForm"
      //   to="/InsideSales_DailyReportForm"
      //   icon={AddShoppingCartIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,

      

      // <Item
      //   key="InsideSales_FeedBackForm"
      //   title="InsideSales FeedBackForm"
      //   to="/InsideSales_FeedBackForm"
      //   icon={FormatListNumberedRtlIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
     
      // <Item
      //   key="InsideSales_AddBankDetails"
      //   title="InsideSales AddBankDetails"
      //   to="/InsideSales_AddBankDetails"
      //   icon={AssignmentOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      

      // <Item
      //   key="InsideSales_PaidInvoiceList"
      //   title="InsideSales_PaidInvoiceList"
      //   to="/InsideSales_PaidInvoiceList"
      //   icon={FormatListNumberedRtlIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      

      // <Item
      //   key="InsideSales_UnPaidInvoiceList"
      //   title="InsideSales UnPaidInvoiceList"
      //   to="/InsideSales_UnPaidInvoiceList"
      //   icon={TaskOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      
      
      // <Item
      //   key="InsideSales_QuotationForm"
      //   title="InsideSales QuotationForm"
      //   to="/InsideSales_QuotationForm"
      //   icon={TaskOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      // <Item
      //   key="InsideSales_AddParty"
      //   title="InsideSales AddParty"
      //   to="/InsideSales_AddParty"
      //   icon={TaskOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      // <Item
      //   key="InsideSales_ItemTable"
      //   title="InsideSales ItemTable"
      //   to="/InsideSales_ItemTable"
      //   icon={TaskOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      
     

      // Add more items for salesManager if needed
    ],
   
  };

  const userMenuItems = menuItems[role] || [];
  // const userMenuItems = menuItems[role] || menuItems.GUEST;

  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "#ffffff !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: "#ffffff",
          fontWeight: "bold !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `#ff0000 !important`,
          fontWeight: "bold !important",
          backgroundColor: "transparent !important",
        },
      }}
    >
     <Sidebar
      breakPoint="md"
      style={{ height: '100%', width: collapsed ? '80px' : '250px', transition: 'width 0.3s ease-in-out' }} // Adjust sidebar width based on collapsed state
      backgroundColor="#3f51b5"
    >
      {/* Collapse Button */}
      <Box sx={{ mb: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <IconButton
          onClick={broken ? () => toggleSidebar() : () => collapseSidebar()}
          sx={{ color: 'white', marginRight: '22px', '&:hover': { backgroundColor: '#3b4d7d' } }}
        >
          {collapsed ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
      </Box>

      {/* Company Logo */}
      {!collapsed && (
        <Box mb="25px" mt={2} textAlign="center">
          <Box display="flex" justifyContent="center" alignItems="center">
            {/* {loading ? (
              <CircularProgress sx={{ color: 'white' }} /> // Loader during loading
            ) : ( */}
              <img
                alt="company logo"
                width="100px"
                height="100px"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREXVTLV4zTip3OjYRhWNEntAg51kKu9fx2Iw&s"
                style={{ borderRadius: '50%', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)' }}
              />
            {/* )} */}
          </Box>
          {!loading && (
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ m: '10px 0 0 0', color: 'white' }}
              >
                MAP TECHNOS
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Menu Items */}
      <Menu iconShape="square" style={{ flex: 1 }}>
        {userMenuItems.map((menuItem, index) => (
          <MenuItem
            key={index}
            style={{
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#3b4d7d', // Darker blue on hover
              },
            }}
          >
            {menuItem}
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
     
    </Box>
  );
};

export default MyProSidebar;
