import React, { useState, useEffect } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Collapse, Button,Icon,CircularProgress,Avatar } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { GlobalStyles } from "@mui/system";
import Badge from '@mui/material/Badge';

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";
import './sidebar.css'

const Item = ({ title, to, icon:Icon, selected, setSelected,badgeCount }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <MenuItem
      active={isActive}
      onClick={() => setSelected(title)}
      // icon={<Box sx={{ marginTop: "40px", color: isActive ? "white" : "#BCCDD5" }}><Icon /></Box>}
      icon={
        <Box sx={{ marginTop: "40px", color: isActive ? "white" : "#BCCDD5" }}>
          {badgeCount > 0 ? (
            <Badge badgeContent={badgeCount} color="secondary">
              <Icon />
            </Badge>
          ) : (
            <Icon />
          )}
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
          marginTop: "40px",
          color: isActive ? "white" : "#BCCDD5", // Apply blue color to active text
        }}
      >
        {title}
      </Typography>
    </MenuItem>
  );
};
const baseUrl = process.env.REACT_APP_API_BASE_URL;
const MyProSidebar = () => {
  const [badgeCount, setBadgeCount] = useState(0); // State to store the badge count
  const [selected, setSelected] = useState("Dashboard");
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState({ companyLogo: "", companyName: "" });
  const [loading, setLoading] = useState(true);
  const [isTicketsOpen, setTicketsOpen] = useState(false);
  const { orgId ,count,techcount,salescount,telcount ,AccCount} = useAuth();
 console.log("i AM BADGE COUNT : "+badgeCount);
  // Role-based menu items
  const role = localStorage.getItem("role")   // Convert role to uppercase


  //Fetch company info
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/auth/organize/getProfile/${orgId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched Company Info:", data); // Debug log
        setCompanyInfo({
          companyLogo: data?.companyLogo || "",
          companyName: data?.companyName || "Unknown Company",
        });
      } catch (error) {
        console.error("Error fetching company info:", error);
      } finally {
        setLoading(false); // Ensure loading state is always updated
      }
    };
    fetchCompanyInfo();
  }, [orgId]);
  

  useEffect(() => {
    // Function to prevent default touch actions
    const preventTouch = (e) => {
      e.preventDefault();
    };

    // Add touch event listeners
    document.addEventListener('touchstart', preventTouch, { passive: false });
    document.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      // Clean up the event listeners on component unmount
      document.removeEventListener('touchstart', preventTouch);
      document.removeEventListener('touchmove', preventTouch);
    };
  }, []);


    // Fetch the badge count from the API
    const fetchBadgeCount = async () => {
      try {

        const response = await fetch(`${baseUrl}/api/v1/operationTechLead/getNewTickets/count`); // Replace with your actual API URL
        if (response.ok) {
          const data = await response.text();; // Assuming the API returns a JSON object with badgeCount
          setBadgeCount(Number(data)); // Assuming the response contains badgeCount
        } else {
          console.error('Failed to fetch badge count');
        }
      } catch (error) {
        console.error('Error fetching badge count:', error);
      }
    };
  
    useEffect(() => {
      fetchBadgeCount(); // Fetch badge count on component mount
    }, []);


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
        title="Dashboard "
        to="/AccountsDashboard"
        icon={DashboardIcon}
        selected={selected}
        setSelected={setSelected}
      />,
 
      <Item
        key="Accounts_QuotationList"
        title="Invoice Request"
        to="/Accounts_QuotationList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
        badgeCount={AccCount  || 0} 
      />,
      <Item
      key="AccountsInvoiceList"
      title="Invoice "
      to="/AccountsInvoiceList"
      icon={ReceiptIcon}
      selected={selected}
      setSelected={setSelected}
      
    />,

      <Item
        key="AccountsDCList"
        title="Delivery Challan"
        to="/AccountsDCList"
        icon={DescriptionIcon}
        selected={selected}
        setSelected={setSelected}
      />,
     
      <Item
      key="AccountsProformaList"
      title="Proforma"
      to="/AccountsProformaList"
      icon={InsertDriveFileIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="Accounts_PaidList"
      title="Paid List"
      to="/Accounts_PaidList"
      icon={InsertDriveFileIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="Accounts_UnPaidList"
      title="UnPaid List"
      to="/Accounts_UnPaidList"
      icon={InsertDriveFileIcon}
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
      <Item
        key="Manager_VideosUpload"
        title="Demo Video Upload"
        to="/Manager_VideosUpload"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="Manager_PPTUpload"
        title="PPT Upload"
        to="/Manager_PPTUpload"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
      key="ServiceRequest"
      title="Service Request"
      to="/ServiceRequest"
      icon={FormatListNumberedRtlIcon}
      selected={selected}
      setSelected={setSelected}
    />,

    <Item
      key="Manager_Demo"
      title="Demo"
      to="/Manager_Demo"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="Manager_DailyReportList"
      title="Daily Report"
      to="/Manager_DailyReportList"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="Manager_FoodTravelAllowance"
      title="FoodAndTravel"
      to="/Manager_FoodTravelAllowance"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="Manager_PetrolAllowance"
      title="PetrolAllowance"
      to="/Manager_PetrolAllowance"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
    key="Manager_TrainingSession"
    title="Training Session"
    to="/Manager_TrainingSession"
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
        title="Dashboard"
        to="/SalesManagerDashboard"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="SalesManagerTechnicianRegister"
        title="Registration"
        to="/SalesManagerTechnicianRegister"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
      key="SalesManager_Demo"
      title="Demo"
      to="/SalesManager_Demo"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    // <Item
    //     key="SalesManagerSalesRegister"
    //     title="Invoice List"
    //     to="/SalesAllInvoiceList"
    //     icon={HomeOutlinedIcon}
    //     selected={selected}
    //     setSelected={setSelected}
    //   />,
    <Item
      key="SalesManager_DailyReportList"
      title="Daily Report"
      to="/SalesManager_DailyReportList"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="SalesManager_FoodTravelAllowance"
      title="Food & Travel"
      to="/SalesManager_FoodTravelAllowance"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
      key="SalesManager_PetrolAllowance"
      title="Petrol Allowance"
      to="/SalesManager_PetrolAllowance"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
    key="SalesManager_TrainingSession"
    title="Training Session"
    to="/SalesManager_TrainingSession"
    icon={HomeOutlinedIcon}
    selected={selected}
    setSelected={setSelected}
  />,
      
      
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
      <Item
        key="TechLead_CustomerForm"
        title="New Customer Form"
        to="/TechLead_CustomerForm"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="TechLeadTicketsRequest"
        title="Tickets Request"
        to="/TechLeadTicketsRequest"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
        badgeCount={count  || 0} // Example badge count
      />,
      <Item
      key="TechLead_CompletedTickets"
      title="Completed Tickets"
      to="/TechLead_CompletedTickets"
      icon={HomeOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
      <Item
        key="TechLeadTicketsHistory"
        title="Total Tickets"
        to="/TechLeadTicketsHistory"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="TechLead_Demo"
        title="Demo"
        to="/TechLead_Demo"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="TechLead_DailyReportList"
        title="Daily Report"
        to="/TechLead_DailyReportList"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="TechLead_FoodAndTravel"
        title="FoodAndTravel"
        to="/TechLead_FoodAndTravel"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="TechLead_PetrolAllowance"
        title="PetrolAllowance"
        to="/TechLead_PetrolAllowance"
        icon={HomeOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
      key="TechLead_TrainingSession"
      title="Training Session"
      to="/TechLead_TrainingSession"
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
      key="Technician_Demo"
      title="Demo"
      to="/Technician_Demo"
      icon={AssignmentOutlinedIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
    key="newtickets"
    title="New Tickets"
    to="/TechnicianNewTickets"
    icon={TaskOutlinedIcon}
    selected={selected}
    setSelected={setSelected}
    badgeCount={techcount  || 0} // Example badge count
  />,
 
  // <Item
  //   key="pendingtickets"
  //   title="Pending Tickets"
  //   to="/TechnicianPendingTicketsList"
  //   icon={AssignmentOutlinedIcon}
  //   selected={selected}
  //   setSelected={setSelected}
  // />
  ,
  <Item
    key="completedtickets"
    title="Completed Tickets"
    to="/TechnicianCompletedTicketsList"
    icon={AssignmentOutlinedIcon}
    selected={selected}
    setSelected={setSelected}
  />,
  <Item
  key="completedtickets"
  title="Total Tickets"
  to="/TechnicianTicketsHistory"
  icon={AssignmentOutlinedIcon}
  selected={selected}
  setSelected={setSelected}
/>,
      // <Item
      //   key="materialRequest"
      //   title="Material Request"
      //   to="/TechnicianMaterialRequest"
      //   icon={AssignmentOutlinedIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      <Item
      key="toolRequest"
      title="Tools"
      to="/TechnicianTools"
      icon={AddShoppingCartIcon}
      selected={selected}
      setSelected={setSelected}
    />,
    <Item
    key="TechnicianToolsRequestList"
    title="Tools Request List"
    to="/TechnicianToolsRequestList"
    icon={AssignmentOutlinedIcon}
    selected={selected}
    setSelected={setSelected}
  />,
      
     
     

      <Item
        key="Technician_DailyReportForm"
        title="DailyReport Form"
        to="/Technician_DailyReportList"
        icon={TaskOutlinedIcon}
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
        key="foodAndTravelAllowanceForm"
        title="Food & Travel"
        to="/TechnicianFoodTravelAllowance"
        icon={TaskOutlinedIcon}
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
        key="training section"
        title="Training session"
        to="/TechnicianTrainingSection"
        icon={AssignmentOutlinedIcon}
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
        badgeCount={salescount  || 0}
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
      //   key="quotationList"
      //   title="Profile"
      //   to="/Profile"
      //   icon={FormatListNumberedRtlIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
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
        key="ListCustomer"
        title="Customers List"
        to="/ListCustomer"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="SalesInvoiceList"
        title="Tickets List"
        to="/TicketsList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      // <Item
      //   key="SalesInvoiceList"
      //   title="Tickets"
      //   to="/SalesInvoiceList"
      //   icon={FormatListNumberedRtlIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,

      <Item
        key="DailyReportList"
        title="Daily Report"
        to="/SalesDailyReportList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="AppointmentList"
        title="Appointment List"
        to="/AppointmentList"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      <Item
        key="petrolAllowance"
        title="Petrol Allowance"
        to="/PetrolAllowance"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,

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
        title="Sale Invoice"
        to="/InsideSales_InvoiceList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
        badgeCount={telcount  || 0} // Example badge count
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
        key="InsideSales_CustomerList"
        title="Customer List"
        to="/InsideSales_CustomerList"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,
     
      <Item
        key="InsideSales_TicketsList"
        title="Tickets List"
        to="/InsideSales_TicketsList"
        icon={FormatListNumberedRtlIcon}
        selected={selected}
        setSelected={setSelected}
      />,
      // <Item
      //   key="InsideSales_DocumentsUpload"
      //   title="PPT Upload"
      //   to="/InsideSales_DocumentsUpload"
      //   icon={FormatListNumberedRtlIcon}
      //   selected={selected}
      //   setSelected={setSelected}
      // />,
      <Item
        key="InsideSales_DailyReportList"
        title="Daily Report"
        to="/InsideSales_DailyReportList"
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
        key="InsideSales_FoodAndTravelAllowance"
        title="Food & Travel Allowence"
        to="/InsideSales_FoodAndTravelAllowance"
        icon={TaskOutlinedIcon}
        selected={selected}
        setSelected={setSelected}
      />,

      <Item
        key="InsideSales_TrainingSession"
        title="Training Session"
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
    <>
    <GlobalStyles
  styles={{
    
    '.custom-sidebar-scrollbar': {
      // scrollbarWidth: '2px', // Reduced width for Firefox
      scrollbarColor: 'grey #e0e0e0',
    },
  }}
/>

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
          color: "#ff0000 !important",
          fontWeight: "bold !important",
          backgroundColor: "transparent !important",
        },
      }}
     
    >
     <Sidebar
     className="custom-sidebar-scrollbar"
      breakPoint="md"
      style={{ 
         height: '100%',
         width: collapsed ? '80px' : '250px', 
         transition: 'width 0.3s ease-in-out', 
        
      }} // Adjust sidebar width based on collapsed state
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
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            {loading ? (
              // <CircularProgress sx={{ color: 'white' }} />
              // {<Typography></Typography>}
              <>
                <CircularProgress sx={{ color: 'white', mb: 10 }} />
                <Typography sx={{ color: 'white' }}>Loading Logo...</Typography>
              </>
            ) : (
              <Avatar
              alt="Company Logo"
              src={companyInfo.companyLogo ? `data:image/jpeg;base64,${companyInfo.companyLogo}` : ""} 
              sx={{ width: "100px",
                height:"100px" ,
                borderRadius: "50%",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                objectFit: "cover",}}
            />
            )}
          </Box>
          {!loading && (
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ m: '10px 0 0 0', color: 'white' }}
              >
                {companyInfo.companyName}
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
              padding: '2px',
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
    </>
  );
};

export default MyProSidebar;