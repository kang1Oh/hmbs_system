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
  const [deniedRequest, setDeniedRequest] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [returns, setReturns] = useState([]);
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
      requests.sort((a, b) => new Date(b.date_requested) - new Date(a.date_requested));

      const active = requests.find(r => r.status_id !== 5 && r.status_id !== 6);
      const denied = requests.find(r => r.status_id === 6);
      const latest = requests[0];
      const isLatestCompleted = latest && latest.status_id === 5;

      // 🟢 pick the current request FIRST
      const currentRequest = active || denied || null;

      // 🧹 ensure clean slate when latest request is completed
      if (isLatestCompleted) {
        setActiveRequest(null);
        setDeniedRequest(null);
        setApprovals([]);
        setReturns([]);
        setRemarks("No active borrow request yet.");
        setCurrentStep(0);
        return;
      }

      // 🧠 branch logic
      if (denied && !active) {
        setActiveRequest(null);
        setDeniedRequest(denied);
        setCurrentStep(1);
        setRemarks("Your borrowing request was denied. See below for details.");
      } else if (active) {
        setDeniedRequest(null);
        setActiveRequest(active);
        setCurrentStep(Number(active.status_id));
      } else {
        setActiveRequest(null);
        setDeniedRequest(null);
        setApprovals([]);
      }

      // ✅ approvals, items, group, returns — only if currentRequest exists
      if (!currentRequest) return;

      const { data: allApprovals } = await axios.get("/api/approvals");
      const requestApprovals = allApprovals.filter(a => a.request_id === currentRequest._id);

      const { data: allUsers } = await axios.get(`/api/users`);
      const enrichedApprovals = requestApprovals.map(a => ({
        ...a,
        name: a.name || allUsers.find(u => u._id === a.user_id)?.name || "Unknown",
      }));

      const roleOrder = { 2: 1, 3: 2, 1: 3 };
      const sortedApprovals = enrichedApprovals.sort((a, b) => {
        const orderA = roleOrder[a.role_id] || 99;
        const orderB = roleOrder[b.role_id] || 99;
        return orderA - orderB;
      });
      setApprovals(sortedApprovals);

      // remarks per status
      if (currentRequest.status_id === 1) setRemarks("Borrowing request has been submitted for approval.");
      else if (currentRequest.status_id === 2) setRemarks("Your borrow request has been approved.");
      else if (currentRequest.status_id === 3) setRemarks("Your items have been released.");
      else if (currentRequest.status_id === 4) setRemarks("Your returned items are currently under review.");
      else if (currentRequest.status_id === 5) setRemarks("All items have been returned in good condition.");

      // fetch items & groups
      const { data: allItems } = await axios.get(`/api/borrow-items`);
      const requestItems = allItems.filter(i => i.request_id === currentRequest._id);
      const enrichedItems = await Promise.all(
        requestItems.map(async (i) => {
          const { data: tool } = await axios.get(`/api/tools/numeric/${i.tool_id}`);
          return { ...i, name: tool.name, unit: tool.unit, price: tool.price, img: tool.img || itemImage };
        })
      );

      const { data: groupMembers } = await axios.get(`/api/groups/request/${currentRequest._id}`);
      const enrichedGroups = groupMembers.map(gm => {
        const user = allUsers.find(u => u._id === gm.user_id);
        return { ...gm, user };
      });

      const instructor = allUsers.find(u => u._id === currentRequest.instructor_id);
      const { data: allReturns } = await axios.get("/api/returns");
      const requestReturns = allReturns.filter(r => String(r.request_id) === String(currentRequest._id));
      setReturns(requestReturns);

      if (active) {
        setActiveRequest({
          ...currentRequest,
          items: enrichedItems,
          groupMembers: enrichedGroups,
          instructor,
        });
      }

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
    // If there’s no active or denied request
    if (!activeRequest && !deniedRequest) {
      return (
        <div style={{ ...cardStyle, padding: '30px 24px', backgroundColor: 'rgba(255,255,255,0.95)', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#666' }}>No active borrow request yet.</p>
        </div>
      );
    }

    // Pick which request to display
    const current = activeRequest || deniedRequest;

    return (
      <div style={{ ...cardStyle, padding: '30px 10px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
        {/* Status Tracker */}
        <p style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 3px 15px', lineHeight: 1.2 }}>
          Current Status
        </p>
        <p style={{ fontSize: '15px', color: '#444', fontWeight: 400, margin: '0 0 20px 15px', lineHeight: 1.2 }}>
          {remarks}
        </p>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <div
            style={{position: 'absolute',top: '48px',left: '8%',right: '8%',height: '2px',backgroundColor: '#991F1F',zIndex: 0}}
          />
          {steps.map((label, index) => {
            const isCompleted = index < currentStep;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div
                  style={{width: '85px', height: '85px', borderRadius: '50%', backgroundColor: isCompleted ? '#991F1F' : '#fff', border: '2px solid #991F1F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'}}
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

        {/* Approval Timeline */}
        {((current?.status_id && [1, 2, 3, 4, 5, 6].includes(current.status_id)) ||
          (deniedRequest?.status_id === 6)) && (
          <div style={{ marginTop: '10px', padding: '24px', backgroundColor: '#fff', borderRadius: '10px' }}>
            <hr style={{ margin: '10px 0 20px', border: 'none', borderTop: '1px solid #ddd' }} />
            <p style={{ fontSize: '17px', fontWeight: 600, marginBottom: '16px' }}>Request No. {current.request_slip_id} Approval Timeline</p>

            {approvals.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginLeft: '12px' }}>
                {approvals.map((appr, i) => {
                  const isDenied = appr.status_id === 6;
                  const color = isDenied ? '#DC3545' : '#28A745';
                  return (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative' }}>
                      {/* Connector line */}
                      {i !== approvals.length - 1 && (
                        <div
                          style={{position: 'absolute', top: '35px', left: '9px', width: '2px', height: 'calc(100% - 35px)', backgroundColor: '#ddd'}}
                        />
                      )}

                      {/* Status circle */}
                      <div
                        style={{width: '18px', height: '18px', borderRadius: '50%', backgroundColor: color, marginTop: '5px', flexShrink: 0}}
                      />

                      {/* Info Card */}
                      <div style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderTop: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${color}`,
                      }}>
                        <div style={{ fontWeight: 600, color: '#222' }}>{appr.name}</div>
                        <div style={{ fontSize: '13.5px', color: '#666', marginTop: '2px' }}>
                          {appr.role_id === 1
                            ? 'Administrator'
                            : appr.role_id === 2
                            ? 'Instructor'
                            : appr.role_id === 3
                            ? 'Program Head'
                            : 'Staff'}
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '6px' }}>
                          <strong style={{ color }}>{isDenied ? 'Denied' : 'Approved'}</strong> — {appr.remarks || 'No remarks'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                          {new Date(appr.date_approved).toLocaleString('en-PH', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#555' }}>No approvals yet.</p>
            )}
          </div>
        )}
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
              <div style={{marginLeft: "7px"}}>
                <div style={{ ...headingStyle, fontSize: "17px" }}>On-going Borrowed Request</div>
                <div style={{ ...subTextStyle, marginBottom: "10px" }}>
                  {activeRequest ? `Request No. ${activeRequest.request_slip_id}` : "No active borrow request yet."}
                </div>
              </div>
                {activeRequest && (
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: activeRequest.status_id !== 1 
                        ? buttonStyle.backgroundColor 
                        : "#b1b1b1ff",
                      cursor: activeRequest.status_id !== 1 ? "pointer" : "not-allowed",
                    }}
                    disabled={activeRequest.status_id === 1}
                    onClick={() => {
                      if (activeRequest.status_id === 1) return;

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
                      <div >
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
                          {(() => {
                            const requestId = activeRequest._id;
                            const statusId = activeRequest.status_id;

                            // 🔍 find any return entry for this tool in this request
                            const itemReturn = returns?.find(
                              (r) =>
                                String(r.request_id) === String(requestId) &&
                                (String(r.tool_id) === String(item.tool_id) ||
                                String(r.tool_id) === String(item._id) ||
                                String(r.tool_id) === String(item.tool_numeric_id))
                            );

                            // determine per-item status
                            let itemStatus = "Released";

                            if (itemReturn) {
                              if (itemReturn.status === "Returned") itemStatus = "Returned";
                              else if (itemReturn.status === "Needs Replacement") itemStatus = "Needs Replacement";
                              else itemStatus = "Released";
                            } 
                            else if (statusId === 3 || statusId === 4) {
                              // Request released = items marked released if no return record yet
                              itemStatus = "Released";
                            } 
                            else if (statusId === 2) {
                              // Request approved but not yet released
                              itemStatus = "Reserved";
                            }
                            else if (statusId === 1){
                              // Request has just been submitted
                              itemStatus = "Pending";
                            }

                            // color mapping
                            const statusColors = {
                              Pending: "#6C757D",
                              Reserved: "#FFA500",
                              Released: "#007BFF",
                              Returned: "#28A745",
                              "Needs Replacement": "#DC3545",
                            };

                            return (
                              <span
                                style={{
                                  fontSize: "13.5px",
                                  padding: "4px 10px",
                                  backgroundColor: `${statusColors[itemStatus]}20`,
                                  color: statusColors[itemStatus],
                                  borderRadius: "5px",
                                  fontWeight: 500,
                                  display: "inline-block",
                                }}
                              >
                                {itemStatus}
                              </span>
                            );
                          })()}
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
                          <div>
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
                              <td style={{ padding: "10px", color: "#267326", fontWeight: 500 }}> 
                                <span style={{fontSize: "13.5px",
                                  padding: "4px 10px",
                                  backgroundColor: '#26732620',
                                  borderRadius: "5px",
                                  display: "inline-block",
                                  }}>Returned
                                </span>
                              </td>
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
