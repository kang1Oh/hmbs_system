// All existing imports remain the same
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AddUserModal from '../components/AdminModal/AddUserModal';
import UserAddedModal from '../components/AdminModal/UserAddedModal';
import ImportCSVModal from '../components/AdminModal/ImportCSVModal';
import ImportSuccessModal from '../components/AdminModal/ImportSuccessModal';
import { FaFileAlt, FaBoxOpen, FaClipboardList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const USERS_PER_PAGE = 5;

// Different dummy data for each tab
const dummyDataByRole = {
  Custodians: Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    userId: `2022-${String(index + 1).padStart(5, '0')}`,
    name: `Custodian User ${index + 1}`,
    email: `custodian${index + 1}@usep.edu.ph`,
  })),
  'Program Heads': Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    userId: `2022-${String(index + 1).padStart(5, '0')}`,
    name: `Program Head User ${index + 1}`,
    email: `proghead${index + 1}@usep.edu.ph`,
  })),
  Instructors: Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    userId: `2022-${String(index + 1).padStart(5, '0')}`,
    name: `Instructor User ${index + 1}`,
    email: `instructor${index + 1}@usep.edu.ph`,
  })),
};

// Dummy student list (separate)
const dummyStudents = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  userId: `2022-STU-${String(index + 1).padStart(5, '0')}`,
  name: `Student User ${index + 1}`,
  email: `student${index + 1}@usep.edu.ph`,
}));

const roleTabs = ['Custodians', 'Program Heads', 'Instructors'];

