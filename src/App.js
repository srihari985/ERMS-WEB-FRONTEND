import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import Topbar from "./pages/global/Topbar";
import Dashboard from "./pages/dashboard/dashboard";
import SignIn from "./pages/signin/signin";
import EmployeeRegForm from "./pages/EmployeeRegistration/EmployeeRegistration";

import SalesMaterialRequest from "./pages/Sales_Material_Request/SalesMaterialRequest";
import Demo from "./pages/Demo/Demo"
import SalesDailyReport from "./pages/Sales_DailyReportForm/SalesDailyReportForm";
import PetrolAllowance from "./pages/PetrolAllowance/PetrolAllowance";
import FoodRequestForm from "./pages/FoodRequestForm/FoodRequestForm";
import SalesFeedbackForm from "./pages/SalesFeedBackForm/SalesFeedBackForm";
import QuotationFeedbackForm from "./pages/QuotationFeedbackForm/QuotationFeedbackForm"
import TrainingSection from "./pages/TrainingSection/TrainingSection"
import CustomerForm from "./pages/CustomerForm/CustomerForm";
import QuotationForm from "./pages/QuotationForm/QuotationForm";
import AddParty from "./pages/AddParty/AddParty";
import ItemTable from "./pages/ItemTable/ItemTable"
import SalesDailyReportList from "./pages/Sales_DailyReportList/SalesdailyReportList";
import TravelAllowanceForm from "./pages/FoodAndTravelAllowence/FoodTravelAllowence";
import TechnicianDashboard from "./pages/Technician_Dashboard/technicianDashboard";
import SalesQuationList from "./pages/Sales_QuationList/salesQuationList";
import SelectBankAccount from "./pages/Sales_AddBankDetails/salesAddBankDetils";
import SalesPaidInvoiceList from "./pages/Sales_PaidInvoiceList/SalesPaidInvoiceList"
import SalesUnPaidInvoiceList from "./pages/Sales_UnPaidInvoiceList/SalesUnPaidInvoiceList"


import TechnicianMaterialRequest from "./pages/Technician_MaterialRequest/technicianMaterialRequest";
import TechnicianPetrolAllowance from "./pages/Technician_PetrolAllowance/technicianPetrolAllowance";
import TechnicianFeedbackForm from "./pages/Technician_FeedBackForm/technicianFeedBackForm";
import TechnicianFoodTravelAllowance from "./pages/Technician_FoodAndTravelAllowance/technicianFoodAndTravelAllowance";
import TechnicianTools from "./pages/Technician_ToolsRequirements/technicianToolsRequirements";
import SalesInvoiceList from "./pages/Sales_InvoiceList/saleInvoicelist";
import QuotationSetting from "./pages/QuotationSetting/QuotationSetting"
import ListCustomer from "./pages/ListCustomer/ListCustomer";
import TicketsList from "./pages/TicketsList/TicketsList"
import EmployeeRegistration from "./pages/EmployeeRegistration/EmployeeRegistration";
import TechnicianTrainingSection from "./pages/TechnicianTrainingSection/TechnicianTrainingSection";
import TechnicianNewTickets from "./pages/Technician_NewTickets_List/TechnicianNewTickets";
import TechnicianExistingTicketsList from "./pages/Technician_ExistingTickets_List/TechnicianExistingTicketsList";
import TechnicianPendingTicketsList from "./pages/Technician_PendingTickets_List/TechnicianPendingTicketsList";
import TechnicianCompletedTicketsList from "./pages/Technician_CompletedTickets_List/TechnicianCompletedTicketsList";
import TicketAssignForm from "./pages/TicketAssignFormSales/TicketAssignForm";


import InvoiceTemplate from "./pages/InvoiceTemplate/InvoiceTemplate";
import { AuthProvider } from "./AuthProvider";
import OrganizationForm from "./pages/OrganisationForm/OrganisationForm";
import OrganizationDashboard from "./pages/OrganizationDashboard/OrganizationDashboard";
import OrganizationAdminRegister from "./pages/OganizationAdminRegister/OrganizationAdminRegister";
import AdminDashboard from "./pages/AdminDashboard/adminDashboard";
import AdminManagerRegister from "./pages/AdminManagerRegister/adminManagerRegister";
import ManagerDashboard from "./pages/ManagerDashboard/managerDashboard";
import ManagerSalesManagerRegister from "./pages/ManagerSalesMangerRegister/managerSalesManagerRegister";
import SalesManagerDashboard from "./pages/SalesMangerDashboard/salesManagerDashboard";
import SalesManagerTechnicianRegister from "./pages/SalesManagerTechnicianRegister/salesManagerTechnicianRegister";


