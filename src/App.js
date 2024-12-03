import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation , Navigate } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import { useAuth } from "./AuthProvider";

import Topbar from "./pages/global/Topbar";
import SignIn from "./pages/signin/signin";
import ChangePassword from "./pages/ChangePassword/changePassword";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";


import OrganizationForm from "./pages/Organization_Role/OrganisationForm/OrganisationForm";
import OrganizationDashboard from "./pages/Organization_Role/OrganizationDashboard/OrganizationDashboard";
import OrganizationAdminRegister from "./pages/Organization_Role/OganizationAdminRegister/OrganizationAdminRegister";

import AdminDashboard from "./pages/Admin_Role/AdminDashboard/adminDashboard";
import AdminManagerRegister from "./pages/Admin_Role/AdminManagerRegister/adminManagerRegister";

import ManagerDashboard from "./pages/Manager_Role/ManagerDashboard/managerDashboard";
import ManagerSalesManagerRegister from "./pages/Manager_Role/ManagerSalesMangerRegister/managerSalesManagerRegister";

import Hr from "./pages/Hr_Role/Hr";
import HrToSaleTeleTechOperRegistration from "./pages/Hr_Role/HumanResource/HumanResourceOtherRoleRegistrations";

import SalesManagerDashboard from "./pages/SalesManager_Role/SalesMangerDashboard/salesManagerDashboard";
import SalesManagerTechnicianRegister from "./pages/SalesManager_Role/SalesManager_To_Reg_Sales_Tech_Teli/salesManager_To_Reg_Sales_Tech_Teli";


import OperationalManagerDashboard from "./pages/OperationalManager_Role/OperationalManager/OperationalManagerDashboard"
import OperationalManagerTechnicianRegister from "./pages/OperationalManager_Role/OperationalManager/OperationalManagerTechnicianRegister";



import SalesDashboard from "./pages/Sales_ExecutiveRole/Sales_Dashboard/dashboard";
import SalesMaterialRequest from "./pages/Sales_ExecutiveRole/Sales_Material_Request/SalesMaterialRequest";
import Demo from "./pages/Sales_ExecutiveRole/Demo/Demo";
import SalesDailyReport from "./pages/Sales_ExecutiveRole/Sales_DailyReportForm/SalesDailyReportForm";
import PetrolAllowance from "./pages/Sales_ExecutiveRole/PetrolAllowance/PetrolAllowance";
import TrainingSection from "./pages/Sales_ExecutiveRole/TrainingSection/TrainingSection"
import QuotationForm from "./pages/Sales_ExecutiveRole/QuotationForm/QuotationForm";
import AddParty from "./pages/Sales_ExecutiveRole/AddParty/AddParty";
import ItemTable from "./pages/Sales_ExecutiveRole/ItemTable/ItemTable";
import SalesDailyReportList from "./pages/Sales_ExecutiveRole/Sales_DailyReportList/SalesdailyReportList";
import TravelAllowanceForm from "./pages/Sales_ExecutiveRole/FoodAndTravelAllowence/FoodTravelAllowence";
import SalesQuotationList from "./pages/Sales_ExecutiveRole/Sales_QuationList/salesQuationList";
import SelectBankAccount from "./pages/Sales_ExecutiveRole/Sales_AddBankDetails/salesAddBankDetils";
import SalesPaidInvoiceList from "./pages/Sales_ExecutiveRole/Sales_PaidInvoiceList/SalesPaidInvoiceList"
import SalesUnPaidInvoiceList from "./pages/Sales_ExecutiveRole/Sales_UnPaidInvoiceList/SalesUnPaidInvoiceList"
import ListCustomer from "./pages/Sales_ExecutiveRole/ListCustomer/ListCustomer";
import TicketsList from "./pages/Sales_ExecutiveRole/TicketsList/TicketsList";
import SalesInvoiceList from "./pages/Sales_ExecutiveRole/Sales_InvoiceList/saleInvoicelist";
import TicketAssignForm from "./pages/Sales_ExecutiveRole/TicketAssignFormSales/TicketAssignForm";
import QuotationTemplate from "./pages/Sales_ExecutiveRole/Quotation_Template/quotationTemplate";
import SalesDocumentsUpload from "./pages/Sales_ExecutiveRole/Sales_Documents_Upload/SalesDocumentsUpload";
import SalesVideosUpload from "./pages/Sales_ExecutiveRole/Sales_Videos_Upload/SalesVideosUpload";
import SalesInvoiceTemplate from "./pages/Sales_ExecutiveRole/Sales_InvoiceList/SalesInvoiceTemplate";
import InvoiceTemplate from "./pages/InvoiceTemplate/InvoiceTemplate";
import SalesProfile from "./pages/Sales_ExecutiveRole/Sales_Profile/salesProfile";



