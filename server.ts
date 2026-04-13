import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";

dotenv.config();

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if using another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Setup ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is extremely missing from .env. Server will crash.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Cluster");
    await seedDatabase();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// --- Schemas (for MongoDB) ---
const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  status: { type: String, default: 'Published' },
  date: { type: Date, default: Date.now },
});

const AdmissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const WeightCategorySchema = new mongoose.Schema({
  age_group: String,
  gender: String,
  min_weight: Number,
  max_weight: Number,
  name: String
});

const PlayerSchema = new mongoose.Schema({
  name: String,
  father_name: String,
  gender: String,
  dob: String,
  address: String,
  weight: Number,
  age: Number,
  age_group: String,
  weight_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WeightCategory' },
  
  // Extended fields for Portal Admin Full Registration
  email: String,
  mobile: String,
  blood_group: String,
  aadhar_no: String,
  height_cm: Number,
  father_occupation: String,
  marital_status: String,
  qualification: String,
  school_college: String,
  permanent_address: String,
  local_address: String,
  coach_name: String,
  training_center: String,
  training_center_address: String,
  
  // Document URLs
  aadhar_url: String,
  photo_url: String,
  signature_url: String,
  
  status: { type: String, default: 'Pending Verification' },
  
  // Belt Grading
  current_belt: { type: String, default: 'White' },
  belt_history: [{
    belt_color: String,
    promotion_date: { type: Date, default: Date.now }
  }],
  
  date_registered: { type: Date, default: Date.now }
});

const MatchSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'WeightCategory' },
  round_number: Number,
  match_number: Number,
  player1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  player2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  winner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  next_match_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', default: null }
});

const BeltPromotionSchema = new mongoose.Schema({
  name: String,
  currentBelt: String,
  requestedBelt: String,
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});

const CoachSchema = new mongoose.Schema({
  name: String,
  academyName: String,
  address: String,
  contactNumber: String,
  email: String,
  qualifications: String,
  experience: String,
  certificationId: String,
  image_url: String, // Extended field for picture
  password: { type: String }, // Explicitly remove default to force generation
  status: { type: String, default: 'Active' },
  date: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  type: String,
  status: { type: String, default: 'Draft' }, // Draft, Published, Completed
  created_at: { type: Date, default: Date.now }
});

const MediaSchema = new mongoose.Schema({
  title: String,
  url: String,
  category: String, // Images, Videos
  date: { type: Date, default: Date.now }
});

const DocumentSchema = new mongoose.Schema({
  title: String,
  category: String, // Forms, Syllabus, Guidelines
  url: String,
  description: String,
  date: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  audience: String, // All Players, Coaches, Organizers
  status: { type: String, default: 'Sent' },
  date: { type: Date, default: Date.now }
});

const CoachStudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  weight_category: String,
  current_belt: { type: String, default: 'White' },
  belt_history: [{
    belt_color: String,
    promotion_date: { type: Date, default: Date.now }
  }],
  coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  date: { type: Date, default: Date.now }
});

const EventEnrollmentSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  coach_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  enrolled_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoachStudent' }],
  status: { type: String, default: 'Registered' },
  date: { type: Date, default: Date.now }
});

const News = mongoose.model("News", NewsSchema);
const Admission = mongoose.model("Admission", AdmissionSchema);
const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
const WeightCategory = mongoose.model("WeightCategory", WeightCategorySchema);
const Player = mongoose.model("Player", PlayerSchema);
const Match = mongoose.model("Match", MatchSchema);
const BeltPromotion = mongoose.model("BeltPromotion", BeltPromotionSchema);
const Coach = mongoose.model("Coach", CoachSchema);
const Event = mongoose.model("Event", EventSchema);
const Media = mongoose.model("Media", MediaSchema);
const DocumentModel = mongoose.model("Document", DocumentSchema);
const NotificationModel = mongoose.model("Notification", NotificationSchema);
const CoachStudent = mongoose.model("CoachStudent", CoachStudentSchema);
const EventEnrollment = mongoose.model("EventEnrollment", EventEnrollmentSchema);

