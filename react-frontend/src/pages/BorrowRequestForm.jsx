import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import tempItemImg from '../assets/images/temp-item-img.png';
import { FiTrash2 } from 'react-icons/fi';
import RequestSubmittedModal from '../components/RequestSubmittedModal';

function BorrowRequestForm() {
  const [groupMembers, setGroupMembers] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dateRequested, setDateRequested] = useState('');
  const [dateUse, setDateUse] = useState('');
  const [timeUse, setTimeUse] = useState('');
  const [groupLeader, setGroupLeader] = useState('');
  const [course, setCourse] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleAddMember = () => {
    setGroupMembers([...groupMembers, '']);
  };

  const handleRemoveMember = (index) => {
    if (groupMembers.length > 1) {
      const updated = [...groupMembers];
      updated.splice(index, 1);
      setGroupMembers(updated);
    }
  };

  const handleMemberChange = (index, value) => {
    const updated = [...groupMembers];
    updated[index] = value;
    setGroupMembers(updated);
  };

  useEffect(() => {
    const hasEmptyMember = groupMembers.some(member => member.trim() === '');
    const isValid = dateRequested && dateUse && timeUse && groupLeader && course && !hasEmptyMember;
    setIsFormValid(isValid);
  }, [dateRequested, dateUse, timeUse, groupLeader, course, groupMembers]);

  const sampleItems = [
    { id: 1, name: 'Stone 27cm Granule Dinner Plate', quantity: 12 },
    { id: 2, name: 'Silver-Mirror Tea Spoon', quantity: 12 },
    { id: 3, name: 'Crystal Wine Glass', quantity: 6 },
  ];

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

  const required = (text) => <span>{text} <span style={{ color: 'red' }}>*</span></span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <div style={{ flex: 1 }}>
        <div style={formStyle}>
          <h2 style={sectionTitle}>Borrow Request Form</h2>
          <p style={subText}>Ensure all required fields are filled out before submitting</p>

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

          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={label}>{required('Group Leader')}</label>
              <input type="text" placeholder="Enter full name" style={inputStyle} value={groupLeader} onChange={(e) => setGroupLeader(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>{required('Course')}</label>
              <select style={selectStyle} value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="" disabled>Select a course</option>
                <option value="Hospitality Management">Hospitality Management</option>
              </select>
            </div>
          </div>

          <label style={label}>Group Member</label>
          {groupMembers.map((member, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={member}
                  placeholder="Enter full name"
                  onChange={(e) => handleMemberChange(idx, e.target.value)}
                  style={inputStyle}
                />
              </div>
              {groupMembers.length > 1 && (
                <button
                  onClick={() => handleRemoveMember(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px',
                    width: '40px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#991F1F'
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
              backgroundColor: '#fff',
              color: '#991F1F',
              border: '1px solid #991F1F',
              fontSize: '14px',
              padding: '10px 15px',
              marginTop: '1px'
            }}
          >
            + Add New Member
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '16px' }}>
            <h3 style={sectionTitle}>List of Borrowed Items</h3>
            <span style={totalLine}>Total ({sampleItems.length})</span>
          </div>

          {sampleItems.map(item => (
            <div key={item.id} style={itemCard}>
              <img src={tempItemImg} alt={item.name} style={imgStyle} />
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: '4px 0', color: '#555' }}>Quantity: {item.quantity} pcs</p>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <button
              style={{
                ...submitBtn,
                opacity: isFormValid ? 1 : 0.6,
                cursor: isFormValid ? 'pointer' : 'not-allowed'
              }}
              onClick={() => isFormValid && setIsModalOpen(true)}
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