import TechnicianDashboard from "./pages/Technician_Role/Technician_Dashboard/technicianDashboard";
import TechnicianMaterialRequest from "./pages/Technician_Role/Technician_MaterialRequest/technicianMaterialRequest";
import TechnicianPetrolAllowance from "./pages/Technician_Role/Technician_PetrolAllowance/technicianPetrolAllowance";
import TechnicianFeedbackForm from "./pages/Technician_Role/Technician_FeedBackForm/technicianFeedBackForm";
import TechnicianFoodTravelAllowance from "./pages/Technician_Role/Technician_FoodAndTravelAllowance/technicianFoodAndTravelAllowance";
import TechnicianTools from "./pages/Technician_Role/Technician_ToolsRequirements/technicianToolsRequirements";
import TechnicianTrainingSection from "./pages/Technician_Role/TechnicianTrainingSection/TechnicianTrainingSection";
import TechnicianNewTickets from "./pages/Technician_Role/Technician_NewTickets_List/TechnicianNewTickets";
import TechnicianExistingTicketsList from "./pages/Technician_Role/Technician_ExistingTickets_List/TechnicianExistingTicketsList";
import TechnicianPendingTicketsList from "./pages/Technician_Role/Technician_PendingTickets_List/TechnicianPendingTicketsList";
import TechnicianCompletedTicketsList from "./pages/Technician_Role/Technician_CompletedTickets_List/TechnicianCompletedTicketsList";
import TechnicianTicketsHistory from "./pages/Technician_Role/Technician_Tickets_History/TechnicianHistory";

import InsideSales_Dashboard from "./pages/InsideSales_Role/InsideSales_Dashboard/InsideSales_Dashboard";
import InsideSales_DailyReportForm from "./pages/InsideSales_Role/InsideSales_DailyReportForm/InsideSales_DailyReportForm";
import InsideSales_DailyReportList from "./pages/InsideSales_Role/InsideSales_DailyReportList/InsideSales_DailyReportList";
import InsideSalesCRM from "./pages/InsideSales_Role/CRM/InsideSalesCRM";
import InsideSales_AddBankDetails from "./pages/InsideSales_Role/InsideSales_AddBankDetails/InsideSales_AddBankDetails";
import InsideSales_InvoiceList from "./pages/InsideSales_Role/InsideSales_InvoiceList/InsideSales_InvoiceList";
import InsideSales_PaidInvoiceList from "./pages/InsideSales_Role/InsideSales_PaidInvoiceList/InsideSales_PaidInvoiceList";
import InsideSales_UnPaidInvoiceList from "./pages/InsideSales_Role/InsideSales_UnPaidInvoiceList/InsideSales_UnPaidInvoiceList";
import InsideSales_MaterialRequest from "./pages/InsideSales_Role/InsideSales_MaterialRequest/InsideSales_MaterialRequest";
import InsideSales_QuotationForm from "./pages/InsideSales_Role/InsideSales_QuotationForm/InsideSales_QuotationForm";
import InsideSales_AddParty from "./pages/InsideSales_Role/InsideSales_AddParty/InsideSales_AddParty";
import InsideSales_ItemTable from "./pages/InsideSales_Role/InsideSales_ItemTable/InsideSales_ItemTable";
import InsideSales_QuotationList from "./pages/InsideSales_Role/InsideSales_QuotationList/InsideSales_QuotationList";
import InsideSales_TrainingSession from "./pages/InsideSales_Role/InsideSales_TrainingSession/InsideSales_TrainingSession";
import InsideSales_Demo from "./pages/InsideSales_Role/InsideSales_Demo/InsideSales_Demo";
import InsideSales_PetrolAllowance from "./pages/InsideSales_Role/InsideSales_PetrolAllowance/InsideSales_PetrolAllowance";
import InsideSales_VideosUpload from "./pages/InsideSales_Role/InsideSales_Videos_Upload/InsideSales_Videos_Upload";
import InsideSales_DocumentsUpload from "./pages/InsideSales_Role/InsideSales_Documents_Upload/InsideSales_Documents_Upload";
import InsideSales_FoodAndTravelAllowance from "./pages/InsideSales_Role/InsideSales_FoodAndTravelAllowanceForm/InsideSales_FoodAndTravelAllowanceForm";
import InsideSales_CustomerList from "./pages/InsideSales_Role/InsideSales_CustomerList/InsideSales_CustomerList";
import InsideSales_TicketsList from "./pages/InsideSales_Role/InsideSales_TicketsList/InsideSales_TicketsList";
import InsideSales_TicketsAssignForm from "./pages/InsideSales_Role/InsideSales_TicketsAssignForm/InsideSales_TicketsAssignForm";
import InsideSales_QuotationTemplate from "./pages/InsideSales_Role/InsideSales_QuotationTemplate/InsideSales_QuotationTemplate";



import AccountsDashboard from "./pages/Accounts_Role/Accounts/AccountsDashboard";
import Accounts_QuotationList from "./pages/Accounts_Role/Accounts_QuotationList/Accounts_QuotationList";
import AccountsQuotationTemplate from "./pages/Accounts_Role/Accounts_QuotationList/AccountsQuotationTemplate";
import AccountsDCList from "./pages/Accounts_Role/Accounts_DCList/Accounts_DcList";
import AccountsDCTemplate from "./pages/Accounts_Role/Accounts_DCList/AccountsDCTemplate";
import AccountsInvoiceList from "./pages/Accounts_Role/Accounts_InvoiceList/Accounts_InvoiceList";
import AccountsInvoiceTemplate from "./pages/Accounts_Role/Accounts_InvoiceList/AccountsInvoiceTemplate";
import AccountsProformaList from "./pages/Accounts_Role/Accounts_ProformaList/Accounts_ProformaList";
import AccountsProformaTemplate from "./pages/Accounts_Role/Accounts_ProformaList/AccountsProformaTemplate";

