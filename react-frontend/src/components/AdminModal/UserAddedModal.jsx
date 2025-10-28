import React from 'react';
import { FaUserCheck } from 'react-icons/fa';

const handleMouseEnter = (e) => Object.assign(e.target.style, btnHover);
const handleMouseLeave = (e) => Object.assign(e.target.style, btnStyle);

const UserAddedModal = ({ onDone }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FaUserCheck style={styles.icon} />
        <h2 style={styles.title}>User Registered</h2>
        <p style={styles.message}>The user has been successfully registered</p>
        <button 
          style={btnStyle} 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: 'Poppins, sans-serif',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '40px',
    width: '350px',
    borderRadius: '14px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '64px',
    color: '#8A1F2B',
    marginBottom: '16px',
    marginLeft: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  message: {
    fontSize: '16px',
    color: '#444',
    marginBottom: '24px',
  },
};

const btnStyle = {
    backgroundColor: '#fff',
    color: '#991F1F',
    padding: '8px 30px',
    borderRadius: '999px',
    border: '1.5px solid #991F1F',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Poppins', sans-serif",
  };
const btnHover = {
    backgroundColor: '#991F1F',
    color: '#fff',
  };

export default UserAddedModal;
