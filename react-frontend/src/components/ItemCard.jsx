import React from 'react';
import tempItemImg from '../assets/images/temp-item-img.png';

function ItemCard({ name, qty, onClick }) {
  const cardStyle = {
    backgroundColor: '#991F1F',
    color: '#fff',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    height: '260px',
    justifyContent: 'space-between',
    cursor: 'pointer',
  };

  const cardImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  };

  const cardTitleStyle = {
    fontSize: '17px',
    fontWeight: '600',
    marginBottom: '1px',
  };

  const qtyRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '300',
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <img src={tempItemImg} alt={name} style={cardImageStyle} />
      <p style={cardTitleStyle}>{name}</p>
      <div style={qtyRowStyle}>
        <span>Qty Available</span>
        <span>{qty}</span>
      </div>
    </div>
  );
}

export default ItemCard;