import Profile from "./pages/Profile/Profile";
import OrganizationProfile from "./pages/Profile/OrganizationProfile/OrganizationProfile";
import TechLeadTicketsRequest from "./pages/OperationalManager_Role/Tickets_Request/TicketsRequest";
import AccountsTelecallerQuotationTemplate from "./pages/Accounts_Role/Accounts_QuotationList/AccountsTelecallerQuotationTemplate";
import AccountsTelecallerInvoiceTemplate from "./pages/Accounts_Role/Accounts_InvoiceList/AccountsTelecallerInvoiceTemplate";
import AccountsTelecallerDCTemplate from "./pages/Accounts_Role/Accounts_DCList/AccountsTelecallerDCTemplate";
import AccountsTelecallerProformaTemplate from "./pages/Accounts_Role/Accounts_ProformaList/AccountsTelecallerProformaTemplate";
import InsideSales_InvoiceTemplate from "./pages/InsideSales_Role/InsideSales_InvoiceList/InsideSales_InvoiceTemplate";
import Manager_VideosUpload from "./pages/Manager_Role/Manager_VideosUpload/Manager_VideosUpload";
import Manager_PPTUpload from "./pages/Manager_Role/Manager_PPTUpload/Manager_PPTUpload";
import AppointmentList from "./pages/Sales_ExecutiveRole/AppointmentList/AppointmentList";
import ServiceRequest from "./pages/Manager_Role/ServiceRequest/ServiceRequest";
import TechLeadTicketsHistory from "./pages/OperationalManager_Role/Tickets_History/Tickets_History";
import Technician_DailyReportForm from "./pages/Technician_Role/Technician_DailyReportForm/Technician_DailyReportForm";
import Technician_DailyReportList from "./pages/Technician_Role/Technician_DailyReportList/Technician_DailyReportList";
import Technician_Demo from "./pages/Technician_Role/Technician_Demo/Technician_demo";
import TechLead_DailyReportForm from "./pages/OperationalManager_Role/TechLead_DailyReportForm/TechLead_DailyReportForm";
import TechLead_DailyReportList from "./pages/OperationalManager_Role/TechLead_DailyReportList/TechLead_DailyReportList";
import TechLead_Demo from "./pages/OperationalManager_Role/TechLead_Demo/TechLead_Demo";
import TechLead_FoodAndTravel from "./pages/OperationalManager_Role/TechLead_FoodAndTravel/TechLead_FoodAndTravel";
import TechLead_PetrolAllowance from "./pages/OperationalManager_Role/TechLead_PetrolAllowanace/TechLead_PetrolAllowance";
import TechLead_TrainingSession from "./pages/OperationalManager_Role/TechLead_TrainingSession/TechLead_TrainingSession";

import SalesManager_Demo from "./pages/SalesManager_Role/SalesManager_Demo/SalesManager_Demo";
import SalesManager_PetrolAllowance from "./pages/SalesManager_Role/SalesManager_PertrolAllowance/SalesManager_PetrolAllowance";
import SalesManager_DailyReportForm from "./pages/SalesManager_Role/SalesManager_DailyReportForm/SalesManager_DailyReportForm";
import SalesManager_DailyReportList from "./pages/SalesManager_Role/SalesManager_DailyReportList/SalesManager_DailyReportList";
import SalesManager_FoodTravelAllowance from "./pages/SalesManager_Role/SalesManager_FoodAndTravel/SalesManager_FoodAndTravel";
import SalesManager_TrainingSession from "./pages/SalesManager_Role/SalesManager_TrainingSession/SalesManager_TrainingSession";
import SalesAllInvoiceList from "./pages/SalesManager_Role/InvoiceList/InvoiceList";

import Manager_Demo from "./pages/Manager_Role/Manager_Demo/Manager_Demo";
import Manager_DailyReportForm from "./pages/Manager_Role/Manager_DailyReportForm/Manager_DailyReportForm";
import Manager_DailyReportList from "./pages/Manager_Role/Manager_DailyReportList/Manager_DailyReportList";
import Manager_FoodTravelAllowance from "./pages/Manager_Role/Manager_FoodAndTravel/Manager_FoodAndTravel";
import Manager_PetrolAllowance from "./pages/Manager_Role/Manager_PetrolAllowance/Manager_petrolAllowance";
import Manager_TrainingSession from "./pages/Manager_Role/Manager_TrainingSession/Manager_TrainingSession";
import InsideSales_Profile from "./pages/InsideSales_Role/InsidesSales_Profile/InsideSales_Profile";
import Technician_Profile from "./pages/Technician_Role/Technician_Profile/Technician_Profile";
import Admin_Profile from "./pages/Admin_Role/Admin_Profile/Admin_Profile";
import HR_Profile from "./pages/Hr_Role/Hr_Profile/Hr_Profile";
import Accounts_Profile from "./pages/Accounts_Role/Accounts_Profile/Accounts_Profile";
import Manager_Profile from "./pages/Manager_Role/Manager_Profile/Manager_Profile";
import SalesManagerProfile from "./pages/SalesManager_Role/SalesManager_Profile/SalesManager_Profile";
import TechLead_Profile from "./pages/OperationalManager_Role/TechLead_Profile/TechLead_Profile";
import TechLead_CompletedTickets from "./pages/OperationalManager_Role/TechLead_CompletedTickets/TechLead_CompletedTickets";
import TechLead_CustomerForm from "./pages/OperationalManager_Role/TechLead_CustomerForm/TechLead_CustomerForm";
import TechnicianToolsRequestList from "./pages/Technician_Role/TechnicianToolsRequestList/TechnicianToolsRequestList";
import Accounts_PaidList from "./pages/Accounts_Role/Accounts_PaidList/Accounts_PaidList";
import Accounts_UnPaidList from "./pages/Accounts_Role/Accounts_UnpaidList/Accounts_UnPaidList";



