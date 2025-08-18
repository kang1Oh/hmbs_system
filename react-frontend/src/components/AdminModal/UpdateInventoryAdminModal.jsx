import React, { useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { ChevronDown } from 'lucide-react';
import InventoryUpdatedAdminModal from './InventoryUpdatedAdminModal';
import uploadFileIcon from '../../assets/upload-file.svg';

const mechanicalElectricCategories = ['Mechanical Equipment', 'Electrical Equipment'];

const UpdateInventoryAdminModal = ({ onClose }) => {
  const [showUpdatedModal, setShowUpdatedModal] = useState(false);
  const [status, setStatus] = useState('');
  const [disposalTag, setDisposalTag] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [statusError, setStatusError] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [isBrowseHover, setIsBrowseHover] = useState(false);
  const [isCancelHover, setIsCancelHover] = useState(false);
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (!status) {
      setStatusError('Please select a status');
      return;
    }
    setStatusError('');
    setShowUpdatedModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleDone = () => {
    setShowUpdatedModal(false);
    onClose();
  };

  const isDisposalTagDisabled = !mechanicalElectricCategories.includes(category);

  // Helper to render select with icon
  const renderSelect = (props) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select {...props} style={props.style} />
      <ChevronDown
        size={16}
        style={{
          position: 'absolute',
          right: '12px',
          pointerEvents: 'none',
          color: '#991F1F',
        }}
      />
    </div>
  );

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      fontFamily: 'Poppins, sans-serif',
    },
    modal: {
      background: '#fff',
      padding: '30px',
      borderRadius: '16px',
      width: '700px',
      maxHeight: '95vh',
      overflowY: 'auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1A1A1A',
      marginBottom: '-3px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '22px',
      cursor: 'pointer',
    },
    subtitle: {
      color: '#666',
      fontSize: '17px',
      marginBottom: '10px',
    },
    divider: {
      border: 'none',
      borderTop: '1.5px solid rgba(97, 97, 97, 0.3)',
      marginBottom: '15px',
    },
    formGroup: {
      marginBottom: '1.4rem',
      flex: 1,
    },
    row: {
      display: 'flex',
      gap: '1rem',
    },
    label: {
      fontWeight: 600,
      marginBottom: '0.2rem',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      border: '0.5px solid #1A1A1A',
      borderRadius: '7px',
      fontSize: '0.9rem',
      outline: 'none',
      fontFamily: 'Poppins, Sans-Serif',
    },
    inputFocused: {
      border: '2px solid #1A1A1A',
    },
    select: {
      width: '100%',
      padding: '12px 40px 12px 16px', // space for icon
      border: '0.5px solid #1A1A1A',
      borderRadius: '7px',
      fontSize: '14px',
      outline: 'none',
      appearance: 'none',
      backgroundColor: '#fff',
      fontFamily: 'Poppins, Sans-serif',
    },
    selectFocused: {
      border: '2px solid #000',
    },
    uploadBox: {
      border: '2px dashed #991F1F',
      borderRadius: '12px',
      padding: '2.5rem 1rem',
      textAlign: 'center',
      color: '#666',
      position: 'relative',
      marginTop: '8px',
    },
    uploadIcon: {
      width: '40px',
      height: '40px',
      marginBottom: '-0.3rem',
    },
    uploadText: {
      fontSize: '1rem',
      fontWeight: '530',
      color: '#2F2F2F',
      marginBottom: '4px',
    },
    uploadInfo: {
      fontSize: '0.875rem',
      color: '#6B7280',
      marginBottom: '12px',
    },
    uploadBtn: {
      padding: '6px 18px',
      backgroundColor: '#fff',
      border: '1px solid #991F1F',
      color: '#991F1F',
      borderRadius: '999px',
      fontSize: '0.85rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Poppins, Sans-serif',
    },
    uploadBtnHover: {
      backgroundColor: '#991F1F',
      color: '#fff',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '7px',
      marginTop: '2rem',
    },
    cancelBtn: {
      padding: '0.5rem 1rem',
      border: '1.5px solid #991F1F',
      color: '#991F1F',
      background: 'white',
      borderRadius: '1000px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Poppins, Sans-serif',
    },
    cancelBtnHover: {
      backgroundColor: '#991F1F',
      color: '#fff',
    },
    saveBtn: {
      padding: '0.5rem 1rem',
      backgroundColor: '#991F1F',
      color: '#fff',
      border: 'none',
      borderRadius: '9999px',
      cursor: 'pointer',
      fontFamily: 'Poppins, Sans-serif',
    },
    errorText: {
      color: 'red',
      fontSize: '0.85rem',
      marginTop: '0.4rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    },
    icon: {
      fontSize: '1.1rem',
    },
  };

  return (
    <>
      {!showUpdatedModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.header}>
              <h2 style={styles.title}>Edit Item</h2>
              <button style={styles.closeBtn} onClick={onClose}>
               <span style={{ color: '#991F1F' }}>✕</span> 
              </button>
            </div>
            <p style={styles.subtitle}>Edit item details below</p>
          
            <hr style={styles.divider} />

            <div style={styles.formGroup}>
              <label style={styles.label}>Item Name</label>
              <input
                style={{
                  ...styles.input,
                  ...(focusedInput === 'itemName' && styles.inputFocused),
                }}
                placeholder="Enter item name"
                onFocus={() => setFocusedInput('itemName')}
                onBlur={() => setFocusedInput('')}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                {renderSelect({
                  value: category,
                  onChange: (e) => {
                    setCategory(e.target.value);
                    if (!mechanicalElectricCategories.includes(e.target.value)) {
                      setDisposalTag('');
                    }
                  },
                  onFocus: () => setFocusedInput('category'),
                  onBlur: () => setFocusedInput(''),
                  style: {
                    ...styles.select,
                    ...(focusedInput === 'category' && styles.selectFocused),
                  },
                  children: (
                    <>
                      <option value="">Select category</option>
                      <option>Pantry Tools</option>
                      <option>Cleaning Tools</option>
                      <option>Kitchenware</option>
                      <option>Mechanical Equipment</option>
                      <option>Electrical Equipment</option>
                    </>
                  ),
                })}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'location' && styles.inputFocused),
                  }}
                  placeholder="Enter location"
                  onFocus={() => setFocusedInput('location')}
                  onBlur={() => setFocusedInput('')}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Available Quantity</label>
                <input
                  type="number"
                  min="0"
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'quantity' && styles.inputFocused),
                  }}
                  placeholder="Enter quantity"
                  onFocus={() => setFocusedInput('quantity')}
                  onBlur={() => setFocusedInput('')}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Unit</label>
                {renderSelect({
                  onFocus: () => setFocusedInput('unit'),
                  onBlur: () => setFocusedInput(''),
                  style: {
                    ...styles.select,
                    ...(focusedInput === 'unit' && styles.selectFocused),
                  },
                  children: (
                    <>
                      <option value="">Select unit</option>
                      <option>Pcs</option>
                      <option>Boxes</option>
                      <option>Liters</option>
                    </>
                  ),
                })}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price</label>
                <input
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'price' && styles.inputFocused),
                  }}
                  placeholder="Enter price"
                  onFocus={() => setFocusedInput('price')}
                  onBlur={() => setFocusedInput('')}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Status <span style={{ color: 'red' }}>*</span>
                </label>
                {renderSelect({
                  value: status,
                  onChange: (e) => setStatus(e.target.value),
                  onFocus: () => setFocusedInput('status'),
                  onBlur: () => setFocusedInput(''),
                  style: {
                    ...styles.select,
                    border: statusError
                      ? '2px solid red'
                      : focusedInput === 'status'
                        ? styles.selectFocused.border
                        : styles.select.border,
                  },
                  children: (
                    <>
                      <option value="">Select status</option>
                      <option>Available</option>
                      <option>Unavailable</option>
                    </>
                  ),
                })}
                {statusError && (
                  <p style={styles.errorText}>
                    <MdErrorOutline style={styles.icon} />
                    {statusError}
                  </p>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Disposal Tagging</label>
              {renderSelect({
                value: disposalTag,
                onChange: (e) => setDisposalTag(e.target.value),
                onFocus: () => setFocusedInput('disposalTag'),
                onBlur: () => setFocusedInput(''),
                disabled: isDisposalTagDisabled,
                style: {
                  ...styles.select,
                  ...(focusedInput === 'disposalTag' && styles.selectFocused),
                },
                children: (
                  <>
                    <option value="">Select disposal tag</option>
                    <option>For Disposal</option>
                    <option>For Repair</option>
                    <option>Good Condition</option>
                  </>
                ),
              })}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Image <span style={{ color: 'red' }}>*</span></label>
              <div style={styles.uploadBox}>
                <img src={uploadFileIcon} alt="Upload Icon" style={styles.uploadIcon} />
                <p style={styles.uploadText}>Choose a file or drag & drop it here</p>
                <p style={styles.uploadInfo}>PDF, JPG, JPEG, PNG, DOC, DOCX formats, up to 10MB</p>
                <label
                  htmlFor="file-upload"
                  style={{
                    ...styles.uploadBtn,
                    ...(isBrowseHover && styles.uploadBtnHover),
                  }}
                  onMouseEnter={() => setIsBrowseHover(true)}
                  onMouseLeave={() => setIsBrowseHover(false)}
                >
                  Browse File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div style={styles.footer}>
              <button
                style={{
                  ...styles.cancelBtn,
                  ...(isCancelHover && styles.cancelBtnHover),
                }}
                onMouseEnter={() => setIsCancelHover(true)}
                onMouseLeave={() => setIsCancelHover(false)}
                onClick={onClose}
              >
                Cancel
              </button>
              <button style={styles.saveBtn} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdatedModal && <InventoryUpdatedAdminModal onDone={handleDone} />}
    </>
  );
};

export default UpdateInventoryAdminModal;
