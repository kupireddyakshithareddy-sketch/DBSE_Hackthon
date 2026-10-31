
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialBookings = [
  {
    id: "BK001",
    customer: "Rahul Kumar",
    service: "General Service",
    date: "2026-10-30",
    status: "Approved",
    reason: ""
  },
  {
    id: "BK002",
    customer: "Priya Reddy",
    service: "Oil Change",
    date: "2026-10-30",
    status: "Approved",
    reason: ""
  },
  {
    id: "BK003",
    customer: "Arjun Sharma",
    service: "Brake Service",
    date: "2026-10-31",
    status: "Approved",
    reason: ""
  },
  {
    id: "BK004",
    customer: "Ananya Rao",
    service: "Full Vehicle Inspection",
    date: "2026-10-31",
    status: "Approved",
    reason: ""
  },
  {
    id: "BK005",
    customer: "Kiran Reddy",
    service: "Engine Repair",
    date: "2026-10-31",
    status: "Rejected",
    reason: "Service slot unavailable."
  }
];

const demoData = {
  Notifications: {
    description: "Important updates from your garage.",
    columns: ["Notification", "Time", "Type"],
    rows: [
      ["New service booking received", "Today, 10:30 AM", "Booking"],
      ["Engine oil stock is running low", "Today, 09:15 AM", "Stock Alert"],
      ["Mechanic completed a service", "Yesterday", "Service"]
    ]
  },
  Customers: {
    description: "Registered customer information.",
    columns: ["Customer", "Email", "Phone"],
    rows: [
      ["Rahul Kumar", "rahul@gmail.com", "9876543210"],
      ["Priya Reddy", "priya@gmail.com", "9876543211"],
      ["Arjun Sharma", "arjun@gmail.com", "9876543212"]
    ]
  },
  Vehicles: {
    description: "Customer registered vehicles.",
    columns: ["Owner", "Vehicle", "Type", "Registration"],
    rows: [
      ["Rahul Kumar", "Hyundai Creta", "Car", "TS09AB1234"],
      ["Priya Reddy", "Honda Activa", "Bike", "TS10CD5678"],
      ["Arjun Sharma", "Maruti Swift", "Car", "AP07EF9012"]
    ]
  },
  Mechanics: {
    description: "Manage mechanics and availability.",
    columns: ["Mechanic", "Specialization", "Phone", "Availability"],
    rows: [
      ["Ravi Kumar", "Engine Repair", "9876500001", "Available"],
      ["Suresh", "Bike Service", "9876500002", "Busy"],
      ["Mahesh", "General Service", "9876500003", "Available"]
    ]
  },
  "Spare Parts": {
    description: "Monitor spare parts and stock.",
    columns: ["Part Name", "Category", "Quantity", "Status"],
    rows: [
      ["Engine Oil", "Lubricants", "25 Litres", "Available"],
      ["Car Battery", "Electrical", "8 Units", "Available"],
      ["Oil Filter", "Engine Parts", "3 Units", "Low Stock"],
      ["Brake Pads", "Brake Parts", "12 Sets", "Available"],
      ["Tyres", "Tyres", "2 Units", "Low Stock"]
    ]
  },
  "Garage Inventory": {
    description: "Garage tools, machines and equipment.",
    columns: ["Equipment", "Quantity", "Condition", "Status"],
    rows: [
      ["Hydraulic Lift", "2", "Good", "Working"],
      ["Air Compressor", "1", "Good", "Working"],
      ["Wheel Alignment Machine", "1", "Good", "Working"],
      ["Diagnostic Scanner", "3", "Needs Check", "Maintenance"]
    ]
  },
  "Service Bays": {
    description: "Monitor garage service bay availability.",
    columns: ["Bay", "Purpose", "Status", "Mechanic"],
    rows: [
      ["Bay 01", "General Service", "Occupied", "Ravi Kumar"],
      ["Bay 02", "Oil Change", "Available", "Not Assigned"],
      ["Bay 03", "Engine Repair", "Occupied", "Mahesh"],
      ["Bay 04", "Bike Service", "Available", "Not Assigned"]
    ]
  },
  Services: {
    description: "Available services and prices.",
    columns: ["Service", "Description", "Price", "Duration"],
    rows: [
      ["General Service", "Complete vehicle checkup", "₹1,500", "120 min"],
      ["Oil Change", "Engine oil replacement", "₹800", "45 min"],
      ["Engine Repair", "Engine diagnosis", "₹3,000", "240 min"],
      ["Brake Service", "Brake inspection", "₹1,200", "90 min"],
      ["Battery Service", "Battery inspection", "₹1,000", "45 min"]
    ]
  },
  Invoices: {
    description: "Customer bills and payment status.",
    columns: ["Invoice", "Customer", "Amount", "Payment"],
    rows: [
      ["INV001", "Rahul Kumar", "₹1,500", "Paid"],
      ["INV002", "Priya Reddy", "₹800", "Pending"],
      ["INV003", "Arjun Sharma", "₹1,200", "Paid"]
    ]
  },
  Reports: {
    description: "Garage business performance summary.",
    columns: ["Report", "Value", "Period"],
    rows: [
      ["Total Revenue", "₹45,000", "This Month"],
      ["Completed Services", "32", "This Month"],
      ["Pending Bookings", "6", "Current"],
      ["Customer Registrations", "18", "This Month"]
    ]
  },
  Settings: {
    description: "Garage and manager information.",
    columns: ["Setting", "Information"],
    rows: [
      ["Garage Name", "AutoCare Service Center"],
      ["Working Hours", "9 AM - 8 PM"],
      ["Working Days", "Monday - Saturday"],
      ["Contact", "9876543210"]
    ]
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activePage, setActivePage] = useState("Dashboard");

  // Demo bookings are stored under a separate key so old sample data
  // does not overwrite the five records prepared for the presentation.
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("managerBookingsDemoV2");
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [modalError, setModalError] = useState("");

  const menuItems = [
    ["▦", "Dashboard"],
    ["🔔", "Notifications"],
    ["👥", "Customers"],
    ["🚘", "Vehicles"],
    ["📋", "Bookings"],
    ["🔧", "Mechanics"],
    ["🛠️", "Spare Parts"],
    ["🏭", "Garage Inventory"],
    ["🅿️", "Service Bays"],
    ["🧰", "Services"],
    ["🧾", "Invoices"],
    ["📊", "Reports"],
    ["⚙️", "Settings"]
  ];

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem("managerBookingsDemoV2", JSON.stringify(updated));
  };

  const approveBooking = (bookingId) => {
    const updated = bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: "Approved", reason: "" }
        : booking
    );

    saveBookings(updated);
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setRejectReason("");
    setModalError("");
  };

  const rejectBooking = () => {
    if (!rejectReason.trim()) {
      setModalError("Please enter a reason for rejecting this booking.");
      return;
    }

    const updated = bookings.map(booking =>
      booking.id === selectedBooking.id
        ? {
            ...booking,
            status: "Rejected",
            reason: rejectReason.trim()
          }
        : booking
    );

    saveBookings(updated);
    setSelectedBooking(null);
    setRejectReason("");
    setModalError("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderTable = (data) => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {data.columns.map((column, index) => (
              <th style={styles.th} key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td style={styles.td} key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBookings = () => (
    <div style={styles.panel}>
      <h2>📋 Booking Management</h2>
      <p style={styles.muted}>
        Review customer service requests and approve or reject bookings.
      </p>

      <div style={styles.bookingCounts}>
        <span>All: {bookings.length}</span>
        <span>Pending: {bookings.filter(b => b.status === "Pending").length}</span>
        <span>Approved: {bookings.filter(b => b.status === "Approved").length}</span>
        <span>Rejected: {bookings.filter(b => b.status === "Rejected").length}</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Booking ID", "Customer", "Service", "Date", "Status", "Action"].map(item => (
                <th style={styles.th} key={item}>{item}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td style={styles.td}>{booking.id}</td>
                <td style={styles.td}>{booking.customer}</td>
                <td style={styles.td}>{booking.service}</td>
                <td style={styles.td}>{booking.date}</td>

                <td style={styles.td}>
                  <span style={{
                    ...styles.status,
                    background:
                      booking.status === "Approved" ? "#145c3b" :
                      booking.status === "Rejected" ? "#762d36" :
                      "#70551d"
                  }}>
                    {booking.status}
                  </span>

                  {booking.status === "Rejected" && (
                    <p style={styles.reasonText}>
                      Reason: {booking.reason}
                    </p>
                  )}
                </td>

                <td style={styles.td}>
                  {booking.status === "Pending" ? (
                    <div style={styles.actions}>
                      <button
                        style={styles.approveButton}
                        onClick={() => approveBooking(booking.id)}
                      >
                        ✓ Approve
                      </button>

                      <button
                        style={styles.rejectButton}
                        onClick={() => openRejectModal(booking)}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  ) : (
                    <span style={styles.muted}>Action completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <p style={styles.empty}>No bookings available.</p>
      )}
    </div>
  );

  const renderDashboard = () => (
    <>
      <h2>Management Overview</h2>
      <p style={styles.muted}>
        Welcome to your AutoCare garage management system.
      </p>

      <div style={styles.statsGrid}>
        {[
          ["👥", "Customers", "125", "#087ef0"],
          ["🚘", "Vehicles", "98", "#159b68"],
          ["📋", "Bookings", String(bookings.length), "#df9625"],
          ["🔧", "Mechanics", "8", "#9360d9"]
        ].map(([icon, title, value, color]) => (
          <div style={styles.statCard} key={title}>
            <div style={{ ...styles.statIcon, background: color }}>{icon}</div>
            <div>
              <p style={styles.muted}>{title}</p>
              <h2>{value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.twoColumns}>
        <div style={styles.panel}>
          <h2>🔔 Recent Notifications</h2>
          {demoData.Notifications.rows.map((row, i) => (
            <div style={styles.listItem} key={i}>
              <strong>{row[0]}</strong>
              <p style={styles.muted}>{row[1]}</p>
            </div>
          ))}
          <button style={styles.button} onClick={() => setActivePage("Notifications")}>
            View Notifications
          </button>
        </div>

        <div style={styles.panel}>
          <h2>📋 Recent Bookings</h2>
          {bookings.slice(0, 3).map(booking => (
            <div style={styles.listItem} key={booking.id}>
              <strong>{booking.id} - {booking.customer}</strong>
              <p style={styles.muted}>
                {booking.service} · {booking.status}
              </p>
            </div>
          ))}
          <button style={styles.button} onClick={() => setActivePage("Bookings")}>
            Manage Bookings
          </button>
        </div>
      </div>

      <div style={styles.twoColumns}>
        <div style={styles.panel}>
          <h2>🔧 Mechanic Availability</h2>
          <p>Available Mechanics: <strong>5</strong></p>
          <p>Busy Mechanics: <strong>3</strong></p>
          <button style={styles.button} onClick={() => setActivePage("Mechanics")}>
            View Mechanics
          </button>
        </div>

        <div style={styles.panel}>
          <h2>🏭 Garage Status</h2>
          <p>Available Service Bays: <strong>2</strong></p>
          <p>Occupied Service Bays: <strong>2</strong></p>
          <button style={styles.button} onClick={() => setActivePage("Service Bays")}>
            View Service Bays
          </button>
        </div>
      </div>
    </>
  );

  const renderSection = () => {
    if (activePage === "Bookings") return renderBookings();

    const data = demoData[activePage];
    if (!data) return null;

    return (
      <div style={styles.panel}>
        <h2>{menuItems.find(item => item[1] === activePage)?.[0]} {activePage}</h2>
        <p style={styles.muted}>{data.description}</p>
        <div style={styles.sectionSummary}>
          <strong>{data.rows.length} demo records</strong>
          <span>Sample information for project demonstration</span>
        </div>
        {renderTable(data)}
        <button style={styles.button} onClick={() => setActivePage("Dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <h2>🚘 AutoCare</h2>
          <p>Manager / Admin Panel</p>
        </div>

        <div style={styles.menu}>
          {menuItems.map(([icon, name]) => (
            <button
              key={name}
              onClick={() => setActivePage(name)}
              style={{
                ...styles.menuButton,
                ...(activePage === name ? styles.menuActive : {})
              }}
            >
              <span>{icon}</span>{name}
            </button>
          ))}
        </div>

        <div style={styles.garageStatus}>
          <strong>🏭 Garage Status</strong>
          <p>🟢 Operating</p>
          <p>Service Bays: 2 Available</p>
          <p>Mechanics: 5 Available</p>
        </div>

        <button onClick={logout} style={styles.logout}>↪ Logout</button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1>{activePage}</h1>
            <p>Welcome, {user.name || "Manager"}!</p>
          </div>
          <div style={styles.managerBadge}>🛡️ Administrator</div>
        </header>

        {activePage === "Dashboard" ? renderDashboard() : renderSection()}
      </main>

      {selectedBooking && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Reject Booking</h2>
            <p>
              Booking ID: <strong>{selectedBooking.id}</strong>
            </p>
            <p>
              Customer: <strong>{selectedBooking.customer}</strong>
            </p>
            <p style={styles.muted}>
              Please explain why this service request is being rejected.
              The customer should be informed of the reason.
            </p>

            <label style={styles.label}>Reason for Rejection *</label>
            <textarea
              style={styles.textarea}
              rows={4}
              placeholder="Example: Required engine oil is currently out of stock. Please book again after restocking."
              value={rejectReason}
              onChange={e => {
                setRejectReason(e.target.value);
                setModalError("");
              }}
            />

            {modalError && <p style={styles.error}>{modalError}</p>}

            <div style={styles.actions}>
              <button
                style={styles.cancelButton}
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
              <button style={styles.rejectButton} onClick={rejectBooking}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#091b30",
    color: "white",
    fontFamily: "Arial, sans-serif"
  },
  sidebar: {
    width: "275px",
    minWidth: "245px",
    background: "#07172a",
    padding: "20px 14px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column"
  },
  brand: {
    padding: "5px 12px 18px",
    borderBottom: "1px solid #29415a"
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    marginTop: "15px",
    flex: 1
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "11px 12px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "#d8e5f4",
    textAlign: "left",
    fontSize: "14px",
    cursor: "pointer"
  },
  menuActive: {
    background: "#087ef0",
    color: "white",
    fontWeight: "bold"
  },
  garageStatus: {
    background: "#132c46",
    border: "1px solid #294966",
    borderRadius: "9px",
    padding: "12px",
    fontSize: "12px",
    marginTop: "20px",
    color: "#d8e5f4"
  },
  logout: {
    padding: "13px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px"
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "30px",
    boxSizing: "border-box"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "30px"
  },
  managerBadge: {
    background: "#173a58",
    padding: "12px 17px",
    borderRadius: "9px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "16px",
    margin: "25px 0"
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "20px",
    background: "#132c46",
    border: "1px solid #294966",
    borderRadius: "12px"
  },
  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "9px",
    display: "grid",
    placeItems: "center",
    fontSize: "22px"
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "18px",
    marginBottom: "20px"
  },
  panel: {
    background: "#132c46",
    border: "1px solid #294966",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "20px"
  },
  listItem: {
    padding: "12px 0",
    borderBottom: "1px solid #294966"
  },
  muted: {
    color: "#b9cce0",
    fontSize: "14px"
  },
  sectionSummary: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
    background: "#0d2239",
    padding: "14px",
    borderRadius: "8px",
    margin: "20px 0",
    color: "#c9dcf1",
    fontSize: "13px"
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    margin: "20px 0"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "750px",
    textAlign: "left"
  },
  th: {
    padding: "14px",
    background: "#087ef0",
    color: "white",
    fontSize: "13px"
  },
  td: {
    padding: "14px",
    borderBottom: "1px solid #294966",
    color: "#e0eaf5",
    fontSize: "13px",
    verticalAlign: "top"
  },
  button: {
    padding: "11px 15px",
    background: "#087ef0",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    marginTop: "12px"
  },
  bookingCounts: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    padding: "14px",
    marginTop: "18px",
    background: "#0d2239",
    borderRadius: "8px",
    fontSize: "13px"
  },
  status: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px"
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px"
  },
  approveButton: {
    background: "#16834e",
    color: "white",
    border: "none",
    padding: "8px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  rejectButton: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  cancelButton: {
    background: "#526477",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  reasonText: {
    color: "#ffb5b5",
    fontSize: "12px",
    maxWidth: "180px"
  },
  empty: {
    color: "#c9dcf1",
    padding: "20px"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000
  },
  modal: {
    width: "100%",
    maxWidth: "500px",
    background: "#132c46",
    border: "1px solid #42617e",
    borderRadius: "14px",
    padding: "25px",
    boxSizing: "border-box"
  },
  label: {
    display: "block",
    margin: "18px 0 8px",
    fontWeight: "bold"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #526c86",
    background: "#e8f0fe",
    color: "#111827",
    boxSizing: "border-box",
    fontFamily: "Arial",
    resize: "vertical"
  },
  error: {
    color: "#ff8e8e",
    fontSize: "13px"
  }
};

export default AdminDashboard;
