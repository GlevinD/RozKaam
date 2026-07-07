import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./pages/Intro";
import WorkerSignup from "./pages/Auth/WorkerSignup";
import WorkerLogin from "./pages/Auth/WorkerLogin";
import WorkerDashboard from "./pages/Worker/Dashboard";
import HouseholdSignup from "./pages/Household/HouseholdSignup";
import HouseholdLogin from "./pages/Household/HouseholdLogin";
import HouseholdDashboard from "./pages/Household/Dashboard";
import SearchWorkers from "./pages/Household/SearchWorkers";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌹 Landing Page */}
        <Route path="/" element={<Intro />} />

        {/* 👷 Worker Auth Pages */}
        <Route path="/signup/worker" element={<WorkerSignup />} />
        <Route path="/login/worker" element={<WorkerLogin />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />

        {/* 🏠 Household Pages */}
        <Route path="/signup/household" element={<HouseholdSignup />} />
        <Route path="/login/household" element={<HouseholdLogin />} />
        <Route path="/household/dashboard" element={<HouseholdDashboard />} />
        <Route path="/household/search" element={<SearchWorkers />} />

        {/* 🧩 Fallback Route */}
        <Route
          path="*"
          element={
            <h2 style={{ color: "white", textAlign: "center", padding: "50px" }}>
              404 Page Not Found
            </h2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;