import InsideSales_Dashboard from "./pages/InsideSales_Dashboard/InsideSales_Dashboard";
import InsideSales_DailyReportForm from "./pages/InsideSales_DailyReportForm/InsideSales_DailyReportForm";
import InsideSales_DailyReportList from "./pages/InsideSales_DailyReportList/InsideSales_DailyReportList";
import InsideSales_FeedBackForm from "./pages/InsideSales_FeedBackForm/InsideSales_FeedBackForm";
import InsideSalesCRM from "./pages/CRM/InsideSalesCRM";
import InsideSales_AddBankDetails from "./pages/InsideSales_AddBankDetails/InsideSales_AddBankDetails";
import InsideSales_InvoiceList from "./pages/InsideSales_InvoiceList/InsideSales_InvoiceList";
import InsideSales_PaidInvoiceList from "./pages/InsideSales_PaidInvoiceList/InsideSales_PaidInvoiceList";
import InsideSales_UnPaidInvoiceList from "./pages/InsideSales_UnPaidInvoiceList/InsideSales_UnPaidInvoiceList";
import InsideSales_MaterialRequest from "./pages/InsideSales_MaterialRequest/InsideSales_MaterialRequest";
import InsideSales_QuotationForm from "./pages/InsideSales_QuotationForm/InsideSales_QuotationForm";
import InsideSales_AddParty from "./pages/InsideSales_AddParty/InsideSales_AddParty";
import InsideSales_ItemTable from "./pages/InsideSales_ItemTable/InsideSales_ItemTable";
import InsideSales_QuotationList from "./pages/InsideSales_QuotationList/InsideSales_QuotationList";
import InsideSales_TrainingSession from "./pages/InsideSales_TrainingSession/InsideSales_TrainingSession";
import SalesVideosUpload from "./pages/Sales_Videos_Upload/SalesVideosUpload";




