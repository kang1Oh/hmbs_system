import React, { useState } from 'react';
import axios from 'axios';
import hmbsLogo from '../assets/site-images/hmbs-logo-maroon.png';
import backgroundImage from '../assets/site-images/building-background1.png';
import { useNavigate, Link } from 'react-router-dom';

function StaffLoginPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogIn = async () => {
    try {
      const res = await axios.post(
        "api/users/login", 
        { email, password },
        { withCredentials: true } // Ensure cookies are sent with the request
      );

      if (res.data.success) {
        const user = res.data.user;

        // Redirect based on role_id
        switch (user.role_id) {
          case '1': // Admin
            // Store user info in localStorage
            localStorage.setItem("user", JSON.stringify(user));
            navigate('/requests-admin');
            break;
          case '2': // Instructor
            localStorage.setItem("user", JSON.stringify(user));
            navigate('/requests-instructor');
            break;
          case '3': // Program Head
            localStorage.setItem("user", JSON.stringify(user));
            navigate('/requests-instructor');
            navigate('/requests-programhead');
            break;
          case '4': // Student
            setError('You are trying to log in as a Student. Redirect to Student Login.');
            break;
          default:
            setError('Role not recognized. Contact admin.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };


  const pageStyle = {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: `url(${backgroundImage}) center/cover no-repeat`,
    justifyContent: 'flex-end',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
  };

  const formContainerStyle = {
    width: '45vw',
    maxWidth: '620px',
    height: '100vh',
    backgroundColor: '#ffffffee',
    borderTopLeftRadius: '30px',
    borderBottomLeftRadius: '30px',
    padding: '48px 40px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  const logoStyle = { width: 140, marginBottom: 32 };

  const headingStyle = {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 29,
    marginBottom: 1,
  };
  const subTextStyle = {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 36,
  };

  const fieldWrapper = {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  };
  const inputStyle = {
    width: '100%',
    padding: '18px 40px 18px 20px',
    borderRadius: 40,
    border: '1px solid #ccc',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif",
  };
  const iconCommon = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 20,
    fill: '#999',
    pointerEvents: 'none',
  };
  const eyeBtn = { ...iconCommon, cursor: 'pointer', pointerEvents: 'auto' };

  const buttonStyle = {
    backgroundColor: '#861818',
    color: '#fff',
    padding: '16px 0',
    border: 'none',
    borderRadius: 40,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    width: '100%',
    cursor: 'pointer',
    marginTop: 20,
  };

  const footerStyle = { fontSize: 14, marginTop: 24, color: '#555' };
  const linkStyle = { color: '#861818', fontWeight: 600, textDecoration: 'underline' };

  const IdIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" style={iconCommon}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
  const EyeIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
  const EyeOffIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 4.5c3.49 0 6.8 1.62 9 4.5-.68 1.08-1.5 2.05-2.44 2.9l1.46 1.46C22.17 11.51 23 10.32 23 10.32 21.27 5.93 16.99 2.82 12 2.82c-1.79 0-3.53.35-5.09 1L8.24 5.2c1.19-.45 2.45-.7 3.76-.7zM2.39 1.73 1.11 3l3.94 3.94C3.62 8.02 2.79 9.21 2 10.32c1.73 4.39 6 7.5 11 7.5 1.97 0 3.83-.47 5.47-1.29l2.13 2.13 1.27-1.27L2.39 1.73zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5 0-.64.18-1.24.49-1.77l4.78 4.78c-.53.31-1.13.49-1.77.49z" />
    </svg>
  );

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <img src={hmbsLogo} alt="HMBS Logo" style={logoStyle} />
        <h2 style={headingStyle}>Hello, Staff!</h2>
        <p style={subTextStyle}>Enter your credentials to proceed</p>

        <div style={fieldWrapper}>
          <input
            type="text"
            placeholder="staff@hmbs.com"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {IdIcon}
        </div>

        <div style={fieldWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span style={eyeBtn} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? EyeOffIcon : EyeIcon}
          </span>
        </div>

        {error && <p style={{ color: "red", fontSize: 14 }}>{error}</p>}

        <button style={buttonStyle} onClick={handleLogIn}>Log In</button>

        <p style={footerStyle}>
          Not a student? <Link to="/" style={linkStyle}>Log in as student.</Link>
        </p>
      </div>
    </div>
  );
}

export default StaffLoginPage;
