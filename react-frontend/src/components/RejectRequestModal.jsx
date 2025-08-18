import React, { useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';

const RejectRequestModal = ({ onClose, onSubmit }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState(false);

  const handleSubmission = () => {
    if (!rejectionReason.trim()) {
      setError(true);
      return;
    }

    setError(false);
    onSubmit(rejectionReason);
    setRejectionReason('');
  };

  const inputStyle = {
    width: '100%',
    height: '280px',
    padding: '1rem',
    fontSize: '17px',
    border: error ? '2px solid #e53935' : '1.5px solid #991f1f',
    borderRadius: '10px',
    resize: 'none',
    marginTop: '1rem',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
  };

  const errorMessage = (
    <div style={{
      color: '#e53935',
      marginTop: '0.35rem',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.85rem',
    }}>
      <MdErrorOutline size={16} style={{ marginRight: '0.3rem' }} />
      Reason is required
    </div>
  );

  return (
    <>
      <style>
        {`
          .reject-cancel-btn {
            background-color: white;
            color: #8A1F2B;
            border: 1.5px solid #8A1F2B;
            padding: 0.5rem 1.5rem;
            border-radius: 2rem;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: all 0.2s ease;
          }

          .reject-cancel-btn:hover {
            background-color: #8A1F2B;
            color: white;
          }

          .reject-submit-btn {
            background-color: #8A1F2B;
            color: white;
            padding: 0.1rem 1.5rem;
            border: none;
            border-radius: 2rem;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: background-color 0.2s ease;
          }

          .reject-submit-btn:hover {
            background-color: #a32c3a;
          }
        `}
      </style>

      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          width: '650px',
          fontFamily: 'Poppins, sans-serif',
        }}>
          <h2 style={{ marginTop: 0, fontSize: '26px' }}>Reject Request</h2>
          <p style={{ fontSize: '17px' }}>
            Please provide a reason for rejecting this request. The student will be notified with your feedback.
          </p>
          <textarea
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              if (error) setError(false);
            }}
            style={inputStyle}
          />
          {error && errorMessage}

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0.7rem',
            gap: '0.5rem',
          }}>
            <button
              className="reject-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="reject-submit-btn"
              onClick={handleSubmission}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RejectRequestModal;
