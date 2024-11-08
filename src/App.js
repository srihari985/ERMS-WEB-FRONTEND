import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation , Navigate } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import { useAuth } from "./AuthProvider";

import Topbar from "./pages/global/Topbar";
import SalesDashboard from "./pages/Sales_ExecutiveRole/Sales_Dashboard/dashboard";
import SignIn from "./pages/signin/signin";


import SalesMaterialRequest from "./pages/Sales_ExecutiveRole/Sales_Material_Request/SalesMaterialRequest";
import Demo from "./pages/Sales_ExecutiveRole/Demo/Demo";
import SalesDailyReport from "./pages/Sales_ExecutiveRole/Sales_DailyReportForm/SalesDailyReportForm";
import PetrolAllowance from "./pages/Sales_ExecutiveRole/PetrolAllowance/PetrolAllowance";

import SalesFeedbackForm from "./pages/Sales_ExecutiveRole/SalesFeedBackForm/SalesFeedBackForm";
import QuotationFeedbackForm from "./pages/Sales_ExecutiveRole/QuotationFeedbackForm/QuotationFeedbackForm"
import TrainingSection from "./pages/Sales_ExecutiveRole/TrainingSection/TrainingSection"
import CustomerForm from "./pages/Sales_ExecutiveRole/CustomerForm/CustomerForm";
import QuotationForm from "./pages/Sales_ExecutiveRole/QuotationForm/QuotationForm";
import AddParty from "./pages/Sales_ExecutiveRole/AddParty/AddParty";
import ItemTable from "./pages/Sales_ExecutiveRole/ItemTable/ItemTable";
import SalesDailyReportList from "./pages/Sales_ExecutiveRole/Sales_DailyReportList/SalesdailyReportList";
import TravelAllowanceForm from "./pages/Sales_ExecutiveRole/FoodAndTravelAllowence/FoodTravelAllowence";
import TechnicianDashboard from "./pages/Technician_Role/Technician_Dashboard/technicianDashboard";
import SalesQuotationList from "./pages/Sales_ExecutiveRole/Sales_QuationList/salesQuationList";
import SelectBankAccount from "./pages/Sales_ExecutiveRole/Sales_AddBankDetails/salesAddBankDetils";
import SalesPaidInvoiceList from "./pages/Sales_ExecutiveRole/Sales_PaidInvoiceList/SalesPaidInvoiceList"
import SalesUnPaidInvoiceList from "./pages/Sales_ExecutiveRole/Sales_UnPaidInvoiceList/SalesUnPaidInvoiceList"


import TechnicianMaterialRequest from "./pages/Technician_Role/Technician_MaterialRequest/technicianMaterialRequest";
import TechnicianPetrolAllowance from "./pages/Technician_Role/Technician_PetrolAllowance/technicianPetrolAllowance";
import TechnicianFeedbackForm from "./pages/Technician_Role/Technician_FeedBackForm/technicianFeedBackForm";
import TechnicianFoodTravelAllowance from "./pages/Technician_Role/Technician_FoodAndTravelAllowance/technicianFoodAndTravelAllowance";
import TechnicianTools from "./pages/Technician_Role/Technician_ToolsRequirements/technicianToolsRequirements";
import SalesInvoiceList from "./pages/Sales_ExecutiveRole/Sales_InvoiceList/saleInvoicelist";

import ListCustomer from "./pages/Sales_ExecutiveRole/ListCustomer/ListCustomer";
import TicketsList from "./pages/TicketsList/TicketsList"

import TechnicianTrainingSection from "./pages/Technician_Role/TechnicianTrainingSection/TechnicianTrainingSection";
import TechnicianNewTickets from "./pages/Technician_Role/Technician_NewTickets_List/TechnicianNewTickets";
import TechnicianExistingTicketsList from "./pages/Technician_Role/Technician_ExistingTickets_List/TechnicianExistingTicketsList";
import TechnicianPendingTicketsList from "./pages/Technician_Role/Technician_PendingTickets_List/TechnicianPendingTicketsList";
import TechnicianCompletedTicketsList from "./pages/Technician_Role/Technician_CompletedTickets_List/TechnicianCompletedTicketsList";
import TicketAssignForm from "./pages/Sales_ExecutiveRole/TicketAssignFormSales/TicketAssignForm";


