import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
  TablePagination,
  Divider,
} from "@mui/material";
import {
  Add,
  Delete,
  KeyboardBackspace as KeyboardBackspaceIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthProvider";
import { Box } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { GlobalStyles } from "@mui/system";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const QuotationForm = () => {
  // const sid = localStorage.getItem("sId")
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMode, setEditMode] = useState({});
  // const [party, setParty] = useState(null);
  const [selectedParty, setSelectedParty] = useState([]);
  const { AdId, sId, setFid, } = useAuth();

  const [tableData, setTableData] = useState([]); // State to store fetched table data

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // States for showing input fields
  const [showNotes, setShowNotes] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [items, setItems] = useState([]);

  // States for bank details and authorized signature
  const [bankDetails, setBankDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  //Set Total Amount
  const [amount, setTotalAmount] = useState("");
  const location = useLocation();

  // Access the passed state (quotationData)
  const { quotationData } = location.state || {};

  const [invoiceData, setInvoiceData] = useState({
    quotationDate: "",
    paymentTerms: "",
    dueDate: "",
  });

  const [showAdditionalCharges, setShowAdditionalCharges] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState(0); // <-- Initialize state
  const [description, setDescription] = useState(" "); // <-- Initialize state

  //GRAND TOTAL
  const [grandTotal, setGrandTotal] = useState(0);

  //After INvoice Post Method
  const [responseData, setResponseData] = useState({
    quotationNumber: "",
    quotationDate: '',
    paymentTerms: '',
    dueDate: '',
  });

  const [notes, setNotes] = useState('');  // Define 'notes' state
  const [termsAndConditions, setTerms] = useState('');  // Define 'terms' state
  const [isAddItemDisabled, setIsAddItemDisabled] = useState(true);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false); // Track save button disabled state
  
  

  //Bank Details
  useEffect(() => {
    // Get bank details from local storage when the component mounts
    const storedBankDetails = localStorage.getItem("selectedBankDetails");

    // Check if storedBankDetails exists
    if (storedBankDetails) {
      try {
        const parsedDetails = JSON.parse(storedBankDetails); // Parse the stored string back into an object
        setBankDetails(parsedDetails); // Update state with parsed details
      } catch (error) {
        console.error("Failed to parse bank details from localStorage:", error);
      }
    } else {
      console.log("No bank details found in localStorage.");
    }
  }, []); // Empty dependency array means this effect runs once on mount




 // First API: BILL TO SHIP TO GET METHOD
const fetchPartyById = async () => {
  if (!AdId) {
    console.error('AdId is undefined or null');
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/addParty/getPartyById/${AdId}`);
    if (response.ok) {
      const data = await response.json();
      setSelectedParty(prevState => ({
        ...prevState,
        ...data,
      }));
    }
  } catch (error) {
    console.error('Error fetching party data:', error);
  }
};

// Second API: Fetch data from the second API
const fetchAnotherPartyById = async () => {
  if (!quotationData || !quotationData.fId) {
    console.error('quotationData or fId is undefined');
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/quotationList/getByIdAddPartyDetailsOnFid/${quotationData.fId}`);
    if (response.ok) {
      const data = await response.json();
      setSelectedParty(prevState => ({
        ...prevState,
        ...data,
      }));
    }
  } catch (error) {
    console.error('Error fetching another party data:', error);
  }
};

