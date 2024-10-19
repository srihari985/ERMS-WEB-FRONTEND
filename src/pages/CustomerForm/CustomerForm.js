import React, { useState } from 'react';
import './CustomerForm.css'; // Import the CSS file

const CustomerForm = () => {
  const [form, setForm] = useState({
    customername: '',
    companyname: '',
    contactnumber: '',
    emailid: '',
    details: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to the server or log it)
    console.log('Form submitted:', form);
    alert('Daily report submitted!');
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="header-title"></h1>
      </header>

      <section className="form-section">
        <h2 className="section-title">Add New Customer</h2>
        <form onSubmit={handleSubmit}>
          <label>
            customer name:
            <input
              type="customername"
              name="customername"
              value={form.customername}
              onChange={handleChange}
              required
            />
          </label>
         
          <label>
          company name:
            <input
              type="companyname"
              name="companyname"
              value={form.companyname}
              onChange={handleChange}
              required
            />
          </label>
          <label>
          contact number:
            <textarea
              type="contactnumber"
              name="contactnumber"
              value={form.contactnumber}
              onChange={handleChange}
              required
            />
          </label>
          <label>
          emailid:
            <input
              type="emailid"
              name="emailid"
              value={form.emailid}
              onChange={handleChange}
              required
            />
          </label>
          <label>
          details:
            <input
              type="details"
              name="details"
              value={form.details}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Submit details</button>
        </form>
      </section>
    </div>
  );
};

export default CustomerForm;
