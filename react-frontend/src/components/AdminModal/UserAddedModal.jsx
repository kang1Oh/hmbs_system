import React from 'react';
import { FaUserCheck } from 'react-icons/fa';

const UserAddedModal = ({ onDone }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FaUserCheck style={styles.icon} />
        <h2 style={styles.title}>User Registered</h2>
        <p style={styles.message}>The user has been successfully registered</p>
        <button style={styles.doneBtn} onClick={onDone}>Done</button>
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
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  message: {
    fontSize: '14px',
    color: '#444',
    marginBottom: '24px',
  },
  doneBtn: {
    backgroundColor: '#fff',
    color: '#8A1F2B',
    border: '2px solid #8A1F2B',
    padding: '10px 24px',
    borderRadius: '20px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default UserAddedModal;
