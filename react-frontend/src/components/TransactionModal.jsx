import React from 'react';
import image2 from '../assets/request.png';

const TransactionModal = ({ onClose }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px 30px 40px', //28px
        borderRadius: '16px',
        textAlign: 'center',
        width: '500px',
        minHeight: '350px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px'

      }}>
        <div>
          <img
            src={image2}
            alt="Transaction Complete Icon"
            style={{ width: '150px', height: '150px', objectFit: 'contain' }} //div-margin-bottom 20px
          />
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          //color: '#1A1A1A',
        }}>
          Transaction Completed
        </h2>

        <p style={{
          color: '#555555',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '35px'
        }}>
          The transaction has been successfully processed.<br />
          The student will be notified accordingly.
        </p>

        <button
          onClick={onClose}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            border: '1px solid #991F1F',
            backgroundColor: hovered ? '#991F1F' : '#ffffff',
            color: hovered ? '#ffffff' : '#991F1F',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '8px 30px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontFamily: 'Poppins, Sans-serif',
            transition: 'background-color 150ms ease, color 150ms ease'
          }}
        >
          Done
        </button>
      </div>
    </div >
  );
};

export default TransactionModal;