import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import RejectRequestModal from '../components/RejectRequestModal.jsx';
import DeniedRequestModal from '../components/DeniedRequestModal.jsx';
import ApprovedRequestModal from '../components/ApprovedRequestModal.jsx';

const RequestDetailsProgHead = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const [request, setRequest] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [approvalExists, setApprovalExists] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null); 
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get the borrow request
        const { data: reqData } = await axios.get(`/api/borrow-requests/${id}`);
        setRequest(reqData);

        // 2. Fetch the instructor's info 
        const { data: instructor } = await axios.get(`/api/users/${reqData.instructor_id}`);
        setInstructor(instructor);

        // 3. Get borrow items and enrich with tool data
        const { data: allItems } = await axios.get('/api/borrow-items');
        const requestItems = allItems.filter(i => i.request_id === reqData._id);

        const enrichedItems = await Promise.all(
          requestItems.map(async (i) => {
            const { data: tool } = await axios.get(`/api/tools/numeric/${i.tool_id}`);
            return {
              ...i,
              name: tool.name,
              quantity: i.requested_qty,
              unit: tool.unit,
              price: tool.price,
              img: tool.img 
            };
          })
        );
        setItems(enrichedItems);

        // 4. Get group members and enrich with user info
        const { data: group } = await axios.get(`/api/groups/request/${reqData._id}`);

        const enrichedMembers = await Promise.all(
          group.map(async (gm) => {
            const { data: user } = await axios.get(`/api/users/${gm.user_id}`);
            return { ...gm, user };
          })
        );

        const leader = enrichedMembers.find(m => m.is_leader === 'yes' || m.is_leader === true);
        const members = enrichedMembers.filter(m => !(m.is_leader === 'yes' || m.is_leader === true));

        setMembers({
          leader,
          others: members
        });

        // 5. Check approvals (for program head)
        const { data: approvals } = await axios.get('/api/approvals');
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null') || {};

        const approverId = currentUser._id;
        const reqId = reqData._id;

        const approval = approvals.find(a => 
          String(a.request_id) === String(reqId) &&
          String(a.user_id) === String(approverId) &&
          (a.status_id === 2 || a.status_id === 6)
        );

        setApprovalExists(Boolean(approval));
        setApprovalStatus(approval ? approval.status_id : null);

      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [id]);

  // Program Head approval handler
  const handleApprove = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const payload = {
        request_id: request._id,
        user_id: currentUser._id,
        name: currentUser.name || 'Program Head',
        role_id: 3, 
        status_id: 2,
        remarks: 'Approved request',
        date_approved: new Date().toISOString()
      };
      await axios.post('/api/approvals', payload);
      setApprovalExists(true);
      setShowApprovedModal(true);
      setApprovalStatus(2);
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  // Program Head rejection handler
  const handleReject = async (reason) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const payload = {
        request_id: request._id,
        user_id: currentUser._id,
        name: currentUser.name || 'Program Head',
        role_id: 3, 
        status_id: 6, 
        remarks: reason,
        date_approved: new Date().toISOString()
      };
      await axios.post('/api/approvals', payload);

      await axios.put(`/api/borrow-requests/${request._id}`, { status_id: 6 });

      setApprovalExists(true);
      setShowRejectModal(false);
      setShowDeniedModal(true);
      setApprovalStatus(6);
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  if (!request) return <div>Loading...</div>;

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };

  const styles = {
    layout:{display:'flex',minHeight:'100vh',fontFamily:'Poppins, sans-serif'},
    main:{marginLeft:'240px',flex:1,padding:'2rem'},
    formGroup:{marginBottom:'1.5rem'},
    label:{display:'block',marginBottom:'0.2rem',fontWeight:600},
    input:{width:'100%',padding:'14px',borderRadius:'7px',border:'1px solid black',fontSize:'15px',fontFamily:'Poppins, sans-serif'},
    table:{width:'100%',borderCollapse:'separate',borderSpacing:0,marginTop:'0.5rem',backgroundColor:'white',borderRadius:'10px',border:'1px solid #8A1F2B',fontFamily:'Poppins, sans-serif'},
    th:{backgroundColor:'#8A1F2B',color:'white',padding:'1rem',textAlign:'center',fontWeight:600},
    td:{padding:'1rem',textAlign:'center',borderBottom:'1px solid #ddd'},
    actionButtons:{display:'flex',justifyContent:'flex-end',marginTop:'2rem',gap:'0.5rem',fontFamily:'Poppins, sans-serif'},
    itemCountContainer:{fontWeight:600,fontSize:'18px'},
    approveButton:{backgroundColor:'#8A1F2B',color:'white',border:'none',padding:'0.75rem 1.5rem',borderRadius:'99px',cursor:'pointer',fontFamily:'Poppins, sans-serif',fontSize:'14px'},
    rejectButton:{backgroundColor:'#fff',color:'#8A1F2B',border:'1px solid #8A1F2B',padding:'0.75rem 1.5rem',borderRadius:'99px',cursor:'pointer',fontFamily:'Poppins, sans-serif',fontSize:'14px'},
    goBackBtn:{background:'none',border:'none',color:'#8A1F2B',textDecoration:'underline',cursor:'pointer',fontFamily:'Poppins, sans-serif',fontSize:'17px',fontWeight:600},
    topHeader:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.2rem',fontSize:'14px'},
    hr:{border:'none',borderTop:'2px solid rgba(97,97,97,0.3)',marginTop:'1rem',marginBottom:'-0.6rem'},
    flexRow:{display:'flex',gap:'2rem',marginTop:'2rem',flexWrap:'wrap'},
    newreq: {backgroundColor: '#2D9CDB',color:'white',padding:'0.2rem 1rem',borderRadius:'1rem',fontSize:'15px',marginLeft:'0.2rem'},
    approvedreq: {backgroundColor: '#f29544ff',color:'white',padding:'0.2rem 1rem',borderRadius:'1rem',fontSize:'15px',marginLeft:'0.2rem'},
    deniedreq: {backgroundColor: '#DC2626',color:'white',padding:'0.2rem 1rem',borderRadius:'1rem',fontSize:'15px',marginLeft:'0.2rem'},
    itemImage:{borderRadius:'8px',width:'50px',height:'50px',objectFit:'cover'},
    sectionHeader:{margin:0,fontWeight:600,fontSize:'20px'},
    membersHeader:{marginTop:'2rem',marginBottom:'0.5rem',fontWeight:600},
  };

  return (
    <div style={styles.layout}>
      <style>
        {`
          .approve-btn:hover { background-color: #a32c3a !important; }
          .reject-btn:hover { background-color: #8A1F2B !important; color: white !important; }
          .go-back-btn:hover { text-decoration: none !important; opacity: 0.8; }
        `}
      </style>

      <Sidebar
        activePage="requests"
        userRole="Staff"
        userSubrole="Program Head"
        navItems={[{id:'requests',name:'Requests',icon:<FaFileAlt/>,path:'/requests-programhead'}]}
      />

      <main style={styles.main}>
        <div style={styles.topHeader}>
          <div>
            <h1>Request No. {request.request_slip_id}</h1>
            <p style={{ fontSize: '16px' }}>
              Status:{' '}
              <span
                style={
                  approvalStatus === 2
                    ? styles.approvedreq
                    : approvalStatus === 6
                    ? styles.deniedreq
                    : styles.newreq
                }
              >
                {approvalStatus === 2
                  ? 'Approved'
                  : approvalStatus === 6
                  ? 'Denied'
                  : 'New Request'}
              </span>
            </p>
          </div>
          <button className="go-back-btn" style={styles.goBackBtn} onClick={() => navigate('/requests-programhead')}>Go Back</button>
        </div>

        <hr style={styles.hr} />

        <div style={styles.flexRow}>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Date Requested</label>
            <input type="text" value={formatDate(request.date_requested)} style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Date Use</label>
            <input type="text" value={formatDate(request.lab_date)} style={styles.input} readOnly />
          </div>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Time</label>
            <input type="text" value={request.lab_time} style={styles.input} readOnly />
          </div>
        </div>

        <div style={{ ...styles.flexRow, marginTop: '1rem' }}>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Group Leader</label>
            <input
              type="text"
              value={
                members.leader
                  ? `${members.leader.user?.name} (${members.leader.user?.email})`
                  : 'N/A'
              }
              style={styles.input}
              readOnly
            />
          </div>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Subject</label>
            <input type="text" value={request.subject} style={styles.input} readOnly />
          </div>
        </div>

        <h3 style={styles.membersHeader}>Group Members</h3>
        <table style={{ ...styles.table, marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: '7px' }}>#</th>
              <th style={styles.th}>Name</th>
              <th style={{ ...styles.th, borderTopRightRadius: '7px' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {members.others?.map((m, i) => (
              <tr key={m._id}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{m.user?.name || '(unknown)'}</td>
                <td style={styles.td}>{m.user?.email || '(unknown)'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, ...styles.formGroup }}>
            <label style={styles.label}>Approved by (Instructor):</label>
            <input type="text" value={instructor ? `${instructor.name} (${instructor.email})` : 'N/A'} style={styles.input} readOnly />
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2rem',marginBottom:'0.1rem'}}>
          <h3 style={styles.sectionHeader}>List of Borrowed Items</h3>
          <div style={styles.itemCountContainer}>Total ({items.length})</div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: '8px' }}>#</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Item Name</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
              <th style={{ ...styles.th, borderTopRightRadius: '8px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item._id}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}><img src={`${import.meta.env.VITE_API_BASE_URL}${item.img}` || `${import.meta.env.VITE_API_BASE_URL}uploads/tools/default.png`} alt={item.name} style={styles.itemImage} /></td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.requested_qty}</td>
                <td style={styles.td}>{item.unit}</td>
                <td style={styles.td}>₱{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!approvalExists && (
          <div style={styles.actionButtons}>
            <button className="reject-btn" style={styles.rejectButton} onClick={() => setShowRejectModal(true)}>Reject Request</button>
            <button className="approve-btn" style={styles.approveButton} onClick={handleApprove}>Approve Request</button>
          </div>
        )}
      </main>

      {showRejectModal && (
        <RejectRequestModal
          onClose={() => setShowRejectModal(false)}
          onSubmit={handleReject}
        />
      )}
      {showDeniedModal && (
        <DeniedRequestModal 
          onClose={() => {
            setShowDeniedModal(false);
            navigate('/requests-programhead');
            }} />)}
      {showApprovedModal && (
        <ApprovedRequestModal
          onClose={() => {
            setShowApprovedModal(false);
            navigate(`/requests-programhead`);
          }}
        />
      )}
    </div>
  );
};

export default RequestDetailsProgHead;