import { AuthProvider } from "./AuthProvider";
import OrganizationForm from "./pages/Organization_Role/OrganisationForm/OrganisationForm";
import OrganizationDashboard from "./pages/Organization_Role/OrganizationDashboard/OrganizationDashboard";
import OrganizationAdminRegister from "./pages/Organization_Role/OganizationAdminRegister/OrganizationAdminRegister";
import AdminDashboard from "./pages/Admin_Role/AdminDashboard/adminDashboard";
import AdminManagerRegister from "./pages/Admin_Role/AdminManagerRegister/adminManagerRegister";
import ManagerDashboard from "./pages/Manager_Role/ManagerDashboard/managerDashboard";
import ManagerSalesManagerRegister from "./pages/Manager_Role/ManagerSalesMangerRegister/managerSalesManagerRegister";
import SalesManagerDashboard from "./pages/SalesManager_Role/SalesMangerDashboard/salesManagerDashboard";
import SalesManagerTechnicianRegister from "./pages/SalesManager_Role/SalesManager_To_Reg_Sales_Tech_Teli/salesManager_To_Reg_Sales_Tech_Teli";


import InsideSales_Dashboard from "./pages/InsideSales_Role/InsideSales_Dashboard/InsideSales_Dashboard";
import InsideSales_DailyReportForm from "./pages/InsideSales_Role/InsideSales_DailyReportForm/InsideSales_DailyReportForm";
import InsideSales_DailyReportList from "./pages/InsideSales_Role/InsideSales_DailyReportList/InsideSales_DailyReportList";
import InsideSales_FeedBackForm from "./pages/InsideSales_Role/InsideSales_FeedBackForm/InsideSales_FeedBackForm";
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
import SalesVideosUpload from "./pages/Sales_ExecutiveRole/Sales_Videos_Upload/SalesVideosUpload";
import ChangePassword from "./pages/ChangePassword/changePassword";
import InvoiceTemplate from "./pages/InvoiceTemplate/InvoiceTemplate";

