import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import tempItemImg from '../assets/images/temp-item-img.png';
import { FiTrash2 } from 'react-icons/fi';
import RequestSubmittedModal from '../components/RequestSubmittedModal';
import { useCart } from '../context/CartContext';

  // Autocomplete sub-component
  function AutocompleteInput({ value, onChange, onSelect, inputStyle }) {
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/users/search/${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onChange={(e) => {
            const q = e.target.value;
            onChange(q);
            setOpen(true);
            fetchSuggestions(q);
          }}
          placeholder="Enter student name"
          style={inputStyle}
        />

        {open && suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              listStyle: "none",
              margin: 0,
              fontSize: "14px",
              padding: "6px 8px",
              width: "100%",
              borderRadius: '6px',
              zIndex: 10,
              maxHeight: "160px",
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #030303ff",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s._id}
                style={{ cursor: "pointer", padding: "5px 5px" }}
                  // mousedown so it fires before input blur
                  onMouseDown={() => {
                  onSelect(s);
                  setSuggestions([]);
                  setOpen(false);
                }}
              >
                {s.name} ({s.email})
              </li>
            ))}
          </ul>
        )}

        {open && value.trim() && !loading && suggestions.length === 0 && (
          <div
            style={{
              position: "absolute",
              background: "#fff",
              border: "1px solid #030303ff",
              fontSize: "14px",
              padding: "6px 8px",
              width: "100%",
              zIndex: 10,
              borderRadius: '6px',
            }}
          >
            No student registered
          </div>
        )}
      </div>
    );
  }



