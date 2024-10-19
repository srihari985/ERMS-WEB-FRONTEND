import React, { useState } from 'react';
import './FoodRequestForm.css'; // Import the CSS file

const FoodRequestForm = () => {
  const [form, setForm] = useState({
    name: '',
    fooditem: '',
    quantity: '',
    
   
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
        <h2 className="section-title">Apply food request</h2>
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
            food item:
            <input
              type="fooditem"
              name="food item"
              value={form.fooditem}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            quantity:
            <textarea
              type="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>
          
          <button type="submit">Submit request</button>
        </form>
      </section>
    </div>
  );
};

export default FoodRequestForm;
