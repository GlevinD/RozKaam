// src/pages/Auth/WorkerSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function WorkerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    location: "",
    pincode: "",
    skills: "",
    charge: "",
    profilePhoto: null,
    policeDoc: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      formData.append("role", "worker");

      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.ok) {
        setMessage("❌ " + (data.error || "Signup failed"));
        setLoading(false);
        return;
      }

      const loginRes = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: "worker",
        }),
      });

      const loginData = await loginRes.json();
      if (loginData.ok) {
        localStorage.setItem("token", loginData.token);
        setMessage("✅ Signup successful! Redirecting...");
        setTimeout(() => navigate("/worker/dashboard"), 1000);
      } else {
        setMessage("✅ Signup complete. Please login manually.");
        setTimeout(() => navigate("/login/worker"), 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-[Poppins] overflow-hidden px-6 py-10">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-md">
            👷 Join <span className="text-yellow-300">RozKaam</span>
          </h1>
          <p className="text-sm text-gray-100 mt-1">
            Register as a verified worker and start earning with trusted clients
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="skills"
            placeholder="Skills (e.g. plumbing, painting)"
            value={form.skills}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="charge"
            type="number"
            placeholder="Hourly Charge (₹)"
            value={form.charge}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
          />

          {/* File Uploads */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              name="profilePhoto"
              onChange={handleFileChange}
              className="w-full bg-gray-800/60 text-gray-200 p-2 rounded-lg border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Police Verification Document
            </label>
            <input
              type="file"
              name="policeDoc"
              onChange={handleFileChange}
              className="w-full bg-gray-800/60 text-gray-200 p-2 rounded-lg border border-gray-600"
              required
            />
          </div>

          {/* Signup Button */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {message && (
              <p className="text-center mt-4 text-sm text-gray-300">
                {message}
              </p>
            )}

            <p className="text-center mt-6 text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login/worker"
                className="text-indigo-400 hover:underline font-medium"
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
