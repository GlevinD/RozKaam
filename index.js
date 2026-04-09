// 🌹 RozKaam — Phase 2 Complete Server.js (CommonJS Version)
const path = require("path");
const dotenvPath = path.resolve(__dirname, "../.env");
console.log("🔍 Loading .env from:", dotenvPath);
require("dotenv").config({ path: dotenvPath });
console.log("Loaded Mongo URI:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// Create uploads folder if missing
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// 📦 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 🧩 Schemas
const userBase = {
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: String,
  contact: String,
  location: String,
  pincode: String,
  verified: { type: Boolean, default: false },
  profilePhoto: String,
  policeDoc: String,
};

const WorkerSchema = new mongoose.Schema({
  ...userBase,
  skills: [String],
  charge: Number,
  availability: {
    weekdays: [String],
    from: String,
    to: String,
  },
  available: Boolean,
  verified: { type: Boolean, default: true },
  profilePhoto: String,
  policeDoc: String,
});

const HouseholdSchema = new mongoose.Schema({
  ...userBase,
  address: String,
});

const BookingSchema = new mongoose.Schema(
  {
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    skill: String,
    date: { type: Date, default: Date.now },
    scheduledFor: Date,
    status: { type: String, enum: ["requested", "hired", "completed", "cancelled"], default: "requested" },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TransactionSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  commission: Number,
  workerAmount: Number,
  date: { type: Date, default: Date.now },
});

const Worker = mongoose.model("Worker", WorkerSchema);
const Household = mongoose.model("Household", HouseholdSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);

// 🔐 Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, error: "No token" });
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

// ✨ Signup
app.post(
  "/api/signup",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "policeDoc", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, password, role, contact, location, pincode, skills, charge, address } = req.body;

      if (!email || !password || !role)
        return res.status(400).json({ ok: false, error: "Missing fields" });

      const existing = await (role === "worker" ? Worker : Household).findOne({ email });
      if (existing)
        return res.status(400).json({ ok: false, error: "Email exists" });

      const passwordHash = await bcrypt.hash(password, 10);
      const base = { name, email, passwordHash, role, contact, location, pincode };

      if (req.files?.profilePhoto)
        base.profilePhoto = "/uploads/" + req.files.profilePhoto[0].filename;
      if (req.files?.policeDoc)
        base.policeDoc = "/uploads/" + req.files.policeDoc[0].filename;

      let user;
      if (role === "worker") {
        user = new Worker({
          ...base,
          skills: (skills || "").split(",").map((s) => s.trim()),
          charge,
        });
      } else {
        user = new Household({ ...base, address });
      }

      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        ok: true,
        token,
        user: { id: user._id, name: user.name, role: user.role, email: user.email },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ ok: false, error: "Signup failed" });
    }
  }
);

// ✨ Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === "worker" ? Worker : Household;
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, error: "User not found" });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ ok: false, error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ ok: true, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});

// 📄 Profile
app.get("/api/me", authMiddleware, async (req, res) => {
  const Model = req.user.role === "worker" ? Worker : Household;
  const user = await Model.findById(req.user.id).select("-passwordHash");
  if (!user) return res.status(404).json({ ok: false });
  res.json({ ok: true, user });
});

app.put("/api/me", authMiddleware, upload.none(), async (req, res) => {
  try {
    const Model = req.user.role === "worker" ? Worker : Household;
    const updates = req.body || {};
    if (updates.skills && typeof updates.skills === "string")
      updates.skills = updates.skills.split(",").map((s) => s.trim());
    const u = await Model.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
    res.json({ ok: true, user: u });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Update failed" });
  }
});

// 🔄 Toggle worker availability (with real-time update)
app.post('/api/worker/toggle-availability', authMiddleware, async (req, res) => {
  if (req.user.role !== 'worker')
    return res.status(403).json({ ok: false, error: 'Only workers allowed' });

  const { available } = req.body;

  const updatedWorker = await Worker.findByIdAndUpdate(
    req.user.id,
    { available },
    { new: true }
  );

  // 🔌 Notify all clients (household dashboards)
  io.emit("workerAvailabilityUpdated", {
    workerId: updatedWorker._id.toString(),
    available: updatedWorker.available,
  });

  res.json({ ok: true, available: updatedWorker.available });
});


