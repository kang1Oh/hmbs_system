import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestProgHeadPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [hoveredArrow, setHoveredArrow] = useState(null);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const requestsToDisplay = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get('/api/borrow-requests/programhead/new');

        const formatted = data.map((req) => ({
          requestId: req.request_slip_id,
          name: req.student_name,
          subject: req.subject,
          requestDate: req.date_requested,
          status: req.status, 
          _id: req._id,
        }));

        setRequests(formatted);
      } catch (err) {
        console.error('Error fetching program head requests', err);
      }
    };

    fetchRequests();
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handleNavigate = (id) => navigate(`/request-details-programhead/${id}`);

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Poppins, sans-serif',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '240px',
      height: '100vh',
      backgroundColor: '#8A1F2B',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem 0rem 0rem 0rem',
      zIndex: 1000,
    },
    main: {
      marginLeft: '240px',
      flex: 1,
      backgroundColor: '#ffffff',
      padding: '2rem',
      minHeight: '100vh',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      marginTop: '1rem',
      background: 'white',
      border: '1px solid #8A1F2B',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    },
    thtd: {
      padding: '1rem',
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
    },
    rowHover: {
      cursor: 'pointer',
    },
    theadCell: {
      padding: '1.1rem 1rem',
      textAlign: 'center',
      backgroundColor: '#a52a2a',
      color: 'white',
      fontWeight: 100,
    },
    statusBadge: {
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.85rem',
    },
    newreq: {
      backgroundColor: '#23a6f0',
    },
    approvedreq: {
      backgroundColor: '#f29544ff',
    },
    deniedreq: {
      backgroundColor: '#DC2626',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '2rem',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    pageButton: (active) => ({
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: '1px solid #8A1F2B',
      backgroundColor: active ? '#8A1F2B' : '#fff',
      color: active ? '#fff' : '#8A1F2B',
      fontWeight: 500,
      fontSize: '14px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      fontFamily: 'Poppins, sans-serif',
    }),
    navButton: (disabled) => ({
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      backgroundColor: disabled ? '#ccc' : '#8A1F2B',
      border: 'none',
      color: 'white',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s ease',
    }),
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1.3rem',
      marginBottom: '-0.3rem',
    },
    header: { marginBottom: '20px' },
    headerTitle: { margin: 0 },
    headerSubtitle: { margin: '-4px 0 15px', fontSize: '18px' },
    legend: { display: 'flex', gap: '20px', marginBottom: '10px', flexWrap: 'wrap' },
    legendItem: { display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '600', gap: '10px' },
    legendCircle: { width: '28px', height: '27px', borderRadius: '50%', display: 'inline-block' },
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        activePage="requests"
        userRole="Staff"
        userSubrole="Program Head"
        navItems={[{ id: 'requests', name: 'Requests', icon: <FaFileAlt />, path: '/requests-programhead' }]}
      />

      <main style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Lists of Requests</h2>
          <p style={styles.headerSubtitle}>List of all borrowing requests submitted by students</p>
          <div style={styles.legend}>
            <div style={styles.legendItem}><span style={{ ...styles.legendCircle, backgroundColor: '#2D9CDB' }}></span> New Request</div>
            <div style={styles.legendItem}><span style={{ ...styles.legendCircle, backgroundColor: '#f29544ff' }}></span> Approved & Forwarded Request</div>
          </div>
        </div>
        <div style={styles.headerRow}>
          <h3 style={{ fontWeight: '600' }}>{requests.length} New Requests</h3>
          <div style={{ fontSize: '15px', color: '#444', fontWeight: 500 }}>
            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, requests.length)} out of {requests.length}
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.theadCell}>#</th>
              <th style={styles.theadCell}>Request ID</th>
              <th style={styles.theadCell}>Name</th>
              <th style={styles.theadCell}>Subject</th>
              <th style={styles.theadCell}>Request Date</th>
              <th style={styles.theadCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requestsToDisplay.map((req, idx) => {
              const rowIndex = indexOfFirstItem + idx;
              const isHovered = hoveredRowIndex === rowIndex;

              let badgeStyle = styles.newreq;
              if (req.status === "Approved") {
                badgeStyle = styles.approvedreq; 
              }else if (req.status === "Denied") {
                badgeStyle = styles.deniedreq; 
              }

              return (
                <tr
                  key={rowIndex}
                  onClick={() => handleNavigate(req._id)}
                  onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                  style={{
                    ...styles.rowHover,
                    backgroundColor: isHovered ? "#ffe6e9" : idx % 2 === 0 ? "white" : "#f9f9f9",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <td style={styles.thtd}>{rowIndex + 1}</td>
                  <td style={styles.thtd}>{req.requestId}</td>
                  <td style={styles.thtd}>{req.name}</td>
                  <td style={styles.thtd}>{req.subject}</td>
                  <td style={styles.thtd}>
                    {req.requestDate
                      ? new Date(req.requestDate).toISOString().split("T")[0]
                      : ""}
                  </td>
                  <td style={styles.thtd}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...badgeStyle,
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={styles.paginationContainer}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            onMouseEnter={() => setHoveredArrow('left')}
            onMouseLeave={() => setHoveredArrow(null)}
            style={{
              ...styles.navButton(currentPage === 1),
              ...(hoveredArrow === 'left' && currentPage !== 1 ? { backgroundColor: '#a22c38' } : {}),
            }}
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              onMouseEnter={() => setHoveredPage(num)}
              onMouseLeave={() => setHoveredPage(null)}
              style={{
                ...styles.pageButton(num === currentPage),
                ...(hoveredPage === num && num !== currentPage
                  ? { backgroundColor: '#8A1F2B', color: '#fff' }
                  : {}),
              }}
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            onMouseEnter={() => setHoveredArrow('right')}
            onMouseLeave={() => setHoveredArrow(null)}
            style={{
              ...styles.navButton(currentPage === totalPages),
              ...(hoveredArrow === 'right' && currentPage !== totalPages
                ? { backgroundColor: '#a22c38' }
                : {}),
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default RequestProgHeadPage;
