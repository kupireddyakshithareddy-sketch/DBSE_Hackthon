
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MechanicDashboard() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const mechanicName = user.name || "Mechanic";

  const [activePage, setActivePage] = useState("Dashboard");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [workNote, setWorkNote] = useState("");

  const [notification] = useState([
    "Check your assigned customer bookings.",
    "Check spare parts before starting service.",
    "Update completed jobs after servicing.",
    "Rahul Kumar: General Service appointment at 10:00 AM (sample).",
    "Priya Reddy: Brake Repair appointment at 12:00 PM (sample).",
    "Arjun Sharma: Oil Change completed (sample)."
  ]);

  // Convert customer booking data into mechanic job format
  const loadJobs = () => {
    try {
      const allBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );

      const assignedJobs = allBookings
        .filter((booking) => {
          const assignedName = String(
            booking.assignedMechanic || ""
          ).trim().toLowerCase();

          const currentName = String(
            mechanicName
          ).trim().toLowerCase();

          return (
            assignedName === currentName &&
            booking.status !== "Pending" &&
            booking.status !== "Rejected"
          );
        })
        .map((booking) => ({
          ...booking,
          customer: booking.name || booking.customer || "Customer",
          phone: booking.phone || "",
          email: booking.email || "",
          vehicle: booking.vehicle || "Vehicle",
          registration:
            booking.registration ||
            booking.registrationNumber ||
            "Not provided",
          service: booking.service || "Service",
          date: booking.date || "",
          time: booking.time || "",
          problem: booking.problem || "Not specified",
          parts: booking.parts || [],
          status: booking.status || "Approved"
        }));

      setJobs(assignedJobs);
    } catch (error) {
      console.error("Unable to load bookings:", error);
      setJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();

    // Refresh when another tab updates bookings
    const handleStorage = (event) => {
      if (event.key === "bookings") {
        loadJobs();
      }
    };

    // Refresh when returning to this dashboard
    const handleFocus = () => loadJobs();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [mechanicName]);

  // Update the original customer booking
  const updateStatus = (id, status) => {
    try {
      const allBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );

      const updatedBookings = allBookings.map((booking) =>
        String(booking.id) === String(id)
          ? {
              ...booking,
              status,
              workNote:
                workNote || booking.workNote || ""
            }
          : booking
      );

      localStorage.setItem(
        "bookings",
        JSON.stringify(updatedBookings)
      );

      loadJobs();
      setSelectedJob(null);
      setWorkNote("");
    } catch (error) {
      alert("Unable to update service status.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pending = jobs.filter(
    (job) =>
      job.status === "Approved" ||
      job.status === "Assigned"
  ).length;

  const inProgress = jobs.filter(
    (job) => job.status === "In Progress"
  ).length;

  const completed = jobs.filter(
    (job) => job.status === "Completed"
  ).length;

  const menuItems = [
    ["▦", "Dashboard"],
    ["🔧", "My Jobs"],
    ["👥", "Customer Details"],
    ["🚘", "Vehicle Details"],
    ["📋", "Service Updates"],
    ["🛠️", "Spare Parts"],
    ["📜", "Work History"],
    ["🔔", "Notifications"],
    ["👤", "My Profile"]
  ];

  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parts = String(date).split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return date;
  };

  const statusStyle = (status) => ({
    ...styles.status,
    background:
      status === "Completed"
        ? "#145c3b"
        : status === "In Progress"
        ? "#70551d"
        : "#234d79"
  });

  const appointmentDetails = (job) => (
    <div style={styles.appointmentBox}>
      <h3>📅 Customer Appointment</h3>

      <div style={styles.appointmentRow}>
        <span>Appointment Date</span>
        <strong>{formatDate(job.date)}</strong>
      </div>

      <div style={styles.appointmentRow}>
        <span>Appointment Time</span>
        <strong>{job.time || "Not provided"}</strong>
      </div>

      <div style={styles.appointmentRow}>
        <span>Service Center</span>
        <strong>{job.center || "Not provided"}</strong>
      </div>
    </div>
  );

  const emptyMessage = (
    <div style={styles.empty}>
      <h2>📭 No Assigned Bookings</h2>
      <p>
        No approved customer bookings have been assigned to you yet.
      </p>
      <p>
        Please check again after the manager assigns a booking
        using your mechanic name: <strong>{mechanicName}</strong>
      </p>
    </div>
  );

  const renderDashboard = () => (
    <>
      <h2>Mechanic Overview</h2>
      <p style={styles.muted}>
        Manage your assigned customer vehicle service work.
      </p>

      <div style={styles.statsGrid}>
        {[
          ["🔧", "Total Jobs", jobs.length, "#087ef0"],
          ["⏳", "Assigned Jobs", pending, "#df9625"],
          ["⚙️", "In Progress", inProgress, "#9360d9"],
          ["✅", "Completed Jobs", completed, "#159b68"]
        ].map(([icon, title, value, color]) => (
          <div style={styles.statCard} key={title}>
            <div style={{ ...styles.statIcon, background: color }}>
              {icon}
            </div>
            <div>
              <p style={styles.muted}>{title}</p>
              <h2>{value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.panel}>
        <h2>🔧 Recent Assigned Jobs</h2>

        {displayJobs.slice(0, 3).map((job) => (
              <div style={styles.jobItem} key={job.id}>
                <div>
                  <strong>{job.vehicle}</strong>
                  <p style={styles.muted}>
                    {job.customer} · {job.service}
                  </p>
                  <p style={styles.muted}>
                    📅 {formatDate(job.date)} · 🕒 {job.time}
                  </p>
                </div>

                <span style={statusStyle(job.status)}>
                  {job.status}
                </span>
              </div>
            ))}

        {showingDemoData && <p style={styles.demoNotice}>Showing sample dashboard records. Your actual assigned jobs will appear here after manager assignment.</p>}

        <button
          style={styles.button}
          onClick={() => setActivePage("My Jobs")}
        >
          View All Jobs
        </button>
      </div>

      <div style={styles.twoColumns}>
        <div style={styles.panel}>
          <h2>🛠️ Spare Parts Reminder</h2>
          <p>Check required spare parts before starting each job.</p>
          <button
            style={styles.button}
            onClick={() => setActivePage("Spare Parts")}
          >
            View Spare Parts
          </button>
        </div>

        <div style={styles.panel}>
          <h2>📜 Work Summary</h2>
          <p>Completed Services: <strong>{completed}</strong></p>
          <p>Pending Services: <strong>{pending}</strong></p>
          <button
            style={styles.button}
            onClick={() => setActivePage("Work History")}
          >
            View Work History
          </button>
        </div>
      </div>
    </>
  );

  const renderJobs = () => (
    <div style={styles.panel}>
      <h2>🔧 My Assigned Jobs</h2>
      <p style={styles.muted}>
        Customer bookings assigned to {mechanicName}.
      </p>

      {displayJobs.map((job) => (
            <div style={styles.jobCard} key={job.id}>
              <div style={styles.jobHeader}>
                <h3>{job.service}</h3>
                <span style={statusStyle(job.status)}>
                  {job.status}
                </span>
              </div>

              <p>🚘 Vehicle: {job.vehicle}</p>
              <p>🔢 Registration: {job.registration}</p>
              <p>👤 Customer: {job.customer}</p>
              <p>📞 Phone: {job.phone}</p>

              {appointmentDetails(job)}

              <p>📝 Problem: {job.problem}</p>

              <p>
                <b>Estimated Cost:</b> ₹
                {Number(job.estimatedCost || 0).toLocaleString("en-IN")}
              </p>

              {!showingDemoData && <button
                style={styles.button}
                onClick={() => setSelectedJob(job)}
              >
                View Job Details
              </button>}
            </div>
          ))}
      {showingDemoData && <p style={styles.demoNotice}>These are sample jobs for your project demo. Real assigned bookings will replace these samples automatically.</p>}
    </div>
  );

  // Demo records keep this page useful during the project presentation.
  // Real customer bookings automatically replace these examples when assigned.
  const demoCustomers = [
    {
      id: "DEMO-101", customer: "Rahul Kumar", email: "rahul.kumar@example.com",
      phone: "+91 90000 00001", vehicle: "Hyundai Creta",
      registration: "AP 07 AB 1234", service: "General Service",
      problem: "Engine oil change and general vehicle check-up",
      date: "2026-10-30", time: "10:00 AM", center: "AutoCare - Guntur",
      estimatedCost: 3999, status: "Approved", workNote: ""
    },
    {
      id: "DEMO-102", customer: "Priya Reddy", email: "priya.reddy@example.com",
      phone: "+91 90000 00002", vehicle: "Honda City",
      registration: "TS 09 CD 5678", service: "Brake Repair",
      problem: "Brake noise while applying brakes",
      date: "2026-10-30", time: "12:00 PM", center: "AutoCare - Hyderabad",
      estimatedCost: 2999, status: "In Progress", workNote: "Brake pads inspection required"
    },
    {
      id: "DEMO-103", customer: "Arjun Sharma", email: "arjun.sharma@example.com",
      phone: "+91 90000 00003", vehicle: "Maruti Swift",
      registration: "AP 16 EF 9012", service: "Oil Change",
      problem: "Regular engine oil replacement",
      date: "2026-10-31", time: "03:00 PM", center: "AutoCare - Vijayawada",
      estimatedCost: 1499, status: "Completed", workNote: "Engine oil and oil filter replaced"
    }
  ];

  // Show sample records across the mechanic sections until real jobs are assigned.
  // Sample records are display-only and never update the customer's real booking.
  const displayJobs = jobs.length > 0 ? jobs : demoCustomers;
  const showingDemoData = jobs.length === 0;

  const renderCustomerCard = (job, isDemo = false) => (
    <div style={styles.jobCard} key={job.id}>
      <div style={styles.jobHeader}>
        <div>
          <h3>{job.customer}</h3>
          <p style={styles.muted}>Customer ID: {job.id}</p>
        </div>
        <span style={statusStyle(job.status)}>{job.status}</span>
      </div>
      <div style={styles.twoColumns}>
        <div>
          <p>📧 <b>Email:</b> {job.email || "Not provided"}</p>
          <p>📞 <b>Phone:</b> {job.phone || "Not provided"}</p>
          <p>🚘 <b>Vehicle:</b> {job.vehicle}</p>
          <p>🔢 <b>Registration:</b> {job.registration || "Not provided"}</p>
        </div>
        <div>
          <p>🔧 <b>Service:</b> {job.service}</p>
          <p>📝 <b>Customer Problem:</b> {job.problem}</p>
          <p>💰 <b>Estimated Cost:</b> ₹{Number(job.estimatedCost || 0).toLocaleString("en-IN")}</p>
          <p>🧰 <b>Work Note:</b> {job.workNote || "Not updated yet"}</p>
        </div>
      </div>
      {appointmentDetails(job)}
      {isDemo && <p style={styles.demoNotice}>Demo sample only — real customer details will appear here after the manager assigns a booking to you.</p>}
    </div>
  );

  const renderCustomerDetails = () => (
    <div style={styles.panel}>
      <h2>👥 Customer Details</h2>
      <p style={styles.muted}>Customer contact, vehicle, service and appointment information.</p>
      {jobs.length > 0
        ? jobs.map((job) => renderCustomerCard(job))
        : <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}><div><p style={styles.muted}>Sample Customers</p><h2>3</h2></div></div>
              <div style={styles.statCard}><div><p style={styles.muted}>Appointments</p><h2>3</h2></div></div>
              <div style={styles.statCard}><div><p style={styles.muted}>Service Types</p><h2>3</h2></div></div>
            </div>
            {demoCustomers.map((job) => renderCustomerCard(job, true))}
          </>}
    </div>
  );

  const renderVehicleDetails = () => (
    <div style={styles.panel}>
      <h2>🚘 Customer Vehicle Details</h2>
      <p style={styles.muted}>
        Vehicles related to your assigned service jobs.
      </p>

      {displayJobs.map((job) => (
            <div style={styles.jobCard} key={job.id}>
              <h3>{job.vehicle}</h3>

              {job.vehicleImage && (
                <img
                  src={job.vehicleImage}
                  alt={job.vehicle}
                  style={styles.vehicleImage}
                />
              )}

              <p>Registration Number: {job.registration}</p>
              <p>Customer: {job.customer}</p>
              <p>Contact: {job.phone}</p>
              <p>Required Service: {job.service}</p>
              <p>Problem: {job.problem}</p>

              {appointmentDetails(job)}

              <span style={statusStyle(job.status)}>
                {job.status}
              </span>
            </div>
          ))}
      {showingDemoData && <p style={styles.demoNotice}>Sample vehicle records are shown for presentation. Real vehicle details will load from assigned bookings.</p>}
    </div>
  );

  const renderServiceUpdates = () => (
    <div style={styles.panel}>
      <h2>📋 Service Progress Updates</h2>
      <p style={styles.muted}>
        Update the progress of your assigned services.
      </p>

      {displayJobs.map((job) => (
            <div style={styles.jobCard} key={job.id}>
              <h3>{job.vehicle}</h3>
              <p>Service: {job.service}</p>
              <p>Customer: {job.customer}</p>

              {appointmentDetails(job)}

              <p>
                Current Status:{" "}
                <span style={statusStyle(job.status)}>
                  {job.status}
                </span>
              </p>

              {!showingDemoData && job.status === "Approved" && (
                <button
                  style={styles.button}
                  onClick={() =>
                    updateStatus(job.id, "In Progress")
                  }
                >
                  ▶ Start Service
                </button>
              )}

              {!showingDemoData && job.status === "Assigned" && (
                <button
                  style={styles.button}
                  onClick={() =>
                    updateStatus(job.id, "In Progress")
                  }
                >
                  ▶ Start Service
                </button>
              )}

              {!showingDemoData && job.status === "In Progress" && (
                <button
                  style={styles.completeButton}
                  onClick={() => {
                    setSelectedJob(job);
                    setWorkNote(job.workNote || "");
                  }}
                >
                  ✓ Mark Completed
                </button>
              )}

              {job.status === "Completed" && (
                <p style={styles.success}>
                  Service Completed Successfully!
                </p>
              )}

              {job.workNote && (
                <p style={styles.muted}>
                  Work Note: {job.workNote}
                </p>
              )}
            </div>
          ))}
      {showingDemoData && <p style={styles.demoNotice}>Sample service progress is view-only. Start/Complete buttons become available when the manager assigns real bookings.</p>}
    </div>
  );

  const renderSpareParts = () => {
    const parts = [
      ["Engine Oil", "Lubricants", "25 Litres", "Available"],
      ["Oil Filter", "Engine Parts", "3 Units", "Low Stock"],
      ["Brake Pads", "Brake Parts", "12 Sets", "Available"],
      ["Car Battery", "Electrical", "8 Units", "Available"],
      ["Tyres", "Tyres", "2 Units", "Low Stock"]
    ];

    return (
      <div style={styles.panel}>
        <h2>🛠️ Spare Parts Information</h2>
        <p style={styles.muted}>
          Check the availability of parts required for your jobs.
        </p>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Part Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Availability</th>
              </tr>
            </thead>

            <tbody>
              {parts.map((part, i) => (
                <tr key={i}>
                  {part.map((value, j) => (
                    <td style={styles.td} key={j}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWorkHistory = () => {
    const history = displayJobs.filter(
      (job) => job.status === "Completed"
    );

    return (
      <div style={styles.panel}>
        <h2>📜 Completed Work History</h2>

        {history.length === 0 ? (
          <p>No completed services yet.</p>
        ) : (
          history.map((job) => (
            <div style={styles.jobCard} key={job.id}>
              <h3>✅ {job.vehicle}</h3>
              <p>Customer: {job.customer}</p>
              <p>Service: {job.service}</p>
              <p>Registration: {job.registration}</p>
              {appointmentDetails(job)}
              <p>Work Note: {job.workNote || "Service completed."}</p>
            </div>
          ))
        )}
        {showingDemoData && <p style={styles.demoNotice}>This completed service is a sample work-history entry for the demo.</p>}
      </div>
    );
  };

  const renderNotifications = () => (
    <div style={styles.panel}>
      <h2>🔔 Notifications</h2>
      {notification.map((item, index) => (
        <div style={styles.jobItem} key={index}>
          <span>🔔 {item}</span>
        </div>
      ))}

      <p style={styles.muted}>
        Assigned customer bookings: {jobs.length}
      </p>
    </div>
  );

  const renderProfile = () => (
    <div style={styles.panel}>
      <h2>👤 My Mechanic Profile</h2>
      <div style={styles.profile}>
        <h1>👨‍🔧</h1>
        <h2>{mechanicName}</h2>
        <p>{user.email || "mechanic@example.com"}</p>
        <p>Role: {user.role || "Mechanic"}</p>
        <p>Assigned Jobs: {jobs.length}</p>
        <p>Completed Jobs: {completed}</p>
        <p>Specialization: General Maintenance & Vehicle Repair</p>
        <p>Service Center: AutoCare - Guntur</p>
        <p>Shift: 09:00 AM - 06:00 PM</p>
        <p>Availability: Active</p>
        <p style={styles.demoNotice}>Demo profile information. Update your account details through the admin panel when connected.</p>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();
      case "My Jobs":
        return renderJobs();
      case "Customer Details":
        return renderCustomerDetails();
      case "Vehicle Details":
        return renderVehicleDetails();
      case "Service Updates":
        return renderServiceUpdates();
      case "Spare Parts":
        return renderSpareParts();
      case "Work History":
        return renderWorkHistory();
      case "Notifications":
        return renderNotifications();
      case "My Profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <h2>🚘 AutoCare</h2>
          <p>Mechanic Panel</p>
        </div>

        <div style={styles.menu}>
          {menuItems.map(([icon, name]) => (
            <button
              key={name}
              onClick={() => {
                loadJobs();
                setActivePage(name);
              }}
              style={{
                ...styles.menuButton,
                ...(activePage === name ? styles.menuActive : {})
              }}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </div>

        <div style={styles.garageStatus}>
          <strong>🔧 Work Status</strong>
          <p>Assigned: {pending}</p>
          <p>In Progress: {inProgress}</p>
          <p>Completed: {completed}</p>
        </div>

        <button style={styles.logout} onClick={logout}>
          ↪ Logout
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1>{activePage}</h1>
            <p>Welcome, {mechanicName}!</p>
          </div>

          <div style={styles.badge}>👨‍🔧 Mechanic</div>
        </header>

        {renderPage()}
      </main>

      {selectedJob && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>
              {selectedJob.status === "In Progress"
                ? "Complete Service"
                : "Job Details"}
            </h2>

            <p>Booking ID: {selectedJob.id}</p>
            <p>Vehicle: {selectedJob.vehicle}</p>
            <p>Customer: {selectedJob.customer}</p>
            <p>Phone: {selectedJob.phone}</p>
            <p>Service: {selectedJob.service}</p>
            <p>Problem: {selectedJob.problem}</p>

            {appointmentDetails(selectedJob)}

            {selectedJob.status === "In Progress" && (
              <>
                <label style={styles.label}>
                  Work Completion Notes
                </label>

                <textarea
                  style={styles.textarea}
                  rows={4}
                  placeholder="Enter completed work details..."
                  value={workNote}
                  onChange={(e) => setWorkNote(e.target.value)}
                />

                <button
                  style={styles.completeButton}
                  onClick={() =>
                    updateStatus(selectedJob.id, "Completed")
                  }
                >
                  Confirm Completed
                </button>
              </>
            )}

            <button
              style={styles.cancelButton}
              onClick={() => {
                setSelectedJob(null);
                setWorkNote("");
              }}
            >
              Close
            </button>
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
    gap: "6px",
    marginTop: "20px",
    flex: 1
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px",
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
  badge: {
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
  panel: {
    background: "#132c46",
    border: "1px solid #294966",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "20px"
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px"
  },
  jobItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    padding: "14px 0",
    borderBottom: "1px solid #294966"
  },
  jobCard: {
    background: "#0d2239",
    border: "1px solid #294966",
    borderRadius: "10px",
    padding: "18px",
    marginTop: "15px",
    lineHeight: 1.6
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px"
  },
  customerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "15px"
  },
  status: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    marginLeft: "8px"
  },
  muted: {
    color: "#b9cce0",
    fontSize: "14px"
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
  completeButton: {
    padding: "11px 15px",
    background: "#159b68",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    margin: "12px 8px 0 0"
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    marginTop: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "500px"
  },
  th: {
    padding: "13px",
    background: "#087ef0",
    textAlign: "left"
  },
  td: {
    padding: "13px",
    borderBottom: "1px solid #294966"
  },
  profile: {
    textAlign: "center",
    padding: "25px"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
    overflowY: "auto"
  },
  modal: {
    background: "#132c46",
    border: "1px solid #42617e",
    borderRadius: "14px",
    padding: "25px",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box"
  },
  label: {
    display: "block",
    margin: "15px 0 8px",
    fontWeight: "bold"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontFamily: "Arial"
  },
  cancelButton: {
    padding: "11px 15px",
    background: "#526477",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    marginTop: "12px"
  },
  appointmentBox: {
    background: "#173a58",
    border: "1px solid #42617e",
    borderRadius: "9px",
    padding: "14px",
    margin: "15px 0"
  },
  appointmentRow: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    padding: "8px 0",
    borderBottom: "1px solid #42617e"
  },
  vehicleImage: {
    width: "100%",
    maxWidth: "280px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "9px",
    margin: "10px 0"
  },
  demoNotice: {
    marginTop: "14px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#263b52",
    color: "#ffd58a",
    fontSize: "12px"
  },
  empty: {
    background: "#0d2239",
    border: "1px dashed #42617e",
    borderRadius: "10px",
    padding: "25px",
    textAlign: "center",
    marginTop: "15px",
    lineHeight: 1.7
  },
  success: {
    color: "#4ade80",
    fontWeight: "bold"
  }
};

export default MechanicDashboard;
