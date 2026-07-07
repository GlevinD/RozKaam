import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export default function SearchWorkers() {
  const [jobType, setJobType] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!jobType.trim()) return alert("Please enter a job type");
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.get(`${API_BASE_URL}/workers?jobType=${jobType}`);
      if (res.data.length === 0) {
        setMessage("No workers found for this job type.");
      }
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching workers.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (workerId) => {
    const householdId = localStorage.getItem("householdId");
    if (!householdId) {
      alert("Please login as a household first!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/bookings`, {
        householdId,
        workerId,
        jobType,
      });
      alert("🎉 Booking created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-[Poppins]">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
        🔍 Search for Workers
      </h2>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter job type (e.g. Cooking, Cleaning)"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="p-3 w-80 rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 px-6 py-3 rounded-r-md hover:bg-indigo-500 transition-all disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && <p className="text-center text-gray-400 mb-4">{message}</p>}

      <div className="max-w-3xl mx-auto">
        {workers.map((w) => (
          <div
            key={w._id}
            className="bg-gray-800 rounded-lg p-5 mb-4 flex justify-between items-center shadow-lg"
          >
            <div>
              <h3 className="text-xl font-semibold text-indigo-300">{w.name}</h3>
              <p className="text-gray-400">{w.jobType}</p>
              <p className="text-sm text-gray-500">📍 {w.location || "N/A"}</p>
              <p className="text-sm text-gray-500">📧 {w.email}</p>
            </div>
            <button
              onClick={() => handleBook(w._id)}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white font-semibold transition-all"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
