// No changes to imports
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import itemImage from '../assets/images/temp-item-img.png';
import progressChecked from '../assets/progress-checked.svg';
import { FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

function TransactionPage() {
  const steps = [
    'Request Submitted',
    'Request Approved',
    'Items are Released',
    'Returned Items Under Review',
    'Returned All in Good Condition',
  ];

  const [currentStep, setCurrentStep] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [activeRequest, setActiveRequest] = useState(null);
  const [historyRequests, setHistoryRequests] = useState([]);

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

  //active request fetch
  useEffect(() => {
  const fetchActiveRequest = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;

      const { data: requests } = await axios.get(`/api/borrow-requests/by-group-or-user/${storedUser._id}`);
      const active = requests.find(r => r.status_id !== 5 && r.status_id !== 6);

      if (!active) {
        setActiveRequest(null);
        return;
      }

      setCurrentStep(Number(active.status_id));

      if (active.status_id === 1) {
        setRemarks("Borrowing request has been submitted for approval.");
      } else if (active.status_id === 2 || active.status_id === 6) {
        const { data: approvals } = await axios.get("/api/approvals");
        const approval = approvals.find(a => a.request_id == active.request_slip_id);
        setRemarks(approval ? approval.remarks : '');
      } else if (active.status_id === 3) {
        setRemarks("Your items have been released.");
      } else if (active.status_id === 4) {
        setRemarks("Your returned items are currently under review.");
      } else if (active.status_id === 5) {
        setRemarks("All items have been returned in good condition.");
      }

      // fetch items
      const { data: allItems } = await axios.get(`/api/borrow-items`);
      const requestItems = allItems.filter(i => i.request_id === active._id);

      const enrichedItems = await Promise.all(
        requestItems.map(async (i) => {
          const { data: tool } = await axios.get(`/api/tools/numeric/${i.tool_id}`);
          return {
            ...i,
            name: tool.name,
            unit: tool.unit,
            price: tool.price,
            img: tool.img || itemImage,
          };
        })
      );

      // fetch users + groups
      const { data: allUsers } = await axios.get(`/api/users`);
      const { data: groupMembers } = await axios.get(`/api/groups/request/${active._id}`);

      const enrichedGroups = groupMembers.map(gm => {
        const user = allUsers.find(u => u._id === gm.user_id);
        return { ...gm, user };
      });

      // find instructor
      const instructor = allUsers.find(u => u._id === active.instructor_id);

      setActiveRequest({
        ...active,
        items: enrichedItems || [],
        groupMembers: enrichedGroups || [],
        instructor: instructor || null,
      });

    } catch (err) {
      console.error("Error fetching active request:", err);
    }
  };

  fetchActiveRequest();
}, []);


  //transaction history fetch
  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;

      try {
        // 1. get all requests related to this user
        const { data: requests } = await axios.get(`/api/borrow-requests/by-group-or-user/${storedUser._id}`);

        // 2. only keep completed ones (status_id = 5)
        const completed = requests.filter(r => r.status_id === 5);

        // 3. get all borrow items
        const { data: allItems } = await axios.get(`/api/borrow-items`);

        // 4. get all users (so we can match group members)
        const { data: allUsers } = await axios.get(`/api/users`);

        // 5. enrich each completed request with items + tools + group members
        const enrichedRequests = await Promise.all(
          completed.map(async (req) => {
            // items
            const requestItems = allItems.filter(i => i.request_id === req._id);
            const enrichedItems = await Promise.all(
              requestItems.map(async (i) => {
                const { data: tool } = await axios.get(`/api/tools/numeric/${i.tool_id}`);
                return {
                  ...i,
                  name: tool.name,
                  unit: tool.unit,
                  price: tool.price,
                  img: tool.img || itemImage,
                };
              })
            );

            // groups
            const { data: groupMembers } = await axios.get(`/api/groups/request/${req._id}`);

            // join groups → users by `_id`
            const enrichedGroups = groupMembers.map(gm => {
              const user = allUsers.find(u => u._id === gm.user_id); // match NeDB _id
              return { ...gm, user };
            });

            // find instructor 
            const instructor = allUsers.find(u => u._id === req.instructor_id);

            return { ...req, items: enrichedItems, groupMembers: enrichedGroups, instructor: instructor || null };
          })
        );

        
        setHistoryRequests(enrichedRequests);
      } catch (err) {
        console.error("Failed to fetch transaction history:", err);
      }
    };

    fetchHistory();
  }, []);

  const renderStatusTracker = () => {
    if (!activeRequest) {
      return (
        <div style={{ ...cardStyle, padding: '30px 24px', backgroundColor: 'rgba(255,255,255,0.95)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#666' }}>No active borrow request yet.</p>
        </div>
      );
    }

    return (
      <div style={{ ...cardStyle, padding: '30px 24px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <p style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 2px 15px', lineHeight: 1.2 }}>
          Current Status
        </p>
        <p style={{ fontSize: '15px', color: '#444', fontWeight: 400, margin: '0 0 20px 15px', lineHeight: 1.2 }}>
          {remarks}
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
            const isCompleted = index < currentStep; // careful: status_id aligns 1-based
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div
                  style={{
                    width: '85px',
                    height: '85px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#991F1F' : '#fff',
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
                      filter: isCompleted ? 'brightness(0) invert(1)' : 'none',
                    }}
                  />
                </div>
                <div style={{ fontSize: '14.2px', textAlign: 'center', maxWidth: '124px', fontWeight: isCompleted ? 600 : 400, color: '#333', lineHeight: 1.2 }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ ...headingStyle, fontSize: "17px" }}>On-going Borrowed Request</div>
                <div style={{ ...subTextStyle, marginBottom: "10px" }}>
                  {activeRequest ? `Request No. ${activeRequest.request_slip_id}` : "No active borrow request yet."}
                </div>
              </div>
                {activeRequest && (
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: activeRequest.status_id === 2 
                        ? buttonStyle.backgroundColor 
                        : "#b1b1b1ff",
                      cursor: activeRequest.status_id === 2 ? "pointer" : "not-allowed",
                    }}
                    disabled={activeRequest.status_id !== 2}
                    onClick={() => {
                      if (activeRequest.status_id !== 2) return;

                      const baseUrl = import.meta.env.VITE_API_BASE_URL;   //requires .env variable
                      const fileUrl = `${baseUrl}/pdf/borrow_slip_${activeRequest.request_slip_id}.pdf`;
                      window.open(fileUrl, "_blank"); // opens in new tab (downloadable/viewable)
                    }}
                  >
                    Export List Requisition
                  </button>
                )}
            </div>

            {activeRequest && (
              <div
                style={{
                  border: "1px solid #991F1F",
                  borderRadius: "8px",
                  marginTop: "10px",
                  overflow: "hidden",
                }}
              >
                {/* ✅ Request Details */}
                <div style={{ display: "flex", flexWrap: "wrap", columnGap: "40px", rowGap: "10px", marginBottom: "18px", padding: "15px" }}>
                  <div style={{ flex: "1 1 45%" }}>
                    <p><strong>Date Requested:</strong> {activeRequest.date_requested}</p>
                    <p><strong>Date Use:</strong> {activeRequest.lab_date}</p>
                    <p><strong>Time Use:</strong> {activeRequest.lab_time}</p>
                    <p><strong>Subject:</strong> {activeRequest.subject}</p>
                    <p><strong>Instructor:</strong> {activeRequest.instructor?.name || "(unknown)"}</p>
                  </div>
                  <div style={{ flex: "1 1 45%" }}>
                    {activeRequest.groupMembers && activeRequest.groupMembers.length > 0 && (
                      <div style={{ marginTop: "10px" }}>
                        {(() => {
                          const leader = activeRequest.groupMembers.find(gm => gm.is_leader);
                          const members = activeRequest.groupMembers.filter(gm => !gm.is_leader);

                          return (
                            <>
                              {leader && (
                                <p>
                                  <strong>Group Leader:</strong>{" "}
                                  {leader.user?.name || "(unknown)"}
                                </p>
                              )}
                              {members.length > 0 && (
                                <div>
                                  <p><strong>Group Members:</strong></p>
                                  <ul style={{ marginLeft: "18px", fontSize: "14px" }}>
                                    {members.map(m => (
                                      <li key={m._id}>{m.user?.name || "(unknown)"}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ Items Table */}
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#991F1F", color: "#fff" }}>
                      <th style={{ ...tableHeaderCell, borderTopLeftRadius: "8px" }}>Item</th>
                      <th style={tableHeaderCell}>Description</th>
                      <th style={{ ...tableHeaderCell, textAlign: "center" }}>Quantity</th>
                      <th style={tableHeaderCell}>Unit</th>
                      <th style={tableHeaderCell}>Price</th>
                      <th style={{ ...tableHeaderCell, borderTopRightRadius: "8px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRequest.items?.map((item, index) => (
                      <tr key={index} style={{ backgroundColor: "#fff" }}>
                        <td style={tableCell}>
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${item.img}` || `${import.meta.env.VITE_API_BASE_URL}uploads/tools/default.png`}
                            alt="item"
                            style={{
                              width: "44px",
                              height: "44px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        </td>
                        <td style={{ ...tableCell, color: "#333" }}>{item.name}</td>
                        <td style={{ ...tableCell, textAlign: "center" }}>{item.requested_qty}</td>
                        <td style={tableCell}>{item.unit}</td>
                        <td style={tableCell}>₱ {item.price}</td>
                        <td style={tableCell}>
                          <span
                            style={{
                              fontSize: "13.5px",
                              padding: "4px 10px",
                              backgroundColor: "#E6F0FF",
                              color: "#0053A6",
                              borderRadius: "5px",
                              fontWeight: 500,
                              display: "inline-block",
                            }}
                          >
                            Requested
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div style={{ ...cardStyle, padding: '25px', marginBottom: '60px' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '19px', fontWeight: 600 }}>Transaction History</div>
              <div style={{ fontSize: '15px', color: '#777', margin: '-4px 0 12px' }}>Track completed equipment transactions</div>
            </div>

            {historyRequests.map((req, index) => (
              <div
                key={req._id}
                style={{
                  border: "0.5px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  padding: "15px 16px",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                <div
                  onClick={() => toggleExpand(index)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <div>
                    <strong>Completed Borrowed Request</strong>
                    <div style={{ fontSize: "13px", color: "#777" }}>
                      Request No. {req.request_slip_id}
                    </div>
                  </div>
                  <FaChevronDown
                    style={{
                      color: "#991F1F",
                      transform: expandedIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </div>

                {expandedIndex === index && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "20px",
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      fontSize: "14px",
                      color: "#333",
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "40px", rowGap: "10px", marginBottom: "18px" }}>
                      <div style={{ flex: "1 1 45%" }}>
                        <p><strong>Date Requested:</strong> {req.date_requested}</p>
                        <p><strong>Date Use:</strong> {req.lab_date}</p>
                        <p><strong>Time Use:</strong> {req.lab_time}</p>
                        <p><strong>Subject:</strong> {req.subject}</p>
                        <p><strong>Instructor:</strong> {req.instructor?.name || "(unknown)"}</p>
                      </div>
                      <div style={{ flex: "1 1 45%" }}>
                        {req.groupMembers && req.groupMembers.length > 0 && (
                          <div style={{ marginTop: "10px" }}>
                            {(() => {
                              const leader = req.groupMembers.find(gm => gm.is_leader);
                              const members = req.groupMembers.filter(gm => !gm.is_leader);

                              return (
                                <>
                                  {leader && (
                                    <p>
                                      <strong>Group Leader:</strong>{" "}
                                      {leader.user?.name || "(unknown)"}
                                    </p>
                                  )}
                                  {members.length > 0 && (
                                    <div>
                                      <p><strong>Group Members:</strong></p>
                                      <ul style={{ marginLeft: "18px", fontSize: "13.5px" }}>
                                        {members.map(m => (
                                          <li key={m._id}>{m.user?.name || "(unknown)"}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontWeight: 600, marginBottom: "10px" }}>Borrowed Items:</p>
                      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "6px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <thead style={{ backgroundColor: "#f2f2f2" }}>
                          <tr>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13.5px" }}>Item</th>
                            <th style={{ textAlign: "center", padding: "10px", fontSize: "13.5px" }}>Quantity</th>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13.5px" }}>Unit</th>
                            <th style={{ textAlign: "left", padding: "10px", fontSize: "13.5px" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {req.items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                              <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <img
                                  src={`${import.meta.env.VITE_API_BASE_URL}${item.img}` || `${import.meta.env.VITE_API_BASE_URL}uploads/tools/default.png`}
                                  alt="Item"
                                  style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
                                />
                                {item.name}
                              </td>
                              <td style={{ textAlign: "center", padding: "10px" }}>{item.requested_qty}</td>
                              <td style={{ padding: "10px" }}>{item.unit}</td>
                              <td style={{ padding: "10px", color: "#267326", fontWeight: 500 }}>Returned</td>
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
