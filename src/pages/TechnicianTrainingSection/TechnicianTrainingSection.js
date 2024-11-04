import React, { useState } from 'react';

const TechnicianTrainingSession = () => {
  const [selectedHardware, setSelectedHardware] = useState('');
  const [videoUrls, setVideoUrls] = useState([]);

  const hardwareOptions = ['CCTV', 'Biometric', 'Networking', 'Camera'];
  const hardwareVideos = {
    CCTV: [
      'https://www.youtube.com/embed/r733ieBgR70',
      'https://www.youtube.com/embed/e3JZWDyG6Yk',
      'https://www.youtube.com/embed/ZvDI1IDfBkE',
      'https://www.youtube.com/embed/Er7OLk0ob5Q',
      'https://www.youtube.com/embed/ok2M5pHPFj0',
      'https://www.youtube.com/embed/CzjvrTrImUk',
      'https://www.youtube.com/embed/x_n70R7JJKg',
    ],
    Biometric: [
      'https://www.youtube.com/embed/kRCXhdXj2i0',
      'https://www.youtube.com/embed/jQzGe1dOeeE',
      'https://www.youtube.com/embed/SXvRX38GnY8',
    ],
    Networking: [
      'https://www.youtube.com/embed/_IOZ8_cPgu8',
      'https://www.youtube.com/embed/oHQvWa6J8dU',
    ],
    Camera: ['https://www.youtube.com/embed/d0GViR3exik'],
  };

  const handleSelectChange = (event) => {
    setSelectedHardware(event.target.value);
  };

  const handleGetVideos = () => {
    if (selectedHardware) {
      const embedUrls = hardwareVideos[selectedHardware];
      setVideoUrls(embedUrls);
    } else {
      alert('Please select a hardware option.');
    }
  };

  // Inline Styles
  const cardStyle = {
    maxWidth: '100%',
    margin: '20px auto',
    padding: '30px',
    marginRight: '15px',
    marginLeft: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '90px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const hardwareSectionStyle = {
    display: 'flex',
    justifyContent: 'left', // Align center
    alignItems: 'center',
    
  };

  const selectStyle = {
    padding: '10px',
    width: '200px',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  };

  const buttonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '0 5px 5px 0', // Rounded right corners to attach to select
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838',
  };

  const videoContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '25px',
    marginTop: '20px',
  };

  const iframeStyle = {
    width: '260px',
    height: '170px',
    border: 'none',
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Hardware Training</h2>

      <div style={hardwareSectionStyle}>
        <select
          id="hardware-dropdown"
          value={selectedHardware}
          onChange={handleSelectChange}
          style={selectStyle}
        >
          <option value="">-- Select --</option>
          {hardwareOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={handleGetVideos}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)
          }
        >
          Get Videos
        </button>
      </div>

      {videoUrls.length > 0 && (
        <div style={videoContainerStyle}>
          {videoUrls.map((url, index) => (
            <iframe
              key={index}
              title={`YouTube Video ${index + 1}`}
              src={url}
              style={iframeStyle}
              allowFullScreen
            ></iframe>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianTrainingSession;
