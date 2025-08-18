import React, { useState } from 'react';
import { X } from 'lucide-react';
import ImportSuccessModal from './ImportSuccessModal'; // Ensure this path is correct
import ApprovedIcon from '../../assets/import-file.svg'; // Adjust path if needed

const ImportCSVModal = ({ onClose }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImportClick = () => {
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the parent modal too
  };

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
    borderRadius: '16px',
    width: '550px',
    minHeight: '460px',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '24px 24px 16px',
    fontSize: '20px',
    fontWeight: 600,
    borderBottom: '1.5px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const dropZoneStyle = {
    border: '2px dashed #222',
    borderRadius: '10px',
    margin: '20px',
    padding: '50px 20px',
    textAlign: 'center',
    flexGrow: 1,
  };

  const iconStyle = {
    width: '55px',
    height: '55px',
    marginBottom: '5px',
    marginTop: '30px',
  };

  const textStyle = {
    fontWeight: 500,
    fontSize: '16px',
    marginBottom: '-2px',
  };

  const subTextStyle = {
    fontSize: '14px',
    color: '#777',
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '7px',
    padding: '0 24px 24px',
    marginTop: '-1px',
  };

  const cancelBtn = {
    backgroundColor: '#fff',
    color: '#991F1F',
    border: '1.5px solid #991F1F',
    borderRadius: '999px',
    padding: '8px 17px',
    fontSize: '14.5px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.3s ease',
  };

  const importBtn = {
    backgroundColor: '#991F1F',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '5px 17px',
    fontSize: '14.5px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.3s ease',
  };

  const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
  };

  return (
    <>
      <div style={modalStyle}>
        <div style={boxStyle}>
          <div style={headerStyle}>
            <span>Import CSV</span>
            <button onClick={onClose} style={closeBtnStyle}>
              <X size={24} color="#000" />
            </button>
          </div>

          <div style={dropZoneStyle}>
            <img src={ApprovedIcon} alt="Upload Icon" style={iconStyle} />
            <div style={textStyle}>Select a CSV file to Import</div>
            <div style={subTextStyle}>or drag and drop it here</div>
          </div>

          <div style={buttonRowStyle}>
            <button
              style={cancelBtn}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#991F1F';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#991F1F';
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={importBtn}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#701923')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#991F1F')}
              onClick={handleImportClick}
            >
              Import File
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && <ImportSuccessModal onClose={handleSuccessClose} />}
    </>
  );
};

export default ImportCSVModal;
