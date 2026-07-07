// src/pages/Auth/HouseholdLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function HouseholdLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "household" }),
      });
      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("token", data.token);
        if (data.household && data.household._id) {
          localStorage.setItem("householdId", data.household._id);
        }

        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/household/dashboard"), 1000);
      } else {
        setMessage("❌ " + (data.error || "Login failed"));
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
        className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400">
          🏡 Household Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}

        <p className="text-center mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup/household"
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}