// 🔍 Search workers
app.get("/api/workers/search", async (req, res) => {
  const { skill, pincode } = req.query;
  const query = {};
  if (skill) query.skills = { $regex: skill, $options: "i" };
  if (pincode) query.pincode = pincode;
  const workers = await Worker.find(query).select("-passwordHash");
  res.json({ ok: true, workers });
});

// 🧾 Bookings
app.post("/api/book", authMiddleware, async (req, res) => {
  if (req.user.role !== "household")
    return res.status(403).json({ error: "Only households can book" });
  const { workerId, skill, scheduledFor, amount } = req.body;
  const worker = await Worker.findById(workerId);
  if (!worker || !worker.verified)
    return res.status(400).json({ error: "Worker not verified" });
  const booking = new Booking({ householdId: req.user.id, workerId, skill, scheduledFor, amount });
  await booking.save();
  io.emit("bookingCreated", booking);
  res.json({ ok: true, booking });
});

// 📦 Get bookings
app.get("/api/bookings", authMiddleware, async (req, res) => {
  try {
    let bookings = [];
    if (req.user.role === "worker") {
      bookings = await Booking.find({ workerId: req.user.id })
        .populate("householdId", "name email location")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "household") {
      bookings = await Booking.find({ householdId: req.user.id })
        .populate("workerId", "name email skills charge location")
        .sort({ createdAt: -1 });
    }
    res.json({ ok: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ Worker accepts booking
app.post("/api/bookings/:id/accept", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ ok: false, error: "Booking not found" });

    if (req.user.role !== "worker" || booking.workerId.toString() !== req.user.id)
      return res.status(403).json({ ok: false, error: "Unauthorized" });

    booking.status = "hired";
    await booking.save();
    io.emit("bookingUpdated", { id: booking._id, status: "hired" });

    const updated = await Booking.findById(booking._id)
      .populate("householdId", "name location")
      .populate("workerId", "name skills charge");

    res.json({ ok: true, booking: updated });
  } catch (err) {
    console.error("Accept booking error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ Mark booking complete
app.post("/api/bookings/:id/complete", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const amount = Number(req.body.paymentAmount) || booking.amount || 0;
    const commission = +(amount * 0.05).toFixed(2);
    const workerAmount = +(amount - commission).toFixed(2);

    // 💰 Save transaction
    const tx = new Transaction({
      bookingId: booking._id,
      amount,
      commission,
      workerAmount,
    });
    await tx.save();

    // 🧾 Update booking with final amount + completed status
    booking.amount = amount;
    booking.status = "completed";
    await booking.save();

    // Worker goes back to available
    await Worker.findByIdAndUpdate(booking.workerId, { available: true });

    // ✅ Broadcast real-time update to both sides
    io.emit("bookingUpdated", {
      id: booking._id,
      status: "completed",
      amount,
    });

    res.json({ ok: true, tx, booking });
  } catch (err) {
    console.error("Complete booking error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});


// 🔒 Admin verify worker
app.post("/api/admin/verify-worker", async (req, res) => {
  const key = req.headers["x-admin-secret"];
  if (key !== process.env.ADMIN_SECRET)
    return res.status(403).json({ error: "Forbidden" });
  const { workerId, approve } = req.body;
  const w = await Worker.findByIdAndUpdate(workerId, { verified: !!approve }, { new: true });
  res.json({ ok: true, worker: w });
});

// ✅ Test API
app.get("/api/test", (req, res) => {
  console.log("✅ Frontend connected successfully!");
  res.json({ message: "Backend connected successfully!" });
});

// 🏁 Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("\n🌹 RozKaam backend is now running!");
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}\n`);
});