// useEffect to check if the component was navigated to from another component
useEffect(() => {
  // Check if quotationData exists and has fId
  if (quotationData && quotationData.fId) {
    // If we have quotationData, call the second API
    fetchAnotherPartyById();
  } else {
    // Call the first API if accessed directly
    fetchPartyById();
  }
}, [quotationData, AdId]);




  // Calculate the number of days between quotationDate and dueDate
  const calculatePaymentTerms = (quotationDate, dueDate) => {
    if (quotationDate && dueDate) {
      const date1 = new Date(quotationDate);
      const date2 = new Date(dueDate);
      const timeDifference = date2 - date1;
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      // Only update if the difference is positive (valid date range)
      setInvoiceData((prevData) => ({
        ...prevData,
        paymentTerms: daysDifference > 0 ? daysDifference : "",
      }));
    }
  };
  // Handle Quotation Date change
  const handleQuotationDateChange = (e) => {
    const newQuotationDate = e.target.value;
    setInvoiceData((prevData) => ({
      ...prevData,
      quotationDate: newQuotationDate,
    }));
    calculatePaymentTerms(newQuotationDate, invoiceData.dueDate);
  };

  // Handle Due Date change
  const handleDueDateChange = (e) => {
    const newDueDate = e.target.value;
    setInvoiceData((prevData) => ({
      ...prevData,
      dueDate: newDueDate,
    }));
    calculatePaymentTerms(invoiceData.quotationDate, newDueDate);
  };



  //INVOICE POST METHOD
  const InvoiceFormHandleSubmit = async () => {
    setIsSaving(true); // Disable the button while saving
    console.log("I am response data:", JSON.stringify(responseData, null, 2));
  // Save the button disabled state in localStorage
  localStorage.setItem("isSaveButtonDisabled", "true");
  localStorage.setItem("isAddItemDisabled", "true"); // Disable "Add Item" button

  setIsSaveButtonDisabled(true); // Disable the button
  setIsAddItemDisabled(true); // Disable the "Add Item" button


    
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/form/save/${AdId}/${sId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responseData), // Use responseData for the request body
      });
  
      // Check if the response is successful
      if (response.status === 201) {
        const result = await response.json(); // Parse the response
  
        // Store fId in localStorage instead of state
        localStorage.setItem("fId", result.fId); // Store fId in local storage
        console.log("fId stored in localStorage: " + result.fId);
        
         // Enable the "Add Item" button after the second API call
      localStorage.setItem("isAddItemDisabled", "false");
      setIsAddItemDisabled(false); // Enable the "Add Item" button
  
        // Show success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Submitted successfully!',
          text: 'Your data has been saved.',
          timer: 1000, // Auto-close after 1 second
          showConfirmButton: false, // Hide the confirm button
        });
      } else {
        // Show error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Failed to submit',
          text: 'Please try again.',
          timer: 1000, // Auto-close after 1 second
          showConfirmButton: false, // Hide the confirm button
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
  
      // Show error toast in case of exception
      toast.error("Error occurred while saving.", {
        position: "top-right",
        autoClose: 1000,
      });
    } finally {
      setIsSaving(false); // Enable the button again
    }
  };
  
  useEffect(() => {
    // Check if the button should be disabled when the component mounts
    const isButtonDisabled = localStorage.getItem("isSaveButtonDisabled");
    if (isButtonDisabled) {
      setIsSaveButtonDisabled(true);
    }
  }, []);

  useEffect(() => {
    const isAddItemDisabledFromStorage = localStorage.getItem("isAddItemDisabled");
    if (isAddItemDisabledFromStorage === "true") {
      setIsAddItemDisabled(true);
    } else {
      setIsAddItemDisabled(false);
    }
  }, []);



  // Fetch Invoice Data
  const fetchInvoiceData = async (fIdToUse) => {
    console.log("Fetching with fId:", fIdToUse); // Log fId being used in the API request
    if (!fIdToUse) {
      console.error("fId is undefined. Cannot fetch data.");
      return; // Early return if fId is undefined
    }
  
    setIsLoadingInvoice(true); // Start loading for invoice data
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/form/getById/${fIdToUse}`);
      if (response.ok) {
        const data = await response.json();
        setResponseData({
          quotationNumber: data.quotationNumber || "",
          quotationDate: data.quotationDate || "",
          paymentTerms: data.paymentTerms || "",
          dueDate: data.dueDate || "",
        });
      } else {
        console.error("Failed to fetch invoice data");
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    } finally {
      setIsLoadingInvoice(false); // End loading for invoice data
    }
  };
  
  useEffect(() => {
    // Get the fId from localStorage
    const fIdFromLocalStorage = localStorage.getItem("fId");
  
    // Get the fId from quotationData or fallback to the fId from localStorage
    const fIdToUse1 = quotationData?.fId || fIdFromLocalStorage;
  
    // Log to track values before calling fetch
    console.log("fIdToUse1:", fIdToUse1);
  
    // Check if fIdToUse1 is available, if so, fetch invoice data
    if (fIdToUse1) {
      fetchInvoiceData(fIdToUse1); // Fetch data using fIdToUse1
    } else {
      console.error("fIdToUse1 is undefined, cannot fetch data");
    }
  }, [quotationData]); // Depend on quotationData changes
  


  const getFormattedDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extracts only the 'YYYY-MM-DD' part
  };



  //QUOTATION Itmes TABLE---- GET METHOD
  const fetchTableData = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      
      // Access the passed state (quotationData) from another component
      const { quotationData } = location.state || {};
      const localStorageFId = localStorage.getItem("fId");
  
      // Determine which API to call based on the presence of quotationData
      let apiUrl;
      if (quotationData && quotationData.fId) {
        apiUrl = `${baseUrl}/api/itemSalesTable/getfinalItems/${quotationData.fId}`;
      } else {
        apiUrl = `${baseUrl}/api/itemSalesTable/getfinalItems/${localStorageFId}`; // Default API
      }
  
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setItems(data); // Store the fetched data in the state
        setTableData(data);
        fetchInvoiceData(); // Additional fetch if needed
      } else {
        console.error("Failed to fetch table data");
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  
  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchTableData();
  }, []);


  

  const handleChange = (event) => {
    // Handle input changes here
    const { name, value } = event.target;
    setResponseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddItemClick = () => {
    navigate("/ItemTable", { state: { quotationData } });
  };

  const handleChangeParty = () => {
    navigate("/AddParty");
  };



  //Items Table
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Recalculate amount if any of the relevant fields are updated
    if (["priceItem", "discount", "tax", "qty"].includes(field)) {
      const price = parseFloat(updatedItems[index].priceItem) || 0;
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const discount = parseFloat(updatedItems[index].discount) || 0;
      const tax = parseFloat(updatedItems[index].tax) || 0;

      updatedItems[index].amount = calculateAmount(price, qty, discount, tax);
    }

    setItems(updatedItems);
    setTableData(updatedItems);
  };







  //Edit mode for Item Table
  const toggleEditMode = (index, field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [index]: {
        ...prevEditMode[index],
        [field]: !prevEditMode[index]?.[field], // Toggle the field edit mode
      },
    }));
  };

  const calculateAmount = (price, qty, discount, tax) => {
    const discountAmount = price * qty * (discount / 100) || 0;
    const taxableAmount = price * qty - discountAmount;
    const taxAmount = taxableAmount * (tax / 100) || 0;
    return taxableAmount + taxAmount;
  };



  

//Itmes Table Update Method
  const handleUpdate = async () => {
    // Create a comma-separated string of item IDs
    const itemIds = items.map((item) => item.itId).join(","); // Join IDs with commas
    console.log("Item IDs: " + itemIds);
  
    // Create an array to hold all item objects
    const itemDataArray = items.map((item) => ({
      items: item.items,
      hsn: item.hsn,
      qty: item.qty,
      priceItem: item.priceItem,
      discount: item.discount,
      tax: item.tax,
      amount: item.amount,
      saleDate: item.saleDate,
    }));
  
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      
      // Access quotationData from location.state
      const { quotationData } = location.state || {};
      const localStorageFId = localStorage.getItem("fId");
  
      // Determine which API URL to use based on the presence of quotationData
      let apiUrl;
      if (quotationData && quotationData.fId) {
        // Use fId from quotationData if coming from another component
        apiUrl = `${baseUrl}/api/itemSalesTable/updateItems/${quotationData.saleId}/${quotationData.adId}/${quotationData.fId}?itIds=${itemIds}`;
      } else {
        // Use fId from localStorage or other context if accessing directly
        apiUrl = `${baseUrl}/api/itemSalesTable/updateItems/${sId}/${AdId}/${localStorageFId}?itIds=${itemIds}`;
      }
  
      const response = await fetch(apiUrl, {
        method: "PATCH",
        body: JSON.stringify(itemDataArray), // Send the item data array
        headers: {
          "Content-Type": "application/json", // Ensure Content-Type is JSON
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Uncomment and replace with your token if required
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("i am total amount response :" + result);
        setTotalAmount(result);
        handleSubmit1();
        // Show success toast notification
        toast.success("Updated successfully!", {
          position: "top-right",
          autoClose: 1000, // Display for 1 seconds
        });
      } else {
        toast.error("Failed to Update. Please try again.", {
          position: "top-right",
          autoClose: 1000, // Display for 2 seconds
        });
        console.error("Update failed", response.statusText);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  


  // Delete item function
  const handleDeleteItem = async (index) => {
    const itemId = items[index].itId; // Assuming id exists on each item
    console.log("i am itemID :" + itemId);

    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // Proceed with deletion
      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(
          `${baseUrl}/api/itemSalesTable/${itemId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // If the item was successfully deleted, remove it from the UI
          const updatedItems = [...items];
          updatedItems.splice(index, 1);
          setItems(updatedItems);
          setTableData(updatedItems);
          // Success alert
          Swal.fire("Deleted!", "Your item has been deleted.", "success");
        } else {
          // Handle error response
          Swal.fire("Error", "There was a problem deleting the item.", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        Swal.fire(
          "Error",
          "There was a problem connecting to the server.",
          "error"
        );
      }
    }
  };


  // POST Method for Add notes and Terms and Cobditions
  const handleSaveData = async () => {
    // Create a new FormData object
    const formData = new FormData();
  
    // Append data fields to the FormData object
    formData.append('notes', notes);  // Append notes
    formData.append('termsAndConditions', termsAndConditions);  // Append terms and conditions
  
    try {
      const localStorageFId = localStorage.getItem("fId");
      const response = await fetch(`${baseUrl}/api/TermsAndConditions/save/${sId}/${localStorageFId}`, {
        method: 'POST',
        body: formData,  // Use the formData object as the body
      });
  
      if (response.ok) {
        // Show success toast notification
        // toast.success('Data saved successfully!', {
        //   position: "top-right",  // You can change position as needed
        //   autoClose: 1000,  // Close after 3 seconds
        // });
        console.log('Data saved successfully');
      } else {
        // Show error toast notification
        // toast.error('Failed to save data.', {
        //   position: "top-right",
        //   autoClose: 1000,
        // });
        console.error('Failed to save data');
      }
    } catch (error) {
      // Show error toast notification for catch block
      // toast.error('An error occurred while saving data.', {
      //   position: "top-right",
      //   autoClose: 1000,
      // });
      console.error('Error while saving data:', error);
    }
  };


  //Terms and Conditions Get Method
  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/TermsAndConditions/get/${quotationData.fId}`);
        if (response.ok) {
          const data = await response.json();
          // Set fetched data into state fields
          setNotes(data.notes || '');
          setTerms(data.termsAndConditions || '');
        } else {
          console.error('Failed to fetch terms and conditions');
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
      }
    };
  
    // Check if quotationData and quotationData.fId exist before calling the fetch function
    if (quotationData && quotationData.fId) {
      fetchTermsAndConditions();
    } else {
      console.warn('Quotation data or fId is missing.');
    }
  }, [quotationData]);  // If quotationData changes, useEffect will rerun
  



  // Function to handle the PATCH request to update Terms and Conditions
    const handleUpdateTermsAndConditions = async () => {
      if (!quotationData?.fId) {
        console.error('Quotation ID (fId) is missing');
        return;
      }

      const data = {
        notes: notes,
        termsAndConditions: termsAndConditions,
      };

      try {
        const response = await fetch(`${baseUrl}/api/TermsAndConditions/update/${quotationData.fId}`, {
          method: 'PATCH',  // Use PATCH method
          headers: {
            'Content-Type': 'application/json',  // Set the Content-Type header to JSON
          },
        body: JSON.stringify(data),  // Send form data in the request body
        });

        if (response.ok) {
          // Successfully updated
          // toast.success('Terms and Conditions updated successfully!', {
          //   position: 'top-right',
          //   autoClose: 1000,  // Close after 1 second
          // });
          console.log('Terms and Conditions updated successfully');
        } else {
          // Handle failure
          const errorText = await response.text();
          // toast.error(`Failed to update: ${errorText}`, {
          //   position: 'top-right',
          //   autoClose: 1000,
          // });
          console.error('Failed to update terms and conditions');
        }
      } catch (error) {
        // Handle errors in the catch block
        // toast.error('An error occurred while updating', {
        //   position: 'top-right',
        //   autoClose: 1000,
        // });
        console.error('Error while updating terms and conditions:', error);
      }
    };


  const handleFieldBlur = () => {
    // Check if both fields are filled
    // if (additionalCharges && description) {
    //   handleSubmit1();
    // }
    handleSubmit1();
   

  };

  // Handle PATCH method for Additional charges
  const handleSubmit1 = async () => {
    const data = {
      additionalCharges: additionalCharges,
      description: description,
    };

    try {
      const localStorageFId = localStorage.getItem("fId");
     
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      let apiUrl;
      if (quotationData && quotationData.fId) {
        apiUrl= `${baseUrl}/api/itemsTotal/update/${quotationData.fId}?additionalCharges=${additionalCharges}&description=${description}`
        
      }else {
        // Use fId from localStorage or other context if accessing directly
        apiUrl = `${baseUrl}/api/itemsTotal/update/${localStorageFId}?additionalCharges=${additionalCharges}&description=${description}`;
      }
      const response = await fetch(apiUrl,
        {
          method: "PATCH", // Use PATCH instead of POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setGrandTotal(result);
      console.log("PATCH successful", result);
    } catch (error) {
      console.error("PATCH failed", error);
    }
  };

  //REMOVE DELETE BANK ACCOUNT DETAILS
  const handleRemoveBankAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this bank account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove bank details from local storage
        localStorage.removeItem("selectedBankDetails");
        setBankDetails(null); // Clear the state
        toast.success("Bank Account Deleted successfully!", {
          position: "top-right", // Correct usage of position
          autoClose: 1000, // Display for 2 seconds
        });
      }
    });
  };

 // QUOTATION SAVE METHOD
const handleSaveQuotation = async () => {
  // Show confirmation dialog
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, save it!",
  });

  if (!isConfirmed) {
    return; // Exit if the user cancels
  }

  
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const localStorageFId = localStorage.getItem("fId");

  try {
    let response;
    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    if (quotationData) {
      response = await fetch(`${baseUrl}/api/quotationList/update/quotation/${quotationData.fId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationNumber: quotationData.quotationNumber,
          quotationDate: todayDate,
          dueDate: quotationData.dueDate,
          customerName: quotationData.customerName,
          grandTotal: grandTotal.grandTotal,
        }),
      });

      if (response.ok) {
        toast.success("Quotation updated successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        localStorage.removeItem("isSaveButtonDisabled"); // Enable the button after updating

        localStorage.removeItem("isAddItemDisabled");
        navigate("/SalesQuationList");
        await handleUpdateTermsAndConditions();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to update quotation: ${errorText}`, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } else {
      response = await fetch(
        `${baseUrl}/api/quotationList/createQuotation/${sId}/${AdId}/${localStorageFId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quotationNumber: "newQuotationNumber",
            quotationDate: todayDate,
            dueDate: "2024-11-01", // Example date
            customerName: "Customer Name",
            grandTotal: grandTotal.grandTotal,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Quotation saved successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/SalesQuationList");
          handleSaveData(); // Call the save function for terms and conditions
        }, 2000); // Delay matches the autoClose duration of the toast
      } else {
        const errorText = await response.text();
        toast.error(`Failed to save quotation: ${errorText}`, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    }
  } catch (error) {
    toast.error(`Error saving quotation: ${error.message}`, {
      position: "top-right",
      autoClose: 1000,
    });
  } finally {
    setIsLoading(false);
    setIsSaveButtonDisabled(false); // Enable the button after the process completes
  }
};
  
  
  

  return (
    <Card
      style={{
        margin: "20px",
        marginTop: "6%",
        backgroundColor: "white",
        // marginRight: '10px',
        marginLeft: "20px",
      }}
    >
      <Grid
        container
        spacing={2}
        style={{ marginTop: "2%", margin: "auto" }}
        alignItems="center"
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item container alignItems="center" xs>
            <IconButton
              onClick={() => navigate("/SalesQuationList")}
              sx={{ color: "#2e2a54" }}
            >
              <KeyboardBackspaceIcon fontSize="inherit" />
            </IconButton>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ marginTop: "7px", fontWeight: "bold" }}
            >
              Quotation Form
            </Typography>
          </Grid>

          {/* Submit Button */}
          <Grid item style={{ marginRight: "40px", marginTop: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuotation}
            disabled={isLoading}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#3f51b5",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px 20px",
              margin: "auto",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            {isLoading
              ? "Loading..."
              : quotationData
              ? "Update Quotation"
              : "Save Quotation"}
          </Button>
        </Grid>
        </Grid>
      
      </Grid>

      <CardContent
        sx={{
          border: "2px solid #2e2a54", // Add a solid border with custom color
          borderRadius: "8px", // Optional: to give a rounded border look
          margin: "15px",
        }}
      >
        <Grid container spacing={1}>
          {/* Bill To Section */}
          <Grid item xs={12} md={4}>
            <Grid
              container
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Button
                onClick={handleChangeParty}
                size="small"
                style={{
                  color: "black",
                  border: "2px solid",
                  width: "120px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Add Party
              </Button>
            </Grid>

            {/* Bill To Section */}
            <Typography variant="h5" fontWeight="bold">
              Bill To
            </Typography>
            <Card
              sx={{
                padding: "3%",
                width: "95%",
                height: "66%",
                paddingTop: "8%",
                border: "2px dashed skyblue",
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: "1rem" }}>
                    <strong>Billing Name:</strong>
                    <span style={{ marginLeft: "35px" }}>
                      {selectedParty?.customerName || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "1rem" }}>
                    <strong>Mobile Number:</strong>
                    <span style={{ marginLeft: "17px" }}>
                      {selectedParty?.mobileNumber || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "1rem" }}>
                    <strong>GSTIN:</strong>
                    <span style={{ marginLeft: "83px" }}>
                      {selectedParty?.gstIn || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "1rem" }}>
                    <strong>Billing Address:</strong>
                    <span style={{ marginLeft: "20px" }}>
                      {selectedParty?.billingAddress || "N/A"}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Ship To Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" mt={7} fontWeight="bold">
              Ship To
            </Typography>
            <Card
              sx={{
                padding: "3%",
                width: "120%",
                height: "66%",
                paddingTop: "9%",
                border: "2px dashed skyblue",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: "1rem", marginBottom: "3px" }}>
                    <strong>Shipping Name:</strong>
                    <span style={{ marginLeft: "32px" }}>
                      {selectedParty?.customerName || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", marginBottom: "3px" }}>
                    <strong>Shipping Address:</strong>
                    <span style={{ marginLeft: "15px" }}>
                      {selectedParty?.shippingAddress || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", marginBottom: "3px" }}>
                    <strong>Shipping Pincode:</strong>
                    <span style={{ marginLeft: "17px" }}>
                      {selectedParty?.shippingPincode || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", marginBottom: "3px" }}>
                    <strong>Shipping State:</strong>
                    <span style={{ marginLeft: "33px" }}>
                      {selectedParty?.shippingState || "N/A"}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <ToastContainer />

          {/* Combined Invoice and Payment Details Section */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              border: "1px dashed #bfbdbd",
              borderRadius: "8px",
              marginTop: "18px",
              padding: "10px",
              marginBottom: "5px",
              marginLeft: "7%",
            }}
          >
            {/* Container Title */}
            <Typography
              variant="h6"
              mb={2}
              sx={{ fontWeight: "bold", color: "#535556" }}
            >
              Invoice & Payment Details
            </Typography>

            {/* Form Grid Container */}
            <Grid container spacing={2}>
              {/* Display Quotation Number (Non-editable field) */}
              <Grid item xs={12} marginTop={1}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#535556",
                  }}
                >
                  Quotation Number
                </Typography>
                <Typography
                  sx={{
                    backgroundColor: "#F5F5F5",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  {responseData.quotationNumber || "Not available"}
                </Typography>
              </Grid>

              {/* Quotation Date Input */}
              <Grid item xs={12} md={6} marginTop={1}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#535556",
                  }}
                >
                  Quotation Date
                </Typography>
                <input
                  type="date"
                  name="quotationDate"
                  value={responseData.quotationDate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#DEDEDF",
                  }}
                  disabled={isLoading} // Disable input when loading
                />
              </Grid>

              {/* Due Date Input */}
              <Grid item xs={12} md={6} marginTop={1}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#535556",
                  }}
                >
                  Due Date
                </Typography>
                <input
                  type="date"
                  name="dueDate"
                  value={responseData.dueDate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#DEDEDF",
                  }}
                  disabled={isLoading} // Disable input when loading
                />
              </Grid>

              {/* Payment Terms Input */}
              <Grid item xs={12} md={6} marginTop={1}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#535556",
                  }}
                >
                  Payment Terms (Days)
                </Typography>
                <input
                  type="text"
                  name="paymentTerms"
                  value={responseData.paymentTerms}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#DEDEDF",
                  }}
                  disabled={isLoading} // Disable input when loading
                />
                 
              </Grid>
            

              {/* Save Button */}
              <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
  variant="contained"
  color="success"
  sx={{
    marginTop: "10px",
    opacity: isSaving || isLoadingInvoice || isSaveButtonDisabled ? 0.5 : 1,
    pointerEvents: isSaving || isLoadingInvoice || isSaveButtonDisabled ? "none" : "auto",
  }}
  onClick={InvoiceFormHandleSubmit}
  disabled={isSaveButtonDisabled || isLoadingInvoice || isSaving} // Disable if saving, loading, or button state is disabled
