import React, { useState, useRef, useEffect } from 'react';
import { SquarePen, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { FaFileAlt, FaBoxOpen, FaClipboardList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestAdminPage = () => {
  const navigate = useNavigate();

  const [allRequests, setAllRequests] = useState([]);
  const [pastTransactions, setPastTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [allPage, setAllPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [hoveredArrow, setHoveredArrow] = useState(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);

  const entriesPerPage = 10;

  const handleNavigate = (request) => {
    if (request.status_id === 2 || request.status_id === 3 || request.status_id === 4) {
      navigate(`/request-approved-admin/${request._id}`);
    } else {
      navigate(`/request-details-admin/${request._id}`);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [allRes, pastRes] = await Promise.all([
          axios.get('/api/borrow-requests/for-admin'),
          axios.get('/api/borrow-requests/completed'),
        ]);

        const normalize = (arr) => arr.map((r) => ({
          requestId: r.request_slip_id || r._id,
          name: r.student_name || "Unknown",
          subject: r.subject,
          requestDate: r.date_requested,
          statusLabel: r.status,
          status_id: r.status_id,
          _id: r._id,
        }));

        setAllRequests(normalize(allRes.data));
        setPastTransactions(normalize(pastRes.data));
      } catch (err) {
        console.error('Error fetching admin requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const onDocClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const filteredAllRequests = allRequests.filter(d => statusFilter === 'All Status' || d.statusLabel === statusFilter);
  const paginatedAll = filteredAllRequests.slice((allPage - 1) * entriesPerPage, allPage * entriesPerPage);
  const paginatedPast = pastTransactions.slice((pastPage - 1) * entriesPerPage, pastPage * entriesPerPage);

  const totalAllPages = Math.max(1, Math.ceil(filteredAllRequests.length / entriesPerPage));
  const totalPastPages = Math.max(1, Math.ceil(pastTransactions.length / entriesPerPage));

  const allTotal = filteredAllRequests.length;
  const allStart = allTotal === 0 ? 0 : (allPage - 1) * entriesPerPage + 1;
  const allEnd = Math.min(allTotal, allPage * entriesPerPage);

  const pastTotal = pastTransactions.length;
  const pastStart = pastTotal === 0 ? 0 : (pastPage - 1) * entriesPerPage + 1;
  const pastEnd = Math.min(pastTotal, pastPage * entriesPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return '#2D9CDB'; // blue
      case 'On-Going':
        return '#F2C94C'; // green
      case 'Completed':
        return '#27AE60'; // gray
      case 'Denied':
        return '#DC2626'; // red
      default:
        return '#9CA3AF'; // neutral gray
    }
  };

  const styles = {
    adminPage: { display: 'flex', fontFamily: 'Poppins, sans-serif', minHeight: '100vh', width: '100vw', overflow: 'hidden' },
    content: { flex: 1, padding: '30px', marginLeft: '240px', overflowY: 'auto', height: '100vh' },
    header: { marginBottom: '20px' },
    headerTitle: { margin: 0 },
    headerSubtitle: { margin: '-4px 0 15px', fontSize: '17px', color: '#666' },
    legend: { display: 'flex', gap: '20px', marginBottom: '10px', flexWrap: 'wrap' },
    legendItem: { display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '600', gap: '10px' },
    legendCircle: { width: '28px', height: '27px', borderRadius: '50%', display: 'inline-block' },
    requestsTable: { backgroundColor: 'transparent', padding: '27px 30px', borderRadius: '10px', border: '1px solid #991F1F', marginBottom: '35px' },
    tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' },
    totalRequests: { fontSize: '18px', marginBottom: '5px', color: '#333' },
    sortBtn: { background: 'transparent', border: '1px solid #991f1f', borderRadius: '5px', padding: '0.5rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#991f1f', fontSize: '14px', marginBottom: '12px', fontFamily: 'Poppins, sans-serif', gap: '8px' },
    dropdownMenu: { position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid #991f1f', borderRadius: '6px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', minWidth: '160px', zIndex: 40, overflow: 'hidden' },
    dropdownItem: { padding: '10px 12px', fontSize: '14px', cursor: 'pointer', color: '#333', userSelect: 'none' },
    tableWrapper: { borderLeft: '1px solid #991F1F', borderRight: '1px solid #991F1F', borderBottom: '1px solid #991F1F', borderRadius: '14px 14px 10px 10px' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent' },
    tableHead: { backgroundColor: '#991f1f', color: '#fff' },
    tableHeaderCell: { padding: '15px 22px', fontSize: '16px', textAlign: 'center', verticalAlign: 'middle', fontWeight:'100'},
    tableCell: { padding: '10px 5px', fontSize: '16px', textAlign: 'center', verticalAlign: 'middle', backgroundColor: 'transparent' },
    narrowHeaderCell: { padding: '0 25px 0 18px', fontSize: '16px', textAlign: 'center', verticalAlign: 'middle', fontWeight:'100' },
    narrowCell: { padding: '0px 26px 0 16px', fontSize: '16px', textAlign: 'center', verticalAlign: 'middle', backgroundColor: 'transparent' },
    statusTag: { width: '115px', height: '32px', lineHeight: '30px', textAlign: 'center', borderRadius: '99px', color: '#fff', fontSize: '14px', display: 'inline-block' },
    exportBtn: { background: '#991f1f', border: '1px solid #991f1f', borderRadius: '999px', padding: '8px 25px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '12px', fontFamily: 'Poppins, sans-serif' },
    showingWrapper: { display: 'flex', justifyContent: 'center', marginTop: '12px', marginBottom: '-10px' },
    showingText: { fontSize: '15px', color: '#333' },
    paginationContainer: { display: 'flex', justifyContent: 'center', marginTop: '2rem', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontFamily: 'Poppins, sans-serif' },
    pageButton: (active) => ({ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #8A1F2B', backgroundColor: active ? '#8A1F2B' : '#fff', color: active ? '#fff' : '#8A1F2B', fontWeight: 500, fontSize: '14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', fontFamily: 'Poppins, sans-serif' }),
    navButton: (disabled) => ({ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #991F1F', backgroundColor: '#991F1F', color: '#fff', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif' })
  };

  const renderPagination = (currentPage, totalPages, setPage) => {
    const maxVisible = 5, half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half), end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
      <div style={styles.paginationContainer}>
        <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
          onMouseEnter={() => setHoveredArrow('left')} onMouseLeave={() => setHoveredArrow(null)}
          style={{ ...styles.navButton(currentPage === 1), ...(hoveredArrow === 'left' && currentPage !== 1 ? { backgroundColor: '#a22c38' } : {}) }}>
          <FaChevronLeft />
        </button>
        {pages.map((num) => (
          <button key={num} onClick={() => setPage(num)} onMouseEnter={() => setHoveredPage(num)} onMouseLeave={() => setHoveredPage(null)}
            style={{ ...styles.pageButton(num === currentPage), ...(hoveredPage === num && num !== currentPage ? { backgroundColor: '#8A1F2B', color: '#fff' } : {}) }}>
            {num}
          </button>
        ))}
        <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
          onMouseEnter={() => setHoveredArrow('right')} onMouseLeave={() => setHoveredArrow(null)}
          style={{ ...styles.navButton(currentPage === totalPages), ...(hoveredArrow === 'right' && currentPage !== totalPages ? { backgroundColor: '#a22c38' } : {}) }}>
          <FaChevronRight />
        </button>
      </div>
    );
  };

  const dropdownOptions = ['All Status', 'New', 'On-Going', 'Denied'];

  return (
    <div style={styles.adminPage}>
      <Sidebar activePage="requests" userRole="Staff" userSubrole="Admin"
        navItems={[{ id: 'requests', name: 'Requests', icon: <FaFileAlt />, path: '/requests-admin' }, { id: 'inventory', name: 'Inventory', icon: <FaBoxOpen />, path: '/inventory' }, { id: 'registry', name: 'Registry', icon: <FaClipboardList />, path: '/registry' }]} />
      <main style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Lists of Requests</h2>
          <p style={styles.headerSubtitle}>List of all borrowing requests submitted by students</p>
          <div style={styles.legend}>
            <div style={styles.legendItem}><span style={{ ...styles.legendCircle, backgroundColor: '#2D9CDB' }}></span> New Request</div>
            <div style={styles.legendItem}><span style={{ ...styles.legendCircle, backgroundColor: '#F2C94C' }}></span> On-going Request</div>
            <div style={styles.legendItem}><span style={{ ...styles.legendCircle, backgroundColor: '#27AE60' }}></span> Completed Request</div>
            <div style={styles.legendItem}><span style={{ ...styles.legendCircle, backgroundColor: '#DC2626' }}></span> Denied Request</div>
          </div>
        </div>
        {/* All Requests */}
        <div style={styles.requestsTable}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={{ marginBottom: '-4px', fontSize: '22px' }}>All Requests</h3>
              <p style={styles.totalRequests}>Total Requests: {filteredAllRequests.length}</p>
            </div>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button type="button" style={styles.sortBtn} onClick={() => setDropdownOpen(prev => !prev)} aria-haspopup="true" aria-expanded={dropdownOpen}>
                {statusFilter}<ChevronDown size={14} style={{ marginLeft: '6px', color: '#991f1f' }} />
              </button>
              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  {dropdownOptions.map(option => (
                    <div key={option} onClick={() => { setStatusFilter(option); setAllPage(1); setDropdownOpen(false); }}
                      onMouseEnter={() => setHoveredMenuItem(option)} onMouseLeave={() => setHoveredMenuItem(null)}
                      style={{ ...styles.dropdownItem, backgroundColor: hoveredMenuItem === option ? '#fafafa' : '#fff', fontWeight: option === statusFilter ? 600 : 400 }}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={{ ...styles.narrowHeaderCell, borderTopLeftRadius: '10px' }}>#</th>
                  <th style={styles.tableHeaderCell}>Request ID</th>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Subject</th>
                  <th style={styles.tableHeaderCell}>Request Date</th>
                  <th style={{ ...styles.tableHeaderCell, borderTopRightRadius: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAll.map((item, index) => {
                  const isLastRow = index === paginatedAll.length - 1;
                  return (
                    <tr
                      key={index}
                      onClick={() => handleNavigate(item)}
                      style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      <td style={{ ...styles.narrowCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{(allPage - 1) * entriesPerPage + index + 1}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{item.requestId}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{item.name}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{item.subject}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>
                        {item.requestDate
                          ? new Date(item.requestDate).toISOString().split("T")[0]
                          : ""}
                      </td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}><span style={{ ...styles.statusTag, backgroundColor: getStatusColor(item.statusLabel) }}>{item.statusLabel}</span></td>
                    </tr>
                  );
                })}
                {paginatedAll.length === 0 && (
                  <tr><td colSpan={7} style={{ ...styles.tableCell, padding: '30px 10px', color: '#666' }}>No requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={styles.showingWrapper}><div style={styles.showingText}>Showing {allStart}–{allEnd} of {allTotal} entries</div></div>
          {renderPagination(allPage, totalAllPages, setAllPage)}
        </div>
        {/* Past Transactions */}
        <div style={styles.requestsTable}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={{ marginBottom: '-4px', fontSize: '22px' }}>Past Transactions</h3>
              <p style={styles.totalRequests}>Track completed borrow request transactions</p>
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={{ ...styles.narrowHeaderCell, borderTopLeftRadius: '10px' }}>#</th>
                  <th style={styles.tableHeaderCell}>Request ID</th>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Subject</th>
                  <th style={styles.tableHeaderCell}>Request Date</th>
                  <th style={{ ...styles.tableHeaderCell, borderTopRightRadius: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPast.map((item, index) => {
                  const isLastRow = index === paginatedPast.length - 1;
                  return (
                    <tr
                      key={index}
                      onClick={() => handleNavigate(item)}
                      style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      <td style={{ ...styles.narrowCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{(pastPage - 1) * entriesPerPage + index + 1}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{item.requestId}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{item.name}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>{item.subject}</td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}>
                        {item.requestDate
                          ? new Date(item.requestDate).toISOString().split("T")[0]
                          : ""}
                      </td>
                      <td style={{ ...styles.tableCell, borderBottom: isLastRow ? 'none' : '1px solid #E5E7EB' }}><span style={{ ...styles.statusTag, backgroundColor: getStatusColor(item.statusLabel) }}>{item.statusLabel}</span></td>
                    </tr>
                  );
                })}
                {paginatedPast.length === 0 && (
                  <tr><td colSpan={6} style={{ ...styles.tableCell, padding: '30px 10px', color: '#666' }}>No past transactions.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={styles.showingWrapper}><div style={styles.showingText}>Showing {pastStart}–{pastEnd} of {pastTotal} entries</div></div>
          {renderPagination(pastPage, totalPastPages, setPastPage)}
        </div>
      </main>
    </div>
  );
};

export default RequestAdminPage;
