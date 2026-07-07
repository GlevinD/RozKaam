import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL.replace("/api", "")); // 🔌 connect to backend socket

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ skills: "", charge: "" });

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "bookings" | "earnings"

  // ✅ Completion modal state (replaces prompt())
  const [completingBooking, setCompletingBooking] = useState(null); // booking id
  const [completeAmount, setCompleteAmount] = useState("500");
  const [justCompleted, setJustCompleted] = useState(null); // booking id for tick flash

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login/worker");
      return;
    }

    fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
          setAvailable(data.user.available);
          setEditForm({
            skills: data.user.skills?.join(", ") || "",
            charge: data.user.charge || "",
          });
          fetchBookings(token);
        } else navigate("/login/worker");
      })
      .catch(() => navigate("/login/worker"))
      .finally(() => setLoading(false));

    // ✅ Live booking updates
    socket.on("bookingCreated", (newBooking) => {
      if (newBooking.workerId === user?._id) {
        setBookings((prev) => [newBooking, ...prev]);
      }
    });

    socket.on("bookingUpdated", (update) => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === update.id
            ? { ...b, status: update.status, amount: update.amount ?? b.amount }
            : b
        )
      );
    });

    // ✅ Listen for payment from household side
    socket.on("paymentConfirmed", (update) => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === update.bookingId ? { ...b, status: "paid" } : b
        )
      );
    });

    return () => {
      socket.off("bookingCreated");
      socket.off("bookingUpdated");
      socket.off("paymentConfirmed");
    };
  }, [navigate, user?._id]);

  async function fetchBookings(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setBookings(data.bookings);
    } catch (err) {
      console.error("Error loading bookings:", err);
    }
  }

  async function toggleAvailability() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/worker/toggle-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: !available }),
      });
      const data = await res.json();
      if (data.ok) {
        setAvailable(data.available);
        socket.emit("workerAvailabilityChanged", {
          workerId: user._id,
          available: data.available,
        });
      }
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills: editForm.skills,
          charge: editForm.charge,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
        setEditing(false);
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  }

  async function handleAccept(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        alert("✅ Booking accepted!");
        fetchBookings(token);
      } else alert("❌ " + data.error);
    } catch (err) {
      console.error(err);
      alert("⚠️ Error accepting booking");
    }
  }

  // ✅ Opens the completion modal instead of using prompt()
  function openCompleteModal(id) {
    setCompletingBooking(id);
    setCompleteAmount("500");
  }

  // ✅ Handles the modal's form submit
  async function handleComplete(e) {
    e.preventDefault();
    const id = completingBooking;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentAmount: completeAmount }),
      });
      const data = await res.json();
      if (data.ok) {
        setCompletingBooking(null);
        setJustCompleted(id);
        fetchBookings(token);
        setTimeout(() => setJustCompleted(null), 3000);
      } else {
        alert("❌ Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error completing booking");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  // ✅ Status badge color
  function getStatusStyle(status) {
    switch (status) {
      case "paid": return "text-green-400 font-bold";
      case "accepted": case "hired": return "text-blue-400 font-semibold";
      case "completed": return "text-indigo-400 font-semibold";
      case "rejected": return "text-red-400 font-semibold";
      default: return "text-yellow-400";
    }
  }

  // ✅ Status label with emoji
  function getStatusLabel(status) {
    switch (status) {
      case "paid": return "💰 Paid";
      case "accepted": return "✅ Accepted";
      case "hired": return "🔧 Hired";
      case "completed": return "🏁 Completed";
      case "rejected": return "❌ Rejected";
      case "requested": return "⏳ Requested";
      default: return status;
    }
  }

  // ✅ Earnings summary
  const totalEarnings = bookings
    .filter((b) => b.status === "paid" || b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const pendingCount = bookings.filter(
    (b) => b.status === "requested" || b.status === "accepted" || b.status === "hired"
  ).length;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white text-xl">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen w-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-[Poppins] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl border-r border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-indigo-400 mb-8 text-center">
            🌹 RozKaam
          </h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "dashboard" ? "bg-indigo-600 text-white" : "hover:text-indigo-400"
              }`}
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "bookings" ? "bg-indigo-600 text-white" : "hover:text-indigo-400"
              }`}
            >
              📅 My Bookings
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "earnings" ? "bg-indigo-600 text-white" : "hover:text-indigo-400"
              }`}
            >
              💰 Earnings
            </button>
            <button
              onClick={() => setEditing(true)}
              className="block w-full text-left hover:text-indigo-400 transition px-2 py-1"
            >
              ⚙️ Edit Profile
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 py-2 rounded-lg mt-8 font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto min-h-screen w-full">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-300">
            Welcome back, {user?.name || "Worker"} 👋
          </h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm ${available ? "bg-green-600" : "bg-gray-600"}`}>
              {available ? "Available" : "Unavailable"}
            </span>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-lg font-semibold ${
                available
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-green-500 hover:bg-green-400 text-gray-900"
              }`}
            >
              {available ? "Set Unavailable" : "Go Online"}
            </button>
          </div>
        </header>

        {/* 🏠 Dashboard Tab */}
        {activeTab === "dashboard" && (
          <section className="bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
              👷 Profile Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-200">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Location:</strong> {user.location}</p>
              <p><strong>Pincode:</strong> {user.pincode}</p>
              <p><strong>Skills:</strong> {user.skills?.join(", ")}</p>
              <p><strong>Charge:</strong> ₹{user.charge}/hour</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">₹{totalEarnings}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm mb-1">Active Bookings</p>
                <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
              </div>
            </div>
          </section>
        )}

        {/* 📅 Bookings Tab */}
        {activeTab === "bookings" && (
          <section className="bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
              📅 My Bookings
            </h2>
            {bookings.length === 0 ? (
              <p className="text-gray-300">
                No bookings yet. When households hire you, they'll appear here.
              </p>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li
                    key={b._id}
                    className="bg-gray-800/40 p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold text-indigo-300">{b.skill}</p>
                      <p className="text-sm text-gray-300">
                        👤 Household: {b.householdId?.name}
                      </p>
                      <p className="text-sm text-gray-300">Amount: ₹{b.amount}</p>
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(b.scheduledFor).toLocaleString()}
                      </p>

                      <p className="text-sm">
                        Status:{" "}
                        <span className={getStatusStyle(b.status)}>
                          {getStatusLabel(b.status)}
                        </span>
                      </p>

                      {b.status === "paid" && (
                        <p className="mt-1 text-green-400 text-xs font-semibold">
                          🎉 Payment received from household!
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4 items-end">
                      {b.status === "requested" && (
                        <button
                          onClick={() => handleAccept(b._id)}
                          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg font-semibold text-sm"
                        >
                          Accept
                        </button>
                      )}

                      {/* ✅ Show button only if not just completed and not already completed/paid */}
                      {b.status === "hired" && justCompleted !== b._id && (
                        <button
                          onClick={() => openCompleteModal(b._id)}
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg font-semibold text-sm"
                        >
                          Mark Completed
                        </button>
                      )}

                      {/* ✅ Green tick confirmation - matches font layer/style of status badges */}
                      {(justCompleted === b._id ||
                        b.status === "completed" ||
                        b.status === "paid") && (
                        <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                          ✅ Done
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* 💰 Earnings Tab */}
        {activeTab === "earnings" && (
          <section className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-indigo-300">
              💰 Earnings Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-md">
                <p className="text-gray-400 text-sm mb-1">Total Earned</p>
                <p className="text-3xl font-bold text-green-400">₹{totalEarnings}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-md">
                <p className="text-gray-400 text-sm mb-1">Active Bookings</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
              </div>
              <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-md">
                <p className="text-gray-400 text-sm mb-1">Payments Received</p>
                <p className="text-3xl font-bold text-indigo-400">
                  {bookings.filter((b) => b.status === "paid").length}
                </p>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-lg font-semibold text-indigo-300 mb-4">
                Payment History
              </h3>
              {bookings.filter((b) => b.status === "paid" || b.status === "completed").length === 0 ? (
                <p className="text-gray-400">No payments received yet.</p>
              ) : (
                <ul className="space-y-3">
                  {bookings
                    .filter((b) => b.status === "paid" || b.status === "completed")
                    .map((b) => (
                      <li
                        key={b._id}
                        className="flex justify-between items-center bg-gray-800/40 p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {b.householdId?.name || "Household"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {b.skill} · {new Date(b.scheduledFor).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">₹{b.amount}</p>
                          <p className={`text-xs ${getStatusStyle(b.status)}`}>
                            {getStatusLabel(b.status)}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e1b4b] p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
              ✏️ Edit Profile
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1">Hourly Charge (₹)</label>
                <input
                  type="number"
                  value={editForm.charge}
                  onChange={(e) => setEditForm({ ...editForm, charge: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Complete Booking Modal (replaces prompt()) */}
      {completingBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e1b4b] p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
              🏁 Complete Booking
            </h2>
            <form onSubmit={handleComplete} className="space-y-4">
              <div>
                <label className="block mb-1">Final Payment Amount (₹)</label>
                <input
                  type="number"
                  value={completeAmount}
                  onChange={(e) => setCompleteAmount(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setCompletingBooking(null)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}