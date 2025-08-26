import React from 'react';
import warning from '../assets/warning-triangle.svg'; // Import the warning icon


function LogoutModal({ onCancel, onConfirm }) {
  

  const modalStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: "'Poppins', sans-serif",
  };

  const boxStyle = {
    backgroundColor: '#fff',
    padding: '40px 30px 28px',
    borderRadius: '16px',
    textAlign: 'center',
    width: '450px',
    minHeight: '350px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const iconWrapper = {
    marginBottom: '18px',
  };

  const warningIconStyle = {
    fontSize: '90px',
    color: '#991F1F',
  };

  const titleStyle = {
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '10px',
    marginTop: '6px', // extra gap between icon and title
  };

  const textStyle = {
    color: '#555',
    fontSize: '16px',
    marginBottom: '26px',
    lineHeight: '1.6',
  };

  const buttonRow = {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const baseBtn = {
    padding: '8px 20px',
    borderRadius: '999px',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    border: '1.5px solid #991F1F',
    transition: 'all 0.2s ease',
  };

  const cancelBtnStyle = {
    ...baseBtn,
    backgroundColor: '#991F1F',
    color: '#fff',
  };

  const logoutBtnStyle = {
    ...baseBtn,
    backgroundColor: '#fff',
    color: '#991F1F',
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <div style={{ marginBottom: '20px' }}>
          <img
            src={warning}
            alt="Triangle Warning Icon"
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        </div>
        <div style={titleStyle}>Logout Confirmation</div>
        <p style={textStyle}>
          Are you sure you want to logout? You’ll be redirected to the login page.
        </p>
        <div style={buttonRow}>
          <button
            style={cancelBtnStyle}
            onClick={onCancel}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7e1a1a';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#991F1F';
            }}
          >
            Cancel
          </button>
          <button
            style={logoutBtnStyle}
            onClick={onConfirm}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#991F1F';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#991F1F';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
