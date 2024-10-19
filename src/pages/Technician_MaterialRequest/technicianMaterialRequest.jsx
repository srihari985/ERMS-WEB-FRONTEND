import React, { useState } from 'react';
import { Formik, Form, Field} from 'formik';
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; // Import Edit icon
import swal from 'sweetalert2'; // Import SweetAlert2
import { TextField } from '@mui/material';

const TechnicianMaterialRequest = () => {
  const [partyName, setPartyName] = useState('');
  const [quotationNo, setQuotationNo] = useState('');
  const [data, setData] = useState([
    { slNo: 1, itemName: 'Item A', quantity: 10, price: 100 },
    { slNo: 2, itemName: 'Item B', quantity: 5, price: 50 },
  ]);
  const [isEditable, setIsEditable] = useState(Array(2).fill(false)); // Editable state for each row
  const [totalPrice, setTotalPrice] = useState(() =>
    data.reduce((total, row) => total + row.price, 0)
  );

  const handleAddRow = () => {
    const newRow = { slNo: data.length + 1, itemName: '', quantity: '', price: '' };
    setData([...data, newRow]);
    setIsEditable([...isEditable, true]); // Make the new row editable
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
  };

  const handleDeleteRow = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
    setIsEditable(isEditable.filter((_, i) => i !== index)); // Update isEditable state
    calculateTotalPrice(updatedData); // Recalculate total after deletion
  };

  const calculateTotalPrice = (updatedData = data) => {
    const total = updatedData.reduce((acc, row) => acc + Number(row.price || 0), 0);
    setTotalPrice(total);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    setData(updatedData);
  };

  const handleSubmit = () => {
    swal.fire({
      title: 'Success!',
      text: 'Material Request Submitted Successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle form submission logic here if needed
        console.log('Form has been submitted');
      }
    });
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
        <h3>Material Request</h3>
      </div>

      {/* Formik Input Fields */}
      <Formik
        initialValues={{
          empId: '',
          date: '',
          customerName: '',
          ticketNo: '',
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div style={{ display: 'flex', justifyContent: 'start', marginBottom: '30px' }}>
            <TextField
                label="Emp ID"
                name="empId"
                variant="outlined"
                style={{ width: '200px',marginRight:'16px' }}
              />
              <TextField
                label="Date"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                style={{ width: '200px',marginRight:'16px' }}
              />

              <TextField
                label="Customer Name"
                name="customerName"
                variant="outlined"
                style={{ width: '200px',marginRight:'16px' }}
              />

              <TextField
                label="Ticket No"
                name="ticketNo"
                variant="outlined"
                style={{ width: '200px', marginRight:'16px'}}
              />
              
              
              
            </div>
          </Form>
        )}
      </Formik>

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
              <th style={{ fontWeight: 'bold',padding: '10px', fontSize: '14px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>S.No</th>
              <th style={{ fontWeight: 'bold',padding: '10px',  fontSize: '14px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>Item Name</th>
              <th style={{ fontWeight: 'bold',padding: '10px',  fontSize: '14px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>Quantity</th>
              <th style={{ fontWeight: 'bold',padding: '10px',  fontSize: '14px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>Price</th>
              <th style={{ fontWeight: 'bold',padding: '10px',  fontSize: '14px', color: '#000',border: "1px solid #ACB4AE",backgroundColor: "#A1F4BD",textAlign:'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {row.slNo}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                    <input
                      type="text"
                      value={row.itemName}
                      onChange={(e) => handleChange(index, 'itemName', e.target.value)}
                      style={{ width: '100%',height:'30px' }}
                    />
                  ) : (
                    <>
                      {row.itemName || <button onClick={() => handleEditRow(index)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <EditOutlinedIcon />
                      </button>}
                    </>
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                      style={{ width: '100%',height:'30px' }}
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
                      style={{ width: '100%',height:'30px' }}
                    />
                  ) : (
                    row.price
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {isEditable[index] ? (
                    <button
                      onClick={() => handleSaveRow(index)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditRow(index)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <EditOutlinedIcon />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteRow(index)}
                    style={{ marginLeft: '10px', color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" style={{ padding: '10px', borderTop: '2px none #ccc' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
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
                    Add New Item
                  </button>
                  <div style={{marginRight:'50px'}}>
                    <strong>Total Price: </strong>
                    {totalPrice}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          Submit
        </button>
      </div>
    </div>
  );
};

export default TechnicianMaterialRequest;