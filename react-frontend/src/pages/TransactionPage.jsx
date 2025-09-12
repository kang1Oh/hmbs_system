// No changes to imports
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import itemImage from '../assets/images/temp-item-img.png';
import progressChecked from '../assets/progress-checked.svg';
import { FaChevronDown } from 'react-icons/fa';

function TransactionPage() {
  const steps = [
    'Request Submitted',
    'Request Approved',
    'Items are Released',
    'Returned Items Under Review',
    'Returned All in Good Condition',
  ];

  const currentStep = 0;
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Shared styles
  const sectionStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
  };

  const cardStyle = {
    border: '1px solid #991F1F',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    marginBottom: '40px',
  };

  const headingStyle = {
    fontWeight: 600,
    color: '#333',
  };

  const subTextStyle = {
    fontSize: '14px',
    color: '#777',
  };

  const buttonStyle = {
    backgroundColor: '#991F1F',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13.5px',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  };

  const tableHeaderCell = {
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: 600,
    textAlign: 'left',
  };

  const tableCell = {
    padding: '12px 20px',
    fontSize: '14.5px',
    borderBottom: '1px solid #ddd',
    verticalAlign: 'middle',
  };

  const renderStatusTracker = () => (
    <div style={{ ...cardStyle, padding: '30px 24px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
      <p style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 2px 15px', lineHeight: 1.2 }}>
        Current Status
      </p>
      <p style={{ fontSize: '15px', color: '#444', fontWeight: 400, margin: '0 0 20px 15px', lineHeight: 1.2 }}>
        Borrowing request has been submitted for approval.
      </p>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '8%',
            right: '8%',
            height: '2px',
            backgroundColor: '#991F1F',
            zIndex: 0,
          }}
        />
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
              <div
                style={{
                  width: '85px',
                  height: '85px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#991F1F' : '#fff',
                  border: '2px solid #991F1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <img
                  src={progressChecked}
                  alt="Step"
                  style={{
                    width: '40px',
                    height: '40px',
                    filter: isActive ? 'brightness(0) invert(1)' : 'none',
                  }}
                />
              </div>
              <div style={{ fontSize: '14.2px', textAlign: 'center', maxWidth: '124px', fontWeight: isActive ? 600 : 400, color: '#333', lineHeight: 1.2 }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div style={{ backgroundColor: '#fff' }}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '-1px' }}>All Transactions</h2>
          <p style={{ fontSize: '17px', color: '#555', marginBottom: '25px' }}>
            View all past and ongoing equipment transactions
          </p>

          {renderStatusTracker()}

          {/* On-going Borrowed Request */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ ...headingStyle, fontSize: '17px' }}>On-going Borrowed Request</div>
                <div style={{ ...subTextStyle, marginBottom: '10px' }}>Request No. 0000001249</div>
              </div>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: currentStep === 0 ? '#b1b1b1ff' : buttonStyle.backgroundColor,
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={currentStep === 0}
                onMouseOver={(e) => {
                  if (currentStep !== 0) e.currentTarget.style.backgroundColor = '#7f1a1a';
                }}
                onMouseOut={(e) => {
                  if (currentStep !== 0) e.currentTarget.style.backgroundColor = '#991F1F';
                }}
              >
                Export List Requisition
              </button>
            </div>

            <div style={{ border: '1px solid #991F1F', borderRadius: '8px', marginTop: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: '#991F1F', color: '#fff' }}>
                    <th style={{ ...tableHeaderCell, borderTopLeftRadius: '8px' }}>Item</th>
                    <th style={tableHeaderCell}>Description</th>
                    <th style={{ ...tableHeaderCell, textAlign: 'center' }}>Quantity</th>
                    <th style={tableHeaderCell}>Unit</th>
                    <th style={tableHeaderCell}>Price</th>
                    <th style={{ ...tableHeaderCell, borderTopRightRadius: '8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Stone 27cm Granite Dinner Plate', qty: '12', unit: 'pcs', price: '₱ 1,200' },
                    { name: 'Silver 14cm Tea Spoon', qty: '12', unit: 'pcs', price: '₱ 600' },
                    { name: 'Crystal Wine Glass', qty: '6', unit: 'pcs', price: '₱ 900' },
                  ].map((item, index) => (
                    <tr key={index} style={{ backgroundColor: '#fff' }}>
                      <td style={tableCell}>
                        <img src={itemImage} alt="item" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '5px' }} />
                      </td>
                      <td style={{ ...tableCell, color: '#333' }}>{item.name}</td>
                      <td style={{ ...tableCell, textAlign: 'center' }}>{item.qty}</td>
                      <td style={tableCell}>{item.unit}</td>
                      <td style={tableCell}>{item.price}</td>
                      <td style={tableCell}>
                        <span style={{ fontSize: '13.5px', padding: '4px 10px', backgroundColor: '#E6F0FF', color: '#0053A6', borderRadius: '5px', fontWeight: 500, display: 'inline-block' }}>
                          Requested
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction History */}
          <div style={{ ...cardStyle, padding: '25px', marginBottom: '60px' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '19px', fontWeight: 600 }}>Transaction History</div>
              <div style={{ fontSize: '15px', color: '#777', margin: '-4px 0 12px' }}>Track completed equipment transactions</div>
            </div>

            {[1, 2, 3, 4].map((num, index) => (
              <div key={num} style={{ border: '0.5px solid #ccc', borderRadius: '10px', marginBottom: '12px', padding: '15px 16px', backgroundColor: 'rgba(255,255,255,0.8)' }}>
                <div onClick={() => toggleExpand(index)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div>
                    <strong>Completed Borrowed Request</strong>
                    <div style={{ fontSize: '13px', color: '#777' }}>Request No. 00000012{num}</div>
                  </div>
                  <FaChevronDown
                    style={{
                      color: '#991F1F',
                      transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>

                {expandedIndex === index && (
                  <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', fontSize: '14px', color: '#333', lineHeight: 1.6 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '40px', rowGap: '10px', marginBottom: '18px' }}>
                      <div style={{ flex: '1 1 45%' }}>
                        <p><strong>Date Requested:</strong> July 10, 2025</p>
                        <p><strong>Date Use:</strong> July 12, 2025</p>
                        <p><strong>Time Use:</strong> 8:00 AM – 12:00 PM</p>
                      </div>
                      <div style={{ flex: '1 1 45%' }}>
                        <p><strong>Course:</strong> BSIT-3A</p>
                        <p><strong>Group Leader:</strong> Juan Dela Cruz</p>
                        <p><strong>Group Members:</strong> Maria Santos, Ana Reyes, Pedro Tan</p>
                      </div>
                    </div>

                    <div>
                      <p style={{ fontWeight: 600, marginBottom: '10px' }}>Borrowed Items:</p>
                      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <thead style={{ backgroundColor: '#f2f2f2' }}>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '10px', fontSize: '13.5px' }}>Item</th>
                            <th style={{ textAlign: 'center', padding: '10px', fontSize: '13.5px' }}>Quantity</th>
                            <th style={{ textAlign: 'left', padding: '10px', fontSize: '13.5px' }}>Unit</th>
                            <th style={{ textAlign: 'left', padding: '10px', fontSize: '13.5px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Stone 27cm Granite Dinner Plate', qty: '12', unit: 'pcs' },
                            { name: 'Silver 14cm Tea Spoon', qty: '12', unit: 'pcs' },
                            { name: 'Crystal Wine Glass', qty: '6', unit: 'pcs' },
                          ].map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={itemImage} alt="Item" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {item.name}
                              </td>
                              <td style={{ textAlign: 'center', padding: '10px' }}>{item.qty}</td>
                              <td style={{ padding: '10px' }}>{item.unit}</td>
                              <td style={{ padding: '10px', color: '#267326', fontWeight: 500 }}>Returned</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TransactionPage;