const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const { loginEmail } = useAuth(); // Access authentication state// new code

 

  const RequireAuth = ({ children }) => {
    // Check if the loginEmail is available in localStorage
    const loginEmail = localStorage.getItem("loginEmail");
  
    // Debugging: log the value of loginEmail
    console.log("loginEmail:", loginEmail);
  
    // If loginEmail is missing, user is not authenticated, redirect to login page
    if (!loginEmail) {
      // alert("You need to Log In to access this page.");
      return <Navigate to="/" replace />;
    }
  
    // If authenticated, render the children (protected routes)
    return children;
  };

 

  const checkAuthentication = () => {
    const publicRoutes = ["/", "/OrganizationForm"];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    setAuthenticated(!isPublicRoute);
  };

  useEffect(() => {
    checkAuthentication();
  }, [location.pathname]);



  // Check if the current route is valid
  const isNotFound = () => {
    // Define regex for dynamic routes
    const validRoutes = [
      /^\/InvoiceTemplate$/,
      /^\/SalesVideosUpload$/,
      /^\/SalesManagerTechnicianRegister$/,
      /^\/SalesManagerDashboard$/,
      /^\/ManagerSalesManagerRegister$/,
      /^\/ManagerDashboard$/,
      /^\/AdminManagerRegister$/,
      /^\/AdminDashboard$/,
      /^\/Admin_Profile$/,

      /^\/OrganizationDashboard$/,
      /^\/OrganizationAdminRegister$/,
      /^\/SalesDashboard$/,
      /^\/SalesInvoiceTemplate$/,
      /^\/SalesMaterialRequest$/,
      /^\/Demo$/,
      /^\/SalesDailyReportForm$/,
      /^\/SalesDailyReportList$/,
      /^\/PetrolAllowance$/,
      /^\/TravelAllowanceForm$/,
      /^\/TrainingSection$/,
      /^\/SelectBankAccount$/,
      /^\/SalesInvoiceList$/,
      /^\/AddParty$/,
      /^\/QuotationForm$/,
      /^\/ItemTable$/,
      /^\/SalesPaidInvoiceList$/,
      /^\/SalesUnPaidInvoiceList$/,
      /^\/SalesQuationList$/,
      /^\/SalesProfile$/,



      /^\/TechnicianDashboard$/,
      /^\/TechnicianMaterialRequest$/,
      /^\/TechnicianPetrolAllowance$/,
      /^\/TechnicianFeedbackForm$/,
      /^\/TechnicianFoodTravelAllowance$/,
      /^\/TechnicianTools$/,
      /^\/TechnicianTicketsHistory$/,
      /^\/ListCustomer$/,
      /^\/TicketsList$/,
      /^\/TechnicianTrainingSection$/,
      /^\/TechnicianNewTickets$/,
      /^\/TechnicianExistingTicketsList$/,
      /^\/TechnicianPendingTicketsList$/,
      /^\/TechnicianCompletedTicketsList$/,
      /^\/TicketAssignForm$/,
      /^\/InsideSales_Dashboard$/,
      /^\/InsideSales_DailyReportForm$/,
      /^\/InsideSales_DailyReportList$/,
      /^\/InsideSalesCRM$/,
      /^\/InsideSales_AddBankDetails$/,
      /^\/InsideSales_InvoiceList$/,
      /^\/InsideSales_PaidInvoiceList$/,
      /^\/InsideSales_UnPaidInvoiceList$/,
      /^\/InsideSales_MaterialRequest$/,
      /^\/InsideSales_QuotationForm$/,
      /^\/InsideSales_AddParty$/,
      /^\/InsideSales_ItemTable$/,
      /^\/InsideSales_QuotationList$/,
      /^\/InsideSales_TrainingSession$/,
      /^\/ChangePassword$/,
      /^\/QuotationTemplate$/,
      /^\/SalesDocumentsUpload$/,
      /^\/InsideSales_Demo$/,
      /^\/InsideSales_PetrolAllowance$/,
      /^\/InsideSales_VideosUpload$/,
      /^\/InsideSales_DocumentsUpload$/,
      /^\/InsideSales_FoodAndTravelAllowance$/,
      /^\/InsideSales_CustomerList$/,
      /^\/InsideSales_Profile$/,

      /^\/OperationalManagerDashboard$/,
      /^\/OperationalManagerTechnicianRegister$/,
      /^\/AccountsDashboard$/,
      /^\/Hr$/,
      /^\/HrToSaleTeleTechOperRegistration$/,
      /^\/HR_Profile$/,

      /^\/AccountsQuotationTemplate$/,
      /^\/Accounts_QuotationList$/,
      /^\/AccountsDCList$/,
      /^\/AccountsDCTemplate$/,
      /^\/AccountsInvoiceList$/,
      /^\/AccountsInvoiceTemplate$/,
      /^\/AccountsProformaList$/,
      /^\/AccountsProformaTemplate$/,
      /^\/Accounts_Profile$/,
      /^\/Accounts_PaidList$/,
      /^\/Accounts_UnPaidList$/,

      /^\/Profile$/,
      /^\/OrganizationProfile$/,
      /^\/InsideSales_TicketsList$/,
      /^\/InsideSales_TicketsAssignForm$/,
      /^\/InsideSales_QuotationTemplate$/,
      /^\/TechLeadTicketsRequest$/,
      /^\/AccountsTelecallerQuotationTemplate$/,
      /^\/AccountsTelecallerInvoiceTemplate$/,
      /^\/AccountsTelecallerDCTemplate$/,
      /^\/AccountsTelecallerProformaTemplate$/,
      /^\/InsideSales_InvoiceTemplate$/,
      /^\/Manager_PPTUpload$/,
      /^\/Manager_VideosUpload$/,
      /^\/AppointmentList$/,
      /^\/ServiceRequest$/,
      /^\/TechLeadTicketsHistory$/,
      /^\/Technician_DailyReportForm$/,
      /^\/Technician_DailyReportList$/,
      /^\/Technician_Demo$/,
      /^\/Technician_Profile$/,
      /^\/TechnicianToolsRequestList$/,

      /^\/TechLead_DailyReportForm$/,
      /^\/TechLead_DailyReportList$/,
      /^\/TechLead_Demo$/,
      /^\/TechLead_FoodAndTravel$/,
      /^\/TechLead_PetrolAllowance$/,
      /^\/TechLead_TrainingSession$/,
      /^\/TechLead_Profile$/,
      /^\/TechLead_CompletedTickets$/,
      /^\/TechLead_CustomerForm$/,

      /^\/SalesManager_Demo$/,
      /^\/SalesManager_PetrolAllowance$/,
      /^\/SalesManager_DailyReportForm$/,
      /^\/SalesManager_DailyReportList$/,
      /^\/SalesManager_FoodTravelAllowance$/,
      /^\/SalesManager_TrainingSession$/,
      /^\/SalesAllInvoiceList$/,
      /^\/SalesManagerProfile$/,

      /^\/Manager_Demo$/,
      /^\/Manager_DailyReportForm$/,
      /^\/Manager_DailyReportList$/,
      /^\/Manager_FoodTravelAllowance$/,
      /^\/Manager_PetrolAllowance$/,
      /^\/Manager_TrainingSession$/,
      /^\/Manager_Profile$/,

    ];
    
    // Rest of your code
    

    return !validRoutes.some((route) => route.test(location.pathname));
  };




  return (
    
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Handle authenticated routes */}
        {/* {authenticated ? ( */}

         {/* If the user is authenticated */}
         {authenticated && !isNotFound() ? (
             <MyProSidebarProvider>
            <div style={{ height: "100%", width: "100%" }}>
             
              <Topbar />
              <main>
                <Routes>
                {/* Profile Routes */}
                <Route path="/Profile" element={<RequireAuth><Profile/></RequireAuth>}/>
                <Route path="/OrganizationProfile" element={<RequireAuth><OrganizationProfile/></RequireAuth>}/>
                <Route path="/ChangePassword" element={<RequireAuth><ChangePassword /></RequireAuth>} />

                {/* HR Routes */}
                <Route path="/Hr" element={<RequireAuth><Hr/></RequireAuth>}/>
                <Route path="/HrToSaleTeleTechOperRegistration" element={<RequireAuth><HrToSaleTeleTechOperRegistration/></RequireAuth>}/>
                <Route path="/HR_Profile" element={<RequireAuth><HR_Profile/></RequireAuth>}/>
                
                {/* TECH lead  Routes */}
                <Route path="/OperationalManagerDashboard" element={<RequireAuth><OperationalManagerDashboard /></RequireAuth>}/>
                <Route path="/OperationalManagerTechnicianRegister" element={<RequireAuth><OperationalManagerTechnicianRegister /></RequireAuth>}/>
                <Route path="/TechLeadTicketsRequest" element={<RequireAuth><TechLeadTicketsRequest /></RequireAuth>}/>
                <Route path="/TechLeadTicketsHistory" element={<RequireAuth><TechLeadTicketsHistory /></RequireAuth>}/>
                <Route path="/TechLead_DailyReportForm" element={<RequireAuth><TechLead_DailyReportForm /></RequireAuth>}/>
                <Route path="/TechLead_DailyReportList" element={<RequireAuth><TechLead_DailyReportList /></RequireAuth>}/>
                <Route path="/TechLead_Demo" element={<RequireAuth><TechLead_Demo /></RequireAuth>}/> 
                <Route path="/TechLead_FoodAndTravel" element={<RequireAuth><TechLead_FoodAndTravel /></RequireAuth>}/>
                <Route path="/TechLead_PetrolAllowance" element={<RequireAuth><TechLead_PetrolAllowance /></RequireAuth>}/>
                <Route path="/TechLead_TrainingSession" element={<RequireAuth><TechLead_TrainingSession /></RequireAuth>}/>
                <Route path="/TechLead_Profile" element={<RequireAuth><TechLead_Profile /></RequireAuth>}/>
                <Route path="/TechLead_CompletedTickets" element={<RequireAuth><TechLead_CompletedTickets /></RequireAuth>}/>
                <Route path="/TechLead_CustomerForm" element={<RequireAuth><TechLead_CustomerForm /></RequireAuth>}/>


                {/* Accounts Routes */}
                <Route path="/AccountsDashboard" element={<RequireAuth><AccountsDashboard /></RequireAuth>}/>
                <Route path="/Accounts_QuotationList" element={<RequireAuth><Accounts_QuotationList /></RequireAuth>}/>
                <Route path="/AccountsQuotationTemplate" element={<RequireAuth><AccountsQuotationTemplate /></RequireAuth>}/>
                <Route path="/AccountsDCList" element={<RequireAuth><AccountsDCList /></RequireAuth>}/>
                <Route path="/AccountsDCTemplate" element={<RequireAuth><AccountsDCTemplate /></RequireAuth>}/>
                <Route path="/AccountsInvoiceList" element={<RequireAuth><AccountsInvoiceList /></RequireAuth>}/>
                <Route path="/AccountsInvoiceTemplate" element={<RequireAuth><AccountsInvoiceTemplate /></RequireAuth>}/>
                <Route path="/AccountsProformaList" element={<RequireAuth><AccountsProformaList /></RequireAuth>}/>
                <Route path="/AccountsProformaTemplate" element={<RequireAuth><AccountsProformaTemplate /></RequireAuth>}/>
                <Route path="/AccountsTelecallerQuotationTemplate" element={<RequireAuth><AccountsTelecallerQuotationTemplate /></RequireAuth>}/>
                <Route path="/AccountsTelecallerInvoiceTemplate" element={<RequireAuth><AccountsTelecallerInvoiceTemplate /></RequireAuth>}/>
                <Route path="/AccountsTelecallerDCTemplate" element={<RequireAuth><AccountsTelecallerDCTemplate /></RequireAuth>}/>
                <Route path="/AccountsTelecallerProformaTemplate" element={<RequireAuth><AccountsTelecallerProformaTemplate /></RequireAuth>}/>
                <Route path="/Accounts_Profile" element={<RequireAuth><Accounts_Profile /></RequireAuth>}/>
                <Route path="/Accounts_PaidList" element={<RequireAuth><Accounts_PaidList /></RequireAuth>}/>
                <Route path="/Accounts_UnPaidList" element={<RequireAuth><Accounts_UnPaidList /></RequireAuth>}/>

                {/* Sales Manager Routes */}
                <Route path="/SalesManagerTechnicianRegister" element={<RequireAuth><SalesManagerTechnicianRegister /></RequireAuth>} />
                <Route path="/SalesManagerDashboard" element={<RequireAuth><SalesManagerDashboard /></RequireAuth>} />
                <Route path="/SalesManager_Demo" element={<RequireAuth><SalesManager_Demo /></RequireAuth>}/>
                <Route path="/SalesManager_PetrolAllowance" element={<RequireAuth><SalesManager_PetrolAllowance /></RequireAuth>}/>
                <Route path="/SalesManager_DailyReportForm" element={<RequireAuth><SalesManager_DailyReportForm /></RequireAuth>}/>
                <Route path="/SalesManager_DailyReportList" element={<RequireAuth><SalesManager_DailyReportList /></RequireAuth>}/>
                <Route path="/SalesManager_FoodTravelAllowance" element={<RequireAuth><SalesManager_FoodTravelAllowance /></RequireAuth>}/>
                <Route path="/SalesManager_TrainingSession" element={<RequireAuth><SalesManager_TrainingSession /></RequireAuth>}/>
                <Route path="/SalesAllInvoiceList" element={<RequireAuth><SalesAllInvoiceList /></RequireAuth>}/>
                <Route path="/SalesManagerProfile" element={<RequireAuth><SalesManagerProfile /></RequireAuth>}/>

                {/* Manager Routes */}
                <Route path="/ManagerSalesManagerRegister" element={<RequireAuth><ManagerSalesManagerRegister /></RequireAuth>} />
                <Route path="/ManagerDashboard" element={<RequireAuth><ManagerDashboard /></RequireAuth>} />
                <Route path="/Manager_VideosUpload" element={<RequireAuth><Manager_VideosUpload /></RequireAuth>}/>
                <Route path="/Manager_PPTUpload" element={<RequireAuth><Manager_PPTUpload /></RequireAuth>}/>
                <Route path="/ServiceRequest" element={<RequireAuth><ServiceRequest /></RequireAuth>}/>
                <Route path="/Manager_Demo" element={<RequireAuth><Manager_Demo /></RequireAuth>}/>
                <Route path="/Manager_DailyReportForm" element={<RequireAuth><Manager_DailyReportForm /></RequireAuth>}/>
                <Route path="/Manager_DailyReportList" element={<RequireAuth><Manager_DailyReportList /></RequireAuth>}/>
                <Route path="/Manager_FoodTravelAllowance" element={<RequireAuth><Manager_FoodTravelAllowance /></RequireAuth>}/>
                <Route path="/Manager_PetrolAllowance" element={<RequireAuth><Manager_PetrolAllowance /></RequireAuth>}/>
                <Route path="/Manager_TrainingSession" element={<RequireAuth><Manager_TrainingSession /></RequireAuth>}/>
                <Route path="/Manager_Profile" element={<RequireAuth><Manager_Profile /></RequireAuth>}/>
                
                {/* Admin Routes */}
                <Route path="/AdminManagerRegister" element={<RequireAuth><AdminManagerRegister /></RequireAuth>} />
                <Route path="/AdminDashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
                <Route path="/Admin_Profile" element={<RequireAuth><Admin_Profile /></RequireAuth>}/>

                {/* Organization Routes */}
                <Route path="/OrganizationDashboard" element={<RequireAuth><OrganizationDashboard /></RequireAuth>} />
                <Route path="/OrganizationAdminRegister" element={<RequireAuth><OrganizationAdminRegister /></RequireAuth>} />

                 {/* sales Routes */}
                <Route path="/SalesDashboard" element={<RequireAuth><SalesDashboard /></RequireAuth>} />
                <Route path="/SalesMaterialRequest" element={<RequireAuth><SalesMaterialRequest /></RequireAuth>} />
                <Route path="/Demo" element={<RequireAuth><Demo /></RequireAuth>} />
                <Route path="/SalesDailyReportForm" element={<RequireAuth><SalesDailyReport /></RequireAuth>} />
                <Route path="/SalesDailyReportList" element={<RequireAuth><SalesDailyReportList /></RequireAuth>} />
                <Route path="/PetrolAllowance" element={<RequireAuth><PetrolAllowance /></RequireAuth>} />
                <Route path="/TravelAllowanceForm" element={<RequireAuth><TravelAllowanceForm /></RequireAuth>} />
                <Route path="/TrainingSection" element={<RequireAuth><TrainingSection /></RequireAuth>} />
                <Route path="/SelectBankAccount" element={<RequireAuth><SelectBankAccount /></RequireAuth>} />
                <Route path="/SalesInvoiceList" element={<RequireAuth><SalesInvoiceList /></RequireAuth>} />
                <Route path="/AddParty" element={<RequireAuth><AddParty /></RequireAuth>} />
                <Route path="/QuotationForm" element={<RequireAuth><QuotationForm /></RequireAuth>} />
                <Route path="/ItemTable" element={<RequireAuth><ItemTable /></RequireAuth>} />
                <Route path="/SalesPaidInvoiceList" element={<RequireAuth><SalesPaidInvoiceList /></RequireAuth>} />
                <Route path="/SalesUnPaidInvoiceList" element={<RequireAuth><SalesUnPaidInvoiceList /></RequireAuth>} />
                <Route path="/SalesQuationList" element={<RequireAuth><SalesQuotationList /></RequireAuth>} />
                <Route path="/ListCustomer" element={<RequireAuth><ListCustomer /></RequireAuth>} />
                <Route path="/TicketsList" element={<RequireAuth><TicketsList /></RequireAuth>} />
                <Route path="/TicketAssignForm" element={<RequireAuth><TicketAssignForm /></RequireAuth>} />
                <Route path="/SalesDocumentsUpload" element={<RequireAuth><SalesDocumentsUpload/></RequireAuth>}/>
                <Route path="/SalesVideosUpload" element={<RequireAuth><SalesVideosUpload /></RequireAuth>} />
                <Route path="/QuotationTemplate" element={<RequireAuth><QuotationTemplate/></RequireAuth>} />
                <Route path="/SalesInvoiceTemplate" element={<RequireAuth><SalesInvoiceTemplate/></RequireAuth>}/>
                <Route path="/InvoiceTemplate" element={<RequireAuth><InvoiceTemplate /></RequireAuth>} />
                <Route path="/AppointmentList" element={<RequireAuth><AppointmentList /></RequireAuth>}/>
                <Route path="/SalesProfile" element={<RequireAuth><SalesProfile /></RequireAuth>}/>


                {/* Technician Routes */}
                <Route path="/TechnicianDashboard" element={<RequireAuth><TechnicianDashboard /></RequireAuth>} />
                <Route path="/TechnicianMaterialRequest" element={<RequireAuth><TechnicianMaterialRequest /></RequireAuth>} />
                <Route path="/TechnicianPetrolAllowance" element={<RequireAuth><TechnicianPetrolAllowance /></RequireAuth>} />
                <Route path="/TechnicianFeedbackForm" element={<RequireAuth><TechnicianFeedbackForm /></RequireAuth>} />
                <Route path="/TechnicianFoodTravelAllowance" element={<RequireAuth><TechnicianFoodTravelAllowance /></RequireAuth>} />
                <Route path="/TechnicianTools" element={<RequireAuth><TechnicianTools /></RequireAuth>} />
                <Route path="/TechnicianTrainingSection" element={<RequireAuth><TechnicianTrainingSection /></RequireAuth>} />
                <Route path="/TechnicianNewTickets" element={<RequireAuth><TechnicianNewTickets /></RequireAuth>} />
                <Route path="/TechnicianExistingTicketsList" element={<RequireAuth><TechnicianExistingTicketsList /></RequireAuth>} />
                <Route path="/TechnicianPendingTicketsList" element={<RequireAuth><TechnicianPendingTicketsList /></RequireAuth>} />
                <Route path="/TechnicianCompletedTicketsList" element={<RequireAuth><TechnicianCompletedTicketsList /></RequireAuth>} />
                <Route path="/TechnicianTicketsHistory" element={<RequireAuth><TechnicianTicketsHistory /></RequireAuth>}/>
                <Route path="/Technician_DailyReportForm" element={<RequireAuth><Technician_DailyReportForm /></RequireAuth>}/>
                <Route path="/Technician_DailyReportList" element={<RequireAuth><Technician_DailyReportList /></RequireAuth>}/>
                <Route path="/Technician_Demo" element={<RequireAuth><Technician_Demo /></RequireAuth>}/>
                <Route path="/Technician_Profile" element={<RequireAuth><Technician_Profile /></RequireAuth>}/>
                <Route path="/TechnicianToolsRequestList" element={<RequireAuth><TechnicianToolsRequestList /></RequireAuth>}/>

                {/* Telecaller or InsideSales Routes */}
                <Route path="/InsideSales_Dashboard" element={<RequireAuth><InsideSales_Dashboard /></RequireAuth>} />
                <Route path="/InsideSales_Demo" element={<RequireAuth><InsideSales_Demo /></RequireAuth>}/>
                <Route path="/InsideSales_PetrolAllowance" element={<RequireAuth><InsideSales_PetrolAllowance /></RequireAuth>}/>
                <Route path="/InsideSales_VideosUpload" element={<RequireAuth><InsideSales_VideosUpload /></RequireAuth>}/>
                <Route path="/InsideSales_DocumentsUpload" element={<RequireAuth><InsideSales_DocumentsUpload /></RequireAuth>}/>
                <Route path="/InsideSales_FoodAndTravelAllowance" element={<RequireAuth><InsideSales_FoodAndTravelAllowance /></RequireAuth>}/>
                <Route path="/InsideSales_CustomerList" element={<RequireAuth><InsideSales_CustomerList /></RequireAuth>}/>
                <Route path="/InsideSales_DailyReportForm" element={<RequireAuth><InsideSales_DailyReportForm /></RequireAuth>} />
                <Route path="/InsideSales_DailyReportList" element={<RequireAuth><InsideSales_DailyReportList /></RequireAuth>} />
                <Route path="/InsideSales_AddBankDetails" element={<RequireAuth><InsideSales_AddBankDetails /></RequireAuth>} />
                <Route path="/InsideSales_InvoiceList" element={<RequireAuth><InsideSales_InvoiceList /></RequireAuth>} />
                <Route path="/InsideSales_PaidInvoiceList" element={<RequireAuth><InsideSales_PaidInvoiceList /></RequireAuth>} />
                <Route path="/InsideSales_UnPaidInvoiceList" element={<RequireAuth><InsideSales_UnPaidInvoiceList /></RequireAuth>} />
                <Route path="/InsideSales_MaterialRequest" element={<RequireAuth><InsideSales_MaterialRequest /></RequireAuth>} />
                <Route path="/InsideSales_QuotationForm" element={<RequireAuth><InsideSales_QuotationForm /></RequireAuth>} />
                <Route path="/InsideSales_AddParty" element={<RequireAuth><InsideSales_AddParty /></RequireAuth>} />
                <Route path="/InsideSales_ItemTable" element={<RequireAuth><InsideSales_ItemTable /></RequireAuth>} />
                <Route path="/InsideSales_QuotationList" element={<RequireAuth><InsideSales_QuotationList /></RequireAuth>} />
                <Route path="/InsideSales_QuotationTemplate" element={<RequireAuth><InsideSales_QuotationTemplate /></RequireAuth>}/>
                <Route path="/InsideSales_TicketsAssignForm" element={<RequireAuth><InsideSales_TicketsAssignForm /></RequireAuth>}/>
                <Route path="/InsideSales_TicketsList" element={<RequireAuth><InsideSales_TicketsList /></RequireAuth>}/>
                <Route path="/InsideSales_TrainingSession" element={<RequireAuth><InsideSales_TrainingSession /></RequireAuth>} />
                <Route path="/InsideSales_InvoiceTemplate" element={<RequireAuth><InsideSales_InvoiceTemplate /></RequireAuth>}/>
                <Route path="/InsideSales_Profile" element={<RequireAuth><InsideSales_Profile /></RequireAuth>}/>
                <Route path="/InsideSalesCRM" element={<RequireAuth><InsideSalesCRM /></RequireAuth>} />
                {/* Not found page */}
                <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              
            </div>
            </MyProSidebarProvider>
          
        ) : (
          <Routes>
            {/* Non-authenticated routes */}
            <Route path="/" element={<SignIn />} />
            <Route path="/OrganizationForm" element={<OrganizationForm/>}/>
            <Route path="*" element={<SignIn />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
   
  );
};

export default App;