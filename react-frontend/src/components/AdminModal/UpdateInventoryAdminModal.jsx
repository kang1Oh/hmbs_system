import React, { useState , useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import InventoryUpdatedAdminModal from "./InventoryUpdatedAdminModal";
import uploadFileIcon from "../../assets/upload-file.svg";
import axios from "axios";

const UpdateInventoryAdminModal = ({ tool, onClose, onSave }) => {
  const [showUpdatedModal, setShowUpdatedModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statusError, setStatusError] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [isBrowseHover, setIsBrowseHover] = useState(false);
  const [isCancelHover, setIsCancelHover] = useState(false);

  // Form fields state & fetches
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");
  const [disposalTag, setDisposalTag] = useState("");

  useEffect(() => {
    if (tool) {
      setCategory(tool.category_id || "");
      setName(tool.name || "");
      setLocation(tool.location || "");
      setQuantity(tool.available_qty || "");
      setUnit(tool.unit || "");
      setPrice(tool.price || "");
      setStatus(tool.tool_status || "");
      setDisposalTag(tool.disposal_status || "");
      // Image handling left out for now
    }
  }, [tool]);

  useEffect(() => {
    axios.get("/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);
  
  const handleSave = async () => {
    if (!status) {
      setStatusError("Please select a status");
      return;
    }
    setStatusError("");

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", name);
      formDataObj.append("category_id", Number(category));
      formDataObj.append("location", location);
      formDataObj.append("available_qty", quantity);
      formDataObj.append("unit", unit);
      formDataObj.append("price", Number(price));
      formDataObj.append("tool_status", status);
      formDataObj.append("disposal_status", disposalTag);

      if (imageFile) {
        formDataObj.append("image", imageFile); // must match multer field
      }

      await axios.put(`/api/tools/${tool.tool_id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSave?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update tool:", err);
    }
  };


  const handleFileChange = (e) => setImageFile(e.target.files[0]);
  const handleDone = () => {
    setShowUpdatedModal(false);
    onClose();
  };

  const UploadBox = () => {
    // Decide what to show in the box
    const previewSrc = imageFile
      ? URL.createObjectURL(imageFile) // new upload preview
      : tool?.img
      ? `${import.meta.env.VITE_API_BASE_URL}${tool.img}` // existing image
      : null;

    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>Upload Image</label>
        <div style={styles.uploadBox}>
          {!previewSrc ? (
            <>
              <img src={uploadFileIcon} alt="Upload Icon" style={styles.uploadIcon} />
              <p style={styles.uploadText}>Choose a file or drag & drop it here</p>
              <p style={styles.uploadInfo}>JPG, JPEG, PNG formats up to 10MB</p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    zIndex: 10,
                    background: "#991F1F",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              )}
              <img
                src={previewSrc}
                alt="Preview"
                style={{
                  maxWidth: "120px",
                  maxHeight: "120px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid #000000ff",
                }}
              />
              <p style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem" }}>
                {imageFile ? imageFile.name : "Current Image"}
              </p>
            </div>
          )}

          <input
            id="file-upload"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="file-upload"
            style={{ ...styles.uploadBtn, ...(isBrowseHover && styles.uploadBtnHover) }}
            onMouseEnter={() => setIsBrowseHover(true)}
            onMouseLeave={() => setIsBrowseHover(false)}
          >
            Browse File
          </label>
        </div>
      </div>
    );
  };


  return (
    <>
      {!showUpdatedModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.header}>
              <h2 style={styles.title}>Edit Item</h2>
              <button style={styles.closeBtn} onClick={onClose}>
                <span style={{ color: "#991F1F" }}>✕</span>
              </button>
            </div>
            <p style={styles.subtitle}>Edit item details below</p>
            <hr style={styles.divider} />

            {/* Item Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Item Name</label>
              <input
                type="text"
                placeholder="Enter item name"
                name="itemName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  ...styles.input,
                  ...(focusedInput === "itemName" && styles.inputFocused),
                }}
                onFocus={() => setFocusedInput("itemName")}
                onBlur={() => setFocusedInput("")}
              />
            </div>

            {/* Category */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <div style={{position: "relative"}}>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    name="category"
                    style={{
                      ...styles.select,
                      ...(focusedInput === "category" && styles.selectFocused),
                    }}
                    onFocus={() => setFocusedInput("category")}
                    onBlur={() => setFocusedInput("")}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === "location" && styles.inputFocused),
                  }}
                  onFocus={() => setFocusedInput("location")}
                  onBlur={() => setFocusedInput("")}
                />
              </div>
            </div>

            {/* Available Quantity & Unit */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Available Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === "quantity" && styles.inputFocused),
                  }}
                  onFocus={() => setFocusedInput("quantity")}
                  onBlur={() => setFocusedInput("")}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Unit</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{
                      ...styles.select,
                      ...(focusedInput === "unit" && styles.selectFocused),
                    }}
                    onFocus={() => setFocusedInput("unit")}
                    onBlur={() => setFocusedInput("")}
                  >
                    <option value="">Select unit</option>
                    <option value="Piece">Piece</option>
                    <option value="Set">Set</option>
                    <option value="Unit">Unit</option>
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Price & Status */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price</label>
                <input
                  type="text"
                  placeholder="Enter price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === "price" && styles.inputFocused),
                  }}
                  onFocus={() => setFocusedInput("price")}
                  onBlur={() => setFocusedInput("")}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Status <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    onFocus={() => setFocusedInput("status")}
                    onBlur={() => setFocusedInput("")}  
                    style={{
                      ...styles.select,
                      border: statusError
                        ? "2px solid red"
                        : focusedInput === "status"
                        ? styles.selectFocused.border
                        : styles.select.border,
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
                </div>
                {statusError && (
                  <p style={styles.errorText}>
                    <MdErrorOutline style={styles.icon} />
                    {statusError}
                  </p>
                )}
              </div>
            </div>

            {/* Disposal Tagging */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Disposal Tagging</label>
              <div style={{ position: "relative" }}>
                <select
                  value={disposalTag}
                  onChange={(e) => setDisposalTag(e.target.value)}
                  name="disposalTag"
                  style={{
                    ...styles.select,
                    ...(focusedInput === "disposalTag" && styles.selectFocused),
                  }}
                  onFocus={() => setFocusedInput("disposalTag")}
                  onBlur={() => setFocusedInput("")}
                >
                  <option value="">Select disposal tag</option>
                  <option value="For Disposal">For Disposal</option>
                  <option value="For Repair">For Repair</option>
                  <option value="Good Condition">Good Condition</option>
                </select>
                <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#991F1F", pointerEvents: "none" }} />
              </div>
            </div>

            <UploadBox />

            <div style={styles.footer}>
              <button
                style={{ ...styles.cancelBtn, ...(isCancelHover && styles.cancelBtnHover) }}
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
const styles = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, fontFamily: "Poppins, sans-serif" },
  modal: { background: "#fff", padding: 30, borderRadius: 16, width: 700, maxHeight: "95vh", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A", marginBottom: -3 },
  closeBtn: { background: "none", border: "none", fontSize: 22, cursor: "pointer" },
  subtitle: { color: "#666", fontSize: 17, marginBottom: 10 },
  divider: { border: "none", borderTop: "1.5px solid rgba(97,97,97,0.3)", marginBottom: 15 },
  formGroup: { marginBottom: "1.4rem", flex: 1 },
  row: { display: "flex", gap: "1rem" },
  label: { fontWeight: 600, marginBottom: "0.2rem", display: "block" },
  input: { width: "100%", padding: "0.8rem", border: "0.5px solid #1A1A1A", borderRadius: 7, fontSize: "0.9rem", outline: "none", fontFamily: "Poppins, Sans-Serif" },
  inputFocused: { border: "2px solid #1A1A1A" },
  select: { width: "100%", padding: "12px 40px 12px 16px", border: "0.5px solid #1A1A1A", borderRadius: 7, fontSize: 14, outline: "none", appearance: "none", backgroundColor: "#fff", fontFamily: "Poppins, Sans-serif" },
  selectFocused: { border: "2px solid #000" },
  uploadBox: { position: "relative", border: "2px dashed #991F1F", borderRadius: 12, padding: "2.5rem 1rem", textAlign: "center", color: "#666", marginTop: 8 },
  uploadIcon: { width: 40, height: 40, marginBottom: -3 },
  uploadText: { fontSize: "1rem", fontWeight: 530, color: "#2F2F2F", marginBottom: 4 },
  uploadInfo: { fontSize: "0.875rem", color: "#6B7280", marginBottom: 12 },
  uploadBtn: { padding: "6px 18px", backgroundColor: "#fff", border: "1px solid #991F1F", color: "#991F1F", borderRadius: 999, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease", fontFamily: "Poppins, Sans-serif" },
  uploadBtnHover: { backgroundColor: "#991F1F", color: "#fff" },
  footer: { display: "flex", justifyContent: "flex-end", gap: 7, marginTop: "2rem" },
  cancelBtn: { padding: "0.5rem 1rem", border: "1.5px solid #991F1F", color: "#991F1F", background: "white", borderRadius: 1000, cursor: "pointer", transition: "all 0.2s ease", fontFamily: "Poppins, Sans-serif" },
  cancelBtnHover: { backgroundColor: "#991F1F", color: "#fff" },
  saveBtn: { padding: "0.5rem 1rem", backgroundColor: "#991F1F", color: "#fff", border: "none", borderRadius: 9999, cursor: "pointer", fontFamily: "Poppins, Sans-serif" },
  errorText: { color: "red", fontSize: "0.85rem", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.3rem" },
  icon: { fontSize: "1.1rem" },
};

export default UpdateInventoryAdminModal;