>
  {isSaving ? "Saving..." : "Save"}
</Button>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <GlobalStyles
          styles={{
            '.custom-sidebar-scrollbar': {
              scrollbarWidth: 'thin', // For Firefox
              scrollbarColor: 'grey #e0e0e0',
            },
            '.custom-sidebar-scrollbar::-webkit-scrollbar': {
              width: '6px', // For WebKit-based browsers
            },
            '.custom-sidebar-scrollbar::-webkit-scrollbar-track': {
              background: '#f1f1f1', // Track color
            },
            '.custom-sidebar-scrollbar::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey', // Thumb color
              borderRadius: '10px',
            },
            '.custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
          }}
        />

        {/* Item Table */}
        <Grid item xs={12} marginTop={"20px"}>
          <TableContainer component={Paper} style={{ maxHeight: '408px', overflowY: 'auto' }} className="custom-sidebar-scrollbar">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    NO
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    ITEMS
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    HSN
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    QTY
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    PRICE/ITEM
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    DISCOUNT IN (%)
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    TAX IN (%)
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    AMOUNT
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#000",
                      border: "1px solid #ACB4AE",
                      textAlign: "center",
                      backgroundColor: "#A1F4BD",
                    }}
                  >
                    DELETE
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        onClick={() => toggleEditMode(index, "items")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.items ? (
                          <>
                            <TextField
                              value={item.items}
                              onChange={(e) =>
                                handleItemChange(index, "items", e.target.value)
                              }
                              onBlur={() => toggleEditMode(index, "items")}
                              autoFocus
                            />
                            <TextField
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                toggleEditMode(index, "description")
                              }
                              autoFocus
                              sx={{ mt: 1 }} // Optional margin for spacing between fields
                            />
                          </>
                        ) : (
                          <>
                            <Typography>{item.items}</Typography>
                            <Typography color="textSecondary">
                              {item.description}
                            </Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => toggleEditMode(index, "hsn")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.hsn ? (
                          <TextField
                            value={item.hsn}
                            onChange={(e) =>
                              handleItemChange(index, "hsn", e.target.value)
                            }
                            onBlur={() => toggleEditMode(index, "hsn")}
                            autoFocus
                            style={{ backgroundColor: "#DEDEDF" }}
                          />
                        ) : (
                          <Typography>{item.hsn}</Typography>
                        )}
                      </TableCell>

                      <TableCell
                        onClick={() => toggleEditMode(index, "qty")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.qty ? (
                          <TextField
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(index, "qty", e.target.value)
                            }
                            onBlur={() => toggleEditMode(index, "qty")}
                            autoFocus
                            style={{ backgroundColor: "#DEDEDF" }}
                          />
                        ) : (
                          <Typography>{item.qty}</Typography>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => toggleEditMode(index, "priceItem")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.priceItem ? (
                          <TextField
                            type="number"
                            value={item.priceItem}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "priceItem",
                                e.target.value
                              )
                            }
                            onBlur={() => toggleEditMode(index, "priceItem")}
                            autoFocus
                            style={{ backgroundColor: "#DEDEDF" }}
                          />
                        ) : (
                          <Typography>{item.priceItem}</Typography>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => toggleEditMode(index, "discount")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.discount ? (
                          <TextField
                            type="number"
                            value={item.discount}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "discount",
                                e.target.value
                              )
                            }
                            onBlur={() => toggleEditMode(index, "discount")}
                            autoFocus
                            style={{ backgroundColor: "#DEDEDF" }}
                          />
                        ) : (
                          <Typography>{item.discount}</Typography>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => toggleEditMode(index, "tax")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.tax ? (
                          <TextField
                            type="number"
                            value={item.tax}
                            onChange={(e) =>
                              handleItemChange(index, "tax", e.target.value)
                            }
                            onBlur={() => toggleEditMode(index, "tax")}
                            autoFocus
                            style={{ backgroundColor: "#DEDEDF" }}
                          />
                        ) : (
                          <Typography>{item.tax}</Typography>
                        )}
                      </TableCell>
                      {/* Amount Cell */}
                      {/* <TableCell onClick={() => toggleEditMode(index, 'amount')} sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '15px' }}>
                      {editMode[index]?.amount ? (
                        <TextField
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const newAmount = Number(e.target.value);
                            handleItemChange(index, 'amount', newAmount);

                            // Get the discount percentage and tax rate
                            // const discountPercentage = item.discount || 0; // Get discount percentage
                            const taxRate = item.tax / 100; // Convert percentage to decimal

                            // // Calculate discount amount
                            // const discountAmount = newAmount * (discountPercentage / 100);

                            // // Calculate amount after discount
                            // const amountAfterDiscount = newAmount - discountAmount;

                            // // Calculate Price/Item based on amount after discount and tax
                            // const newPriceItem = amountAfterDiscount / (1 - taxRate); // Apply tax after discount
                          
                            const newPriceItem=newAmount / (1+(taxRate))


                            // Update Price/Item
                            setItems((prevItems) => {
                              const updatedItems = [...prevItems];
                              updatedItems[index] = {
                                ...updatedItems[index],
                                priceItem: newPriceItem.toFixed(2), // Set new Price/Item
                              };
                              return updatedItems;
                            });
                          }}
                          onBlur={() => toggleEditMode(index, 'amount')}
                          autoFocus
                          style={{ backgroundColor: '#DEDEDF' }}
                        />
                      ) : (
                        <Typography>{item.amount}</Typography>
                      )}
                    </TableCell> */}

                      <TableCell
                        onClick={() => toggleEditMode(index, "amount")}
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {editMode[index]?.amount ? (
                          <TextField
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const newAmount = Number(e.target.value);
                              handleItemChange(index, "amount", newAmount);

                              // Get the discount percentage and tax rate
                              const taxRate = item.tax / 100; // Convert percentage to decimal

                              const newPriceItem = newAmount / (1 + taxRate);

                              // Update Price/Item
                              setItems((prevItems) => {
                                const updatedItems = [...prevItems];
                                updatedItems[index] = {
                                  ...updatedItems[index],
                                  priceItem: newPriceItem.toFixed(2), //Set new Price/Item
                                };
                                return updatedItems;
                              });
                            }}
                            onBlur={() => toggleEditMode(index, "amount")}
                            autoFocus
                            style={{ backgroundColor: "#DEDEDF" }}
                          />
                        ) : (
                          // Calculate the amount to show before edit mode
                          <Typography>
                            {(
                              item.priceItem *
                              item.qty *
                              (1 - item.discount / 100) *
                              (1 + item.tax / 100)
                            ).toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell
                        sx={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        <IconButton
                          onClick={() => handleDeleteItem(index)}
                          style={{ color: "red" }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "10px",
            }}
          >
            {/* Left aligned Add Item button */}
            <Button
              onClick={handleAddItemClick}
              variant="contained"
              color="primary"
              disabled={isAddItemDisabled} // Bind the disabled state
            >
              <Add /> Add Item
            </Button>

            {/* Right aligned Update button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#A1F4BD",
                color: "black",
                "&:hover": {
                  backgroundColor: "#90EFB0",
                },
              }}
              onClick={handleUpdate} // Call the update function
              disabled={isUpdating} // Disable the button while saving
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </Box>
        </Grid>

        {/* Sub Total */}
        <Grid
          item
          xs={12}
          sx={{
            marginTop: "20px",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid
              item
              sx={{
                textAlign: "right",
                padding: "10px",
                borderRight: "1px solid #ccc",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333", fontSize: "20px" }}
              >
                Amount: ₹ {amount.amount}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                textAlign: "right",
                padding: "10px",
                borderRight: "1px solid #ccc",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "normal", color: "#555", fontSize: "20px" }}
              >
                Discount: ₹ {amount.totalDiscount}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                textAlign: "right",
                padding: "10px",
                borderRight: "1px solid #ccc",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "normal", color: "#555", fontSize: "20px" }}
              >
                Tax: ₹ {amount.totalTax}
              </Typography>
            </Grid>
            <Grid item sx={{ textAlign: "right", padding: "10px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#d9534f",
                  marginRight: "80px",
                  fontSize: "20px",
                }}
              >
                Total Amount: ₹ {amount.totalAmount}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Additional Charges */}
        <Grid item xs={12} sx={{ marginTop: "20px" }}>
      {/* Main container with two sections: Left for Notes & Terms, Right for Additional Charges */}
           <Grid container spacing={2} sx={{ marginTop: "10px" }}
           
           >
     
         {/* Left Section (Notes and Terms and Conditions) */}
        <Grid item xs={6}>
              {/* Notes Section */}
              {showNotes ? (
                  <TextField
                label="Notes"
                fullWidth
                value={notes}  // Display the fetched notes
                onChange={(e) => setNotes(e.target.value)}  // Update state on input change
                autoFocus
                multiline  // Enables textarea functionality
                minRows={2}  // Minimum number of rows (adjust based on preference)
                maxRows={20}  // Maximum number of rows before scrolling is enabled
                variant="outlined"  // Optional: Adds outlined styling
                inputProps={{ style: { whiteSpace: 'pre-wrap' } }}  // Ensures text wrapping
              />
            ) : (
              <Button
                color="secondary"
                onClick={() => setShowNotes(true)}  // Show the input field when clicked
                size="large"
                sx={{ fontSize: '1rem' }}
              >
                + Add Notes
              </Button>
            )}



         
          {/* Terms and Conditions Section */}
            <Grid item xs={12} sx={{ marginTop: '10px' }}>
              {showTerms ? (
                <TextField
                  label="Terms and Conditions"
                  fullWidth
                  value={termsAndConditions}  // Display the fetched terms and conditions
                  onChange={(e) => setTerms(e.target.value)}  // Update state on input change
                  autoFocus
                  multiline  // Enables textarea functionality
                  minRows={2}  // Minimum rows (can be set to whatever you prefer)
                  maxRows={20}  // Optional: Set maximum rows, after which it will scroll
                  variant="outlined"  // Optional: outlined styling
                  inputProps={{ style: { whiteSpace: 'pre-wrap' } }}  // Ensures line breaks are respected
                />
              ) : (
                <Button
                  color="secondary"
                  onClick={() => setShowTerms(true)}  // Show the input field when clicked
                  size="large"
                  sx={{ fontSize: '1rem' }}
                >
                  + Add Terms and Conditions
                </Button>
              )}
            </Grid>
      
        </Grid>



        {/* Vertical Divider */}
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderRightWidth: 1, height: "100%" }}
          />
    </Grid>

    {/* Right Section (Additional Charges and Description) */}
    <Grid item xs={5}>
      {showAdditionalCharges ? (
        <Grid container spacing={2}>
          {/* Additional Charges Input */}
          <Grid item xs={6}>
            <TextField
              label="Additional Charges"
              fullWidth
              value={additionalCharges}  // Ensure 'additionalCharges' state is defined
              onChange={(e) => setAdditionalCharges(e.target.value)} // Correctly updating state
              onBlur={handleFieldBlur} // Call handleFieldBlur on blur
              autoFocus
            />
          </Grid>

          {/* Description Input */}
          <Grid item xs={6}>
            <TextField
              label="Description"
              fullWidth
              value={description}  // Ensure 'description' state is defined
              onChange={(e) => setDescription(e.target.value)} // Correctly updating state
              onBlur={handleFieldBlur} // Call handleFieldBlur on blur
            />
          </Grid>
        </Grid>
      ) : (
        // Show button to toggle the input fields
        <Button
          color="secondary"
          onClick={() => setShowAdditionalCharges(true)} // Show the fields when clicked
          size="large"
          sx={{ fontSize: "1rem" }}
        >
          + Add Additional Charges
        </Button>
      )}
    </Grid>
  </Grid>

  {/* Grand Total */}
  <Grid item xs={12} sx={{ marginTop: "20px", marginRight: "30px" }}>
    <Grid container spacing={2} justifyContent="flex-end">
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#d9534f", fontSize: "25px" }}
      >
        Grand Total: ₹ {grandTotal.grandTotal}
      </Typography>
    </Grid>
  </Grid>

  {/* Horizontal Line */}
  <Grid item xs={12} sx={{ marginTop: "20px" }}>
    <hr style={{ border: "1px solid #ccc" }} />
  </Grid>
