import React, { useState } from 'react';
import { useEffect } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { Eye, EyeOff } from 'lucide-react';

const AddUserModal = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // new states for email checking
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    // debounce email existence check
    const email = formData.email ? formData.email.trim() : '';
    if (!email) {
      setEmailExists(false);
      setEmailChecking(false);
      setErrors((prev) => ({ ...prev, email: prev.email && null }));
      return;
    }

    setEmailChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/users/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          // on server error, don't block user but clear checker
          setEmailExists(false);
          setEmailChecking(false);
          return;
        }
        const data = await res.json();
        setEmailExists(!!data.exists);
        if (data.exists) {
          setErrors((prev) => ({ ...prev, email: 'Email already exists' }));
        } else {
          setErrors((prev) => ({ ...prev, email: null }));
        }
      } catch (err) {
        console.error('email check failed', err);
        setEmailExists(false);
      } finally {
        setEmailChecking(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [formData.email]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.role.trim()) newErrors.role = 'User Role is required';

    // block if email exists
    if (emailExists) newErrors.email = 'Email already exists';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'studentId' && value && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    if (name === 'email') {
      // optimistic clear, actual check happens in useEffect
      setEmailExists(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // extra guard: if checking in progress, prevent submit
    if (emailChecking) {
      setErrors((prev) => ({ ...prev, email: 'Checking email, please wait' }));
      return;
    }
    if (emailExists) {
      setErrors((prev) => ({ ...prev, email: 'Email already exists' }));
      return;
    }
    onRegister(formData);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: '',
    });
    setErrors({});
  };

  const renderInput = (label, name, type = 'text', placeholder) => (
    <div style={styles.inputGroup}>
      <label style={styles.label}>
        {label} <span style={styles.asterisk}>*</span>
      </label>
      <input
        style={{
          ...styles.input,
          border: errors[name] ? '2px solid #e53935' : '1px solid #000',
        }}
        type={name === 'password' && showPassword ? 'text' : type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
      />
      {name === 'password' && (
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          style={{
            position: 'relative',
            left: '37rem',
            top: '-25px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#555',
          }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      )}

      {/* show email-specific small status (checking) */}
      {name === 'email' && emailChecking && (
        <div style={{ fontSize: '12px', color: '#666', marginTop: 6 }}>Checking email…</div>
      )}

      {errors[name] && (
        <div style={styles.errorText}>
          <MdErrorOutline style={styles.errorIcon} />
          {errors[name]}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add New User</h2>
          <p style={styles.subtitle}>Input required fields to add user</p>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {renderInput('Full Name', 'fullName', 'text', 'Enter Full Name')}
          {renderInput('Email', 'email', 'email', 'Enter Email')}
          {renderInput('Password', 'password', 'password', 'Enter Password')}

          <div style={{...styles.inputGroup, marginTop: '-2rem' }}>
            <label style={styles.label}>
              User Role <span style={styles.asterisk}>*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                ...styles.input,
                border: errors.role ? '2px solid #e53935' : '1px solid #000',
              }}
            >
              <option value="">Select a Role</option>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Program Head">Program Head</option>
              <option value="Custodian">Custodian</option>
            </select>
            {errors.role && (
              <div style={styles.errorText}>
                <MdErrorOutline style={styles.errorIcon} />
                {errors.role}
              </div>
            )}
          </div>

          <button type="submit" style={styles.registerBtn}>Register User</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px 40px',
    width: '700px',
    borderRadius: '12px',
    position: 'relative',
    fontFamily: 'Poppins, sans-serif',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
  },
  asterisk: {
    color: 'red',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '6px',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
  },
  registerBtn: {
    marginTop: '24px',
    backgroundColor: '#8A1F2B',
    color: '#fff',
    padding: '12px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  errorText: {
    color: '#e53935',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
  },
  errorIcon: {
    marginRight: '4px',
    fontSize: '1rem',
  },
};

export default AddUserModal;
