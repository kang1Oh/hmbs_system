import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TransactionModal from "../components/TransactionModal";
import { FaFileAlt, FaBoxOpen, FaClipboardList } from "react-icons/fa";

const statusLabels = {
  1: "Pending",
  2: "Approved",
  3: "Released",
  4: "Reviewed",
  5: "Returned",
  6: "Denied",
};

const statusColors = {
  2: "#FFA500", // Approved / Reserved
  3: "#007BFF", // Released
  4: "#28A745", // Reviewed / Returned
  5: "#28A745", // Completed / Returned
  6: "#DC3545", // Denied / Needs Replacement
};

const RequestApprovedAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [members, setMembers] = useState({ leader: null, others: [] });
  const [items, setItems] = useState([]); // enriched borrow-items with tool info
  const [itemStatuses, setItemStatuses] = useState([]); // parallell to items
  const [itemRemarks, setItemRemarks] = useState([]); // parallell to items
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverTransaction, setHoverTransaction] = useState(false);

  const styles = {
    layout: { display: "flex", minHeight: "100vh", fontFamily: "Poppins, sans-serif" },
    main: { marginLeft: 240, flex: 1, background: "#fff", padding: "2rem" },
    header: {display: "flex", justifyContent: "space-between", alignItems: "center",marginBottom: "0.2rem", fontSize: 14},
    goBack: {background:'none',border:'none',color:'#8A1F2B',textDecoration:'underline',cursor:'pointer',fontFamily:'Poppins, sans-serif',fontSize:'17px',fontWeight:600},
    status: {background: "#ffa500", color: "#fff", padding: "0.2rem 0.7rem",borderRadius: "1rem", fontSize: 15, marginLeft: "0.2rem"},
    input: {width: "100%", padding: "0.8rem", borderRadius: 7,border: "0.5px solid #1A1A1A", fontSize: "0.9rem",fontFamily: "Poppins, sans-serif"},
    table: {width: "100%", borderCollapse: "separate", borderSpacing: 0,marginTop: "0.5rem", background: "#fff", borderRadius: 10,border: "1px solid #8A1F2B"},
    th: {background: "#8A1F2B", color: "#fff", padding: "1rem",textAlign: "center", fontWeight: 600},
    td: { padding: "1rem", textAlign: "center", borderBottom: "1px solid #ddd" },
    tdLeft: { padding: "1.6rem", textAlign: "left", borderBottom: "1px solid #ddd" },
    image: { width: 50, height: 50, objectFit: "contain", display: "block", margin: "0 auto" },
    select: {width: 165, padding: "10px 40px 10px 14px", borderRadius: 8, fontWeight: 600,fontFamily: "inherit", background: "#fff", appearance: "none",backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",backgroundSize: 18, cursor: "pointer"},
    remarks: {width: "100%", padding: "0.7rem", fontSize: "0.9rem",borderRadius: 6, border: "1px solid #ccc", fontFamily: "Poppins, sans-serif"},
    button: {fontFamily: "Poppins, sans-serif", fontSize: "14px" ,background: "#8A1F2B", color: "#fff", padding: "14px 24px", borderRadius: 50,border: "none", float: "right", marginTop: "2rem", cursor: "pointer",transition: "0.3s ease"},
    buttonDisabled: {fontFamily: "Poppins, sans-serif", fontSize: "14px" ,background: "#c58b8b", color: "#fff", padding: "14px 24px", borderRadius: 50,border: "none", float: "right", marginTop: "2rem", cursor: "not-allowed",opacity: 0.6},
  };

  const statusLabel = statusLabels[request?.status_id] || "Unknown";
  const statusColor = statusColors[request?.status_id] || "#FFA500";

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };
  
  const getSelectStyle = (status) => {
    const colors = {
      Reserved: "#FFA500",
      Released: "#007BFF",
      Returned: "#28A745",
      "Needs Replacement": "#DC3545",
    };
    const color = colors[status] || "#FFA500";
    return {
      ...styles.select,
      color,
      border: `2px solid ${color}`,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='${encodeURIComponent(
        color
      )}' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 8px center",
      appearance: "none",
    };
  };

  // helper to get current user (expected in localStorage)
  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null") || {};
    } catch {
      return {};
    }
  };

  // Fetch initial data
  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. borrow request
        const { data: reqData } = await axios.get(`/api/borrow-requests/${id}`);
        if (!mounted) return;
        setRequest(reqData);

        // 2. instructor
        if (reqData.instructor_id) {
          try {
            const { data: instr } = await axios.get(`/api/users/${reqData.instructor_id}`);
            setInstructor(instr);
          } catch {}
        }

        // 3. group members
        try {
          const { data: group } = await axios.get(`/api/groups/request/${reqData.request_id}`);
          const enriched = await Promise.all(
            group.map(async (gm) => {
              try {
                const { data: user } = await axios.get(`/api/users/${gm.user_id}`);
                return { ...gm, user };
              } catch {
                return { ...gm, user: null };
              }
            })
          );
          const leader = enriched.find((m) => m.is_leader === "yes" || m.is_leader === true);
          const others = enriched.filter((m) => !(m.is_leader === "yes" || m.is_leader === true));
          setMembers({ leader, others });
        } catch {}

        // 4. borrow items then enrich with tool numeric
        const { data: allItems } = await axios.get("/api/borrow-items");
        const requestItems = allItems.filter((i) => String(i.request_id) === String(reqData.request_id));
        const enrichedItems = await Promise.all(
          requestItems.map(async (i) => {
            try {
              const { data: tool } = await axios.get(`/api/tools/numeric/${i.tool_id}`);
              return {
                ...i,
                name: tool.name,
                quantity: i.requested_qty || i.quantity || 1,
                unit: tool.unit,
                price: tool.price,
                img: tool.img || "",
                tool_numeric_id: i.tool_id,
              };
            } catch {
              return { ...i, name: i.name || "Unknown", quantity: i.requested_qty || 1, img: "" };
            }
          })
        );

        // 5. existing returns for this request to prefill statuses/remarks
        const { data: allReturns } = await axios.get("/api/returns");
        const requestReturns = (allReturns || []).filter((r) => String(r.request_id) === String(reqData.request_id));

        // 6. existing release for this request
        const { data: allReleases } = await axios.get("/api/releases");
        const requestRelease = (allReleases || []).find(
          (rel) => String(rel.request_id) === String(reqData.request_id)
        );

        // build statuses and remarks arrays
        const initialStatuses = enrichedItems.map((item) => {
          const itemReturn = requestReturns.find((r) => {
            return (
              String(r.tool_id) === String(item.tool_id)
            );
          });

          if (itemReturn) {
            if (itemReturn.status === "Returned") return "Returned";
            if (itemReturn.status === "Needs Replacement") return "Needs Replacement";
            // if it’s reserved in DB, still show reserved unless released
            if (itemReturn.status === "Reserved") return "Reserved";
          }

          // if there's a release record, show "Released"
          if (reqData.status_id === 3 || requestRelease) return "Released";

          // otherwise still reserved
          return "Reserved";
        });

        const remarksArr = enrichedItems.map((item) => {
          const itemReturn = requestReturns.find((r) => {
            return (
              String(r.tool_id) === String(item.tool_id)
            );
          });
          return itemReturn ? itemReturn.remarks || "" : "";
        });

        setItems(enrichedItems);
        setItemStatuses(initialStatuses);
        setItemRemarks(remarksArr);
      } catch (err) {
        console.error("RequestApprovedAdmin fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => (mounted = false);
  }, [id]);

  // derived booleans
  const allReleased = items.length > 0 && itemStatuses.every((s) => s === "Released");
  const anyReturnedOrReplacement = itemStatuses.some((s) => s === "Returned" || s === "Needs Replacement");
  const allReturnedGood = items.length > 0 && itemStatuses.every((s) => s === "Returned");

  // persist release when allReleased becomes true
  useEffect(() => {
    if (!request) return;
    // only act when all items are marked Released and request isn't already marked released
    if (!allReleased || Number(request.status_id) === 3) return;

    let mounted = true;
    const doRelease = async () => {
      try {
        // avoid creating duplicate release records
        const { data: allReleases } = await axios.get("/api/releases");
        const existing = (allReleases || []).find(
          (r) => String(r.request_id) === String(request.request_id)
        );

        const currentUser = getCurrentUser();
        const payload = {
          request_id: request.request_id,
          released_by: currentUser?.user_id || 1,
          release_date: new Date().toISOString().split("T")[0],
        };

        // create release only if none exists
        if (!existing) {
          await axios.post("/api/releases", payload);
        }

        // ensure borrow request status is set to 3 (Released)
        const { data } = await axios.put(`/api/borrow-requests/${request.request_id}`, {
          status_id: 3,
        });

        if (mounted) {
          // update local request with returned updated record
          setRequest((r) => ({ ...r, ...data.updated }));
        }
      } catch (err) {
        console.error("Error creating release or updating request:", err);
      }
    };

    doRelease();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReleased, request]);

  // persist returns when an item's status changes to Returned or Needs Replacement
  const upsertReturnForItem = async (itemIndex, forcedStatus = null) => {
    const it = items[itemIndex];
    const status = forcedStatus || itemStatuses[itemIndex];
    const remarks = itemRemarks[itemIndex] || "";

    if (!it || !request) return;

    try {
      const currentUser = getCurrentUser();

      // 1 Check if a return already exists for this request + tool
      const { data: existingReturns } = await axios.get("/api/returns");
      const existing = (existingReturns || []).find(
        (r) =>
          String(r.request_id) === String(request.request_id) &&
          String(r.tool_id) === String(it.tool_id)
      );

      // 2 Prepare payload for insert or update
      const payload = {
        request_id: request.request_id,
        tool_id: it.tool_id,
        quantity: it.requested_qty || it.quantity || 1,
        status:
          status === "Returned"
            ? "Returned"
            : status === "Needs Replacement"
            ? "Needs Replacement"
            : "Reserved",
        remarks,
        returned_to: currentUser?.user_id || 1, // FK safety fallback
        return_date:
          status === "Returned" || status === "Needs Replacement"
            ? new Date().toISOString().split("T")[0] // yyyy-mm-dd
            : null,
      };

      // 3 Upsert: update existing or create new
      if (existing) {
        await axios.put(`/api/returns/${existing.return_id}`, payload);
      } else {
        await axios.post("/api/returns", payload);
      }

      // 4 Update main request status to 4 (Returned)
      if (request.status_id !== 4) {
        const { data } = await axios.put(`/api/borrow-requests/${request.request_id}`, {
          status_id: 4,
        });
        setRequest((r) => ({ ...r, ...data.updated }));
      }
    } catch (err) {
      console.error("Error upserting return:", err);
    }
  };

  // handler for changing an item status
  const handleStatusChange = async (index, value) => {
    const updated = [...itemStatuses];
    updated[index] = value;
    setItemStatuses(updated);

    if (["Returned", "Needs Replacement"].includes(value)) {
      await upsertReturnForItem(index, value);
    }
  };

  // handler for remarks input
  const handleRemarkChange = (index, value) => {
    const r = [...itemRemarks];
    r[index] = value;
    setItemRemarks(r);
  };

  // Transaction complete: set borrow_request status_id = 5
  const handleTransactionComplete = async () => {
    if (!allReturnedGood || !request) return;
    try {
      const { data: updateRes } = await axios.put(
        `/api/borrow-requests/${request.request_id}`,
        { status_id: 5 }
      );
      await axios.post(
        `/api/borrow-requests/${request.request_id}/generate-pdf-custodian`
      );

      setRequest((r) => ({ ...r, ...updateRes.updated }));
      setShowModal(true);
    } catch (err) {
      console.error("Error completing transaction:", err);
    }
  };

  if (loading) {
    return (
      <div style={styles.layout}>
        <Sidebar
          activePage="requests"
          userRole="Staff"
          userSubrole="Admin"
          navItems={[
            { id: "requests", name: "Requests", icon: <FaFileAlt />, path: "/requests-admin" },
            { id: "inventory", name: "Inventory", icon: <FaBoxOpen />, path: "/inventory" },
            { id: "registry", name: "Registry", icon: <FaClipboardList />, path: "/registry" },
          ]}
        />
        <main style={styles.main}>
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      <Sidebar
        activePage="requests"
        userRole="Staff"
        userSubrole="Admin"
        navItems={[
          { id: "requests", name: "Requests", icon: <FaFileAlt />, path: "/requests-admin" },
          { id: "inventory", name: "Inventory", icon: <FaBoxOpen />, path: "/inventory" },
          { id: "registry", name: "Registry", icon: <FaClipboardList />, path: "/registry" },
        ]}
      />

      <main style={styles.main}>
        <div style={styles.header}>
          <h1>Request No. {request ? request.request_slip_id || request.request_id : "—"}</h1>
          <a
            href="/requests-admin"
            style={{ ...styles.goBack, opacity: hoverBack ? 0.8 : 1 }}
            onMouseEnter={() => setHoverBack(true)}
            onMouseLeave={() => setHoverBack(false)}
            onClick={(e) => {
              e.preventDefault();
              navigate("/requests-admin");
            }}
          >
            Go Back
          </a>
        </div>

        <p>
          Status:{" "}
          <span
            style={{
              ...styles.status,
              background: statusColor,
            }}
          >
            {statusLabel}
          </span>
        </p>
        <hr style={{ border: "none", borderTop: "2px solid rgba(97,97,97,0.3)", margin: "1rem 0 -0.6rem" }} />

        <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
          {[
            ["Date Requested", request?.date_requested],
            ["Date Use", request?.lab_date],
            ["Time", request?.lab_time],
          ].map(([label, value], i) => {
            const formattedValue =
              label.includes("Date") && value ? formatDate(value) : value || "";
            return (
              <div key={i} style={{ flex: 1, minWidth: 240 }}>
                <label style={{ fontWeight: 600 }}>{label}</label>
                <input style={styles.input} value={formattedValue} readOnly />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
          {[
            ["Group Leader", members.leader?.user?.name || members.leader?.user?.full_name || request?.requested_by || ""],
            ["Subject", request?.subject || ""],
          ].map(([label, value], i) => (
            <div key={i} style={{ flex: 1, minWidth: 240 }}>
              <label style={{ fontWeight: 600 }}>{label}</label>
              <input style={styles.input} value={value} readOnly />
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: "2.5rem", marginBottom: "0.5rem", fontWeight: 600 }}>Group Members</h3>
        <table style={{ ...styles.table, marginBottom: "1rem" }}>
          <thead>
            <tr>
              {["#", "Name", "Email"].map((h, i) => (
                <th key={i} style={{ ...styles.th, borderTopLeftRadius: i === 0 ? 7 : 0, borderTopRightRadius: i === 2 ? 7 : 0 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.others.map((m, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{idx + 1}</td>
                <td style={styles.td}>{m.user?.name || m.user?.full_name || "Member"}</td>
                <td style={styles.td}>{m.user?.email || request?.email || ""}</td>
              </tr>
            ))}
            {!members.leader && members.others.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={3}>No group members found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4rem 0 0.1rem" }}>
          <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>List of Borrowed Items</h3>
          <div style={{ fontWeight: 600, fontSize: 18 }}>
            Total ({items.length})
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              {["Image", "Item Name", "Quantity", "Status", "Remarks"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    ...styles.th,
                    textAlign: "center",
                    borderTopLeftRadius: i === 0 ? 8 : 0,
                    borderTopRightRadius: i === 4 ? 7 : 0,
                    paddingLeft: i === 2 ? 20 : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td style={styles.td}>
                  {item.img ? <img src={`${import.meta.env.VITE_API_BASE_URL}${item.img}` || `${import.meta.env.VITE_API_BASE_URL}uploads/tools/default.png`} alt="item" style={styles.image} /> : <div style={{ width: 72, height: 48, background: "#eee", borderRadius: 6 }} />}
                </td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.quantity} {item.unit || ""}</td>
                <td style={styles.td}>
                  <select
                    value={itemStatuses[idx] || "Reserved"}
                    onChange={(e) => handleStatusChange(idx, e.target.value)}
                    style={getSelectStyle(itemStatuses[idx] || "Reserved")}
                  >
                    {["Reserved", "Released", "Returned", "Needs Replacement"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td style={styles.tdLeft}>
                  <input
                    type="text"
                    style={styles.remarks}
                    value={itemRemarks[idx] || ""}
                    onChange={(e) => handleRemarkChange(idx, e.target.value)}
                    onBlur={async () => {
                      // save remark if there's already a return entry or if status is returned/needs replacement
                      if ((itemStatuses[idx] === "Returned" || itemStatuses[idx] === "Needs Replacement") && request) {
                        await upsertReturnForItem(idx);
                      }
                    }}
                    placeholder="Remarks (optional)"
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={5}>No items found for this request.</td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          style={
            allReturnedGood
              ? { ...styles.button, backgroundColor: hoverTransaction ? "#731923" : "#8A1F2B", opacity: hoverTransaction ? 0.9 : 1 }
              : styles.buttonDisabled
          }
          disabled={!allReturnedGood}
          onMouseEnter={() => allReturnedGood && setHoverTransaction(true)}
          onMouseLeave={() => allReturnedGood && setHoverTransaction(false)}
          onClick={() => allReturnedGood && handleTransactionComplete()}
        >
          Transaction Completed
        </button>

        {showModal && (
          <TransactionModal 
            onClose={() => {
              setShowModal(false);
              navigate('/requests-admin');
            }}
            />
          )}
      </main>
    </div>
  );
};

export default RequestApprovedAdmin;