</Grid>



        {/*Bank Details */}
        <Grid container spacing={2} sx={{ marginTop: "20px" }}>
          {/* Bank Details Section */}
          <Grid item xs={12} sm={6} sx={{ paddingLeft: "39px" }}>
            {/* Header for Bank Details */}
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                marginBottom: "5px",
                textDecoration: "underline",
                color: "#4381E6",
              }}
            >
              Bank Details
            </Typography>

            {/* Display Bank Details if available */}
            {bankDetails && ( // Check if bankDetails is not null before accessing its properties
              <>
                <Typography sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                  <strong>Account Number:</strong> {bankDetails.accountNumber}
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                  <strong>IFSC Code:</strong> {bankDetails.ifscCode}
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                  <strong>Bank & Branch Name:</strong> {bankDetails.bankName},{" "}
                  {bankDetails.branchName}
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                  <strong>Account Holder Name:</strong>{" "}
                  {bankDetails.accountHolderName}
                </Typography>
              </>
            )}

            {/* Container for buttons to place them side by side */}
            <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
              {/* Button to Add Bank Details */}
              <Grid item>
                <Button
                  color="secondary"
                  onClick={() => navigate("/SelectBankAccount")}
                  size="large"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  + Add Bank Details
                </Button>
              </Grid>

              {/* Button to Remove Bank Account */}

              <Grid item>
                <Button
                  variant="text"
                  color="error"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                  onClick={handleRemoveBankAccount}
                >
                  Remove Bank Account
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Authorized Signature Section */}
          <Grid
            item
            xs={12}
            sm={6}
            container
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Typography sx={{ marginTop: "20px", fontSize: "1rem" }}>
                Authorized Signature for <strong>Map Technos</strong>
              </Typography>
              {/* Image at the top right */}
              <img
                src="../assets/mapStamp.jpg" // Replace with the actual path to your image
                alt="Authorized Signatory"
                style={{
                  maxWidth: "23%", // Set a maximum width for the image
                  marginBottom: "10px",
                  marginRight: "7%",
                  marginTop: "2%", // Add margin below the image
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuotationForm;