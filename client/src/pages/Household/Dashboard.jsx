import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL.replace("/api", ""));

// ✅ Razorpay loader utility
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true); // already loaded
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function HouseholdDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    amount: "",
    scheduledFor: "",
    skill: "",
  });
  const [activeTab, setActiveTab] = useState("find");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login/household");
      return;
    }

    fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
          fetchWorkers(token);
          fetchBookings(token);
        } else {
          navigate("/login/household");
        }
      })
      .catch(() => navigate("/login/household"))
      .finally(() => setLoading(false));

    socket.on("bookingUpdated", (update) => {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === update.id
            ? { ...b, status: update.status, amount: update.amount ?? b.amount }
            : b
        )
      );
    });

    socket.on("workerAvailabilityUpdated", (update) => {
      setWorkers((prev) =>
        prev.map((w) =>
          w._id === update.workerId ? { ...w, available: update.available } : w
        )
      );
    });

    return () => {
      socket.off("bookingUpdated");
      socket.off("workerAvailabilityUpdated");
    };
  }, [navigate]);

  async function fetchWorkers(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/workers/search`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setWorkers(data.workers);
    } catch (err) {
      console.error("Error loading workers:", err);
    }
  }

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

  // ✅ handleBook: saves booking then opens Razorpay
  async function handleBook(workerId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login/household");
      return;
    }

    const { amount, skill, scheduledFor } = bookingDetails;

    try {
      // Step 1: Save booking to backend
      const res = await fetch(`${API_BASE_URL}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workerId, skill, amount, scheduledFor }),
      });

      const data = await res.json();

      if (data.ok) {
        setShowBookingModal(false);

        // Step 2: Load Razorpay SDK
        const loaded = await loadRazorpay();
        if (!loaded) {
          alert("⚠️ Razorpay SDK failed to load. Check your internet.");
          return;
        }

        // Step 3: Open Razorpay payment popup
        const options = {
          key: "rzp_test_Reqk4ukCGKKQpY",
          amount: amount * 100, // convert to paise
          currency: "INR",
          name: "RozKaam",
          description: `Payment for ${skill} by ${selectedWorker.name}`,
          handler: function (response) {
            alert(
              `✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`
            );
            fetchBookings(token); // refresh bookings list
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: { color: "#6366f1" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          alert("❌ Payment failed: " + response.error.description);
        });
        rzp.open();
      } else {
        alert("❌ Booking failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Booking failed:", err);
      alert("⚠️ Error while booking");
    }
  }

  // ✅ Pay Now for existing accepted bookings
  async function handlePayNow(booking) {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("⚠️ Razorpay SDK failed to load. Check your internet.");
      return;
    }

    const options = {
      key: "rzp_test_Reqk4ukCGKKQpY",
      amount: booking.amount * 100,
      currency: "INR",
      name: "RozKaam",
      description: `Payment for ${booking.skill} by ${booking.workerId?.name}`,
      handler: function (response) {
        alert(
          `✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`
        );
        const token = localStorage.getItem("token");
        if (token) fetchBookings(token);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: { color: "#6366f1" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert("❌ Payment failed: " + response.error.description);
    });
    rzp.open();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white text-xl">
        Loading dashboard...
      </div>
    );

  const filteredWorkers = workers.filter((w) =>
    w.skills?.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-[Poppins] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md p-6 flex flex-col justify-between shadow-2xl border-r border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-indigo-400 mb-8 text-center">
            🏡 Household Dashboard
          </h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("find")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "find"
                  ? "bg-indigo-600 text-white"
                  : "hover:text-indigo-400"
              }`}
            >
              👷 Find Workers
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeTab === "bookings"
                  ? "bg-indigo-600 text-white"
                  : "hover:text-indigo-400"
              }`}
            >
              📅 My Bookings
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
            Welcome, {user?.name || "Household"} 👋
          </h1>
          {activeTab === "find" && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold">
                Search
              </button>
            </div>
          )}
        </header>

        {/* Conditional Views */}
        {activeTab === "find" ? (
          filteredWorkers.length === 0 ? (
            <p className="text-gray-300">No workers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker._id}
                  className="bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                    {worker.name}
                  </h3>
                  <p className="text-gray-300">{worker.skills?.join(", ")}</p>
                  <p className="text-gray-400 mt-2">₹{worker.charge}/hour</p>
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      worker.available ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {worker.available ? "🟢 Available" : "🔴 Unavailable"}
                  </p>
                  <p
                    className={`mt-2 text-sm ${
                      worker.verified ? "text-green-400" : "text-yellow-400 italic"
                    }`}
                  >
                    {worker.verified ? "✅ Verified" : "⚠️ Not Verified"}
                  </p>
                  <button
                    disabled={!worker.available}
                    onClick={() => {
                      setSelectedWorker(worker);
                      setBookingDetails({
                        amount: worker.charge || "",
                        scheduledFor: "",
                        skill: worker.skills?.[0] || "",
                      });
                      setShowBookingModal(true);
                    }}
                    className={`${
                      worker.available
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-600 cursor-not-allowed"
                    } px-4 py-2 rounded-lg font-semibold mt-4`}
                  >
                    Book Worker
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          // 📅 My Bookings section
          <section className="bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
              📅 My Bookings
            </h2>
            {bookings.length === 0 ? (
              <p className="text-gray-300">No bookings yet.</p>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li
                    key={b._id}
                    className="bg-gray-800/40 p-4 rounded-lg shadow"
                  >
                    <p className="text-lg font-semibold text-indigo-300">
                      {b.workerId?.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      Skill: {b.skill || "N/A"}
                    </p>
                    <p className="text-sm text-gray-300">
                      Status:{" "}
                      <span
                        className={`capitalize font-semibold ${
                          b.status === "accepted"
                            ? "text-green-400"
                            : b.status === "rejected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-300">Amount: ₹{b.amount}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.scheduledFor).toLocaleString()}
                    </p>

                    {/* ✅ Pay Now button — only shown when booking is accepted */}
                    {b.status === "accepted" && (
                      <button
                        onClick={() => handlePayNow(b)}
                        className="mt-3 bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg font-semibold text-sm transition"
                      >
                        💳 Pay Now
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e1b4b] p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
              📅 Book {selectedWorker.name}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBook(selectedWorker._id);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">Skill</label>
                <input
                  type="text"
                  value={bookingDetails.skill}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, skill: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={bookingDetails.amount}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, amount: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingDetails.scheduledFor}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      scheduledFor: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded font-semibold"
                >
                  Confirm & Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}