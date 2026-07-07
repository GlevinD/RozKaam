// src/pages/Auth/HouseholdSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function HouseholdSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    pincode: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "household",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setMessage("✅ Signup successful! Redirecting...");

        if (data.token) {
          localStorage.setItem("token", data.token);
          setTimeout(() => navigate("/household/dashboard"), 1500);
        } else {
          setTimeout(() => navigate("/login/household"), 1500);
        }
      } else {
        setMessage("❌ " + (data.error || "Signup failed"));
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error. Try again later.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-[Poppins] overflow-hidden px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-white/10"
      >
        <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-400 drop-shadow-md">
          🏡 Household Signup
        </h1>

        <p className="text-center text-gray-300 mb-6 text-sm">
          Create your account to book trusted, verified home service workers.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          required
          className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold py-3 rounded-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-indigo-500/30"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300 animate-pulse">
            {message}
          </p>
        )}

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login/household"
            className="text-indigo-400 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
