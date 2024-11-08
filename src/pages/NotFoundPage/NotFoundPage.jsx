import { height } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <div style={styles.container}>
      <img src="/assets/notfound.png" alt="Not Found" style={styles.image} />
      <h1 style={styles.heading}>Sorry! Page Not Found</h1>
      <p style={styles.paragraph}>THE PAGE YOU ARE LOOKING FOR DOESN'T EXIST....</p>
      <div style={styles.buttonContainer}>
        <button style={styles.goBackButton} onClick={handleGoBack}>Go Back</button>
        <button style={styles.homeButton} onClick={() => navigate("/")}>Go To Home Page</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  image: {
    width: '300px', // Adjust as needed
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
    margin: '0 0 5px 0',
  },
  paragraph: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  goBackButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#007bff',
    backgroundColor: 'transparent',
    border: '2px solid #007bff', // Blue border
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
  homeButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff', // Blue background for home button
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default NotFoundPage;