const CRUDUserPageAdmin = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserAddedModal, setShowUserAddedModal] = useState(false);
  const [showImportCSVModal, setShowImportCSVModal] = useState(false);
  const [showImportSuccessModal, setShowImportSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState(roleTabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);

  const styles = {
    layout: {
      display: 'flex',
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: '#fff',
    },
    main: {
      marginLeft: '240px',
      padding: '2rem',
      flex: 1,
      backgroundColor: '#fff',
      minHeight: '100vh',
    },
    topSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    titleGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: { fontSize: '1.6rem', fontWeight: 600 },
    subtitle: { color: '#666', fontSize: '17px' , marginBottom: '-0.5rem' },
    button: {
      backgroundColor: '#991F1F',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1.1rem',
      borderRadius: '20px',
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
    },
    groupedSection: {
      border: '1.5px solid #991F1F',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      backgroundColor: '#fff',
    },
    sectionTitle: {
      fontWeight: 600,
      fontSize: '1.4rem',
      marginBottom: '1rem',
      color: '#000',
    },
    tabsContainer: {
      display: 'flex',
      marginBottom: '-1.5px',
    },
    tab: (active) => ({
      padding: '0.6rem 1.2rem',
      border: '1.5px solid #991F1F',
      borderBottom: active ? 'none' : '1.5px solid #991F1F',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      backgroundColor: active ? '#fff' : '#f5f5f5',
      fontWeight: 500,
      fontSize: '15px',
      color: '#000',
      cursor: 'pointer',
    }),
    staffTableWrapper: {
      border: '1.5px solid #991F1F',
      borderTop: 'none',
      borderRadius: '0 12px 12px 12px',
      overflow: 'hidden',
    },
    studentTableWrapper: {
      border: '1.5px solid #991F1F',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'Poppins, sans-serif',
    },
    th: {
      backgroundColor: '#991F1F',
      color: '#fff',
      padding: '0.75rem',
      textAlign: 'left',
      fontWeight: 500,
      fontSize: '16px',
    },
    td: {
      padding: '0.75rem',
      fontSize: '16px',
      borderTop: '1px solid #ddd',
    },
    paginationInfo: {
      textAlign: 'center',
      marginTop: '0.7rem',
      fontSize: '15px',
      color: '#555',
      marginBottom: '15px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    pageButton: (active) => ({
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: '1px solid #991F1F',
      backgroundColor: active ? '#991F1F' : '#fff',
      color: active ? '#fff' : '#991F1F',
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    navIconButton: (disabled) => ({
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: '1px solid #991F1F',
      backgroundColor: '#991F1F',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }),
  };

  const handlePageChange = (page, setter, totalItems) => {
    if (page >= 1 && page <= Math.ceil(totalItems / USERS_PER_PAGE)) {
      setter(page);
    }
  };

  const getPaginated = (data, page) =>
    data.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  const renderTable = (data, wrapperStyle, page, setPage, roleLabel) => {
    const totalItems = data.length;
    const start = (page - 1) * USERS_PER_PAGE + 1;
    const end = Math.min(start + USERS_PER_PAGE - 1, totalItems);

    return (
      <>
        <div style={wrapperStyle}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>User ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(data, page).map((user, index) => (
                <tr key={user.id}>
                  <td style={styles.td}>{index + 1 + (page - 1) * USERS_PER_PAGE}</td>
                  <td style={styles.td}>{user.userId}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{roleLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.paginationInfo}>
          Showing {start} to {end} of {totalItems} entries
        </div>

        <div style={styles.pagination}>
          <button
            style={styles.navIconButton(page === 1)}
            onClick={() => handlePageChange(page - 1, setPage, totalItems)}
            disabled={page === 1}
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: Math.ceil(totalItems / USERS_PER_PAGE) }).map((_, index) => (
            <button
              key={index}
              style={styles.pageButton(page === index + 1)}
              onClick={() => handlePageChange(index + 1, setPage, totalItems)}
            >
              {index + 1}
            </button>
          ))}
          <button
            style={styles.navIconButton(page === Math.ceil(totalItems / USERS_PER_PAGE))}
            onClick={() => handlePageChange(page + 1, setPage, totalItems)}
            disabled={page === Math.ceil(totalItems / USERS_PER_PAGE)}
          >
            <FaChevronRight />
          </button>
        </div>
      </>
    );
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        activePage="registry"
        userRole="Staff"
        userSubrole="Admin"
        navItems={[
          { id: 'requests', name: 'Requests', icon: <FaFileAlt />, path: '/requests-admin' },
          { id: 'inventory', name: 'Inventory', icon: <FaBoxOpen />, path: '/inventory' },
          { id: 'registry', name: 'Registry', icon: <FaClipboardList />, path: '/registry' },
        ]}
      />
      <main style={styles.main}>
        <div style={styles.topSection}>
          <div style={styles.titleGroup}>
            <h2 style={{ margin: 0, lineHeight: '1.2', fontWeight: 'bold' }}>Registered Users</h2>
            <p style={styles.subtitle}>View the list of all registered users in the system and their roles</p>
          </div>
          <button style={styles.button} onClick={() => setShowAddUserModal(true)}>Add New User</button>
        </div>

        {/* Staff Section */}
        <div style={styles.groupedSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={styles.sectionTitle}>Staffs</p>
            <button style={styles.button} onClick={() => setShowImportCSVModal(true)}>Import CSV File</button>
          </div>
          <div style={styles.tabsContainer}>
            {roleTabs.map((role) => (
              <div
                key={role}
                style={styles.tab(role === activeTab)}
                onClick={() => {
                  setActiveTab(role);
                  setCurrentPage(1);
                }}
              >
                {role}
              </div>
            ))}
          </div>
          {renderTable(dummyDataByRole[activeTab], styles.staffTableWrapper, currentPage, setCurrentPage, activeTab)}
        </div>

        {/* Student Section */}
        <div style={styles.groupedSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={styles.sectionTitle}>Students</p>
            <button style={styles.button} onClick={() => setShowImportCSVModal(true)}>Import CSV File</button>
          </div>
          {renderTable(dummyStudents, styles.studentTableWrapper, studentPage, setStudentPage, 'Student')}
        </div>
      </main>

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onRegister={() => {
            setShowAddUserModal(false);
            setShowUserAddedModal(true);
          }}
        />
      )}
      {showUserAddedModal && <UserAddedModal onDone={() => setShowUserAddedModal(false)} />}
      {showImportCSVModal && (
        <ImportCSVModal
          onClose={() => setShowImportCSVModal(false)}
          onImport={() => {
            setShowImportCSVModal(false);
            setShowImportSuccessModal(true);
          }}
        />
      )}
      {showImportSuccessModal && <ImportSuccessModal onDone={() => setShowImportSuccessModal(false)} />}
    </div>
  );
};

export default CRUDUserPageAdmin;