import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import QuotationTemplate from "./pages/Sales_ExecutiveRole/Quotation_Template/quotationTemplate";
import SalesDocumentsUpload from "./pages/Sales_ExecutiveRole/Sales_Documents_Upload/SalesDocumentsUpload";
import InsideSales_Demo from "./pages/InsideSales_Role/InsideSales_Demo/InsideSales_Demo";
import InsideSales_PetrolAllowance from "./pages/InsideSales_Role/InsideSales_PetrolAllowance/InsideSales_PetrolAllowance";
import InsideSales_VideosUpload from "./pages/InsideSales_Role/InsideSales_Videos_Upload/InsideSales_Videos_Upload";
import InsideSales_DocumentsUpload from "./pages/InsideSales_Role/InsideSales_Documents_Upload/InsideSales_Documents_Upload";
import InsideSales_FoodAndTravelAllowance from "./pages/InsideSales_Role/InsideSales_FoodAndTravelAllowanceForm/InsideSales_FoodAndTravelAllowanceForm";
import InsideSales_CustomerList from "./pages/InsideSales_Role/InsideSales_CustomerList/InsideSales_CustomerList";
import OperationalManagerDashboard from "./pages/OperationalManager_Role/OperationalManager/OperationalManagerDashboard"
import OperationalManagerTechnicianRegister from "./pages/OperationalManager_Role/OperationalManager/OperationalManagerTechnicianRegister";
import AccountsDashboard from "./pages/Accounts_Role/Accounts/AccountsDashboard";
import Hr from "./pages/Hr_Role/Hr";
import HrToSaleTeleTechOperRegistration from "./pages/Hr_Role/HumanResource/HumanResourceOtherRoleRegistrations";






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
      /^\/OrganizationDashboard$/,
      /^\/OrganizationAdminRegister$/,
      /^\/SalesDashboard$/,
      /^\/SalesMaterialRequest$/,
      /^\/Demo$/,
      /^\/SalesDailyReportForm$/,
      /^\/SalesDailyReportList$/,
      /^\/PetrolAllowance$/,
      /^\/TravelAllowanceForm$/,
      /^\/SalesFeedbackForm$/,
      /^\/QuotationFeedbackForm$/,
      /^\/TrainingSection$/,
      /^\/CustomerForm$/,
      /^\/SelectBankAccount$/,
      /^\/SalesInvoiceList$/,
      /^\/AddParty$/,
      /^\/QuotationForm$/,
      /^\/ItemTable$/,
      /^\/SalesPaidInvoiceList$/,
      /^\/SalesUnPaidInvoiceList$/,
      /^\/SalesQuationList$/,
      /^\/TechnicianDashboard$/,
      /^\/TechnicianMaterialRequest$/,
      /^\/TechnicianPetrolAllowance$/,
      /^\/TechnicianFeedbackForm$/,
      /^\/TechnicianFoodTravelAllowance$/,
      /^\/TechnicianTools$/,
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
      /^\/InsideSales_FeedBackForm$/,
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
      /^\/OperationalManagerDashboard$/,
      /^\/OperationalManagerTechnicianRegister$/,
      /^\/AccountsDashboard$/,
      /^\/Hr$/,
      /^\/HrToSaleTeleTechOperRegistration$/,
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
                
                <Route path="/Hr" element={<RequireAuth><Hr/></RequireAuth>}/>
                <Route path="/HrToSaleTeleTechOperRegistration" element={<RequireAuth><HrToSaleTeleTechOperRegistration/></RequireAuth>}/>
                <Route path="/SalesDocumentsUpload" element={<RequireAuth><SalesDocumentsUpload/></RequireAuth>}/>
                <Route path="/QuotationTemplate" element={<RequireAuth><QuotationTemplate/></RequireAuth>} />
                <Route path="/InvoiceTemplate" element={<RequireAuth><InvoiceTemplate /></RequireAuth>} />
                <Route path="/SalesVideosUpload" element={<RequireAuth><SalesVideosUpload /></RequireAuth>} />
                <Route path="/OperationalManagerDashboard" element={<RequireAuth><OperationalManagerDashboard /></RequireAuth>}/>
                <Route path="/OperationalManagerTechnicianRegister" element={<RequireAuth><OperationalManagerTechnicianRegister /></RequireAuth>}/>

                <Route path="/AccountsDashboard" element={<RequireAuth><AccountsDashboard /></RequireAuth>}/>
                <Route path="/SalesManagerTechnicianRegister" element={<RequireAuth><SalesManagerTechnicianRegister /></RequireAuth>} />
                <Route path="/SalesManagerDashboard" element={<RequireAuth><SalesManagerDashboard /></RequireAuth>} />

                <Route path="/ManagerSalesManagerRegister" element={<RequireAuth><ManagerSalesManagerRegister /></RequireAuth>} />
                <Route path="/ManagerDashboard" element={<RequireAuth><ManagerDashboard /></RequireAuth>} />

                <Route path="/AdminManagerRegister" element={<RequireAuth><AdminManagerRegister /></RequireAuth>} />
                <Route path="/AdminDashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />

                <Route path="/OrganizationDashboard" element={<RequireAuth><OrganizationDashboard /></RequireAuth>} />
                <Route path="/OrganizationAdminRegister" element={<RequireAuth><OrganizationAdminRegister /></RequireAuth>} />

                <Route path="/SalesDashboard" element={<RequireAuth><SalesDashboard /></RequireAuth>} />
                <Route path="/SalesMaterialRequest" element={<RequireAuth><SalesMaterialRequest /></RequireAuth>} />
                <Route path="/Demo" element={<RequireAuth><Demo /></RequireAuth>} />
                <Route path="/SalesDailyReportForm" element={<RequireAuth><SalesDailyReport /></RequireAuth>} />
                <Route path="/SalesDailyReportList" element={<RequireAuth><SalesDailyReportList /></RequireAuth>} />
                <Route path="/PetrolAllowance" element={<RequireAuth><PetrolAllowance /></RequireAuth>} />
                <Route path="/TravelAllowanceForm" element={<RequireAuth><TravelAllowanceForm /></RequireAuth>} />
                {/* Uncomment as needed */}
                {/* <Route path="/FoodRequestForm" element={<RequireAuth><FoodRequestForm /></RequireAuth>} /> */}
                <Route path="/SalesFeedbackForm" element={<RequireAuth><SalesFeedbackForm /></RequireAuth>} />
                <Route path="/QuotationFeedbackForm" element={<RequireAuth><QuotationFeedbackForm /></RequireAuth>} />
                <Route path="/TrainingSection" element={<RequireAuth><TrainingSection /></RequireAuth>} />
                <Route path="/CustomerForm" element={<RequireAuth><CustomerForm /></RequireAuth>} />
                <Route path="/SelectBankAccount" element={<RequireAuth><SelectBankAccount /></RequireAuth>} />
                <Route path="/SalesInvoiceList" element={<RequireAuth><SalesInvoiceList /></RequireAuth>} />
                <Route path="/AddParty" element={<RequireAuth><AddParty /></RequireAuth>} />
                <Route path="/QuotationForm" element={<RequireAuth><QuotationForm /></RequireAuth>} />
                <Route path="/ItemTable" element={<RequireAuth><ItemTable /></RequireAuth>} />
                <Route path="/SalesPaidInvoiceList" element={<RequireAuth><SalesPaidInvoiceList /></RequireAuth>} />
                <Route path="/SalesUnPaidInvoiceList" element={<RequireAuth><SalesUnPaidInvoiceList /></RequireAuth>} />
                
                {/* Uncomment as needed */}
                {/* <Route path="/QuotationList" element={<RequireAuth><QuotationList /></RequireAuth>} /> */}
                <Route path="/SalesQuationList" element={<RequireAuth><SalesQuotationList /></RequireAuth>} />

                <Route path="/TechnicianDashboard" element={<RequireAuth><TechnicianDashboard /></RequireAuth>} />
                <Route path="/TechnicianMaterialRequest" element={<RequireAuth><TechnicianMaterialRequest /></RequireAuth>} />
                <Route path="/TechnicianPetrolAllowance" element={<RequireAuth><TechnicianPetrolAllowance /></RequireAuth>} />
                <Route path="/TechnicianFeedbackForm" element={<RequireAuth><TechnicianFeedbackForm /></RequireAuth>} />
                <Route path="/TechnicianFoodTravelAllowance" element={<RequireAuth><TechnicianFoodTravelAllowance /></RequireAuth>} />
                <Route path="/TechnicianTools" element={<RequireAuth><TechnicianTools /></RequireAuth>} />

                <Route path="/ListCustomer" element={<RequireAuth><ListCustomer /></RequireAuth>} />
                <Route path="/TicketsList" element={<RequireAuth><TicketsList /></RequireAuth>} />
                <Route path="/TechnicianTrainingSection" element={<RequireAuth><TechnicianTrainingSection /></RequireAuth>} />
                <Route path="/TechnicianNewTickets" element={<RequireAuth><TechnicianNewTickets /></RequireAuth>} />
                <Route path="/TechnicianExistingTicketsList" element={<RequireAuth><TechnicianExistingTicketsList /></RequireAuth>} />
                <Route path="/TechnicianPendingTicketsList" element={<RequireAuth><TechnicianPendingTicketsList /></RequireAuth>} />
                <Route path="/TechnicianCompletedTicketsList" element={<RequireAuth><TechnicianCompletedTicketsList /></RequireAuth>} />
                <Route path="/TicketAssignForm" element={<RequireAuth><TicketAssignForm /></RequireAuth>} />

                <Route path="/InsideSales_Dashboard" element={<RequireAuth><InsideSales_Dashboard /></RequireAuth>} />
                <Route path="/InsideSales_Demo" element={<RequireAuth><InsideSales_Demo /></RequireAuth>}/>
                <Route path="/InsideSales_PetrolAllowance" element={<RequireAuth><InsideSales_PetrolAllowance /></RequireAuth>}/>
                <Route path="/InsideSales_VideosUpload" element={<RequireAuth><InsideSales_VideosUpload /></RequireAuth>}/>
                <Route path="InsideSales_DocumentsUpload" element={<RequireAuth><InsideSales_DocumentsUpload /></RequireAuth>}/>
                <Route path="/InsideSales_FoodAndTravelAllowance" element={<RequireAuth><InsideSales_FoodAndTravelAllowance /></RequireAuth>}/>
                <Route path="/InsideSales_CustomerList" element={<RequireAuth><InsideSales_CustomerList /></RequireAuth>}/>

                <Route path="/InsideSales_DailyReportForm" element={<RequireAuth><InsideSales_DailyReportForm /></RequireAuth>} />
                <Route path="/InsideSales_DailyReportList" element={<RequireAuth><InsideSales_DailyReportList /></RequireAuth>} />
                <Route path="/InsideSales_FeedBackForm" element={<RequireAuth><InsideSales_FeedBackForm /></RequireAuth>} />
                <Route path="/InsideSalesCRM" element={<RequireAuth><InsideSalesCRM /></RequireAuth>} />
                <Route path="/InsideSales_AddBankDetails" element={<RequireAuth><InsideSales_AddBankDetails /></RequireAuth>} />
                <Route path="/InsideSales_InvoiceList" element={<RequireAuth><InsideSales_InvoiceList /></RequireAuth>} />
                <Route path="/InsideSales_PaidInvoiceList" element={<RequireAuth><InsideSales_PaidInvoiceList /></RequireAuth>} />
                <Route path="/InsideSales_UnPaidInvoiceList" element={<RequireAuth><InsideSales_UnPaidInvoiceList /></RequireAuth>} />
                <Route path="/InsideSales_MaterialRequest" element={<RequireAuth><InsideSales_MaterialRequest /></RequireAuth>} />
                <Route path="/InsideSales_QuotationForm" element={<RequireAuth><InsideSales_QuotationForm /></RequireAuth>} />
                <Route path="/InsideSales_AddParty" element={<RequireAuth><InsideSales_AddParty /></RequireAuth>} />
                <Route path="/InsideSales_ItemTable" element={<RequireAuth><InsideSales_ItemTable /></RequireAuth>} />
                <Route path="/InsideSales_QuotationList" element={<RequireAuth><InsideSales_QuotationList /></RequireAuth>} />
                <Route path="/InsideSales_TrainingSession" element={<RequireAuth><InsideSales_TrainingSession /></RequireAuth>} />
                <Route path="/ChangePassword" element={<RequireAuth><ChangePassword /></RequireAuth>} />
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