const VerifiedEntitySchema = new mongoose.Schema({
  name: String,
  category: String, // 'Referee', 'BlackBelt', 'NationalPlayer'
  details: String,
  mobile: String,
  email: String,
  dob: String,
  weight_category: String,
  player_category: String, // 'Sub-Junior', 'Cadet', 'Junior', 'Senior'
  championships: [{ name: String, year: String, medal: String }],
  dan_level: String,    // e.g. 'BLACK BELT 4th DAN'
  dan_poom_no: String,  // e.g. '05379384'
  image_url: String,
  status: { type: String, default: 'Active' },
  date: { type: Date, default: Date.now }
});

const ContentDetailSchema = new mongoose.Schema({
  section_name: { type: String, unique: true },
  content: String,
  last_updated: { type: Date, default: Date.now }
});

const TrainingCenterSchema = new mongoose.Schema({
  centerName: String,
  address: String,
  coachName: String,
  contact: String,
  email: String,
  logo_url: String,
  date: { type: Date, default: Date.now }
});

const VerifiedEntity = mongoose.model("VerifiedEntity", VerifiedEntitySchema);
const ContentDetail = mongoose.model("ContentDetail", ContentDetailSchema);
const TrainingCenter = mongoose.model("TrainingCenter", TrainingCenterSchema);

