import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import ItemDetail from '../components/ItemDetail';

import equipmentHeaderBg from '../assets/site-images/equipment-header-bg.png';
import tempItemImg from '../assets/images/temp-item-img.png';

import { FiSearch } from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';

const TYPE_MAP = {
  'Kitchen Tools & Equipment': [1, 2, 3, 4],   // Baking & Pantry Tools, Cooking Wares, etc.
  'Serving & Dining Essentials': [5, 7],       // Serving Tools, Dining Equipment
  'Beverage & Barware': [6],                    // Bar Tools & Drinkware
  'Storage, Cleaning, & Utility': [8, 9],      // Storage & Utility, Furnitures & Fixtures
};

function EquipmentsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Recommended');
  const [category, setCategory] = useState('All Products');
  const [type, setType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch tools from backend
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await axios.get('/api/tools');
        setTools(res.data);
      } catch (err) {
        console.error('Failed to fetch tools:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // Filtering
  const categoryMap = categories.reduce((acc, c) => {
    acc[c.category_id] = c.category_name;
    return acc;
  }, {});

  const filteredList = tools
    .filter(item => 
      category === "All Products" 
      ? true 
      : categoryMap[item.category_id] === category
    )
    .filter(item => 
      type 
        ? TYPE_MAP[type]?.includes(Number(item.category_id)) 
        : true
    )
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));


  // Sorting
  const sortedList = [...filteredList];
  if (sort === 'Name (A-Z)') sortedList.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'Name (Z-A)') sortedList.sort((a, b) => b.name.localeCompare(a.name));

  // Pagination
  const totalPages = Math.ceil(sortedList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = sortedList.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', margin: '40px' }}>Loading equipment catalogue...</div>
        <Footer />
      </>
    );
  }

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      color: '#333',
    },
    headerImageWrapper: {
      position: 'relative',
      width: '100%',
      height: '300px',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    headerImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
    },
    searchBarContainer: {
      position: 'relative',
      zIndex: 2,
      backgroundColor: 'white',
      borderRadius: '999px',
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: '700px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    },
    searchIcon: {
      marginRight: '12px',
      color: '#861111',
      fontSize: '20px',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      fontSize: '16px',
      flexGrow: 1,
      fontFamily: "'Poppins', sans-serif",
    },
    layout: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '1200px',
      margin: '50px auto',
      gap: '40px',
      padding: '0 20px',
    },
    sidebar: {
      width: '250px',
      borderRight: '2px solid #ccc',
      paddingRight: '20px',
      minHeight: '900px',
      boxSizing: 'border-box',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '5px',
    },
    hr: {
      width: '200px',
      border: 'none',
      borderTop: '0.5px solid #616161',
      margin: '2px 0 5px',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '30px',
      lineHeight: '1.8',
      fontSize: '14px',
    },
    listItem: active => ({
      cursor: 'pointer',
      color: active ? '#861111' : '#333',
      fontWeight: active ? 600 : 400,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '200px',
      transition: 'color 0.2s',
    }),
    gridSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '700px',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      fontSize: '14px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '20px',
    },
    selectWrapper: {
      position: 'relative',
      display: 'inline-block',
    },
    select: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '13.5px',
      padding: '6px 12px',
      width: '150px',
      height: '37px',
      borderRadius: '6px',
      border: '0.6px solid #bbb',
      backgroundColor: '#fff',
      color: sort === 'Recommended' ? '#861111' : '#333',
      cursor: 'pointer',
      appearance: 'none',
    },
    dropdownIcon: {
      position: 'absolute',
      right: '13px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#861111',
      fontSize: '12px',
    },
    cardName: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '100%',
      display: 'block',
    },
    pagination: {
      marginTop: '30px',
      marginBottom: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
    },
    pageButton: isDisabled => ({
      backgroundColor: '#fff',
      color: isDisabled ? '#bbb' : '#861111',
      border: `1.2px solid ${isDisabled ? '#ddd' : '#861111'}`,
      borderRadius: '50%',
      width: '38px',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      cursor: isDisabled ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
    }),
  };

  return (
    <>
      <Header />

      <div style={styles.container}>
        {/* Header Image + Search Bar */}
        <div style={styles.headerImageWrapper}>
          <img src={equipmentHeaderBg} alt="Equipment Header" style={styles.headerImage} />
          <div style={styles.searchBarContainer}>
            <FiSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search available kitchen equipment..."
              style={styles.searchInput}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Main Layout */}
        <div style={styles.layout}>
          {/* Sidebar Filters */}
          <div style={styles.sidebar}>
            <h3 style={styles.sectionTitle}>Browse by</h3>
            <hr style={styles.hr} />
            <ul style={styles.list}>
              <li
                key="All Products"
                style={styles.listItem(category === "All Products")}
                onClick={() => {
                  setCategory("All Products");
                  setType("");
                  setCurrentPage(1);
                }}
                title="All Products"
              >
                All Products
              </li>

              {categories.map(cat => (
                <li
                  key={cat._id}
                  style={styles.listItem(category === cat.category_name)}
                  onClick={() => {
                    setCategory(cat.category_name);
                    setType("");
                    setCurrentPage(1);
                  }}
                  title={cat.category_name}
                >
                  {cat.category_name}
                </li>
              ))}
            </ul>

            <h3 style={styles.sectionTitle}>Filter by Type</h3>
            <hr style={styles.hr} />
            <ul style={styles.list}>
              {Object.keys(TYPE_MAP).map(t => (
                <li
                  key={t}
                  style={styles.listItem(type === t)}
                  onClick={() => {
                    setType(t);
                    setCategory('All Products');
                    setCurrentPage(1);
                  }}
                  title={t}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Grid Section */}
          <div style={styles.gridSection}>
            {/* Top Bar */}
            <div style={styles.topBar}>
              <span>Showing {paginatedList.length} of {sortedList.length}</span>
              <div style={styles.selectWrapper}>
                <select
                  style={styles.select}
                  value={sort}
                  onChange={e => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option>Recommended</option>
                  <option>Name (A-Z)</option>
                  <option>Name (Z-A)</option>
                </select>
                <FaChevronDown style={styles.dropdownIcon} />
              </div>
            </div>

            {/* Item Grid */}
            <div style={styles.grid}>
              {paginatedList.map((item) => (
                <ItemCard
                  key={item._id}
                  name={<span style={styles.cardName} title={item.name}>{item.name}</span>}
                  onClick={() =>
                    setSelectedItem({
                      ...item,
                      image: item.img || tempItemImg,
                      price: item.price || 100,
                    })
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            <div style={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={styles.pageButton(currentPage === 1)}
                title="Previous Page"
              >
                <FaChevronLeft />
              </button>

              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={styles.pageButton(currentPage === totalPages)}
                title="Next Page"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <Footer />
    </>
  );
}

export default EquipmentsPage;