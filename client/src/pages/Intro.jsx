// src/pages/Intro.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Intro() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#0b1220] via-[#141a34] to-[#1b2350] text-white font-[Poppins] overflow-x-hidden">
      
      {/* Header */}
      <header className="flex justify-between items-center w-full px-10 py-6 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide text-indigo-400 flex items-center gap-2">
          <span>RozKaam</span>
        </h1>
        <nav className="flex gap-4">
          <Link
            to="/login/worker"
            className="px-5 py-2 border border-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
          >
            Worker Login
          </Link>
          <Link
            to="/login/household"
            className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-md"
          >
            Household Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 md:py-24">
        {/* Left side: text */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Your Trusted Partner for <br />
            <span className="text-indigo-400">Local Services</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            RozKaam connects households with verified and reliable workers for
            your daily needs — plumbing, electrical, cleaning, gardening, and
            many more. <br /> Quick, safe, and convenient.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/signup/household"
              className="bg-green-500 hover:bg-green-400 px-8 py-3 rounded-lg font-semibold text-gray-900 transition-all shadow-lg"
            >
              Get Started (Household)
            </Link>
            <Link
              to="/signup/worker"
              className="border border-gray-400 hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              Join as Worker
            </Link>
          </div>
        </motion.div>

        {/* Right side: illustration */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
        >
          <img
            src="/hero-illustration.png"
            alt="RozKaam workers illustration"
            className="w-full max-w-[600px] h-auto rounded-2xl drop-shadow-[0_0_20px_rgba(90,90,255,0.4)] transition-transform duration-500 hover:scale-105"
          />
        </motion.div>
      </main>

      {/* Services Section */}
      <section className="bg-white/10 backdrop-blur-md py-14 mt-10 w-full">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h3 className="text-3xl font-semibold mb-6 text-indigo-300">
            Services We Provide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "🧰 Plumbing",
              "⚡ Electrical",
              "🧹 Cleaning",
              "🌿 Gardening",
              "🪚 Carpentry",
              "🎨 Painting",
              "🤱 Caregiving",
              "💼 And many more...",
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                className="bg-gray-800/50 rounded-xl p-5 shadow-lg border border-white/10 hover:border-indigo-400 transition-all"
              >
                <p className="text-lg font-medium">{service}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-semibold mb-8 text-center text-indigo-300">
          Why Choose RozKaam?
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            "✅ Police-verified workers for your safety",
            "💸 Transparent pricing & secure payments",
            "⚡ Instant booking & real-time availability",
            "📞 24/7 customer support for all users",
          ].map((point, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/40 border border-gray-700 rounded-xl p-6 shadow-md"
            >
              <p className="text-gray-200 text-lg">{point}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-400 text-sm bg-black/30 w-full">
        © {new Date().getFullYear()}{" "}
        <span className="text-indigo-300">RozKaam</span>. All Rights Reserved.
      </footer>
    </div>
  );
}
