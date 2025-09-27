import React, { useState } from 'react';
import WarningTriangle from '../../assets/warning-triangle.svg';

const InventoryDeletionAdminModal = ({ onCancel, onDelete }) => {
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      fontFamily: 'Poppins, sans-serif',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '40px 30px 28px',
      borderRadius: '16px',
      width: '460px',
      textAlign: 'center',
      minHeight: '350px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px'
    },
    icon: {
      width: '100px',
      height: '100px',
      objectFit: 'contain',
      marginBottom: '10px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
    },
    message: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '26px',
      lineHeight: '1.6',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
    },
    button: {
      padding: '8px 30px',
      borderRadius: '20px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Poppins, Sans-serif',
    },
    cancelButton: {
      backgroundColor: '#991F1F',
      color: '#fff',
      border: 'none',
    },
    deleteButton: {
      backgroundColor: '#fff',
      color: '#991F1F',
      border: '1.5px solid #991F1F',
    },
    deleteButtonHover: {
      backgroundColor: '#991F1F',
      color: '#fff',
    },
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <img src={WarningTriangle} alt="Warning" style={styles.icon} />
        <h2 style={styles.title}>Confirm Deletion</h2>
        <p style={styles.message}>
          Are you sure you want to delete this item?<br />
          This action cannot be undone.
        </p>
        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.deleteButton,
              ...(isHoveringDelete ? styles.deleteButtonHover : {})
            }}
            onMouseEnter={() => setIsHoveringDelete(true)}
            onMouseLeave={() => setIsHoveringDelete(false)}
            onClick={onDelete}
          >
            Yes, Delete Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDeletionAdminModal;
