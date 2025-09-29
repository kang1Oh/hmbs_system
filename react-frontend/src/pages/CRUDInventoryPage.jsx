import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showItemDeletedModal, setShowItemDeletedModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');

  // Fetch tools
  const fetchTools = async () => {
    try {
      const res = await axios.get("/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Failed to fetch tools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Fetch categories
  useEffect(() => {
    axios.get("/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to fetch categories:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Category map
  const categoryMap = categories.reduce((acc, c) => {
    acc[c.category_id] = c.category_name;
    return acc;
  }, {});

  // Filtering
  let filteredData = tools.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sorting
  if (sortBy === 'Name (A-Z)') filteredData.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'Name (Z-A)') filteredData.sort((a, b) => b.name.localeCompare(a.name));
  else filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const getPaginated = (page) => filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  
  const styles = {
    layout: { display: 'flex', fontFamily: 'Poppins, sans-serif' },
    main: { marginLeft: '240px', padding: '2rem', flex: 1, backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' },
    headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontFamily: 'Poppins, sans-serif' },
    searchSortWrapper: { display: 'flex', gap: '1rem', marginBottom: '1rem', position: 'relative', fontFamily: 'Poppins, sans-serif' },
    searchInput: { flex: 1, padding: '0.6rem 1rem', border: '1.5px solid #991F1F', borderRadius: '8px', fontSize: '15px', height: '45px', fontFamily: 'Poppins, sans-serif' },
    exportButton: { padding: '7px 25px', background: '#15814dff', color: 'white', border: '1px solid #15814dff', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', display: 'flex', fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
    addButton: { backgroundColor: '#991F1F', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Poppins, sans-serif' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderLeft: '1px solid #991F1F', borderRight: '1px solid #991F1F', borderBottom: '1px solid #991F1F', borderRadius: '10px', overflow: 'hidden', fontFamily: 'Poppins, sans-serif' },
    th: { backgroundColor: '#991f1f', color: 'white', padding: '0.90rem', textAlign: 'center', fontSize: '15px', fontFamily: 'Poppins, sans-serif', fontWeight: '500' },
    td: { padding: '0.70rem', borderBottom: '1px solid #ccc', backgroundColor: '#fff', fontFamily: 'Poppins, sans-serif', textAlign: 'center' },
    statusAvailable: { backgroundColor: '#2d9cdb', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem', textAlign: 'center', fontWeight: '500', display: 'inline-block', width: '100px', fontFamily: 'Poppins, sans-serif' },
    statusUnavailable: { backgroundColor: '#DC2626', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem', textAlign: 'center', fontWeight: '500', display: 'inline-block', width: '100px', fontFamily: 'Poppins, sans-serif' },
    actionIcons: { display: 'flex', gap: '0.7rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', justifyContent: 'center', alignItems: 'center' },
    roundedCard: { border: '1px solid #991F1F', borderRadius: '12px', padding: '1rem', fontFamily: 'Poppins, sans-serif' },
    pagination: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.2rem', fontFamily: 'Poppins, sans-serif' },
    pageButton: (active) => ({ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #991F1F', backgroundColor: active ? '#991F1F' : '#fff', color: active ? '#fff' : '#991F1F', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }),
    navIconButton: (disabled) => ({ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #991F1F', backgroundColor: '#991F1F', color: '#fff', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Poppins, sans-serif' }),
    selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center', width: '160px', height: '45px', borderRadius: '8px', border: '1px solid #991F1F', paddingRight: '1.5rem', backgroundColor: '#fff', fontFamily: 'Poppins, sans-serif' },
    selectInput: { fontSize: '14px', width: '100%', height: '100%', padding: '0.5rem 0.8rem', border: 'none', outline: 'none', background: 'transparent', color: '#991f1f', cursor: 'pointer', appearance: 'none', fontFamily: 'Poppins, sans-serif' },
    selectChevron: { position: 'absolute', right: '0.9rem', color: '#991f1f', pointerEvents: 'none' },
    paginationInfo: { textAlign: 'center', marginBottom: '1.2rem', marginTop: '0.7rem', fontSize: '15px', color: '#555', fontFamily: 'Poppins, sans-serif' },
  };

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

  // 📤 Handle Export CSV
  const handleExport = async () => {
    try {
      const res = await axios.get("/api/tools/export", {
        responseType: "blob", // important for file download
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tools.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export tools:", err);
    }
  };

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
            <p style={{ marginTop: '0.3rem', lineHeight: '1.2', color: '#555', fontSize: '17px' }}>
              View all tools available for borrowing
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={styles.exportButton} onClick={handleExport}>Export CSV</button>
            <button style={styles.addButton} onClick={() => navigate('/add-to-inventory')}>
              <FiPlus /> Add New Item
            </button>
          </div>
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
              <option>Newest</option>
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
            </select>
            <ChevronDown size={16} style={styles.selectChevron} />
          </div>
        </div>

        <div style={styles.roundedCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '22px', fontWeight: '600', alignItems: 'center' }}>
            <p>List of Inventory Items</p>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
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
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {getPaginated(currentPage).map((item, idx) => (
                  <tr key={item._id}>
                    <td style={styles.td}>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td style={styles.td}>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${item.img}` || (item.img ? `http://localhost:5000${item.img}` : SpoonImage)}
                        alt="Item"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{categoryMap[item.category_id] || "Unknown"}</td>
                    <td style={styles.td}>{item.location}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>{item.available_qty}</td>
                    <td style={styles.td}>{item.unit}</td>
                    <td style={styles.td}>₱{item.price}</td>
                    <td style={styles.td}>
                      <span style={item.tool_status === 'Available' ? styles.statusAvailable : styles.statusUnavailable}>
                        {item.tool_status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionIcons}>
                        <SquarePen
                          size={16}
                          title="Edit Item"
                          style={{ color: '#000' }}
                          onClick={() => {
                            setSelectedTool(item);
                            setShowEditModal(true);
                          }}
                        />
                        <Trash2
                          size={16}
                          title="Delete Item"
                          style={{ color: '#000', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedTool(item);
                            setShowDeleteModal(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={styles.paginationInfo}>
            Showing {startItem}-{endItem} of {filteredData.length} items
          </div>

          <div style={styles.pagination}>
            <button
              style={styles.navIconButton(currentPage === 1)}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            {(() => {
              const maxVisible = 5; // show 5 pages at a time
              const half = Math.floor(maxVisible / 2);

              let start = Math.max(1, currentPage - half);
              let end = Math.min(totalPages, start + maxVisible - 1);

              // Adjust start if we're at the end
              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }

              return Array.from({ length: end - start + 1 }).map((_, index) => {
                const page = start + index;
                return (
                  <button
                    key={page}
                    style={styles.pageButton(currentPage === page)}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            <button
              style={styles.navIconButton(currentPage === totalPages)}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {showEditModal && selectedTool && (
          <UpdateInventoryAdminModal
            tool={selectedTool}
            onClose={() => setShowEditModal(false)}
            onSave={() => { fetchTools(); setShowEditModal(false); }}
          />
        )}
        {showDeleteModal && (
          <InventoryDeletionModal
            tool={selectedTool}
            onCancel={() => setShowDeleteModal(false)}
            onDelete={async () => {
              try {
                await axios.delete(`/api/tools/${selectedTool._id}`);
                setShowDeleteModal(false);
                setShowItemDeletedModal(true);

                fetchTools();
              } catch (err) {
                console.error("Failed to delete tool:", err);
              }
            }}
          />
        )}
        {showItemDeletedModal && <InventoryItemDeletedModal onDone={() => setShowItemDeletedModal(false)} />}
      </main>
    </div>
  );
};

export default CRUDInventoryPage;
