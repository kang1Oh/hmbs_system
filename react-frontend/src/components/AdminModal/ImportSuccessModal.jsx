import React from 'react';
import ApprovedCircle from '../../assets/approved-circle.svg'; // Adjust the path as needed

const ImportSuccessModal = ({ onClose, count, entityName }) => {
  const modalStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    fontFamily: "'Poppins', sans-serif",
  };

  const boxStyle = {
    backgroundColor: '#fff',
    padding: '40px 30px 28px',
    borderRadius: '16px',
    textAlign: 'center',
    width: '460px',
    minHeight: '395px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const iconStyle = {
    width: '90px',
    height: '90px',
    objectFit: 'contain',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontWeight: 700,
    fontSize: '28px',
    //marginBottom: '10px',
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
    padding: '8px 30px',
    borderRadius: '999px',
    border: '1.5px solid #991F1F',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Poppins', sans-serif",
  };

  const btnHover = {
    backgroundColor: '#991F1F',
    color: '#fff',
  };

  const handleMouseEnter = (e) => Object.assign(e.target.style, btnHover);
  const handleMouseLeave = (e) => Object.assign(e.target.style, btnStyle);

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <img src={ApprovedCircle} alt="Approved" style={iconStyle} />
        <div style={titleStyle}>Import Successful</div>
        <p style={textStyle}>
          {count > 0 ? (
            <>
              The file was successfully imported.<br />
              <strong>{count}</strong> {entityName}
              {count !== 1 ? "s" : ""} added.
            </>
          ) : (
            "No new records were added."
          )}
        </p>
        <button 
          style={btnStyle} 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
          onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

export default ImportSuccessModal;