function BorrowRequestForm({user}) {
  const { cart } = useCart();
  const [groupMembers, setGroupMembers] = useState([{ _id: null, name: "" }]);
  const [groupLeader, setGroupLeader] = useState({ _id: null, name: "" });

  const [dateRequested, setDateRequested] = useState("");
  const [dateUse, setDateUse] = useState("");
  const [timeUse, setTimeUse] = useState("");
  const [course, setCourse] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleAddMember = () =>
    setGroupMembers([...groupMembers, { _id: null, name: "" }]);
  const handleRemoveMember = (idx) => {
    if (groupMembers.length > 1) {
      setGroupMembers(groupMembers.filter((_, i) => i !== idx));
    }
  };
  const handleMemberChange = (idx, newVal) => {
    const updated = [...groupMembers];
    updated[idx] = newVal;
    setGroupMembers(updated);
  };

  useEffect(() => {
    const hasEmptyMember = groupMembers.some(
      (m) => !m._id || m.name.trim() === ""
    );
    const validLeader = groupLeader._id && groupLeader.name.trim() !== "";
    const valid =
      dateRequested &&
      dateUse &&
      timeUse &&
      course &&
      validLeader &&
      !hasEmptyMember &&
      cart.length > 0;
    setIsFormValid(valid);
  }, [dateRequested, dateUse, timeUse, course, groupLeader, groupMembers, cart]);

  const handleSubmit = async () => {
    try {
      // 1. Create the borrow request
      const payload = {
        user_id: 6,
        status_id: 1, // Pending
        request_slip_id: Math.floor(Math.random() * 90000) + 10000,
        lab_date: dateUse,
        date_requested: dateRequested,
        lab_time: timeUse,
        course,
      };

      const res = await fetch("/api/borrow-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Borrow request failed");
      const newRequest = await res.json();

      
      // 2. Save group members
      const groupEntries = [
        {
          request_id: newRequest._id,
          user_id: groupLeader._id,
          is_leader: true,
        },
        ...groupMembers.map((m) => ({
          request_id: newRequest._id,
          user_id: m._id,
          is_leader: false,
        })),
      ];

      for (const entry of groupEntries) {
        const groupRes = await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (!groupRes.ok) throw new Error("Group entry failed");
      }

      // 3. Save cart items linked to this request
      for (const item of cart) {
        const itemRes = await fetch("/api/borrow-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request_id: newRequest._id,
            tool_id: item.tool_id,
            requested_qty: item.selectedQty,
          }),
        });
        if (!itemRes.ok) throw new Error("Borrow items failed");
      }

      // 4. Ask backend to prepare PDF slip (not downloadable yet)
      const pdfRes = await fetch(`/api/borrow-requests/${newRequest._id}/generate-pdf`, {
        method: "POST",
      });
      if (!pdfRes.ok) throw new Error("Pdf generation failed");

      setIsModalOpen(true);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const totalQty = cart.reduce((sum, item) => sum + item.selectedQty, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.selectedQty * item.price,
    0
  );


  const formStyle = {
    fontFamily: "'Poppins', sans-serif",
    padding: '40px 60px',
    maxWidth: '1000px',
    margin: '0 auto',
    color: '#333',
  };

  const sectionTitle = {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
  };

  const subText = {
    fontSize: '15px',
    marginBottom: '25px',
    color: '#666',
  };

  const label = {
    fontWeight: 600,
    fontSize: '15px',
    marginBottom: '5px',
    display: 'block',
  };

  const inputStyle = {
    padding: '10px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    fontFamily: 'Poppins, sans-serif',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundColor: '#fff',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23666\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.855a.75.75 0 111.08 1.04l-4.25 4.417a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z\' clip-rule=\'evenodd\' /%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
  };

  const rowStyle = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  };

  const itemCard = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '12px',
    marginBottom: '14px',
    gap: '16px',
  };

  const imgStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
  };

  const totalLine = {
    fontWeight: 600,
    fontSize: '16px',
  };

  const submitBtn = {
    backgroundColor: '#991F1F',
    color: '#fff',
    padding: '10px 19px',
    border: 'none',
    borderRadius: '999px',
    fontWeight: 500,
    fontSize: '15px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '16px',
  };

  const totalSummaryStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '20px',
  };

  const hrLine = {
    margin: '20px 0',
    border: 'none',
    borderTop: '1px solid #ddd',
  };

  const required = (text) => <span>{text} <span style={{ color: 'red' }}>*</span></span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ flex: 1 }}>
        <div style={formStyle}>
          <h2 style={sectionTitle}>Borrow Request Form</h2>
          <p style={subText}>Ensure all required fields are filled out before submitting</p>

          {/* Dates + Time */}
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={label}>{required('Date Requested')}</label>
              <input
                type="date"
                style={inputStyle}
                value={dateRequested}
                min={today}
                onChange={(e) => setDateRequested(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>{required('Date Use')}</label>
              <input
                type="date"
                style={inputStyle}
                value={dateUse}
                min={today}
                onChange={(e) => setDateUse(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>{required('Time Use')}</label>
              <input
                type="time"
                style={inputStyle}
                value={timeUse}
                onChange={(e) => setTimeUse(e.target.value)}
              />
            </div>
          </div>

          {/* Group Leader + Course */}
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={label}>{required("Group Leader")}</label>
              <AutocompleteInput
                value={groupLeader.name}
                onChange={(val) => setGroupLeader({ _id: null, name: val })}
                onSelect={(u) => setGroupLeader({ _id: u._id, name: u.name })}
                inputStyle={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>{required("Course")}</label>
              <select
                style={selectStyle}
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="" disabled>
                  Select a course
                </option>
                <option value="Hospitality Management">
                  Hospitality Management
                </option>
              </select>
            </div>
          </div>

          {/* Group Members */}
          <label style={label}>Group Members</label>
          {groupMembers.map((member, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <div style={{ flex: 1 }}>
                <AutocompleteInput
                  value={member.name}
                  onChange={(val) =>
                    handleMemberChange(idx, { _id: null, name: val })
                  }
                  onSelect={(u) =>
                    handleMemberChange(idx, { _id: u._id, name: u.name })
                  }
                  inputStyle={inputStyle}
                />
              </div>
              {groupMembers.length > 1 && (
                <button
                  onClick={() => handleRemoveMember(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                    width: "40px",
                    borderRadius: "6px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#991F1F",
                  }}
                >
                  <FiTrash2 size={20} />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddMember}
            style={{
              ...submitBtn,
              backgroundColor: "#fff",
              color: "#991F1F",
              border: "1px solid #991F1F",
              fontSize: "14px",
              padding: "10px 15px",
              marginTop: "1px",
            }}
          >
            + Add New Member
          </button>

          {/* Cart Items */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '16px' }}>
            <h3 style={sectionTitle}>List of Borrowed Items</h3>
            <span style={totalLine}>Total ({cart.length})</span>
          </div>

          {cart.length === 0 ? (
            <p style={{ color: '#777' }}>Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item._id} style={itemCard}>
                <img src={tempItemImg} alt={item.name} style={imgStyle} />
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ margin: '4px 0', color: '#555' }}>
                    Quantity: {item.selectedQty} {item.unit || 'pcs'}
                  </p>
                </div>
              </div>
            ))
          )}

            <hr style={hrLine} />
              <div style={totalSummaryStyle}>
                <div>
                  <div style={{ fontSize: '20.5px', fontWeight: 600, marginBottom: '-3px' }}>Replacement Cost</div>
                  <div style={{ fontSize: '15px', color: '#555' }}>
                    {totalQty} item{totalQty > 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ fontSize: '27px', fontWeight: 700, color: '#991F1F' }}>
                  ₱{totalAmount.toLocaleString()}
                </div>
              </div>
            <hr style={hrLine} />

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <button
              style={{
                ...submitBtn,
                opacity: isFormValid ? 1 : 0.6,
                cursor: isFormValid ? 'pointer' : 'not-allowed'
              }}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Submit Borrow Request
            </button>
          </div>
        </div>
      </div>

      <Footer />
      {isModalOpen && <RequestSubmittedModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default BorrowRequestForm;