import React from 'react';
import TrashBin from '../../assets/trashbin.svg'; // Make sure this path is correct

const InventoryItemDeletedModal = ({ onDone }) => {
  const styles = {
    overlay: {
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
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '40px 30px 28px',
      width: '460px',
      textAlign: 'center',
      minHeight: '350px',
      fontFamily: 'Poppins, sans-serif',
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
      //marginBottom: '12px',
    },
    message: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '26px',
      lineHeight: '1.6',
    },
    doneButton: {
      backgroundColor: '#fff',
      color: '#991F1F',
      border: '1.5px solid #991F1F',
      padding: '8px 30px',
      borderRadius: '20px',
      fontSize: '16px',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      transition: 'all 0.2s ease',
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <img src={TrashBin} alt="Deleted" style={styles.icon} />
        <h2 style={styles.title}>Item Deleted</h2>
        <p style={styles.message}>
          The item was successfully deleted from<br />the inventory
        </p>
        <button style={styles.doneButton} onClick={onDone}
          onMouseEnter={e => e.target.style.backgroundColor = '#991F1F'}
          onMouseLeave={e => e.target.style.backgroundColor = '#fff'}
          onMouseOver={e => e.target.style.color = '#fff'}
          onMouseOut={e => e.target.style.color = '#991F1F'}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default InventoryItemDeletedModal;
