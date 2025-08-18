import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';
import SpoonImage from '../assets/images/spoon.png';
import Sidebar from '../components/Sidebar';
import RejectRequestModal from '../components/RejectRequestModal.jsx';
import DeniedRequestModal from '../components/DeniedRequestModal.jsx'; 
import ApprovedRequestModal from '../components/ApprovedRequestModal.jsx'; 

const RequestDetailsInstructor = () => {
  const navigate = useNavigate(); 
  const borrowedItems = [1, 2, 3];
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Poppins, sans-serif',
    },
    main: {
      marginLeft: '240px',
      flex: 1,
      padding: '2rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.2rem',
      fontWeight: 600,
    },
    input: {
      width: '100%',
      padding: '14px',
      borderRadius: '7px',
      border: '1px solid black',
      fontSize: '15px',
      fontFamily: 'Poppins, sans-serif',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      marginTop: '0.5rem',
      backgroundColor: 'white',
      borderRadius: '10px',
      border: '1px solid #8A1F2B',
      fontFamily: 'Poppins, sans-serif',
    },
    th: {
      backgroundColor: '#8A1F2B',
      color: 'white',
      padding: '1rem',
      textAlign: 'center',
      fontWeight: 600,
    },
    td: {
      padding: '1rem',
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      gap: '0.5rem',
      fontFamily: 'Poppins, sans-serif',
    },
    itemCountContainer: {
      fontWeight: '600',
      fontSize: '18px',
    },
    approveButton: {
      backgroundColor: '#8A1F2B',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '99px',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
    },
    rejectButton: {
      backgroundColor: '#fff',
      color: '#8A1F2B',
      border: '1px solid #8A1F2B',
      padding: '0.75rem 1.5rem',
      borderRadius: '99px',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '14px',
    },
    goBackBtn: {
      background: 'none',
      border: 'none',
      color: '#8A1F2B',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '17px',
      fontWeight: 600,
    },
    topHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.2rem',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.layout}>
      {/* HOVER STYLES */}
      <style>
        {`
          .approve-btn:hover {
            background-color: #a32c3a !important;
          }
          .reject-btn:hover {
            background-color: #8A1F2B !important;
            color: white !important;
          }
          .go-back-btn:hover {
            text-decoration: none !important;
            opacity: 0.8;
          }
        `}
      </style>

      <Sidebar
        activePage="requests"
        userRole="Staff"
        userSubrole="Instructor"
        navItems={[
          { id: 'requests', name: 'Requests', icon: <FaFileAlt />, path: '/requests-instructor' }
        ]}
      />

      <main style={styles.main}>
        <div style={styles.topHeader}>
          <div>
            <h1>Request No. 000001234</h1>
            <p style={{ fontSize: '16px'}}>
              Status:{' '}
              <span
                style={{
                  backgroundColor: '#23a6f0',
                  color: 'white',
                  padding: '0.2rem 1rem',
                  borderRadius: '1rem',
                  fontSize : '15px',
                  marginLeft: '0.2rem',
                }}
              >
                New Request
              </span>
            </p>
          </div>
          <button
            className="go-back-btn"
            style={styles.goBackBtn}
            onClick={() => navigate('/requests-instructor')}
          >
            Go Back
          </button>
        </div>

      <hr style={{
          border: 'none',
          borderTop: '2px solid rgba(97, 97, 97, 0.3)',
          marginTop: '1rem',
          marginBottom: '-0.6rem'
        }} />

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Date Requested</label>
            <input type="text" value="July 02, 2025" style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Date Use</label>
            <input type="text" value="July 08, 2025" style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Time</label>
            <input type="text" value="8:00 AM" style={styles.input} readOnly />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Group Leader</label>
            <input type="text" value="Student 1" style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Course</label>
            <input type="text" value="HM 001" style={styles.input} readOnly />
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontWeight: '600' }}>Group Members</h3>
        <table style={{ ...styles.table, marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: '7px' }}>#</th>
              <th style={styles.th}>Name</th>
              <th style={{ ...styles.th, borderTopRightRadius: '7px' }}>Course ID</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td style={styles.td}>{i}</td>
                <td style={styles.td}>Juan Dela Cruz</td>
                <td style={styles.td}>HM 001</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            marginBottom: '0.1rem',
          }}
        >
          <h3 style={{ margin: 0, fontWeight: '600', fontSize: '20px' }}>List of Borrowed Items</h3>
          <div style={styles.itemCountContainer}>Total ({borrowedItems.length})</div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: '8px' }}>#</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Item Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
              <th style={{ ...styles.th, borderTopRightRadius: '8px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {borrowedItems.map((i) => (
              <tr key={i}>
                <td style={styles.td}>{i}</td>
                <td style={styles.td}>
                  <img
                    src={SpoonImage}
                    alt="Spoon"
                    style={{ borderRadius: '8px', width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td style={styles.td}>Spoon</td>
                <td style={styles.td}>Pantry Tools</td>
                <td style={styles.td}>4</td>
                <td style={styles.td}>Pcs</td>
                <td style={styles.td}>₱25.00</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.actionButtons}>
          <button
            className="reject-btn"
            style={styles.rejectButton}
            onClick={() => setShowRejectModal(true)}
          >
            Reject Request
          </button>
          <button
            className="approve-btn"
            style={styles.approveButton}
            onClick={() => {
              setShowApprovedModal(true);
            }}
          >
            Approve Request
          </button>
        </div>
      </main>

      {showRejectModal && (
        <RejectRequestModal
          onClose={() => setShowRejectModal(false)}
          onSubmit={(reason) => {
            console.log('Rejected with reason:', reason);
            setShowRejectModal(false);
            setShowDeniedModal(true);
          }}
        />
      )}

      {showDeniedModal && (
        <DeniedRequestModal
          onClose={() => setShowDeniedModal(false)}
        />
      )}

      {showApprovedModal && (
        <ApprovedRequestModal
          onClose={() => setShowApprovedModal(false)}
        />
      )}
    </div>
  );
};

export default RequestDetailsInstructor;
