const mongoose = require("mongoose");
require("dotenv").config();

// 1. Database Connection Logic
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://haxplore_db:gYIu0UmJKdsmZY08@cluster0.1t4vnav.mongodb.net/";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB for seeding..."))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// 2. Define the Schema (Must match your backend model)
const binSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  acceptedItems: [{ type: String }],
  fillLevel: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["operational", "full", "maintenance"],
    default: "operational",
  },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  points: Number,
  totalRecycled: Number,
  badges: [String],
  co2Saved: Number,
});

// ✅ Detection Schema (for Recent Detects feature)
const detectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: String,
    name: String,
    confidence: Number,
    weight: Number,
    value: Number,
    points: Number,
    co2Saved: Number,
    condition: String,
    image: String,

    confirmed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Bin = mongoose.model("Bin", binSchema);
const User = mongoose.model("User", userSchema);
const Detection = mongoose.model("Detection", detectionSchema);

// 3. The Data
const BINS = [
  /* MAHARASHTRA (MH) */
  {
    id: "mh-1",
    name: "Mumbai E-Tech Hub",
    lat: 19.076,
    lng: 72.8777,
    address: "Andheri East, Mumbai, MH",
    acceptedItems: ["phone", "battery", "charger"],
    fillLevel: 35,
    status: "operational",
  },
  {
    id: "mh-2",
    name: "BKC Green Bin",
    lat: 19.06,
    lng: 72.8697,
    address: "BKC, Mumbai, MH",
    acceptedItems: ["laptop", "hard-drive"],
    fillLevel: 55,
    status: "operational",
  },
  {
    id: "mh-3",
    name: "Navi Mumbai Recycle Point",
    lat: 19.033,
    lng: 73.0297,
    address: "Vashi, Navi Mumbai, MH",
    acceptedItems: ["phone", "tablet"],
    fillLevel: 80,
    status: "full",
  },
  {
    id: "mh-4",
    name: "Pune IT Park Bin",
    lat: 18.5204,
    lng: 73.8567,
    address: "Hinjewadi, Pune, MH",
    acceptedItems: ["battery", "cable", "charger"],
    fillLevel: 20,
    status: "operational",
  },
  {
    id: "mh-5",
    name: "Nagpur Eco Drop",
    lat: 21.1458,
    lng: 79.0882,
    address: "Sitabuldi, Nagpur, MH",
    acceptedItems: ["phone", "watch"],
    fillLevel: 40,
    status: "operational",
  },
  {
    id: "mh-6",
    name: "Nashik Digital Bin",
    lat: 19.9975,
    lng: 73.7898,
    address: "College Road, Nashik, MH",
    acceptedItems: ["laptop", "charger"],
    fillLevel: 60,
    status: "operational",
  },
  {
    id: "mh-7",
    name: "Aurangabad E-Waste Hub",
    lat: 19.8762,
    lng: 75.3433,
    address: "CIDCO, Aurangabad, MH",
    acceptedItems: ["tablet", "battery"],
    fillLevel: 25,
    status: "operational",
  },
  {
    id: "mh-8",
    name: "Thane Smart Bin",
    lat: 19.2183,
    lng: 72.9781,
    address: "Ghodbunder Rd, Thane, MH",
    acceptedItems: ["phone", "headphones"],
    fillLevel: 70,
    status: "operational",
  },
  {
    id: "mh-9",
    name: "Kolhapur E-Recycle",
    lat: 16.705,
    lng: 74.2433,
    address: "Shivaji Nagar, Kolhapur, MH",
    acceptedItems: ["cable", "charger"],
    fillLevel: 15,
    status: "operational",
  },
  {
    id: "mh-10",
    name: "Solapur Green Tech Bin",
    lat: 17.6599,
    lng: 75.9064,
    address: "Station Rd, Solapur, MH",
    acceptedItems: ["battery", "watch"],
    fillLevel: 90,
    status: "full",
  },

  /* KARNATAKA (KA) */
  {
    id: "ka-1",
    name: "Bangalore Central Bin",
    lat: 12.9716,
    lng: 77.5946,
    address: "MG Road, Bengaluru, KA",
    acceptedItems: ["phone", "laptop"],
    fillLevel: 30,
    status: "operational",
  },
  {
    id: "ka-2",
    name: "Electronic City E-Hub",
    lat: 12.8399,
    lng: 77.677,
    address: "Electronic City, KA",
    acceptedItems: ["hard-drive", "cable"],
    fillLevel: 45,
    status: "operational",
  },
  {
    id: "ka-3",
    name: "Whitefield Smart Bin",
    lat: 12.9698,
    lng: 77.75,
    address: "Whitefield, Bengaluru, KA",
    acceptedItems: ["tablet", "charger"],
    fillLevel: 60,
    status: "operational",
  },
  {
    id: "ka-4",
    name: "Mysore Digital Drop",
    lat: 12.2958,
    lng: 76.6394,
    address: "VV Mohalla, Mysuru, KA",
    acceptedItems: ["phone", "battery"],
    fillLevel: 20,
    status: "operational",
  },
  {
    id: "ka-5",
    name: "Hubli Eco Bin",
    lat: 15.3647,
    lng: 75.124,
    address: "Keshwapur, Hubli, KA",
    acceptedItems: ["laptop", "watch"],
    fillLevel: 50,
    status: "operational",
  },
  {
    id: "ka-6",
    name: "Mangalore E-Waste Point",
    lat: 12.9141,
    lng: 74.856,
    address: "Hampankatta, Mangalore, KA",
    acceptedItems: ["phone", "headphones"],
    fillLevel: 65,
    status: "operational",
  },
  {
    id: "ka-7",
    name: "Belgaum Green Tech",
    lat: 15.8497,
    lng: 74.4977,
    address: "Tilakwadi, Belgaum, KA",
    acceptedItems: ["battery", "charger"],
    fillLevel: 10,
    status: "operational",
  },
  {
    id: "ka-8",
    name: "Davangere E-Bin",
    lat: 14.4644,
    lng: 75.9218,
    address: "PJ Extension, Davangere, KA",
    acceptedItems: ["tablet", "cable"],
    fillLevel: 75,
    status: "operational",
  },
  {
    id: "ka-9",
    name: "Udupi Smart Recycle",
    lat: 13.3409,
    lng: 74.7421,
    address: "Manipal Rd, Udupi, KA",
    acceptedItems: ["phone", "watch"],
    fillLevel: 40,
    status: "operational",
  },
  {
    id: "ka-10",
    name: "Tumkur E-Drop",
    lat: 13.3392,
    lng: 77.113,
    address: "BH Road, Tumkur, KA",
    acceptedItems: ["laptop", "battery"],
    fillLevel: 85,
    status: "full",
  },

  /* DELHI (DL) */
  {
    id: "dl-1",
    name: "Connaught Place Green Bin",
    lat: 28.6139,
    lng: 77.209,
    address: "CP, New Delhi, DL",
    acceptedItems: ["phone", "charger"],
    fillLevel: 25,
    status: "operational",
  },
  {
    id: "dl-2",
    name: "Dwarka E-Waste Hub",
    lat: 28.5921,
    lng: 76.046,
    address: "Sector 10, Dwarka, DL",
    acceptedItems: ["laptop", "battery"],
    fillLevel: 55,
    status: "operational",
  },
  {
    id: "dl-3",
    name: "Rohini Smart Bin",
    lat: 29.749,
    lng: 75.0565,
    address: "Sector 3, Rohini, DL",
    acceptedItems: ["tablet", "cable"],
    fillLevel: 40,
    status: "operational",
  },
  {
    id: "dl-4",
    name: "Saket Digital Drop",
    lat: 25.5244,
    lng: 73.2066,
    address: "Saket, New Delhi, DL",
    acceptedItems: ["phone", "watch"],
    fillLevel: 15,
    status: "operational",
  },
  {
    id: "dl-5",
    name: "Karol Bagh E-Bin",
    lat: 28.6512,
    lng: 78.19,
    address: "Karol Bagh, DL",
    acceptedItems: ["battery", "headphones"],
    fillLevel: 70,
    status: "operational",
  },
  {
    id: "dl-6",
    name: "Lajpat Nagar Eco Point",
    lat: 24.5672,
    lng: 74.2436,
    address: "Lajpat Nagar, DL",
    acceptedItems: ["charger", "cable"],
    fillLevel: 60,
    status: "operational",
  },
  {
    id: "dl-7",
    name: "Pitampura Green Tech",
    lat: 28.7033,
    lng: 74.1322,
    address: "Pitampura, DL",
    acceptedItems: ["phone", "tablet"],
    fillLevel: 35,
    status: "operational",
  },
  {
    id: "dl-8",
    name: "Janakpuri E-Recycle",
    lat: 23.6219,
    lng: 77.0878,
    address: "Janakpuri, DL",
    acceptedItems: ["laptop", "hard-drive"],
    fillLevel: 90,
    status: "full",
  },
  {
    id: "dl-9",
    name: "Vasant Kunj Smart Bin",
    lat: 24.5273,
    lng: 77.75,
    address: "Vasant Kunj, DL",
    acceptedItems: ["battery", "watch"],
    fillLevel: 20,
    status: "operational",
  },
  {
    id: "dl-10",
    name: "Mayur Vihar Digital Hub",
    lat: 26.6046,
    lng: 77.2893,
    address: "Mayur Vihar, DL",
    acceptedItems: ["phone", "charger"],
    fillLevel: 45,
    status: "operational",
  },
];

