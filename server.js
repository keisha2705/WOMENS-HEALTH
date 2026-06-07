const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Bypasses local router DNS blocks securely

require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

// Middleware configuration layers for JSON and PowerShell cURL form parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mongoClient;
let db;

// Database connection logic
async function connectToMongo() {
  try {
    console.log("Connecting to database cluster...");
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    db = mongoClient.db("Users"); // Targets your "Users" database from Compass
    console.log("Connected successfully to MongoDB Atlas!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Global Systems Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", database: db ? "connected" : "disconnected" });
});

// ==========================================
// 🛡️ SECURITY & BASE64 AUTHORIZATION
// ==========================================
const authenticateBase64 = async (req, res, next) => {
  try {
    // 🛠️ ADD THIS LOG LINE AT THE VERY TOP:
    console.log("Incoming request headers from terminal:", req.headers);

    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Access Denied: Missing Basic Auth Header" });
    }

    const headerParts = authHeader.split(" ");
    let base64Token = headerParts[1]; 
    
    if (!base64Token) {
      return res.status(401).json({ error: "Access Denied: Invalid Basic Format" });
    }

    // Clean up spaces
    base64Token = base64Token.trim();
    while (base64Token.length % 4 !== 0) {
      base64Token += "=";
    }

    const decodedCredentials = Buffer.from(base64Token, "base64").toString("ascii");
    let [email, password] = decodedCredentials.split(":");

    if (!email || !password) {
      return res.status(401).json({ error: "Authentication failed: Malformed credentials" });
    }

    email = email.trim().toLowerCase(); 

    // Find user record via case-insensitive regex
    const user = await db.collection("Users").findOne({ 
      email: { $regex: new RegExp("^" + email + "$", "i") } 
    });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed: User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Authentication failed: Wrong password" });
    }

    // Populate data object profile onto request
    req.user = { id: user._id, email: user.email };
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication processing error." });
  }
};




// ==========================================
// 👤 ACCOUNTS & DOCTORS PIPELINE
// ==========================================

