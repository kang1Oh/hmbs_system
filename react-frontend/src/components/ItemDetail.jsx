import React, { useState } from 'react';
import tempItemImg from '../assets/images/temp-item-img.png';
import ItemAddedModal from './ItemAddedModal'; 
import { useCart } from '../context/CartContext';

function ItemDetail({ item, onClose }) {
  if (!item) return null;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleAddToRequest = () => {
    addToCart(item, quantity);
    setShowModal(true);
  };

  const handleIncrement = () => {
    if (quantity < item.available_qty) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const modalOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalContent = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '36px 40px',
    width: '700px',
    maxWidth: '95%',
    display: 'flex',
    gap: '25px',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  };

  const imageStyle = {
    width: '300px',
    height: '340px',
    objectFit: 'cover',
    borderRadius: '16px',
    flexShrink: 0,
  };

  const closeButton = {
    position: 'absolute',
    top: '18px',
    right: '22px',
    fontSize: '26px',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#991F1F',
  };

  const qtyControlsContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '20px',
  };

  const qtyLabel = {
    fontSize: '15px',
    fontWeight: 500,
    color: '#333',
  };

  const qtyControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  };

  const qtyBox = {
    border: '1.5px solid #991F1F',
    borderRadius: '10px',
    width: '43px',
    height: '44px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#991F1F',
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: '#fff',
  };

  const qtyDisplayBox = {
    ...qtyBox,
    color: '#333',
    cursor: 'default',
    border: '1px solid #991F1F',
  };

  const addToRequestBtn = {
    backgroundColor: '#991F1F',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '999px',
    border: 'none',
    marginTop: '20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 100,
    transition: 'background-color 0.2s',
    fontFamily: "'Poppins', sans-serif",
  };

  return (
    <>
      <div style={modalOverlay} onClick={onClose}>
        <div style={modalContent} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={closeButton}>×</button>

          <img src={tempItemImg} alt={item.name} style={imageStyle} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontWeight: 600, fontSize: '30px', marginBottom: '5px', lineHeight: '1.2', textAlign: 'left' }}>{item.name}</h2>
            <p style={{ fontSize: '16px', color: '#555', marginBottom: '12px' }}>Available Qty: {item.qty}</p>
            <p style={{ color: '#991F1F', fontWeight: 600, fontSize: '25px', marginBottom: '20px' }}>$100.00</p>

            <div style={qtyControlsContainer}>
              <label style={qtyLabel}>Quantity</label>
              <div style={qtyControls}>
                <div style={qtyBox} onClick={handleDecrement}>−</div>
                <div style={qtyDisplayBox}>{quantity}</div>
                <div style={qtyBox} onClick={handleIncrement}>+</div>
              </div>
            </div>

            <button style={addToRequestBtn} onClick={handleAddToRequest}>
              Add To Request
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ItemAddedModal
          onClose={() => {
            setShowModal(false);
            onClose(); 
          }}
        />
    )}

    </>
  );
}

export default ItemDetail;
