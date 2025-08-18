import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import hmbsLogoWhite from '../assets/site-images/hmbs-logo-white.png';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal'; // Make sure the path is correct

const Sidebar = ({ activePage, navItems, userRole = 'User', userSubrole = 'Admin' }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleCancel = () => setShowLogoutModal(false);
  const handleConfirmLogout = () => {
    navigate('/staff-login');
  };

  const styles = {
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '240px',
      height: '100vh',
      backgroundColor: '#991F1F',
      color: 'white',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      fontfamily: 'Poppins, sans-serif',
    },
    sidebarInner: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
    },
    logo: {
      width: '120px',
      margin: '2rem 0',
    },
    navSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    navButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      width: '90%',
      padding: '1rem',
      marginBottom: '0.5rem',
      borderRadius: '10px',
      fontSize: '1.1rem',
      justifyContent: 'flex-start',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    navActive: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    sidebarBottom: {
      backgroundColor: '#FCD34D',
      color: 'black',
      padding: '0.75rem 1rem',
      borderRadius: '12px 12px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontFamily: 'Poppins, sans-serif',
    },
    logoutButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.5rem',
      color: 'black',
    },
  };

  return (
    <>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarInner}>
          <div style={styles.navSection}>
            <img src={hmbsLogoWhite} alt="HMBS Logo" style={styles.logo} />
            {navItems.map((item) => (
              <button
                key={item.id}
                style={{
                  ...styles.navButton,
                  ...(activePage === item.id ? styles.navActive : {}),
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')
                }
                onMouseLeave={(e) => {
                  if (activePage !== item.id)
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>

          <div style={styles.sidebarBottom}>
            <div style={styles.userInfo}>
              <FaUserCircle size={30} />
              <div>
                <strong>{userRole}</strong>
                <div style={{ fontSize: '0.85rem' }}>{userSubrole}</div>
              </div>
            </div>
            <button style={styles.logoutButton} onClick={handleLogoutClick}>
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal
          onCancel={handleCancel}
          onConfirm={handleConfirmLogout}
        />
      )}
    </>
  );
};

export default Sidebar;
