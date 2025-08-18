import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionModal from '../components/TransactionModal';
import { FaFileAlt, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import sampleImage1 from '../assets/images/plates.jpg';
import sampleImage2 from '../assets/images/spoon.png';
import sampleImage3 from '../assets/images/wine.jpg';

const RequestApprovedAdmin = () => {
  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Poppins, sans-serif',
    },
    main: {
      marginLeft: '240px',
      flex: 1,
      backgroundColor: '#ffffff',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.2rem',
      fontSize: '14px',
    },
    status: {
      backgroundColor: '#ffa500',
      color: 'white',
      padding: '0.2rem 0.7rem',
      borderRadius: '1rem',
      fontSize: '15px',
      marginLeft: '0.2rem',
    },
    goBack: {
      background: 'none',
      border: 'none',
      color: '#8A1F2B',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '17px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
    },
    formGroup: {
      marginBottom: '1.4rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.2rem',
      fontWeight: 600,
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      borderRadius: '7px',
      border: '0.5px solid #1A1A1A',
      fontSize: '0.9rem',
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
    tdBorrowed: {
      padding: '1.5rem',
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
    },
    tdLeftBorrowed: {
      padding: '1.6rem',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
    },
    image: {
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      display: 'block',
      margin: '0 auto',
    },
    selectBase: {
      width: '165px',
      padding: '10px 40px 10px 14px',
      borderRadius: '8px',
      fontWeight: '600',
      fontFamily: 'inherit',
      backgroundColor: '#fff',
      appearance: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      backgroundSize: '18px',
      cursor: 'pointer',
    },
    remarksInput: {
      width: '100%',
      padding: '0.7rem',
      fontSize: '0.9rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontFamily: 'Poppins, sans-serif',
    },
    completedButton: {
      backgroundColor: '#8A1F2B',
      color: 'white',
      padding: '14px 24px',
      borderRadius: '50px',
      border: 'none',
      float: 'right',
      marginTop: '2rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    completedButtonDisabled: {
      backgroundColor: '#c58b8b', // muted reddish
      color: '#fff',
      padding: '14px 24px',
      borderRadius: '50px',
      border: 'none',
      float: 'right',
      marginTop: '2rem',
      cursor: 'not-allowed',
      fontFamily: 'inherit',
      fontSize: '0.9rem',
      opacity: 0.6,
    },
  };

  const [showModal, setShowModal] = useState(false);
  const [hoveringBack, setHoveringBack] = useState(false);
  const [hoveringTransaction, setHoveringTransaction] = useState(false);

  const borrowedItems = [
    { img: sampleImage1, name: 'Stone 27cm Granite Dinner Plate', quantity: '12 Pcs' },
    { img: sampleImage2, name: 'Silver 14cm Tea Spoon', quantity: '12 Pcs' },
    { img: sampleImage3, name: 'Stone 27cm Granite Dinner Plate', quantity: '6 Pcs' },
  ];

  const [itemStatuses, setItemStatuses] = useState(borrowedItems.map(() => 'Reserved'));

  // check if all items are returned
  const allReturned = itemStatuses.every(status => status === 'Returned');

  const getSelectStyle = (status) => {
    const baseStyle = { ...styles.selectBase };
    let color = '#FFA500';

    switch (status) {
      case 'Reserved':
        color = '#FFA500';
        break;
      case 'Released':
        color = '#007BFF';
        break;
      case 'Returned':
        color = '#28A745';
        break;
      case 'Needs Replacement':
        color = '#DC3545';
        break;
    }

    return {
      ...baseStyle,
      color: color,
      border: `2px solid ${color}`,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='${encodeURIComponent(
        color
      )}' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
    };
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        activePage="requests"
        userRole="Staff"
        userSubrole="Admin"
        navItems={[
          { id: 'requests', name: 'Requests', icon: <FaFileAlt />, path: '/requests-admin' },
          { id: 'inventory', name: 'Inventory', icon: <FaBoxOpen />, path: '/inventory' },
          { id: 'registry', name: 'Registry', icon: <FaClipboardList />, path: '/registry' },
        ]}
      />

      <main style={styles.main}>
        <div style={styles.header}>
          <h1>Request No. 000001234</h1>
          <a
            href="/requests-admin"
            style={{
              ...styles.goBack,
              opacity: hoveringBack ? 0.8 : 1,
            }}
            onMouseOver={() => setHoveringBack(true)}
            onMouseOut={() => setHoveringBack(false)}
          >
            Go Back
          </a>
        </div>

        <p>
          Status: <span style={styles.status}>Approved</span>
        </p>
        <hr
          style={{
            border: 'none',
            borderTop: '2px solid rgba(97, 97, 97, 0.3)',
            marginTop: '1rem',
            marginBottom: '-0.6rem',
          }}
        />

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', ...styles.formGroup }}>
            <label style={styles.label}>Date Requested</label>
            <input type="text" value="July 02, 2025" style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, minWidth: '240px', ...styles.formGroup }}>
            <label style={styles.label}>Date Use</label>
            <input type="text" value="July 08, 2025" style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, minWidth: '240px', ...styles.formGroup }}>
            <label style={styles.label}>Time</label>
            <input type="text" value="8:00 AM" style={styles.input} readOnly />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', ...styles.formGroup }}>
            <label style={styles.label}>Group Leader</label>
            <input type="text" value="Student 1" style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, minWidth: '240px', ...styles.formGroup }}>
            <label style={styles.label}>Course</label>
            <input type="text" value="HM 001" style={styles.input} readOnly />
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontWeight: '600' }}>
          Group Members
        </h3>
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
            marginTop: '4rem',
            marginBottom: '0.1rem',
          }}
        >
          <h3 style={{ margin: 0, fontWeight: '600', fontSize: '20px' }}>List of Borrowed Items</h3>
          <div style={{ fontWeight: '600', fontSize: '18px', color: '#5A67D8' }}>
            Total ({borrowedItems.length})
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: '8px', minWidth: '50px' }}>Image</th>
              <th style={{ ...styles.th, textAlign: 'left', width: '315px' }}>Item Name</th>
              <th style={styles.th}>Quantity</th>
              <th style={{ ...styles.th, width: '180px' }}>Status</th>
              <th
                style={{
                  ...styles.th,
                  borderTopRightRadius: '7px',
                  textAlign: 'left',
                  paddingLeft: '20px',
                }}
              >
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {borrowedItems.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.tdBorrowed}>
                  <img src={item.img} alt="item" style={styles.image} />
                </td>
                <td style={styles.tdLeftBorrowed}>{item.name}</td>
                <td style={styles.tdBorrowed}>{item.quantity}</td>
                <td style={styles.tdBorrowed}>
                  <select
                    value={itemStatuses[idx]}
                    onChange={(e) => {
                      const updated = [...itemStatuses];
                      updated[idx] = e.target.value;
                      setItemStatuses(updated);
                    }}
                    style={getSelectStyle(itemStatuses[idx])}
                  >
                    <option value="Reserved">Reserved</option>
                    <option value="Released">Released</option>
                    <option value="Returned">Returned</option>
                    <option value="Needs Replacement">Needs Replacement</option>
                  </select>
                </td>
                <td style={styles.tdLeftBorrowed}>
                  <input type="text" style={styles.remarksInput} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          style={allReturned
            ? { ...styles.completedButton, backgroundColor: hoveringTransaction ? '#731923' : '#8A1F2B', opacity: hoveringTransaction ? 0.9 : 1 }
            : styles.completedButtonDisabled
          }
          disabled={!allReturned}
          onMouseOver={() => allReturned && setHoveringTransaction(true)}
          onMouseOut={() => allReturned && setHoveringTransaction(false)}
          onClick={() => {
            if (allReturned) {
              setShowModal(true);
            }
          }}
        >
          Transaction Completed
        </button>

        {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
      </main>
    </div>
  );
};

export default RequestApprovedAdmin;
