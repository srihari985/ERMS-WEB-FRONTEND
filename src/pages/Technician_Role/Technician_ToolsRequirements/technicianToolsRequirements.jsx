import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; // Import Edit icon
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../AuthProvider";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const TechnicianTools = () => {
  const naviagte = useNavigate()
  const [items, setItems] = useState([]); // Store items dynamically

  const [isEditable, setIsEditable] = useState(Array(2).fill(false)); // Editable state for each row
  const [totalPrice, setTotalPrice] = useState(0); // Calculate total price dynamically
  const { userId: technicianId } = useAuth();

   // Add row with empty data fields
   const handleAddRow = () => {
    setItems([...items, { itemName: '', quantity: 1, price: '' }]); // Default quantity set to 1
  };
  
  const handleEditRow = (index) => {
    const newEditableState = [...isEditable];
    newEditableState[index] = true;
    setIsEditable(newEditableState);
  };
  
  const handleSaveRow = (index) => {
    const newEditableState = [...isEditable];
    newEditableState[index] = false;
    setIsEditable(newEditableState);
    calculateTotalPrice();
    toast.success('Row saved successfully', {
      position: 'top-right',
      autoClose: 1000,
    });
  };
  
  const handleDeleteRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotalPrice(updatedItems); // Recalculate total after deletion
  };
  
  // Calculate total price
  const calculateTotalPrice = (updatedItems = items) => {
    let total = updatedItems.reduce((acc, row) => acc + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 1), 0);
    setTotalPrice(total);
  };
  
  const handleChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
    calculateTotalPrice(updatedItems); // Recalculate total dynamically
  };
  //post methodS
  const handleSubmit = async () => {
    // Prepare request body with invoice data and items
    const requestBody = items.map(item => ({
      // Add any other properties you need for each item
      ...item,
      technicianId: technicianId,  // Assuming `row.technicianId` is available
    }));
  
    // Show confirmation dialog before proceeding
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to submit the Tool request?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, cancel',
      });
  
      if (result.isConfirmed) {
        // Proceed with form submission if confirmed
        const response = await fetch(`${baseUrl}/api/toolsRequest/save/${technicianId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),  // Send the prepared request body
        });
        if (response.ok) {
          // Success toast message after response is OK
          toast.success('Tools Request Submitted Successfully', {
            position: 'top-right',
            autoClose: 1000, // Adjust the duration as needed
            onClose: () => {
              // Navigate after the toast has closed
              naviagte('/TechnicianToolsRequestList');
            }
          });
        } else {
          throw new Error('Failed to submit');
        }
      } else {
        // If user cancels the confirmation
        toast.info('Tools request submission canceled', {
          position: 'top-right',
          autoClose: 1000,
        });
      }
    } catch (error) {
      // Handle errors, either from the fetch request or the confirmation dialog
      toast.error(error.message || 'Error submitting material request', {
        position: 'top-right',
        autoClose: 1000,
      });
    }
  };
  
  
  

  return (
    <div
      style={{
        marginTop: '88px',
        marginLeft: '20px',
        marginRight: '20px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      <div>
        <h3>Tools Requirements</h3>
      </div>

      {/* Editable Table */}
      <div
        style={{
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr>
              <th style={{ fontWeight: 'bold', padding: '10px', fontSize: '14px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#DDDCDC', textAlign: 'center' }}>S.No</th>
              <th style={{ fontWeight: 'bold', padding: '10px', fontSize: '14px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#DDDCDC', textAlign: 'center' }}>Item Name</th>
              <th style={{ fontWeight: 'bold', padding: '10px', fontSize: '14px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#DDDCDC', textAlign: 'center' }}>Quantity</th>
              <th style={{ fontWeight: 'bold', padding: '10px', fontSize: '14px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#DDDCDC', textAlign: 'center' }}>Price</th>

              <th style={{ fontWeight: 'bold', padding: '10px', fontSize: '14px', color: '#000', border: '1px solid #ACB4AE', backgroundColor: '#DDDCDC', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                    <textarea
                      value={row.itemName}
                      onChange={(e) => handleChange(index, 'itemName', e.target.value)}
                      style={{ width: '80%',
                        maxWidth: '500px',  // Restrict the width (max 500px, can adjust based on layout)
                        height: '80px',  // Set the height
                        maxHeight: '100px',  // Restrict the height (max 150px)
                        padding: '8px',
                        fontSize: '14px',
                        border: '1px solid #ccc',  // Light border color
                        borderRadius: '4px',  // Rounded corners
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.3s ease',  // Smooth border color transition
                        resize: 'vertical',  }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {row.itemName || 'N/A'}
                      <button
                        onClick={() => handleEditRow(index)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          marginLeft: '5px',
                          textAlign:'center'
                        }}
                      >
                       
                      </button>
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                   <input
                   type="number"
                   value={row.quantity}
                   onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                   style={{
                     width: '100%',
                     height: '36px',
                     padding: '0 12px',
                     fontSize: '14px',
                     border: '1px solid #ccc', // Light border color
                     borderRadius: '4px', // Rounded corners
                     outline: 'none',
                     boxSizing: 'border-box',
                     transition: 'border-color 0.3s ease', // Smooth border color transition
                   }}
                   onFocus={(e) => e.target.style.borderColor = '#3f51b5'} // Highlight border on focus
                   onBlur={(e) => e.target.style.borderColor = '#ccc'} // Reset border color after focus
                 />
                  ) : (
                    row.quantity
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                 <input
                 type="number"
                 value={row.price}
                 onChange={(e) => handleChange(index, 'price', e.target.value)}
                 style={{
                   width: '100%',
                   height: '36px',
                   padding: '0 12px',
                   fontSize: '14px',
                   border: '1px solid #ccc', // Light border color
                   borderRadius: '4px', // Rounded corners
                   outline: 'none',
                   boxSizing: 'border-box',
                   transition: 'border-color 0.3s ease', // Smooth border color transition
                 }}
                 onFocus={(e) => e.target.style.borderColor = '#3f51b5'} // Highlight border on focus
                 onBlur={(e) => e.target.style.borderColor = '#ccc'} // Reset border color after focus
               />
               
                  ) : (
                    row.price
                  )}
                </td>
              
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                    <button onClick={() => handleSaveRow(index)} style={{  padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer', }}>
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeleteRow(index)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px', color:'red' }}
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        onClick={() => handleEditRow(index)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        <EditOutlinedIcon />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
            onClick={handleAddRow}
            style={{
              border: '2px dashed #007bff',
              color: '#007bff',
              backgroundColor: 'transparent',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add Row
          </button>
      </div>

      {/* Total Price */}
      {/* <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginTop: '20px',
          display: 'flex',
         
        }}
      >
        <span>Total Price : </span>
        <span style={{marginLeft:'15px'}}>{totalPrice}</span>
        
      </div>
       */}

      {/* Save Request Button */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#41CECA',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight:'bold'
          }}
        >
          Submit Request
        </button>
        <ToastContainer/>
      </div>
    </div>
  );
};

export default TechnicianTools;