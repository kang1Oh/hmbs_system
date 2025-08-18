// ... (other imports)
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import tempItemImg from '../assets/images/temp-item-img.png';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Metal Tray', qty: 14, selectedQty: 1, price: 100 },
    { id: 2, name: 'Dinner Fork', qty: 10, selectedQty: 2, price: 30 },
    { id: 3, name: 'Golden Spoon', qty: 12, selectedQty: 5, price: 55 },
  ]);

  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredRemove, setHoveredRemove] = useState(null);

  const handleProceedRequest = () => {
    navigate('/borrow-request');  // Navigate to the request form 
  };

  const handleIncrement = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedQty < item.qty
          ? { ...item, selectedQty: item.selectedQty + 1 }
          : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedQty > 1
          ? { ...item, selectedQty: item.selectedQty - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalQty = cartItems.reduce((sum, item) => sum + item.selectedQty, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.selectedQty * item.price, 0);

  const pageStyle = {
    fontFamily: "'Poppins', sans-serif",
    padding: '40px 60px',
    maxWidth: '900px',
    margin: '0 auto',
    color: '#333',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '-4px',
  };

  const descStyle = {
    fontSize: '17.5px',
    color: '#555',
    marginBottom: '30px',
  };

  const sectionTitle = {
    fontSize: '19px',
    fontWeight: 600,
    marginBottom: '10px',
    marginTop: '20px',
  };

  const itemBox = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    gap: '20px',
    justifyContent: 'space-between',
  };

  const imgStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '10px',
    flexShrink: 0,
  };

  const itemInfoSection = {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const itemDetails = {
    flex: 1,
  };

  const itemName = {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '-1px',
  };

  const itemPrice = {
    fontSize: '15px',
    color: '#991F1F',
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
  };

  const qtyControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  };

  const qtyBox = (isHovered = false) => ({
    border: '1.5px solid #991F1F',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#991F1F',
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: isHovered ? '#fce8e8' : '#fff',
    transition: 'background-color 0.2s',
  });

  const qtyDisplayBox = {
    border: '1px solid #991F1F',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#fff',
    cursor: 'default',
  };

  const removeBtn = (isHovered = false) => ({
    border: '1px solid #991F1F',
    background: isHovered ? '#991F1F' : '#ffffff',
    color: isHovered ? '#fff' : '#991F1F',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'background-color 0.2s, color 0.2s',
    marginLeft: '12px',
  });

  const totalSummaryStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '20px',
  };

  const buttonWrapperStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  };

  const proceedButtonStyle = {
    backgroundColor: '#991F1F',
    color: '#fff',
    border: 'none',
    padding: '11px 26px',
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'background-color 0.2s',
  };

  const hrLine = {
    margin: '20px 0',
    border: 'none',
    borderTop: '1px solid #ddd',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ flex: 1 }}>
        <div style={pageStyle}>
          <h1 style={titleStyle}>Borrowing Cart</h1>
          <p style={descStyle}>Review your selected items before submitting the request.</p>

          <h2 style={sectionTitle}>Your Borrow List</h2>

          {cartItems.length === 0 ? (
            <p style={{ color: '#777' }}>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={itemBox}>
                <img src={tempItemImg} alt={item.name} style={imgStyle} />
                <div style={itemInfoSection}>
                  <div style={itemDetails}>
                    <div style={itemName}>{item.name}</div>
                    <div style={itemPrice}>₱{item.price.toFixed(2)}</div>
                  </div>
                  <div style={qtyControls}>
                    <div
                      style={qtyBox(hoveredBtn === `dec-${item.id}`)}
                      onClick={() => handleDecrement(item.id)}
                      onMouseEnter={() => setHoveredBtn(`dec-${item.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                    >
                      −
                    </div>
                    <div style={qtyDisplayBox}>{item.selectedQty}</div>
                    <div
                      style={qtyBox(hoveredBtn === `inc-${item.id}`)}
                      onClick={() => handleIncrement(item.id)}
                      onMouseEnter={() => setHoveredBtn(`inc-${item.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                    >
                      +
                    </div>
                    <button
                      style={removeBtn(hoveredRemove === item.id)}
                      onClick={() => handleRemove(item.id)}
                      onMouseEnter={() => setHoveredRemove(item.id)}
                      onMouseLeave={() => setHoveredRemove(null)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              <hr style={hrLine} />

              <div style={totalSummaryStyle}>
                <div>
                  <div style={{ fontSize: '20.5px', fontWeight: 600, marginBottom: '-3px' }}>Replacement Cost</div>
                  <div style={{ fontSize: '15px', color: '#555' }}>
                    {totalQty} item{totalQty > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ fontSize: '27px', fontWeight: 700, color: '#991F1F' }}>
                  ₱{totalAmount.toLocaleString()}
                </div>
              </div>

              <hr style={hrLine} />

              <div style={buttonWrapperStyle}>
                <button
                  style={proceedButtonStyle}
                  onClick={handleProceedRequest}
                >
                  Proceed with Request
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CartPage;
