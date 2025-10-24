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

  const imageWrapperStyle = {
    width: '180px',
    height: '180px',
    backgroundColor: '#fff', // white background for transparent images
    borderRadius: '8px',
    overflow: 'hidden', // crop the image to the fixed frame
    marginBottom: '10px',
    alignSelf: 'center', // keep image centered while other content remains full-width
    display: 'block',
  };

  const cardImageStyle = {
    width: '200px',
    height: '200px',
    objectFit: 'cover', // crop to fill the frame
    display: 'block',
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

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const src = img ? `${baseUrl}${img}` : `${baseUrl}uploads/tools/default.png`;

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={imageWrapperStyle}>
        <img
          src={src}
          alt={name}
          style={cardImageStyle}
        />
      </div>
      <p style={cardTitleStyle}>{name}</p>
      <div style={qtyRowStyle}>
        <span>{qty} Available</span>
        <span></span>
      </div>
    </div>
  );
}

export default ItemCard;
