import React, { useState } from 'react';
import approvedIcon from '../../assets/update-approved.svg';

const InventoryUpdatedAdminModal = ({ onDone }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <img
          src={approvedIcon}
          alt="Item Updated Icon"
          style={styles.icon}
        />
        <h2 style={styles.title}>Item Updated</h2>
        <p style={styles.message}>The item was successfully updated</p>
        <button
          style={isHovered ? styles.doneBtnHover : styles.doneBtn}
          onClick={onDone}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Done
        </button>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    fontFamily: 'Poppins, sans-serif',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px 30px 28px',
    width: '460px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    marginBottom: '10px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
  },
  message: {
    color: '#555555',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '26px',
  },
  doneBtn: {
    backgroundColor: '#ffffff',
    color: '#991F1F',
    padding: '8px 28px',
    border: '1.5px solid #991F1F',
    borderRadius: '999px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  doneBtnHover: {
    backgroundColor: '#991F1F',
    color: '#ffffff',
    padding: '8px 28px',
    border: '1.5px solid #991F1F',
    borderRadius: '999px',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default InventoryUpdatedAdminModal;