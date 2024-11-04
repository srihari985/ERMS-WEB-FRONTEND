import React, { useState } from 'react';
import './QuotationFeedbackForm.css'; // Import the CSS file

const QuotationFeedbackForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    quotationId: '',
    feedback: '',
   
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
        <h2 className="section-title">Fill out your daily report</h2>
        <form onSubmit={handleSubmit}>
          <label>
            name:
            <input
              type="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
         
          <label>
            email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            feedback:
            <textarea
              type="feedback"
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Number of Quotations Sent:
            <input
              type="number"
              name="numberOfQuotations"
              value={form.numberOfQuotations}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Submit Report</button>
        </form>
      </section>
    </div>
  );
};

export default QuotationFeedbackForm;
