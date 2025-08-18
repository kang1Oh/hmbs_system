import React from 'react';
import Slider from 'react-slick';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CustomPrevArrow, CustomNextArrow } from '../components/CustomArrows';


// ✅ Image Imports
import imgBarTray from '../assets/images/bar-tray.jpg';
import imgSaladPlate from '../assets/images/plates-salad-plate.jpg';
import imgRedWine from '../assets/images/glass-red-wine.jpg';
import imgSoupBowl from '../assets/images/soup-bowl.jpg';
import imgShowPlate from '../assets/images/show-plate.jpg';
function Homepage() {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };


  const recentlyBorrowedItems = [
    { name: 'Bar Tray Serving Tool', img: imgBarTray, qty: 14 },
    { name: 'Plates Salad Plate', img: imgSaladPlate, qty: 14 },
    { name: 'Glass Red Wine', img: imgRedWine, qty: 14 },
    { name: 'Soup Bowl Red Black', img: imgSoupBowl, qty: 14 },
    { name: 'Show Plate', img: imgShowPlate, qty: 14 },
  ];

  const categories = [
    {
      name: 'Kitchen Tools & Equipment',
      img: './assets/images/category_kitchen.jpg'
    },
    {
      name: 'Serving & Dining Essentials',
      img: './assets/images/category_dining.jpg'
    },
    {
      name: 'Beverage & Barware',
      img: './assets/images/category_beverage.jpg'
    },
    {
      name: 'Storage, Cleaning & Utility',
      img: './assets/images/category_storage.jpg'
    }
  ];

  const containerStyle = {
    fontFamily: 'Poppins, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  };

  const contentStyle = {
    flexGrow: 1,
    padding: '50px',
  };

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '-5px',
  };

  const subtextStyle = {
    color: '#666',
    marginBottom: '20px',
    fontSize: '20px',
  };

  const carouselContainer = {
    border: '1px solid #991f1f',
    padding: '21px 14px 19px 29px',
    borderRadius: '10px',
  };

  const cardWrapper = {
    padding: '0 2px',
  };

  const cardStyle = {
    borderLeft: '11px solid #991f1f',
    borderRight: '11px solid #991f1f',
    borderTop: '11px solid #991f1f',
    borderBottom: '4px solid #991f1f',
    backgroundColor: '#991f1f',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '240px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const cardImage = {
    width: '100%',
    aspectRatio: '1/1', //keeps it square
    objectFit: 'cover',
    borderRadius: '20px',
    display: 'block',
  };

  const cardFooter = {
    //backgroundColor: '#991f1f',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
    fontSize: '12px',
    height: '85px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const categoryGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  const categoryCard = {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  const categoryImg = {
    height: '160px',
    width: '100%',
    objectFit: 'cover',
  };

  const categoryLabel = {
    backgroundColor: '#991f1f',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <Header />

      <main style={contentStyle}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          marginBottom: '2px'
        }}>Welcome, Student!</h2>
        <p style={subtextStyle}>
          Easily check available tools and submit a request
        </p>

        <section style={{ marginBottom: '40px' }}>
          <div style={carouselContainer}>
            <h3 style={sectionTitleStyle}>
              Recently Borrowed Items
            </h3>
            <p style={subtextStyle}>
              See your latest borrowing activity
            </p>
            <Slider {...sliderSettings}>
              {recentlyBorrowedItems.map((item, index) => (
                <div key={index} style={cardWrapper}>
                  <div style={cardStyle}>
                    <img src={item.img} alt={item.name} style={cardImage} />
                    <div style={cardFooter}>
                      <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Qty Available</span>
                        <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        <section>
          <h3 style={sectionTitleStyle}>Browse by Category</h3>
          <p style={subtextStyle}>Easily explore tools by their functional categories</p>
          <div style={categoryGrid}>
            {categories.map((cat, index) => (
              <div key={index} style={categoryCard}>
                <img src={cat.img} alt={cat.name} style={categoryImg} />
                <div style={categoryLabel}>{cat.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Homepage;
