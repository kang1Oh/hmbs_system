import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AddUserModal from '../components/AdminModal/AddUserModal';
import UserAddedModal from '../components/AdminModal/UserAddedModal';
import UserDeletionModal from '../components/AdminModal/UserDeletionModal';
import UserDeletedModal from '../components/AdminModal/UserDeletedModal';
import ImportCSVModal from '../components/AdminModal/ImportCSVModal';
import { FaFileAlt, FaBoxOpen, FaClipboardList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const USERS_PER_PAGE = 5;

const roleTabs = ['Custodians', 'Program Heads', 'Instructors'];

const CRUDUserPageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [staffByRole, setStaffByRole] = useState({});
  const [students, setStudents] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserAddedModal, setShowUserAddedModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserDeletedModal, setShowUserDeletedModal] = useState(false);
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
      marginBottom: '1.5rem',
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
    importBtn: { marginTop: '-1.5rem',padding: '7px 25px', background: '#21be6dff', color: 'white', border: '1px solid #21be6dff', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', display: 'flex', fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
    exportButton: { padding: '7px 25px', background: '#15814dff', color: 'white', border: '1px solid #15814dff', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', display: 'flex', fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
    addButton: { backgroundColor: '#991F1F', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Poppins, sans-serif' },
    
  };

  // 📤 Handle Export CSV
  const handleExport = async () => {
    // when requesting export
    axios.get('/api/users/export', {
      withCredentials: true, // 🔑 required so session cookie is sent
      responseType: 'blob',  // so browser handles CSV download correctly
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      console.error("Export failed:", err.response?.data || err.message);
    });
  };

  // fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', { withCredentials: true });
      setUsers(res.data);
      groupUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const groupUsers = (all) => {
    // Group staff (role_id 1 2 and 3) and students (role_id 4)
    const staff = {
      'Custodians': all.filter(u => u.role_id === 1),
      'Instructors': all.filter(u => u.role_id === 2),
      'Program Heads': all.filter(u => u.role_id === 3),
    };
    const studs = all.filter(u => u.role_id === 4);

    setStaffByRole(staff);
    setStudents(studs);
  };

  const handleRegisterUser = async (formData) => {
    try {
      const roleIDMap = {
        Student: 4,
        Instructor: 2,
        'Program Head': 3,
        Custodian: 1,
      };

      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role_id: roleIDMap[formData.role],
      };

      const res = await axios.post('/api/users', payload, { withCredentials: true });

      // res.data contains the new user (safeDoc without password)
      await fetchUsers(); // refresh user list
      setShowUserAddedModal(true);
      setShowAddUserModal(false);
    } catch (err) {
      console.error('Error adding user:', err);
      if (err.response?.data?.error) {
        toast.error(`Failed to add user: ${err.response.data.error}`);
      } else {
        toast.error('Failed to add user: Unknown error');
      }
    }
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
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(data, page).map((user, index) => (
                <tr key={user._id}>
                  <td style={styles.td}>{index + 1 + (page - 1) * USERS_PER_PAGE}</td>
                  <td style={styles.td}>{user.user_id}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{roleLabel}</td>
                  <td style={styles.td}>
                    <div style={styles.actionIcons}>
                      <Trash2
                        size={16}
                        title="Delete User"
                        style={{ color: '#000', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                      />
                    </div>
                  </td>
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

          {(() => {
            const totalPages = Math.ceil(totalItems / USERS_PER_PAGE);
            const maxVisible = 5;
            const half = Math.floor(maxVisible / 2);

            let start = Math.max(1, page - half);
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
              start = Math.max(1, end - maxVisible + 1);
            }

            return Array.from({ length: end - start + 1 }).map((_, index) => {
              const pageNum = start + index;
              return (
                <button
                  key={pageNum}
                  style={styles.pageButton(page === pageNum)}
                  onClick={() => handlePageChange(pageNum, setPage, totalItems)}
                >
                  {pageNum}
                </button>
              );
            });
          })()}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={styles.exportButton} onClick={handleExport}>Export CSV</button>
            <button style={styles.addButton} onClick={() => setShowAddUserModal(true)}>
              <FiPlus /> Add New User
            </button>
          </div>
        </div>

        {/* Staff Section */}
        <div style={styles.groupedSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={styles.sectionTitle}>Staffs</p>
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
          {renderTable(staffByRole[activeTab] || [], styles.staffTableWrapper, currentPage, setCurrentPage, activeTab)}
        </div>

        {/* Student Section */}
        <div style={styles.groupedSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={styles.sectionTitle}>Students</p>
            <button style={styles.importBtn} onClick={() => setShowImportCSVModal(true)}>Import CSV</button>
          </div>
          {renderTable(students, styles.studentTableWrapper, studentPage, setStudentPage, 'Student')}
        </div>
      </main>

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onRegister={(formData) => handleRegisterUser(formData)}
        />
      )}
      {showUserAddedModal && <UserAddedModal onDone={() => setShowUserAddedModal(false)} />}
      {showDeleteModal && (
        <UserDeletionModal
          user={selectedUser}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={async () => {
            try {
              await axios.delete(`/api/users/${selectedUser._id}`, { withCredentials: true });
              setShowDeleteModal(false);
              setShowUserDeletedModal(true);

              fetchUsers(); // refresh list
            } catch (err) {
              console.error("Failed to delete user:", err);
            }
          }}
        />
      )}
      {showUserDeletedModal && (<UserDeletedModal onDone={() => setShowUserDeletedModal(false)} />)}
      {showImportCSVModal && (
        <ImportCSVModal
          onClose={() => setShowImportCSVModal(false)}
          endpoint={"/api/users/import"}
          entityName={"user"}
          onImportSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default CRUDUserPageAdmin;