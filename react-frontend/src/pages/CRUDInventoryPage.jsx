import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaFileAlt, FaBoxOpen, FaClipboardList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { SquarePen, Trash2, ChevronDown } from 'lucide-react';
import SpoonImage from '../assets/images/spoon.png';
import UpdateInventoryAdminModal from '../components/AdminModal/UpdateInventoryAdminModal';
import InventoryDeletionModal from '../components/AdminModal/InventoryDeletionModal';
import InventoryItemDeletedModal from '../components/AdminModal/InventoryItemDeletedModal';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const CRUDInventoryPage = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showItemDeletedModal, setShowItemDeletedModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');

  const inventoryData = [
    { id: 1, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 20, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 2, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 0, unit: 'Pcs', price: '₱25', status: 'Unavailable' },
    { id: 3, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 20, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 4, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 20, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 5, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 20, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 6, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 20, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 7, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 0, unit: 'Pcs', price: '₱25', status: 'Unavailable' },
    { id: 8, name: 'Spoon', category: 'Pantry Tools', location: 'CBA 404', qty: 20, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 9, name: 'Fork', category: 'Pantry Tools', location: 'CBA 404', qty: 12, unit: 'Pcs', price: '₱25', status: 'Available' },
    { id: 10, name: 'Knife', category: 'Pantry Tools', location: 'CBA 404', qty: 0, unit: 'Pcs', price: '₱25', status: 'Unavailable' },
    { id: 11, name: 'Tongs', category: 'Pantry Tools', location: 'CBA 404', qty: 15, unit: 'Pcs', price: '₱25', status: 'Available' }
  ];

  // Filtering
  let filteredData = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  if (sortBy === 'Name (A-Z)') filteredData.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'Name (Z-A)') filteredData.sort((a, b) => b.name.localeCompare(a.name));

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const getPaginated = (page) => filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  
  const styles = {
  layout: {
    display: 'flex',
    fontFamily: 'Poppins, sans-serif',
  },
  main: {
    marginLeft: '240px',
    padding: '2rem',
    flex: 1,
    backgroundColor: '#fff',
    minHeight: '100vh',
    fontFamily: 'Poppins, sans-serif',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    fontFamily: 'Poppins, sans-serif',
  },
  searchSortWrapper: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    position: 'relative',
    fontFamily: 'Poppins, sans-serif',
  },
  searchInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    border: '1.5px solid #991F1F',
    borderRadius: '8px',
    fontSize: '15px',
    height: '45px',
    fontFamily: 'Poppins, sans-serif',
  },
  exportButton: {
    padding: '7px 25px',
    background: '#991F1F',
    color: 'white',
    border: '1px solid #991f1f',
    borderRadius: '999px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
  },
  addButton: {
    backgroundColor: '#991F1F',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'Poppins, sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderLeft: '1px solid #991F1F',
    borderRight: '1px solid #991F1F',
    borderBottom: '1px solid #991F1F',
    borderRadius: '10px',
    overflow: 'hidden',
    fontFamily: 'Poppins, sans-serif',
  },
  th: {
    backgroundColor: '#991f1f',
    color: 'white',
    padding: '0.90rem',
    textAlign: 'center',
    fontSize: '15px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
  },
  td: {
    padding: '0.70rem',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#fff',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'center',
  },
  statusAvailable: {
    backgroundColor: '#2d9cdb',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '99px',
    fontSize: '0.8rem',
    textAlign: 'center',
    fontWeight: '500',
    display: 'inline-block',
    width: '100px',
    fontFamily: 'Poppins, sans-serif',
  },
  statusUnavailable: {
    backgroundColor: '#DC2626',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '99px',
    fontSize: '0.8rem',
    textAlign: 'center',
    fontWeight: '500',
    display: 'inline-block',
    width: '100px',
    fontFamily: 'Poppins, sans-serif',
  },
  actionIcons: {
    display: 'flex',
    gap: '0.7rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    justifyContent: 'center', // horizontal centering
    alignItems: 'center',     // vert
  },
  roundedCard: {
    border: '1px solid #991F1F',
    borderRadius: '12px',
    padding: '1rem',
    fontFamily: 'Poppins, sans-serif',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.2rem',
    fontFamily: 'Poppins, sans-serif',
  },
  pageButton: (active) => ({
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    border: '1px solid #991F1F',
    backgroundColor: active ? '#991F1F' : '#fff',
    color: active ? '#fff' : '#991F1F',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  }),
  navIconButton: (disabled) => ({
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    border: '1px solid #991F1F',
    backgroundColor: '#991F1F',
    color: '#fff',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Poppins, sans-serif',
  }),
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '160px',
    height: '45px',
    borderRadius: '8px',
    border: '1px solid #991F1F',
    paddingRight: '1.5rem',
    backgroundColor: '#fff',
    fontFamily: 'Poppins, sans-serif',
  },
  selectInput: {
    fontSize: '14px',
    width: '100%',
    height: '100%',
    padding: '0.5rem 0.8rem',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#991f1f',
    cursor: 'pointer',
    appearance: 'none',
    fontFamily: 'Poppins, sans-serif',
  },
  selectChevron: {
    position: 'absolute',
    right: '0.9rem',
    color: '#991f1f',
    pointerEvents: 'none',
  },
  paginationInfo: {
    textAlign: 'center',
    marginBottom: '1.2rem',
    marginTop: '0.7rem',
    fontSize: '15px',
    color: '#555',
    fontFamily: 'Poppins, sans-serif',
  },
};


  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

  return (
    <div style={styles.layout}>
      <Sidebar
        activePage="inventory"
        userRole="Staff"
        userSubrole="Admin"
        navItems={[
          { id: 'requests', name: 'Requests', icon: <FaFileAlt />, path: '/requests-admin' },
          { id: 'inventory', name: 'Inventory', icon: <FaBoxOpen />, path: '/inventory' },
          { id: 'registry', name: 'Registry', icon: <FaClipboardList />, path: '/registry' },
        ]}
      />

      <main style={styles.main}>
        <div style={styles.headerSection}>
          <div>
            <h2 style={{ margin: 0, lineHeight: '1.0' }}>Inventory Table</h2>
            <p style={{ marginTop: '0.3rem', lineHeight: '1.2', color: '#555', fontSize: '17px'}}>View all tools available for borrowing</p>
          </div>
          <button style={styles.exportButton}>Export CSV</button>
        </div>

        <div style={styles.searchSortWrapper}>
          <input
            type="text"
            placeholder="Search available equipment..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <div style={styles.selectWrapper}>
            <select
              style={styles.selectInput}
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            >
              <option>Recommended</option>
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
            </select>
            <ChevronDown size={16} style={styles.selectChevron} />
          </div>
        </div>

        <div style={styles.roundedCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '22px', fontWeight: '600', alignItems: 'center' }}>
            <p>List of Inventory Items</p>
            <button style={styles.addButton} onClick={() => navigate('/add-to-inventory')}>
              <FiPlus /> Add New Item
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Stocks</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Prices</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {getPaginated(currentPage).map((item, idx) => (
                <tr key={item.id}>
                  <td style={styles.td}>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td style={styles.td}><img src={SpoonImage} alt="Item" style={{ width: '40px', height: '40px' }} /></td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>{item.location}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
                  <td style={styles.td}>{item.unit}</td>
                  <td style={styles.td}>{item.price}</td>
                  <td style={styles.td}>
                    <span style={item.status === 'Available' ? styles.statusAvailable : styles.statusUnavailable}>{item.status}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionIcons}>
                      <SquarePen size={16} title="Edit Item" style={{ color: '#000' }} onClick={() => setShowEditModal(true)} />
                      <Trash2 size={16} title="Delete Item" style={{ color: '#000' }} onClick={() => setShowDeleteModal(true)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Info Above Buttons */}
          <div style={styles.paginationInfo}>
            Showing {startItem}-{endItem} of {filteredData.length} items
          </div>

          {/* Pagination Buttons */}
          <div style={styles.pagination}>
            <button
              style={styles.navIconButton(currentPage === 1)}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                style={styles.pageButton(currentPage === index + 1)}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              style={styles.navIconButton(currentPage === totalPages)}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {showEditModal && <UpdateInventoryAdminModal onClose={() => setShowEditModal(false)} onSave={() => setShowEditModal(false)} />}
        {showDeleteModal && <InventoryDeletionModal onCancel={() => setShowDeleteModal(false)} onDelete={() => { setShowDeleteModal(false); setShowItemDeletedModal(true); }} />}
        {showItemDeletedModal && <InventoryItemDeletedModal onDone={() => setShowItemDeletedModal(false)} />}
      </main>
    </div>
  );
};

export default CRUDInventoryPage;