// 🔓 PUBLIC: Bypasses authentication layers completely
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db.collection("Users").findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: normalizedEmail,
      passwordHash,
      role: role || "user",
      createdAt: new Date(),
    };
    const result = await db.collection("Users").insertOne(newUser);

    if (role === "doctor") {
      await db.collection("Doctors").insertOne({
        userId: result.insertedId,
        doctorName: name,
        specialization: "Gynecologist",
        bio: "", location: "", availability: [], rating: 0, reviewsCount: 0,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔓 PUBLIC
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await db.collection("Doctors").find().toArray();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔓 PUBLIC
app.get("/api/doctors/:id", async (req, res) => {
  try {
    const doctor = await db.collection("Doctors").findOne({ _id: new ObjectId(req.params.id.trim()) });
    if (!doctor) return res.status(404).json({ error: "Doctor not found." });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 🩸 PMS / PERIOD TRACKER ENDPOINTS
// ==========================================

// 🔒 PROTECTED
app.post("/api/tracker/log", authenticateBase64, async (req, res) => {
  try {
    const { startDate, symptoms, mood } = req.body;
    const newLog = {
      userId: new ObjectId(req.user.id),
      startDate: startDate ? new Date(startDate) : new Date(),
      symptoms: symptoms ? (Array.isArray(symptoms) ? symptoms : [symptoms]) : [],
      mood: mood || "Neutral",
      createdAt: new Date()
    };
    await db.collection("PMS/Period tracker").insertOne(newLog);
    res.status(201).json({ message: "Period health metrics logged successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.get("/api/tracker/logs", authenticateBase64, async (req, res) => {
  try {
    const logs = await db.collection("PMS/Period tracker")
      .find({ userId: new ObjectId(req.user.id) }).sort({ startDate: -1 }).toArray();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.put("/api/tracker/log/:id", authenticateBase64, async (req, res) => {
  try {
    const { id } = req.params;
    const { endDate, symptoms, mood } = req.body;

    await db.collection("PMS/Period tracker").updateOne(
      { 
        _id: new ObjectId(id.trim()), 
        userId: new ObjectId(req.user.id) 
      },
      { 
        $set: { 
          endDate: endDate ? new Date(endDate) : null, 
          symptoms: symptoms ? (Array.isArray(symptoms) ? symptoms : [symptoms]) : [], 
          mood: mood || "Neutral" 
        } 
      }
    );
    res.status(200).json({ message: "Log entry updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.delete("/api/tracker/log/:id", authenticateBase64, async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("PMS/Period tracker").deleteOne({
      _id: new ObjectId(id.trim()),
      userId: new ObjectId(req.user.id)
    });
    res.status(200).json({ message: "Log entry deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 🩺 APPOINTMENT BOOKINGS SYSTEM
// ==========================================

// 🔒 PROTECTED
app.post("/api/bookings/new", authenticateBase64, async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason } = req.body;
    const booking = {
      userId: new ObjectId(req.user.id),
      doctorId: new ObjectId(doctorId.trim()),
      appointmentDate: appointmentDate ? new Date(appointmentDate) : new Date(),
      reason: reason || "General Consultation",
      status: "upcoming",
      createdAt: new Date(),
    };
    await db.collection("bookings").insertOne(booking);
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.get("/api/bookings/my-list", authenticateBase64, async (req, res) => {
  try {
    const bookings = await db.collection("bookings")
      .find({ userId: new ObjectId(req.user.id) }).sort({ appointmentDate: 1 }).toArray();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.delete("/api/bookings/:id", authenticateBase64, async (req, res) => {
  try {
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(req.params.id.trim()), userId: new ObjectId(req.user.id) },
      { $set: { status: "cancelled" } }
    );
    res.status(200).json({ message: "Appointment cancelled." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.get("/api/bookings/dashboard", authenticateBase64, async (req, res) => {
  try {
    const userId = new ObjectId(req.user.id);
    const upcoming = await db.collection("bookings").find({ userId, status: "upcoming" }).toArray();
    const completed = await db.collection("bookings").find({ userId, status: "completed" }).toArray();
    const cancelled = await db.collection("bookings").find({ userId, status: "cancelled" }).toArray();
    res.status(200).json({ upcoming, completed, cancelled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// ⭐ CLINICAL AND DOCTOR EVALUATION REVIEWS
// ==========================================

// 🔒 PROTECTED
app.post("/api/doctors/review", authenticateBase64, async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    const review = {
      userId: new ObjectId(req.user.id),
      doctorId: new ObjectId(doctorId.trim()),
      rating: Number(rating) || 5, comment: comment || "", createdAt: new Date(),
    }; 





    await db.collection("ReviewsDoctors").insertOne(review);
    res.status(201).json({ message: "Doctor review submitted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.get("/api/doctors/:id/reviews", authenticateBase64, async (req, res) => {
  try {
    const reviews = await db.collection("ReviewsDoctors")
      .find({ doctorId: new ObjectId(req.params.id.trim()) })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🛍️ HEALTH CARE PRODUCTS CATALOGUE
// ==========================================

// 🔒 PROTECTED
app.post("/api/products", authenticateBase64, async (req, res) => {
  try {
    const { name, category, description, priceNote, externalLink, image } = req.body;
    const product = { name, category, description, priceNote, externalLink, image, createdAt: new Date() };
    await db.collection("Products").insertOne(product);
    res.status(201).json({ message: "Product added successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔓 PUBLIC
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.collection("Products").find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔓 PUBLIC
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await db.collection("Products").findOne({ _id: new ObjectId(req.params.id.trim()) });
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.delete("/api/wishlist/remove", authenticateBase64, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "Missing productId parameter." });

    const result = await db.collection("wishlist").updateOne(
      { userId: new ObjectId(req.user.id) },
      { $pull: { productIds: new ObjectId(productId.trim()) } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Product was not found in your wishlist." });
    }

    res.status(200).json({ message: "Product successfully removed from your wishlist." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.put("/api/wishlist/notes", authenticateBase64, async (req, res) => {
  try {
    const { productId, userNotes } = req.body;
    if (!productId) return res.status(400).json({ error: "Missing productId parameter." });

    await db.collection("wishlist").updateOne(
      { userId: new ObjectId(req.user.id) },
      { $set: { [`notes.${productId.trim()}`]: userNotes || "" } }
    );

    res.status(200).json({ message: "Wishlist shopping notes updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ⭐ PRODUCT REVIEWS SYSTEM
// ==========================================

// 🔒 PROTECTED
app.post("/api/products/review", authenticateBase64, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = {
      userId: new ObjectId(req.user.id),
      productId: new ObjectId(productId.trim()),
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    await db.collection("ReviewsProducts").insertOne(review);
    res.status(201).json({ message: "Review submitted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.get("/api/products/:id/reviews", authenticateBase64, async (req, res) => {
  try {
    const reviews = await db.collection("ReviewsProducts")
      .find({ productId: new ObjectId(req.params.id.trim()) })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.put("/api/products/review/:id", authenticateBase64, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    await db.collection("ReviewsProducts").updateOne(
      {
        _id: new ObjectId(req.params.id.trim()),
        userId: new ObjectId(req.user.id)
      },
      {
        $set: {
          rating: Number(rating),
          comment,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({ message: "Review updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.delete("/api/products/review/:id", authenticateBase64, async (req, res) => {
  try {
    await db.collection("ReviewsProducts").deleteOne({
      _id: new ObjectId(req.params.id.trim()),
      userId: new ObjectId(req.user.id)
    });

    res.status(200).json({ message: "Review deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.post("/api/wishlist/add", authenticateBase64, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "Missing productId." });

    await db.collection("wishlist").updateOne(
      { userId: new ObjectId(req.user.id) },
      { $addToSet: { productIds: new ObjectId(productId.trim()) } },
      { upsert: true }
    );

    res.status(201).json({ message: "Product successfully bookmarked to your wishlist." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔒 PROTECTED
app.get("/api/wishlist", authenticateBase64, async (req, res) => {
  try {
    const userWishlist = await db.collection("wishlist").findOne({ userId: new ObjectId(req.user.id) });
    if (!userWishlist) return res.status(200).json([]);

    res.status(200).json(userWishlist.productIds || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
  });
});
