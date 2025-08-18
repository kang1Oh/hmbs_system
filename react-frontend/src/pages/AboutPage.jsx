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
    <>
      <Header />

      <div style={containerStyle}>
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

        {/* Staff In-Charge Section */}
        <div style={staffSectionStyle}>
          <h2 style={staffTitleStyle}>Staff In-Charge</h2>
          <div style={staffGridStyle}>
            {/* Staff 1 */}
            <div style={staffCardStyle}>
              <img
                src="https://ui-avatars.com/api/?name=John+Doe&background=861111&color=fff&size=100"
                alt="John Doe"
                style={staffImageStyle}
              />
              <div style={staffNameStyle}>John Doe</div>
              <div style={staffPositionStyle}>Lab Supervisor</div>
            </div>

            {/* Staff 2 */}
            <div style={staffCardStyle}>
              <img
                src="https://ui-avatars.com/api/?name=Jane+Smith&background=861111&color=fff&size=100"
                alt="Jane Smith"
                style={staffImageStyle}
              />
              <div style={staffNameStyle}>Jane Smith</div>
              <div style={staffPositionStyle}>Inventory Officer</div>
            </div>

            {/* Staff 3 */}
            <div style={staffCardStyle}>
              <img
                src="https://ui-avatars.com/api/?name=Maria+Lopez&background=861111&color=fff&size=100"
                alt="Maria Lopez"
                style={staffImageStyle}
              />
              <div style={staffNameStyle}>Maria Lopez</div>
              <div style={staffPositionStyle}>Head Instructor</div>
            </div>

            {/* Staff 4 */}
            <div style={staffCardStyle}>
              <img
                src="https://ui-avatars.com/api/?name=Peter+Cruz&background=861111&color=fff&size=100"
                alt="Peter Cruz"
                style={staffImageStyle}
              />
              <div style={staffNameStyle}>Peter Cruz</div>
              <div style={staffPositionStyle}>Assistant Lab Technician</div>
            </div>

            {/* Staff 5 */}
            <div style={staffCardStyle}>
              <img
                src="https://ui-avatars.com/api/?name=Ella+Santiago&background=861111&color=fff&size=100"
                alt="Ella Santiago"
                style={staffImageStyle}
              />
              <div style={staffNameStyle}>Ella Santiago</div>
              <div style={staffPositionStyle}>Borrowing Coordinator</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutPage;