const USERS = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    userType: "admin",
    points: 0,
    totalRecycled: 0,
    badges: ["System Starter"],
    co2Saved: 0,
  },
  {
    name: "Eco Warrior",
    email: "user@example.com",
    password: "password123",
    userType: "user",
    points: 150,
    totalRecycled: 5,
    badges: ["First Drop"],
    co2Saved: 12.5,
  },
];

// 4. Seeding Algorithm
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    await Bin.deleteMany({});
    await User.deleteMany({});
    await Detection.deleteMany({}); // ✅ Clear detections too
    console.log("Existing bins, users, detections cleared.");

    const insertedBins = await Bin.insertMany(BINS);
    const insertedUsers = await User.insertMany(USERS);

    // ✅ Seed some recent detections for Eco Warrior
    const ecoUser = insertedUsers.find((u) => u.email === "user@example.com");

    if (ecoUser) {
      const sampleDetections = [
        {
          userId: ecoUser._id,
          type: "phone",
          name: "Smartphone",
          confidence: 92,
          weight: 0.35,
          value: 12.5,
          points: 140,
          co2Saved: 4.2,
          condition: "Good",
          confirmed: true,
        },
        {
          userId: ecoUser._id,
          type: "battery",
          name: "Battery Pack",
          confidence: 88,
          weight: 0.6,
          value: 5.4,
          points: 70,
          co2Saved: 3.0,
          condition: "Fair",
          confirmed: true,
        },
        {
          userId: ecoUser._id,
          type: "laptop",
          name: "Laptop",
          confidence: 95,
          weight: 1.7,
          value: 30.2,
          points: 350,
          co2Saved: 76.5,
          condition: "Excellent",
          confirmed: true,
        },
      ];

      await Detection.insertMany(sampleDetections);
      console.log("Sample detections seeded successfully!");
    }

    console.log(`${insertedBins.length} bins successfully seeded to the database!`);
    console.log(`${insertedUsers.length} users successfully seeded to the database!`);

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
  }
};

seedDB();