const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  
  // Check if the user is authenticated based on the current route
  const checkAuthentication = () => {
    const publicRoutes = ["/", "/OrganizationForm"]; // Define public routes
    const isPublicRoute = publicRoutes.includes(location.pathname);
    setAuthenticated(!isPublicRoute); // If the route is public, user is not authenticated
  };

  // Call checkAuthentication whenever the route changes
  useEffect(() => {
    checkAuthentication();
  }, [location.pathname]);

  return (
    <AuthProvider>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Handle authenticated routes */}
        {authenticated ? (
          <MyProSidebarProvider>
            <div style={{ height: "100%", width: "100%" }}>
              <Topbar />
              <main>
                <Routes>

                <Route path="/SalesVideosUpload" element={<SalesVideosUpload/>}/>
                <Route path="/SalesManagerTechnicianRegister" element={<SalesManagerTechnicianRegister/>}/>
                <Route path="/SalesManagerDashboard" element={<SalesManagerDashboard/>}/>

                <Route path="/ManagerSalesManagerRegister" element={<ManagerSalesManagerRegister/>}/>
               <Route path="/ManagerDashboard" element={<ManagerDashboard/>}/>

                <Route path="/AdminManagerRegister" element={<AdminManagerRegister/>}/>
                <Route path="/AdminDashboard" element={<AdminDashboard/>}/>

               <Route path="/OrganizationDashboard" element={<OrganizationDashboard/>} />
                <Route path="/OrganizationAdminRegister" element={<OrganizationAdminRegister/>}/>

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/SalesMaterialRequest" element={<SalesMaterialRequest/>} />
                  <Route path="/Demo" element={<Demo/>}/>
                  <Route path="/SalesDailyReportForm" element={<SalesDailyReport/>} />
                  <Route path="/SalesDailyReportList" element={<SalesDailyReportList/>} />
                  <Route path="/PetrolAllowance" element={<PetrolAllowance/>} />
                  <Route path="/TravelAllowanceForm" element={<TravelAllowanceForm/>} />
                  <Route path="/EmployeeRegForm" element={<EmployeeRegForm/>}/>
                  <Route path="/FoodRequestForm" element={<FoodRequestForm/>}/>
                  <Route path="/SalesFeedbackForm" element={<SalesFeedbackForm/>}/>
                  <Route path="/QuotationFeedbackForm" element={<QuotationFeedbackForm/>}/>
                  <Route path="/TrainingSection" element={<TrainingSection/>}/>
                  <Route path="/CustomerForm" element={<CustomerForm/>}/>
                  <Route path="/SelectBankAccount" element={<SelectBankAccount/>}/>
                  <Route path="/SalesInvoiceList" element={<SalesInvoiceList/>}/>
                  <Route path="/Addparty" element={<AddParty/>}/>
                  <Route path="/QuotationForm" element={<QuotationForm/>}/>
                  <Route path="/ItemTable" element={<ItemTable/>}/>
                  <Route path="/SalesPaidInvoiceList" element={<SalesPaidInvoiceList/>}/>
                  <Route path="/SalesUnPaidInvoiceList" element={<SalesUnPaidInvoiceList/>}/>
                  {/* <Route path="/QuotationList" element={<QuotationList/>}/> */}
                  <Route path="/SalesQuationList" element={<SalesQuationList/>}/>
                  <Route path="EmpolyeeRegistration" element={<EmployeeRegistration/>}/>
                  

                  <Route path="/TechnicianDashboard" element={<TechnicianDashboard/>}/>
            
                  <Route path="/TechnicianMaterialRequest" element={<TechnicianMaterialRequest/>}/>
                  <Route path="/TechnicianPetrolAllowance" element={<TechnicianPetrolAllowance/>}/>
                  <Route path="/TechnicianFeedbackForm" element={<TechnicianFeedbackForm/>}/>
                  <Route path="/TechnicianFoodTravelAllowance" element={<TechnicianFoodTravelAllowance/>}/>
                  <Route path="/TechnicianTools" element={<TechnicianTools/>}/>
                  <Route path="/QuotationSetting" element={<QuotationSetting/>}/>
                  <Route path="/ListCustomer" element={<ListCustomer/>}/>
                  <Route path="TicketsList" element={<TicketsList/>}/>
                  <Route path="TechnicianTrainingSection" element={<TechnicianTrainingSection/>}/>
                  <Route path="TechnicianNewTickets" element={<TechnicianNewTickets/>}/>
                  <Route path="TechnicianExistingTicketsList" element={<TechnicianExistingTicketsList/>}/>
                  <Route path="TechnicianPendingTicketsList" element={<TechnicianPendingTicketsList/>}/>
                  <Route path="TechnicianCompletedTicketsList" element={<TechnicianCompletedTicketsList/>}/>
                  <Route path="TicketAssignForm" element={<TicketAssignForm/>}/>

                  <Route path="InvoiceTemplate" element={<InvoiceTemplate/>}/>


                  
                  <Route path="/InsideSales_Dashboard" element={<InsideSales_Dashboard/>}/>
                  <Route path="/InsideSales_DailyReportForm" element={<InsideSales_DailyReportForm/>}/>
                  <Route path="/InsideSales_DailyReportList" element={<InsideSales_DailyReportList/>}/>
                  <Route path="/InsideSales_FeedBackForm" element={<InsideSales_FeedBackForm/>}/>
                  <Route path="/InsideSalesCRM" element={<InsideSalesCRM/>}/>
                  <Route path="/InsideSales_AddBankDetails" element={<InsideSales_AddBankDetails/>}/>
                  <Route path="/InsideSales_InvoiceList" element={<InsideSales_InvoiceList/>}/>
                  <Route path="/InsideSales_PaidInvoiceList" element={<InsideSales_PaidInvoiceList/>}/>
                  <Route path="/InsideSales_UnPaidInvoiceList" element={<InsideSales_UnPaidInvoiceList/>}/>
                  <Route path="/InsideSales_MaterialRequest" element={<InsideSales_MaterialRequest/>}/>
                  <Route path="InsideSales_QuotationForm" element={<InsideSales_QuotationForm/>}/>
                  <Route path="/InsideSales_AddParty" element={<InsideSales_AddParty/>}/>
                  <Route path="/InsideSales_ItemTable" element={<InsideSales_ItemTable/>}/>
                  <Route path="/InsideSales_QuotationList" element={<InsideSales_QuotationList/>}/>
                  <Route path="/InsideSales_TrainingSession" element={<InsideSales_TrainingSession/>}/>
              
                </Routes>
              </main>
            </div>
          </MyProSidebarProvider>
        ) : (
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/OrganizationForm" element={<OrganizationForm/>}/>
          </Routes>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
    </AuthProvider>
  );
};

export default App;
