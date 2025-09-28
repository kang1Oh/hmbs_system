import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ImportCSVModal from '../components/AdminModal/ImportCSVModal';
import NewItemAddedModal from '../components/AdminModal/NewItemAddedModal';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { ChevronDown } from 'lucide-react';
import UploadIcon from '../assets/upload-file.svg';
import axios from 'axios';

const styles = {
  layout: { display: 'flex', fontFamily: 'Poppins, sans-serif' },
  main: { marginLeft: '240px', padding: '2rem', flex: 1, backgroundColor: '#fff', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.7rem', fontWeight: 700 },
  subtitle: { color: '#666', fontSize: '17px', marginTop: '-4px', marginBottom: '-1.0rem' },
  importBtn: { padding: '7px 25px', background: '#21be6dff', color: 'white', border: '1px solid #21be6dff', borderRadius: '999px', fontWeight: 600, cursor: 'pointer', display: 'flex', fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
  divider: { border: 'none', borderTop: '1.5px solid rgba(97, 97, 97, 0.3)', marginBottom: '1.3rem' },
  formGroup: { marginBottom: '1.4rem' , flex: 1 },
  row: { display: "flex", gap: "1rem" },
  flexRow: { display: 'flex', gap: '1rem', marginBottom: '1.25rem' },
  flex1: { flex: 1 },
  input: { width: '100%', padding: '0.8rem', borderRadius: '7px', border: '0.5px solid #1A1A1A', fontSize: '0.9rem', outline: 'none', fontFamily: 'Poppins, sans-serif', appearance: 'none', backgroundColor: 'white' },
  inputError: { width: '100%', padding: '0.75rem 1rem', border: '2px solid #e53935', borderRadius: '8px', fontSize: '1rem', outline: 'none', fontFamily: 'Poppins, sans-serif', appearance: 'none', backgroundColor: 'white' },
  selectWrapper: { position: 'relative', width: '100%' },
  select: { width: "100%", padding: "12px 40px 12px 16px", border: "0.5px solid #1A1A1A", borderRadius: 7, fontSize: 14, outline: "none", appearance: "none", backgroundColor: "#fff", fontFamily: "Poppins, Sans-serif" },
  selectFocused: { border: "2px solid #000" },
  label: { fontWeight: 600, marginBottom: '0.2rem', display: 'block', fontFamily: 'Poppins, sans-serif' },
  required: { color: '#e53935' },
  errorMsg: { color: '#e53935', marginTop: '0.35rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif' },
  errorIcon: { marginRight: '0.3rem' },
  uploadBox: { border: '2px dashed #8A1F2B', padding: '7rem 1rem', borderRadius: '12px', textAlign: 'center', color: '#666', position: 'relative' },
  uploadBoxError: { border: '2px solid #e53935', padding: '7rem 1rem', borderRadius: '12px', textAlign: 'center', color: '#666', position: 'relative' },
  uploadIcon: { width: '3rem', marginBottom: '0.5rem' },
  uploadHint: { fontSize: '0.875rem', marginTop: '0.2rem' },
  uploadBtn: { marginTop: '1rem', display: 'inline-block', padding: '0.5rem 1.25rem', borderRadius: '999px', backgroundColor: 'white', border: '1.5px solid #8A1F2B', fontWeight: 500, color: '#8A1F2B', cursor: 'pointer', fontSize: '14px' },
  uploadBtnHover: { backgroundColor: "#991F1F", color: "#fff" },
  inputFocused: { border: '2px solid #000' },
  buttonRow: { display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' },
  cancelBtn: { fontSize: '14px', padding: '0.5rem 1rem', border: '1.5px solid #8A1F2B', borderRadius: '999px', fontWeight: 500, backgroundColor: 'white', color: '#8A1F2B', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' },
  submitBtn: { backgroundColor: '#8A1F2B', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '999px', fontWeight: 500, cursor: 'pointer', fontSize: '14px', fontFamily: 'Poppins, sans-serif' },
  visuallyHidden: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 },
};

const initialFormData = {
  itemName: '',
  category: '',
  location: '',
  quantity: '',
  unit: '',
  price: '',
  status: '',
  tagging: '',
  image: null,
};

const AddNewItemAdmin = () => {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isItemAddedModalOpen, setIsItemAddedModalOpen] = useState(false);
  const [isBrowseHover, setIsBrowseHover] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [focusedInput, setFocusedInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios.get("/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setFormData((prev) => ({
          ...prev,
          image: file, 
        }));
      }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName.trim()) newErrors.itemName = 'Item name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.quantity === '' || formData.quantity < 0) newErrors.quantity = 'Quantity is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.price || formData.price < 0) newErrors.price = 'Price is required';
    if (!formData.status.trim()) newErrors.status = 'Status is required';
    if (!formData.tagging.trim()) newErrors.tagging = 'Disposal tagging is required';
    if (!formData.image) newErrors.image = 'Image upload is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.get("/api/tools");
      const tools = res.data;
      const maxId = tools.length > 0 ? Math.max(...tools.map(t => parseInt(t.tool_id))) : 0;
      const newToolId = (maxId + 1).toString();

      const formDataObj = new FormData();
      formDataObj.append("tool_id", newToolId);
      formDataObj.append("category_id", formData.category);
      formDataObj.append("name", formData.itemName);
      formDataObj.append("location", formData.location);
      formDataObj.append("available_qty", formData.quantity);
      formDataObj.append("unit", formData.unit);
      formDataObj.append("price", formData.price);
      formDataObj.append("tool_status", formData.status);
      formDataObj.append("disposal_status", formData.tagging);

      if (selectedFile) {
        formDataObj.append("image", selectedFile);
      }

      await axios.post("/api/tools", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsItemAddedModalOpen(true);
      setFormData(initialFormData);
      setSelectedFile(null);
      setErrors({}); 
    } catch (error) {
      console.error("Error adding new tool:", error);
      alert(error.response?.data?.error || "Failed to add tool");
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
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Add New Item</h2>
            <p style={styles.subtitle}>Add a new item to the inventory list</p>
          </div>
          <button onClick={() => setIsImportModalOpen(true)} style={styles.importBtn}>
            Import CSV File
          </button>
        </div>

        <hr style={styles.divider} />

        <form onSubmit={handleSubmit}>
          {/* Item Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Item Name</label>
            <input
              type="text"
              placeholder="Enter item name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(focusedInput === "itemName" && styles.inputFocused),
                ...(errors.itemName && styles.inputError),
              }}
              onFocus={() => setFocusedInput("itemName")}
              onBlur={() => setFocusedInput("")}
            />
            {errors.itemName && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.itemName}</p>}
          </div>

          {/* Category + Location */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <div style={{ position: "relative" }}>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    ...styles.select,
                    ...(focusedInput === "category" && styles.selectFocused),
                    ...(errors.category && styles.inputError),
                  }}
                  onFocus={() => setFocusedInput("category")}
                  onBlur={() => setFocusedInput("")}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
              </div>
              {errors.category && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.category}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                placeholder="Enter location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(focusedInput === "location" && styles.inputFocused),
                  ...(errors.location && styles.inputError),
                }}
                onFocus={() => setFocusedInput("location")}
                onBlur={() => setFocusedInput("")}
              />
              {errors.location && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.location}</p>}
            </div>
          </div>

          {/* Quantity + Unit */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Available Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(focusedInput === "quantity" && styles.inputFocused),
                  ...(errors.quantity && styles.inputError),
                }}
                onFocus={() => setFocusedInput("quantity")}
                onBlur={() => setFocusedInput("")}
              />
              {errors.quantity && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.quantity}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Unit</label>
              <div style={{ position: "relative" }}>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  style={{
                    ...styles.select,
                    ...(focusedInput === "unit" && styles.selectFocused),
                    ...(errors.unit && styles.inputError),
                  }}
                  onFocus={() => setFocusedInput("unit")}
                  onBlur={() => setFocusedInput("")}
                >
                  <option value="">Select unit</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Set">Set</option>
                  <option value="Unit">Unit</option>
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
              </div>
              {errors.unit && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.unit}</p>}
            </div>
          </div>

          {/* Price + Status */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(focusedInput === "price" && styles.inputFocused),
                  ...(errors.price && styles.inputError),
                }}
                onFocus={() => setFocusedInput("price")}
                onBlur={() => setFocusedInput("")}
              />
              {errors.price && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.price}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <div style={{ position: "relative" }}>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    ...styles.select,
                    ...(focusedInput === "status" && styles.selectFocused),
                    ...(errors.status && styles.inputError),
                  }}
                  onFocus={() => setFocusedInput("status")}
                  onBlur={() => setFocusedInput("")}
                >
                  <option value="">Select status</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
              </div>
              {errors.status && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.status}</p>}
            </div>
          </div>

          {/* Disposal Tagging */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Disposal Tagging</label>
            <div style={{ position: "relative" }}>
              <select
                name="tagging"
                value={formData.tagging}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  ...(focusedInput === "tagging" && styles.selectFocused),
                  ...(errors.tagging && styles.inputError),
                }}
                onFocus={() => setFocusedInput("tagging")}
                onBlur={() => setFocusedInput("")}
              >
                <option value="">Select disposal tag</option>
                <option value="For Disposal">For Disposal</option>
                <option value="For Repair">For Repair</option>
                <option value="Good Condition">Good Condition</option>
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
            </div>
            {errors.tagging && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.tagging}</p>}
          </div>

          {/* Upload Image */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Image</label>
            <div style={errors.image ? styles.uploadBoxError : styles.uploadBox}>
              {!selectedFile ? (
                <>
                  <img src={UploadIcon} alt="Upload" style={styles.uploadIcon} />
                  <p>Choose a file or drag & drop it here</p>
                  <p style={styles.uploadHint}>JPG, JPEG, PNG file formats up to 10MB</p>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    style={{position: "absolute", top: "20px", right: "20px", background: "#991F1F", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer",}}
                  >
                    X
                  </button>
                  {/* Preview */}
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      style={{ maxWidth: "120px", maxHeight: "120px", marginBottom: "8px", borderRadius: "8px", objectFit: "cover", border: '1px solid #000000ff' }}
                    />
                  ) : null}
                  <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{selectedFile.name}</p>
                </div>
              )}
              <input
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ ...styles.visuallyHidden }}
                id="uploadFile"
              />
              <label 
                htmlFor="uploadFile" 
                style={{ ...styles.uploadBtn, ...(isBrowseHover && styles.uploadBtnHover) }}
                onMouseEnter={() => setIsBrowseHover(true)}
                onMouseLeave={() => setIsBrowseHover(false)}
              >
                Browse File
              </label>
            </div>
            {errors.image && <p style={styles.errorMsg}><MdErrorOutline size={16} style={styles.errorIcon} />{errors.image}</p>}
          </div>

          {/* Buttons */}
          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => navigate("/inventory")}
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
