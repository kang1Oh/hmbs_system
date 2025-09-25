import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hmbsLogo from '../assets/site-images/hmbs-logo-white.png';
import handcartIcon from '../assets/handcart.png';
import userIcon from '../assets/user.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import { useCart } from '../context/CartContext';

function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.selectedQty, 0);
  
  // Fetch user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, { withCredentials: true }); 
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('user'); // Clear local data
      navigate('/'); // Redirect to login page
    }
  };

  const [showLogoutDropdown, setLogoutDropdown] = useState(false);

  const handleCartClick = () => {
    navigate('/cart');  // Navigate to the cart page
  };

  const wrapperStyle = {
    position: 'relative',
    zIndex: 10, 
  };

  const headerStyle = {
    backgroundColor: '#861111',
    color: 'white',
    padding: '0.75rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
    fontFamily: "'Poppins', sans-serif",
  };

  const logoStyle = {
    height: '60px',
    width: 'auto',
  };

  const navContainerStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  const navStyle = {
    display: 'flex',
    gap: '2.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
  };

  const rightIconsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    position: 'relative',
  };

  const iconStyle = {
    height: '32px',
    width: '32px',
    cursor: 'pointer',
    position: 'relative',
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    backgroundColor: '#f6c235',
    color: '#861111',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const LogoutBoxStyle = {
    position: 'absolute',
    top: '45px',
    right: '0',
    backgroundColor: '#ffffff',
    padding: '6px 16px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '600',
    fontSize: '14px',
    color: '#000000',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    display: 'inline-block',
    zIndex: 9999, 
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showLogoutDropdown) return;
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('logout-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setLogoutDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutDropdown]);

  return (
    <div style={wrapperStyle}>
      <header style={headerStyle}>
        {/* Left: Logo */}
        <img src={hmbsLogo} alt="HMBS Logo" style={logoStyle} />

        {/* Center: Navigation */}
        <div style={navContainerStyle}>
          <nav>
            <ul style={navStyle}>
              <li>
                <Link
                  to="/equipment"
                  style={{
                    ...linkStyle,
                    color: window.location.pathname === '/equipment' ? '#f6c235' : 'white'
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  style={{
                    ...linkStyle,
                    color: window.location.pathname === '/about' ? '#f6c235' : 'white'
                  }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/transaction"
                  style={{
                    ...linkStyle,
                    color: window.location.pathname === '/transaction' ? '#f6c235' : 'white'
                  }}
                >
                  Transaction
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        
        {/* Right: Icons */}
        <div style={rightIconsStyle}>
          {/* Cart Icon with Badge */}
          <div style={{ position: 'relative' }} onClick={() => handleCartClick()}>
            <img src={handcartIcon} alt="Cart" style={iconStyle} />
            {totalItems > 0 && (
              <div style={badgeStyle}>{totalItems}</div>
            )}
          </div>

          {/* User Icon */}
          <div style={{ position: 'relative' }}>
            <img
              src={userIcon}
              alt="User"
              style={iconStyle}
              onClick={() => setLogoutDropdown(!showLogoutDropdown)}
            />
            {showLogoutDropdown && (
              <div id="logout-dropdown" style={LogoutBoxStyle}>
                <p style={{ margin: '0 0 8px 0', pointerEvents: 'none' }}>Hello, <span style={{color: '#861111'}}>{user.name}</span>!</p>
                <div
                  style={{
                    cursor: 'pointer',
                    padding: '4px 0',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                  }}
                  onClick={() => {
                    setShowLogoutModal(true);
                    setLogoutDropdown(false);
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f2f2f2';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}

    </div>
  );
}

export default Header;