import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import aboutHeaderBg from '../assets/site-images/about-header-bg.png';

function AboutPage() {
  const containerStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
  };

  const headerImageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
    display: 'block',
  };

  const contentWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '70px 20px',
    maxWidth: '1000px',
    margin: '0 auto',
    gap: '40px',
    flexWrap: 'wrap',
  };

  const leftColumnStyle = {
    flex: '1',
    minWidth: '250px',
  };

  const rightColumnStyle = {
    flex: '2',
    minWidth: '300px',
  };

  const titleStyle = {
    color: '#000000',
    fontSize: '40px',
    fontWeight: '600',
    marginBottom: '10px',
    textAlign: 'left',
    lineHeight: '1',
  };

  const paragraphStyle = {
    fontSize: '17px',
    lineHeight: '1.4',
    textAlign: 'justify',
  };

  const staffSectionStyle = {
    border: '1px solid #991F1F',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '60px 60px 45px',
    margin: '10px auto 60px',
    maxWidth: '1100px',
    borderRadius: '18px',
    minHeight: '380px',
  };

  const staffTitleStyle = {
    fontSize: '29px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '30px',
  };

  const staffGridStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '30px',
  };

  const staffCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '140px',
    gap: '4px',
  };

  const staffImageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #861111',
  };

  const staffNameStyle = {
    fontWeight: '600',
    marginTop: '10px',
    fontSize: '14px',
    textAlign: 'center',
  };

  const staffPositionStyle = {
    fontWeight: '300',
    fontSize: '13px',
    color: '#555',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ ...containerStyle, flex: 1 }}>
        {/* Top Banner Image */}
        <img src={aboutHeaderBg} alt="About Header" style={headerImageStyle} />

        {/* Two Column Section */}
        <div style={contentWrapperStyle}>
          <div style={leftColumnStyle}>
            <h2 style={titleStyle}>About This System</h2>
          </div>
          <div style={rightColumnStyle}>
            <p style={paragraphStyle}>
              The <em>Hospitality Management Borrowing System</em> is a digital tracking platform designed to monitor the issuance, borrowing, return, and inventory of kitchen tools and equipment used by Hospitality Management students during laboratory activities. This system promotes accountability and a sense of professional responsibility among students by encouraging proper handling and timely return of borrowed items.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default AboutPage;
