import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ImportCSVModal from '../components/AdminModal/ImportCSVModal';
import NewItemAddedModal from '../components/AdminModal/NewItemAddedModal';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { ChevronDown } from 'lucide-react';
import UploadIcon from '../assets/upload-file.svg';

const AddNewItemAdmin = () => {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isItemAddedModalOpen, setIsItemAddedModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    location: '',
    quantity: '',
    unit: '',
    price: '',
    status: '',
    tagging: '',
    image: null,
  });

  const [errors, setErrors] = useState({});

  const mechanicalElectricCategories = ['Mechanical Equipment', 'Electrical Equipment'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value,
      ...(name === 'category' && !mechanicalElectricCategories.includes(value) ? { tagging: '' } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.quantity === '' || formData.quantity < 0) newErrors.quantity = 'Quantity is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.price || formData.price < 0) newErrors.price = 'Price is required';
    if (!formData.status.trim()) newErrors.status = 'Status is required';
    if (mechanicalElectricCategories.includes(formData.category) && !formData.tagging.trim())
      newErrors.tagging = 'Disposal tagging is required';
    if (!formData.image) newErrors.image = 'Image upload is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsItemAddedModalOpen(true);
  };

  const selectWrapper = (hasError, children) => (
    <div style={styles.selectWrapper}>
      {children}
      <ChevronDown size={20} style={styles.selectChevron} />
    </div>
  );

  const errorMessage = (msg) => (
    <div style={styles.errorMsg}>
      <MdErrorOutline size={16} style={styles.errorIcon} />
      {msg}
    </div>
  );

  const label = (text, required) => (
    <label style={styles.label}>
      {text} {required && <span style={styles.required}>*</span>}
    </label>
  );

  const isTaggingDisabled = !mechanicalElectricCategories.includes(formData.category);

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
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.7rem',
      fontWeight: 700,
    },
    subtitle: {
      color: '#666',
      fontSize: '17px',
      marginTop: '-4px',
      marginBottom: '-1.0rem',
    },
    importBtn: {
      backgroundColor: '#8A1F2B',
      color: '#fff',
      border: 'none',
      padding: '0.6rem 1.25rem',
      borderRadius: '20px',
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
    },
    divider: {
      border: 'none',
      borderTop: '1.5px solid rgba(97, 97, 97, 0.3)',
      marginBottom: '1.3rem',
    },
    formGroup: {
      marginBottom: '1.4rem',
    },
    flexRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.25rem',
    },
    flex1: {
      flex: 1,
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      borderRadius: '7px',
      border: '0.5px solid #1A1A1A',
      fontSize: '0.9rem',
      outline: 'none',
      fontFamily: 'Poppins, sans-serif',
      appearance: 'none',
      backgroundColor: 'white',
    },
    inputError: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e53935',
      borderRadius: '8px',
      fontSize: '1rem',
      outline: 'none',
      fontFamily: 'Poppins, sans-serif',
      appearance: 'none',
      backgroundColor: 'white',
    },
    selectWrapper: {
      position: 'relative',
      width: '100%',
    },
    selectChevron: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#991f1f',
    },
    label: {
      fontWeight: 600,
      marginBottom: '0.2rem',
      display: 'block',
      fontFamily: 'Poppins, sans-serif',
    },
    required: {
      color: '#e53935',
    },
    errorMsg: {
      color: '#e53935',
      marginTop: '0.35rem',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.85rem',
      fontFamily: 'Poppins, sans-serif',
    },
    errorIcon: {
      marginRight: '0.3rem',
    },
    uploadBox: {
      border: '2px dashed #8A1F2B',
      padding: '7rem 1rem',
      borderRadius: '12px',
      textAlign: 'center',
      color: '#666',
      position: 'relative',
    },
    uploadBoxError: {
      border: '2px solid #e53935',
      padding: '7rem 1rem',
      borderRadius: '12px',
      textAlign: 'center',
      color: '#666',
      position: 'relative',
    },
    uploadIcon: {
      width: '3rem',
      marginBottom: '0.5rem',
    },
    uploadHint: {
      fontSize: '0.875rem',
      marginTop: '0.2rem',
    },
    uploadBtn: {
      marginTop: '1rem',
      display: 'inline-block',
      padding: '0.5rem 1.25rem',
      borderRadius: '999px',
      backgroundColor: 'white',
      border: '1.5px solid #8A1F2B',
      fontWeight: 500,
      color: '#8A1F2B',
      cursor: 'pointer',
      fontSize: '14px',
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.6rem',
    },
    cancelBtn: {
      fontSize: '14px',
      padding: '0.5rem 1rem',
      border: '1.5px solid #8A1F2B',
      borderRadius: '999px',
      fontWeight: 500,
      backgroundColor: 'white',
      color: '#8A1F2B',
      cursor: 'pointer',
      fontFamily: 'Poppins, sans-serif',
    },
    submitBtn: {
      backgroundColor: '#8A1F2B',
      color: '#fff',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '999px',
      fontWeight: 500,
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Poppins, sans-serif',
    },
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
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Add New Item</h2>
            <p style={styles.subtitle}>Add a new item to the inventory list</p>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            style={styles.importBtn}
          >
            Import CSV File
          </button>
        </div>

        <hr style={styles.divider} />

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            {label('Item Name', true)}
            <input
              type="text"
              name="itemName"
              placeholder="Enter item name"
              style={errors.itemName ? styles.inputError : styles.input}
              value={formData.itemName}
              onChange={handleChange}
            />
            {errors.itemName && errorMessage(errors.itemName)}
          </div>

          <div style={styles.flexRow}>
            <div style={styles.flex1}>
              {label('Category', true)}
              {selectWrapper(errors.category, (
                <select
                  name="category"
                  style={errors.category ? styles.inputError : styles.input}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option>Pantry Tools</option>
                  <option>Cleaning Tools</option>
                  <option>Kitchenware</option>
                  <option>Mechanical Equipment</option>
                  <option>Electrical Equipment</option>
                </select>
              ))}
              {errors.category && errorMessage(errors.category)}
            </div>
            <div style={styles.flex1}>
              {label('Location', true)}
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                style={errors.location ? styles.inputError : styles.input}
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && errorMessage(errors.location)}
            </div>
          </div>

          <div style={styles.flexRow}>
            <div style={styles.flex1}>
              {label('Available Quantity', true)}
              <input
                type="number"
                name="quantity"
                min="0"
                placeholder="Enter quantity"
                style={errors.quantity ? styles.inputError : styles.input}
                value={formData.quantity}
                onChange={handleChange}
              />
              {errors.quantity && errorMessage(errors.quantity)}
            </div>
            <div style={styles.flex1}>
              {label('Unit', true)}
              {selectWrapper(errors.unit, (
                <select
                  name="unit"
                  style={errors.unit ? styles.inputError : styles.input}
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="">Select unit</option>
                  <option>Pcs</option>
                  <option>Boxes</option>
                  <option>Liters</option>
                </select>
              ))}
              {errors.unit && errorMessage(errors.unit)}
            </div>
          </div>

          <div style={styles.flexRow}>
            <div style={styles.flex1}>
              {label('Price', true)}
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                min="0"
                step="0.01"
                style={errors.price ? styles.inputError : styles.input}
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && errorMessage(errors.price)}
            </div>
            <div style={styles.flex1}>
              {label('Status', true)}
              {selectWrapper(errors.status, (
                <select
                  name="status"
                  style={errors.status ? styles.inputError : styles.input}
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              ))}
              {errors.status && errorMessage(errors.status)}
            </div>
          </div>

          <div style={styles.formGroup}>
            {label('Disposal Tagging', mechanicalElectricCategories.includes(formData.category))}
            {selectWrapper(errors.tagging, (
              <select
                name="tagging"
                style={errors.tagging ? styles.inputError : styles.input}
                value={formData.tagging}
                onChange={handleChange}
                disabled={isTaggingDisabled}
              >
                <option value="">Select disposal tagging</option>
                <option value="Good Condition">Good Condition</option>
                <option value="For Repair">For Repair</option>
                <option value="For Disposal">For Disposal</option>
              </select>
            ))}
            {errors.tagging && errorMessage(errors.tagging)}
          </div>

          <div style={styles.formGroup}>
            {label('Upload Image', true)}
            <div style={errors.image ? styles.uploadBoxError : styles.uploadBox}>
              <img src={UploadIcon} alt="Upload" style={styles.uploadIcon} />
              <p>Choose a file or drag & drop it here</p>
              <p style={styles.uploadHint}>JPG, JPEG, PNG, PDF, DOC, DOCX formats, up to 10MB</p>
              <input
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={handleChange}
                style={{ display: 'none' }}
                id="uploadFile"
              />
              <label htmlFor="uploadFile" style={styles.uploadBtn}>
                Browse File
              </label>
            </div>
            {errors.image && errorMessage(errors.image)}
          </div>

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Submit Item
            </button>
          </div>
        </form>

        {isImportModalOpen && <ImportCSVModal onClose={() => setIsImportModalOpen(false)} />}
        {isItemAddedModalOpen && <NewItemAddedModal onClose={() => setIsItemAddedModalOpen(false)} />}
      </main>
    </div>
  );
};

export default AddNewItemAdmin;
