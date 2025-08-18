import React from 'react';
import usepLogo from '../assets/site-images/usep-logo.png';
import cbaLogo from '../assets/site-images/cba-logo.png';

function Footer() {
  const footerStyle = {
    backgroundColor: '#861111',
    color: 'white',
    padding: '30px 0 20px',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    flexDirection: 'column',
    width: '100%',
  };

  const logoContainerWrapperStyle = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '0 20px',
  };

  const hrStyle = {
    position: 'absolute',
    top: '50%',
    left: '0',
    right: '0',
    border: 'none',
    height: '1px',
    backgroundColor: 'white',
    zIndex: '0',
  };

  const logoContainerStyle = {
    display: 'flex',
    gap: '18px',
    padding: '0 10px',
    zIndex: '1',
  };

  const logoStyle = {
    height: '65px',
    width: 'auto',
    border: '5px solid #861111',
    borderRadius: '100px',
    backgroundColor: '#861111',
  };

  const textContainerStyle = {
    textAlign: 'center',
    lineHeight: '1.5',
    margin: '0',
    maxWidth: '90%',
  };

  const mainTextStyle = {
    fontWeight: '500',
    fontSize: '15px',
    margin: '5px 0',
  };

  const secondaryTextStyle = {
    fontSize: '13px',
    fontWeight: '400',
    margin: '0',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '400',
    margin: '0 5px',
  };

  return (
    <footer style={footerStyle}>
      <div style={logoContainerWrapperStyle}>
        <hr style={hrStyle} />
        <div style={logoContainerStyle}>
          <img src={usepLogo} alt="USEP Logo" style={logoStyle} />
          <img src={cbaLogo} alt="CBA Logo" style={logoStyle} />
        </div>
      </div>

      <div style={textContainerStyle}>
        <p style={mainTextStyle}>
          University of Southeastern Philippines • College of Business Administration
        </p>
        <p style={secondaryTextStyle}>
          Copyright © 2025. All Rights Reserved.
          <a href="/terms" style={linkStyle}>Terms of Use</a>|
          <a href="/privacy" style={linkStyle}>Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
