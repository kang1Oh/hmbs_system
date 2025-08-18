import React from 'react';
import itemadded from '../assets/approved-cart.svg'; 

function ItemAddedModal({ onClose }) {
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
    position: 'relative',
    width: '90px',
    height: '90px',
    marginBottom: '24px',
  };

  const cartIconStyle = {
    fontSize: '90px',
    color: '#991F1F',
  };

  const checkIconStyle = {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    fontSize: '32px',
    color: '#991F1F',
    border: '2px solid #fff',
  };

  const titleStyle = {
    fontWeight: 700,
    fontSize: '24px',
    marginBottom: '10px',
  };

  const textStyle = {
    color: '#555',
    fontSize: '16px',
    marginBottom: '26px',
    lineHeight: '1.6',
  };

  const btnStyle = {
    backgroundColor: '#fff',
    color: '#991F1F',
    padding: '10px 26px',
    borderRadius: '999px',
    border: '1.5px solid #991F1F',
    fontWeight: 500,
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Poppins', sans-serif",
  };

  const btnHover = {
    backgroundColor: '#991F1F',
    color: '#fff',
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <div style={{ marginBottom: '20px' }}>
          <img
            src={itemadded}
            alt="Approved Cart Icon"
            style={{ width: '100px', height: '100px', objectFit: 'contain', marginRight: '15px', marginTop: '5px' }}
          />
        </div>
        <div style={titleStyle}>Item Added!</div>
        <p style={textStyle}>
          The item has been successfully added to the inventory.
        </p>
        <button
          style={btnStyle}
          onClick={onClose}
          onMouseEnter={e => Object.assign(e.target.style, btnHover)}
          onMouseLeave={e => Object.assign(e.target.style, btnStyle)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ItemAddedModal;
