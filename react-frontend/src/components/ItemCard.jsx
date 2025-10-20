import React from 'react';

function ItemCard({ name, qty, img, onClick }) { //add image prop when available
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
    display: 'block',
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const qtyRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '300',
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {/* Replace with actual image source when available ( <img src={image} alt={name} style={cardImageStyle} />) */}
      <img 
        src={`${import.meta.env.VITE_API_BASE_URL}${img}` || `${import.meta.env.VITE_API_BASE_URL}uploads/tools/default.png`}
        alt={name} 
        style={cardImageStyle} /> 
      <p style={cardTitleStyle}>{name}</p>
      <div style={qtyRowStyle}>
        <span>{qty} Available</span>
        <span></span>
      </div>
    </div>
  );
}

export default ItemCard;