async function seedDatabase() {
  try {
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      await AdminUser.create({ username: 'admin', password: 'admin123' });
      console.log("✅ Seeded default Admin User");
    }

    const categoryCount = await WeightCategory.countDocuments();
    if (categoryCount === 0) {
      const seedCategories = [
        ...[18, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 50].map(w => ({ age_group: 'Cadet (Sub-Junior)', gender: 'Male', min_weight: w === 18 ? 0 : w - 3, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Cadet (Sub-Junior)', gender: 'Male', min_weight: 50.01, max_weight: 999, name: 'Over 50kg' },
        ...[18, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 50].map(w => ({ age_group: 'Cadet (Sub-Junior)', gender: 'Female', min_weight: w === 18 ? 0 : w - 3, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Cadet (Sub-Junior)', gender: 'Female', min_weight: 50.01, max_weight: 999, name: 'Over 50kg' },

        ...[33, 37, 41, 45, 49, 53, 57, 61, 65].map(w => ({ age_group: 'Cadet', gender: 'Male', min_weight: w === 33 ? 0 : w - 4, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Cadet', gender: 'Male', min_weight: 65.01, max_weight: 999, name: 'Over 65kg' },
        ...[29, 33, 37, 41, 44, 47, 51, 55, 59].map(w => ({ age_group: 'Cadet', gender: 'Female', min_weight: w === 29 ? 0 : w - 4, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Cadet', gender: 'Female', min_weight: 59.01, max_weight: 999, name: 'Over 59kg' },

        ...[45, 48, 51, 55, 59, 63, 68, 73, 78].map(w => ({ age_group: 'Junior', gender: 'Male', min_weight: w === 45 ? 0 : w - 3, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Junior', gender: 'Male', min_weight: 78.01, max_weight: 999, name: 'Over 78kg' },
        ...[42, 44, 46, 49, 52, 55, 59, 63, 68].map(w => ({ age_group: 'Junior', gender: 'Female', min_weight: w === 42 ? 0 : w - 2, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Junior', gender: 'Female', min_weight: 68.01, max_weight: 999, name: 'Over 68kg' },

        ...[54, 58, 63, 68, 74, 80, 87].map(w => ({ age_group: 'Senior', gender: 'Male', min_weight: w === 54 ? 0 : w - 4, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Senior', gender: 'Male', min_weight: 87.01, max_weight: 999, name: 'Over 87kg' },
        ...[46, 49, 53, 57, 62, 67, 73].map(w => ({ age_group: 'Senior', gender: 'Female', min_weight: w === 46 ? 0 : w - 3, max_weight: w, name: `Under ${w}kg` })),
        { age_group: 'Senior', gender: 'Female', min_weight: 73.01, max_weight: 999, name: 'Over 73kg' }
      ];
      await WeightCategory.insertMany(seedCategories);
      console.log("✅ Seeded Official WT Weight Categories");
    }

    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.create([
        {
          title: "New Batch for Kids Starting Soon",
          content: "Enroll now for beginner-level taekwondo training.",
          category: "Admission",
          status: "Published",
          date: new Date("2026-03-10")
        },
        {
          title: "MDTA Students Win Gold at State Level",
          content: "Our students secured top positions in state championship.",
          category: "Achievement",
          status: "Published",
          date: new Date("2026-02-28")
        },
        {
          title: "District Taekwondo Championship 2026",
          content: "MDTA to host district-level competition for all categories.",
          category: "Event",
          status: "Published",
          date: new Date("2026-03-15")
        }
      ]);
      console.log("✅ Seeded Initial News Updates");
    }
  } catch (err) {
    console.error("Seeding Error:", err);
  }
}

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- API Routes ---
app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.post("/api/news", async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ error: "Failed to create news" });
  }
});

app.patch("/api/news/:id", async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ error: "Failed to update news" });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete news" });
  }
});

app.post("/api/admission", async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.json({ success: true, message: "Admission request submitted" });
  } catch (err) {
    console.error("Admission error:", err);
    res.status(500).json({ error: "Failed to submit admission request" });
  }
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "taekwondo", // Optional folder in Cloudinary
    });

    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// --- Payment API Routes ---
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    const order_id = `ORDER_MDTA_${Date.now()}`;
    
    const cashfreeAppId = process.env.CASHFREE_APP_ID;
    const cashfreeSecret = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';
    
    if (!cashfreeAppId || !cashfreeSecret) {
      return res.status(500).json({ error: "Payment gateway is not configured on the server." });
    }

    const baseUrl = env === 'PRODUCTION' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
    
    const payload = {
      order_amount: 500.00,
      order_currency: "INR",
      order_id: order_id,
      customer_details: {
        customer_id: `CUST_${mobile || Date.now()}`,
        customer_phone: mobile || "9999999999",
        customer_name: name || "Unknown",
        customer_email: email || "no-reply@mdta.in"
      },
      order_meta: {
        // Adding a return URL just to satisfy some PG requirements that may look for it,
        // but dropin will handle the callback via postMessage to the JS SDK.
        return_url: "https://mdta.in/?order_id={order_id}"
      }
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "x-client-id": cashfreeAppId,
        "x-client-secret": cashfreeSecret,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Cashfree Order Error:", data);
      return res.status(400).json({ error: data.message || "Failed to create payment order." });
    }

    res.json({ success: true, payment_session_id: data.payment_session_id, order_id: data.order_id });
  } catch (err: any) {
    console.error("Payment Order Error:", err);
    res.status(500).json({ error: "Internal server error during payment initialization" });
  }
});

app.post("/api/payment/verify", async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: "Order ID is required" });

    const cashfreeAppId = process.env.CASHFREE_APP_ID;
    const cashfreeSecret = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';
    const baseUrl = env === 'PRODUCTION' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    const response = await fetch(`${baseUrl}/orders/${order_id}`, {
      method: "GET",
      headers: {
        "x-client-id": cashfreeAppId as string,
        "x-client-secret": cashfreeSecret as string,
        "x-api-version": "2023-08-01",
        "Accept": "application/json"
      }
    });
    
    const data = await response.json();
    
    if (data.order_status === 'PAID') {
      res.json({ success: true, status: 'PAID' });
    } else {
      res.status(400).json({ error: "Payment not completed or failed.", status: data.order_status });
    }
  } catch (err: any) {
    console.error("Payment Verify Error:", err);
    res.status(500).json({ error: "Internal server error during payment verification" });
  }
});

// --- Coach API Routes ---

// Coach Login
app.post("/api/coach/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const coach = await Coach.findOne({ email, password });
    if (!coach) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ token: coach._id, name: coach.name, academyName: coach.academyName });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get Coach Students (Official Players)
app.get("/api/coach/students", async (req, res) => {
  const { coachId } = req.query;
  try {
    const coach = await Coach.findById(coachId);
    if (!coach) return res.status(404).json({ error: "Coach not found" });
    
    // Safety check - if academy name is empty, don't just return everything
    if (!coach.academyName) {
       return res.json([]);
    }

    const students = await Player.find({ 
       training_center: coach.academyName 
    }).sort({ date_registered: -1 });

    res.json(students);
  } catch (err) {
    console.error("Coach Students Edge Error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Promote Belt (Official Players)
app.put("/api/coach/students/:id/belt", async (req, res) => {
  const { nextBelt } = req.body;
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Student not found" });
    
    player.current_belt = nextBelt;
    player.belt_history.push({ belt_color: nextBelt, promotion_date: new Date() });
    
    await player.save();
    res.json({ success: true, student: player });
  } catch (err) {
    res.status(500).json({ error: "Failed to promote belt" });
  }
});

// Get Published Events for Coach Registration
app.get("/api/coach/events", async (req, res) => {
  try {
    // Only show published events that are not Completed
    const events = await Event.find({ status: 'Published' }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Enroll Students in Event
app.post("/api/coach/events/enroll", async (req, res) => {
  const { event_id, coach_id, enrolled_students } = req.body;
  try {
    const enrollment = new EventEnrollment({ event_id, coach_id, enrolled_students });
    await enrollment.save();
    res.json({ success: true, enrollment });
  } catch (err) {
    res.status(500).json({ error: "Failed to enroll students" });
  }
});

// --- Admin API Routes ---

// 1. Admin Login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  
  try {
    const user = await AdminUser.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Simplistic token for local demo
    res.json({ token: "admin_mock_token_123", username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Admin: Coaches CRUD ---
const sendCoachApprovalEmail = async (email: string, name: string, password: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Nodemailer credentials missing. Skipping email dispatch.");
    return;
  }
  
  const loginUrl = "https://mdta.in/coach/login"; // Adjust for production

  const mailOptions = {
    from: `"MDTA Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Congratulations! You are an Approved MDTA Coach",
    html: `
      <div style="font-family: Arial, sans-serif; max-w-md: 600px; margin: 0 auto; background: #050505; color: #fff; padding: 30px; border-radius: 15px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff0000; letter-spacing: 2px; text-transform: uppercase; margin: 0;">MDTA</h1>
          <p style="color: #888; font-size: 12px; letter-spacing: 3px; uppercase;">Coach Academy Portal</p>
        </div>
        <h2 style="font-size: 20px;">Congratulations, Master ${name}!</h2>
        <p style="color: #ccc; line-height: 1.6;">You have been officially approved and registered as an affiliated coach. You can now manage your students, track belt gradings, and register your team for upcoming tournaments.</p>
        
        <div style="background: #111; border: 1px solid #ff000030; padding: 20px; border-radius: 10px; margin: 30px 0;">
          <p style="margin: 0 0 10px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Login Credentials</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> <span style="background: #ff000020; color: #ff4d4d; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${password}</span></p>
        </div>
        
        <a href="${loginUrl}" style="display: block; width: 100%; text-align: center; background: #cc0000; color: white; text-decoration: none; padding: 15px 0; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Proceed to Login</a>
        
        <p style="text-align: center; color: #555; font-size: 12px; margin-top: 30px;">Do not share these credentials. If you have questions, please contact the admin team.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Approval email sent to", email);
  } catch (err) {
    console.error("Email send failed:", err);
  }
};

app.get("/api/coaches", async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ date: -1 });
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coaches" });
  }
});

app.post("/api/coaches", async (req, res) => {
  try {
    const rawPass = Math.random().toString(36).slice(-8); // 8 char random password
    const payload = { ...req.body, password: rawPass };
    const coach = new Coach(payload);
    await coach.save();

    // Send email asynchronously
    if (coach.email) {
      sendCoachApprovalEmail(coach.email, coach.name as string, rawPass);
    }

    res.json({ success: true, coach });
  } catch (err) {
    res.status(500).json({ error: "Failed to add coach" });
  }
});

app.put("/api/coaches/:id", async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, coach });
  } catch (err) {
    res.status(500).json({ error: "Failed to update coach" });
  }
});

app.delete("/api/coaches/:id", async (req, res) => {
  try {
    await Coach.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete coach" });
  }
});

// 2. Weight Categories CRUD
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await WeightCategory.find().sort({ age_group: 1, gender: 1, min_weight: 1 });
    // Map _id to id for frontend compatibility
    const mappedCategories = categories.map(c => ({
       id: c._id, age_group: c.age_group, gender: c.gender, min_weight: c.min_weight, max_weight: c.max_weight, name: c.name
    }));
    res.json(mappedCategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/api/categories", async (req, res) => {
  const { age_group, gender, min_weight, max_weight, name } = req.body;
  try {
    const category = new WeightCategory({ age_group, gender, min_weight, max_weight, name });
    await category.save();
    res.json({ id: category._id, success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const playersCount = await Player.countDocuments({ weight_category_id: id });
    if (playersCount > 0) {
      return res.status(400).json({ error: "Cannot delete category in use by players" });
    }
    await Match.deleteMany({ category_id: id });
    await WeightCategory.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Category Delete Error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// 3. Players API
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find().populate('weight_category_id').sort({ date_registered: -1 }).lean();
    
    // Transform specifically to flatten 'category_name' for frontend
    const mappedPlayers = players.map(p => ({
       ...p,
       id: p._id,
       category_name: p.weight_category_id ? (p.weight_category_id as any).name : 'Unknown'
    }));
    res.json(mappedPlayers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

app.post("/api/players", async (req, res) => {
  const { 
    name, father_name, gender, dob, address, weight,
    email, mobile, blood_group, aadhar_no, height_cm, father_occupation, 
    marital_status, qualification, school_college, permanent_address, local_address,
    coach_name, training_center, training_center_address,
    aadhar_url, photo_url, signature_url, status
  } = req.body;
  
  if (!name || !gender || !dob || weight === undefined) {
    return res.status(400).json({ error: "Name, gender, dob, and weight are required" });
  }

  try {
    // 1. Calculate exact age
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 2. Determine Age Group
    let age_group = "Unknown";
    if (age >= 5 && age <= 11) age_group = "Cadet (Sub-Junior)";
    else if (age >= 12 && age <= 14) age_group = "Cadet";
    else if (age >= 15 && age <= 17) age_group = "Junior";
    else if (age >= 18) age_group = "Senior";
    else {
        return res.status(400).json({ error: "Age must be 5 or above to participate" });
    }

    // 3. Auto-determine Weight Category
    const categories = await WeightCategory.find({ age_group, gender });
    let matchedCategoryId = null;
    
    for (const cat of categories) {
      if (cat.min_weight === undefined || cat.max_weight === undefined) continue;
      if (cat.min_weight === 0) {
        if (weight >= cat.min_weight && weight <= cat.max_weight) {
          matchedCategoryId = cat._id;
          break;
        }
      } else {
        if (weight > cat.min_weight && weight <= cat.max_weight) {
          matchedCategoryId = cat._id;
          break;
        }
      }
    }

    if (!matchedCategoryId) {
      return res.status(400).json({ error: `Please create a valid weight division in Categories for ${age_group} ${gender} at ${weight}kg` });
    }

    // 4. Insert player
    const player = new Player({ 
      name, father_name, gender, dob, address, weight, age, age_group, weight_category_id: matchedCategoryId,
      email, mobile, blood_group, aadhar_no, height_cm, father_occupation, 
      marital_status, qualification, school_college, permanent_address, local_address,
      coach_name, training_center, training_center_address,
      aadhar_url, photo_url, signature_url,
      status: status || 'Pending Verification'
    });
    await player.save();

    const insertedPlayer = await Player.findById(player._id).populate('weight_category_id').lean();
    
    res.json({ success: true, player: {
      ...insertedPlayer,
      id: insertedPlayer?._id,
      category_name: insertedPlayer?.weight_category_id ? (insertedPlayer.weight_category_id as any).name : 'Unknown'
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register player" });
  }
});

app.patch("/api/players/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ error: "Player not found" });

    let updatedDob = updates.dob || player.dob;
    let updatedWeight = updates.weight !== undefined ? parseFloat(updates.weight as string) : player.weight;
    let gender = updates.gender || player.gender;

    // 1. Calculate age
    const birthDate = new Date(updatedDob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // 2. Determine Age Group
    let age_group = "Unknown";
    if (age >= 5 && age <= 11) age_group = "Cadet (Sub-Junior)";
    else if (age >= 12 && age <= 14) age_group = "Cadet";
    else if (age >= 15 && age <= 17) age_group = "Junior";
    else if (age >= 18) age_group = "Senior";
    else {
        return res.status(400).json({ error: "Age must be 5 or above to participate" });
    }

    // 3. Auto-determine Weight Category
    const categories = await WeightCategory.find({ age_group, gender });
    let matchedCategoryId = null;
    
    for (const cat of categories) {
      if (cat.min_weight === undefined || cat.max_weight === undefined) continue;
      if (cat.min_weight === 0) {
        if (updatedWeight >= cat.min_weight && updatedWeight <= cat.max_weight) {
          matchedCategoryId = cat._id;
          break;
        }
      } else {
        if (updatedWeight > cat.min_weight && updatedWeight <= cat.max_weight) {
          matchedCategoryId = cat._id;
          break;
        }
      }
    }

    if (!matchedCategoryId) {
      return res.status(400).json({ error: `Please create a valid weight division in Categories for ${age_group} ${gender} at ${updatedWeight}kg` });
    }

    updates.weight = updatedWeight;
    updates.age = age;
    updates.age_group = age_group;
    updates.weight_category_id = matchedCategoryId;

    const updatedPlayer = await Player.findByIdAndUpdate(id, updates, { new: true });
    
    const finalPlayer = await Player.findById(updatedPlayer._id).populate('weight_category_id').lean();
    res.json({ success: true, player: {
      ...finalPlayer,
      id: finalPlayer?._id,
      category_name: finalPlayer?.weight_category_id ? (finalPlayer.weight_category_id as any).name : 'Unknown'
    }});
  } catch (err) {
    console.error("Update Player Error", err);
    res.status(500).json({ error: "Failed to update player" });
  }
});

app.delete("/api/players/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Match.deleteMany({ $or: [{ player1_id: id }, { player2_id: id }, { winner_id: id }] });
    await Player.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error", err);
    res.status(500).json({ error: "Failed to delete player" });
  }
});

app.patch("/api/players/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const player = await Player.findByIdAndUpdate(id, { status }, { new: true });
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json({ success: true, player });
  } catch (err) {
    console.error("Update Status Error", err);
    res.status(500).json({ error: "Failed to update player status" });
  }
});

// 4. Tiesheets / Matches API
app.get("/api/tiesheets/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
      const matches = await Match.find({ category_id: categoryId })
        .populate('player1_id', 'name weight address')
        .populate('player2_id', 'name weight address')
        .sort({ round_number: -1, match_number: 1 })
        .lean();

      const mappedMatches = matches.map(m => ({
        ...m,
        id: m._id,
        player1_name: m.player1_id ? (m.player1_id as any).name : null,
        player1_weight: m.player1_id ? (m.player1_id as any).weight : null,
        player1_address: m.player1_id ? (m.player1_id as any).address : null,
        player2_name: m.player2_id ? (m.player2_id as any).name : null,
        player2_weight: m.player2_id ? (m.player2_id as any).weight : null,
        player2_address: m.player2_id ? (m.player2_id as any).address : null,
      }));
    
    res.json(mappedMatches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tiesheets" });
  }
});

app.post("/api/tiesheets/generate", async (req, res) => {
  try {
    const categoriesWithPlayers = await Player.distinct("weight_category_id");

    await Match.deleteMany({}); // Clear existing matches

    for (const catId of categoriesWithPlayers) {
      // Fetch and shuffle players
      const players = await Player.aggregate([
        { $match: { weight_category_id: catId } },
        { $sample: { size: 1000 } }
      ]);

      let numPlayers = players.length;
      if (numPlayers < 1) continue; 

      // If only 1 player, they automatically "win" their single bracket
      if (numPlayers === 1) {
          const rootMatch = new Match({ category_id: catId, round_number: 1, match_number: 1, player1_id: players[0]._id, player2_id: null, winner_id: players[0]._id });
          await rootMatch.save();
          continue;
      }

      let nextPow2 = 1;
      while (nextPow2 < numPlayers) nextPow2 *= 2;
      
      const numByes = nextPow2 - numPlayers;
      const totalFirstRoundMatches = nextPow2 / 2;
      
      const bracketPositions: (any | null)[] = Array(nextPow2).fill(null);
      let playersIdx = 0;
      for (let i = 0; i < nextPow2; i++) {
          if (i < numByes) {
              bracketPositions[i] = players[playersIdx++]._id;
          } else {
              bracketPositions[i] = playersIdx < numPlayers ? players[playersIdx++]._id : null;
          }
      }
      
      for (let i = bracketPositions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [bracketPositions[i], bracketPositions[j]] = [bracketPositions[j], bracketPositions[i]];
      }
      
      const safePositions: (any | null)[] = [];
      let pIdx = 0;
      for(let i = 0; i < totalFirstRoundMatches; i++) {
         safePositions[i*2] = players[pIdx++]._id;
         safePositions[i*2+1] = null; 
      }
      for(let i = 0; i < totalFirstRoundMatches; i++) {
         if(pIdx < numPlayers) safePositions[i*2+1] = players[pIdx++]._id;
      }
      
      let roundNumber = Math.log2(nextPow2); 
      let matchCounter = 1;
      
      let matchNodes: any[] = [];
      
      const rootMatch = new Match({ category_id: catId, round_number: 1, match_number: matchCounter++ });
      await rootMatch.save();
      matchNodes.push({ id: rootMatch._id, round: 1, isLeaf: roundNumber === 1, parentId: null, isPlayer1: true });
      
      let previousRoundNodes = [matchNodes[0]];
      
      for (let r = 2; r <= roundNumber; r++) {
         let currentRoundNodes = [];
         for (let parentNode of previousRoundNodes) {
             const child1 = new Match({ category_id: catId, round_number: r, match_number: matchCounter++, next_match_id: parentNode.id });
             const child2 = new Match({ category_id: catId, round_number: r, match_number: matchCounter++, next_match_id: parentNode.id });
             await Promise.all([child1.save(), child2.save()]);

             currentRoundNodes.push({ id: child1._id, round: r, isLeaf: r === roundNumber, parentId: parentNode.id, isPlayer1: true });
             currentRoundNodes.push({ id: child2._id, round: r, isLeaf: r === roundNumber, parentId: parentNode.id, isPlayer1: false });
         }
         previousRoundNodes = currentRoundNodes;
      }
      
      let posIdx = 0;
      for (let leafNode of previousRoundNodes) {
         const p1 = safePositions[posIdx++];
         const p2 = safePositions[posIdx++];
         
         const winner = (p1 && !p2) ? p1 : ((!p1 && p2) ? p2 : null);
         
         await Match.findByIdAndUpdate(leafNode.id, { player1_id: p1, player2_id: p2, winner_id: winner });

         if (winner && leafNode.parentId) {
             const updateField = leafNode.isPlayer1 ? { player1_id: winner } : { player2_id: winner };
             await Match.findByIdAndUpdate(leafNode.parentId, updateField);
         }
      }
    }
    
    res.json({ success: true, message: "Tiesheets generated successfully" });
  } catch (err) {
    console.error("Tiesheet Generation Error:", err);
    res.status(500).json({ error: "Failed to generate tiesheets" });
  }
});

// --- Dynamic Admin APIs generated below ---

// Admin Users (UserRoles)
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await AdminUser.find({}, '-password'); // Don't send passwords
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/admin/users", async (req, res) => {
  try {
    const user = new AdminUser(req.body); // In real app, hash password here using bcrypt!
    await user.save();
    res.json({ success: true, user: { username: user.username, _id: user._id } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Belt Promotions
app.get("/api/belt-promotions", async (req, res) => {
  try { res.json(await BeltPromotion.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/belt-promotions", async (req, res) => {
  try { res.json(await new BeltPromotion(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/belt-promotions/:id", async (req, res) => {
  try { res.json(await BeltPromotion.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/belt-promotions/:id", async (req, res) => {
  try { await BeltPromotion.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Coach Academy
app.get("/api/coaches", async (req, res) => {
  try { res.json(await Coach.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/coaches", async (req, res) => {
  try { res.json(await new Coach(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/coaches/:id", async (req, res) => {
  try { res.json(await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/coaches/:id", async (req, res) => {
  try { await Coach.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Events
app.get("/api/events", async (req, res) => {
  try { res.json(await Event.find().sort({ created_at: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/events", async (req, res) => {
  try { res.json(await new Event(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/events/:id", async (req, res) => {
  try { res.json(await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/events/:id", async (req, res) => {
  try { await Event.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Media Gallery
app.get("/api/media", async (req, res) => {
  try { res.json(await Media.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/media", async (req, res) => {
  try { res.json(await new Media(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/media/:id", async (req, res) => {
  try { await Media.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Document Downloads
app.get("/api/documents", async (req, res) => {
  try { res.json(await DocumentModel.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/documents", async (req, res) => {
  try { res.json(await new DocumentModel(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/documents/:id", async (req, res) => {
  try { await DocumentModel.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Notifications
app.get("/api/notifications", async (req, res) => {
  try { res.json(await NotificationModel.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/notifications", async (req, res) => {
  try { res.json(await new NotificationModel(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/notifications/:id", async (req, res) => {
  try { await NotificationModel.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Training Centers
app.get("/api/training-centers", async (req, res) => {
  try { res.json(await TrainingCenter.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/training-centers", async (req, res) => {
  try { res.json(await new TrainingCenter(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/training-centers/:id", async (req, res) => {
  try { res.json(await TrainingCenter.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/training-centers/:id", async (req, res) => {
  try { await TrainingCenter.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Verify Us & Content
app.get("/api/verified-entities", async (req, res) => {
  try { res.json(await VerifiedEntity.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/verified-entities", async (req, res) => {
  try { res.json(await new VerifiedEntity(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/verified-entities/:id", async (req, res) => {
  try { await VerifiedEntity.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/verified-entities/:id", async (req, res) => {
  try { res.json(await VerifiedEntity.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/content/:section", async (req, res) => {
  try { res.json(await ContentDetail.findOne({ section_name: req.params.section })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/content", async (req, res) => {
  try { 
    const { section_name, content } = req.body;
    const result = await ContentDetail.findOneAndUpdate({ section_name }, { section_name, content, last_updated: Date.now() }, { new: true, upsert: true });
    res.json(result); 
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

  
// --- Vite middleware for development ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
