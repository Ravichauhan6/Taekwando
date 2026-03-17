import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Database from "better-sqlite3";

dotenv.config();

const app = express();
const PORT = 3000;

// --- Database Setup ---
const MONGODB_URI = process.env.MONGODB_URI;
let isUsingMongoDB = false;
let sqliteDb: any = null;

if (MONGODB_URI && !MONGODB_URI.includes("localhost")) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
      isUsingMongoDB = true;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error. Falling back to SQLite:", err.message);
      setupSQLite();
    });
} else {
  console.warn("⚠️ No valid MONGODB_URI found. Using SQLite as a local fallback.");
  setupSQLite();
}

function setupSQLite() {
  sqliteDb = new Database("mdta.db");
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      category TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      course TEXT,
      message TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Taekwondo Tournament Schema
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS weight_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      age_group TEXT,      -- 'Cadet', 'Junior', 'Senior'
      gender TEXT,         -- 'Male', 'Female'
      min_weight REAL,
      max_weight REAL,
      name TEXT            -- e.g. 'Senior Boys -54kg' or 'Under 54kg'
    );

    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      father_name TEXT,
      gender TEXT,         -- 'Male', 'Female'
      dob TEXT,            -- YYYY-MM-DD
      address TEXT,
      weight REAL,
      age INTEGER,
      age_group TEXT,
      weight_category_id INTEGER,
      date_registered DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (weight_category_id) REFERENCES weight_categories(id)
    );
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      round_number INTEGER,
      match_number INTEGER,
      player1_id INTEGER,
      player2_id INTEGER,
      winner_id INTEGER,
      next_match_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES weight_categories(id),
      FOREIGN KEY (player1_id) REFERENCES players(id),
      FOREIGN KEY (player2_id) REFERENCES players(id)
    );
  `);
  
  // Seed World Taekwondo Official Categories if empty
  const categoryCount = sqliteDb.prepare("SELECT COUNT(*) as count FROM weight_categories").get();
  if (categoryCount.count === 0) {
    const seedCategories = [
      // Sub-Junior Boys
      ...[18, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 50].map(w => ({ age: 'Cadet (Sub-Junior)', g: 'Male', min: w === 18 ? 0 : w - 3, max: w, n: `Under ${w}kg` })),
      { age: 'Cadet (Sub-Junior)', g: 'Male', min: 50.01, max: 999, n: 'Over 50kg' },
      // Sub-Junior Girls
      ...[18, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 50].map(w => ({ age: 'Cadet (Sub-Junior)', g: 'Female', min: w === 18 ? 0 : w - 3, max: w, n: `Under ${w}kg` })),
      { age: 'Cadet (Sub-Junior)', g: 'Female', min: 50.01, max: 999, n: 'Over 50kg' },

      // Cadet Boys (12-14)
      ...[33, 37, 41, 45, 49, 53, 57, 61, 65].map(w => ({ age: 'Cadet', g: 'Male', min: w === 33 ? 0 : w - 4, max: w, n: `Under ${w}kg` })),
      { age: 'Cadet', g: 'Male', min: 65.01, max: 999, n: 'Over 65kg' },
      // Cadet Girls (12-14)
      ...[29, 33, 37, 41, 44, 47, 51, 55, 59].map(w => ({ age: 'Cadet', g: 'Female', min: w === 29 ? 0 : w - 4, max: w, n: `Under ${w}kg` })),
      { age: 'Cadet', g: 'Female', min: 59.01, max: 999, n: 'Over 59kg' },

      // Junior Boys (15-17)
      ...[45, 48, 51, 55, 59, 63, 68, 73, 78].map(w => ({ age: 'Junior', g: 'Male', min: w === 45 ? 0 : w - 3, max: w, n: `Under ${w}kg` })),
      { age: 'Junior', g: 'Male', min: 78.01, max: 999, n: 'Over 78kg' },
      // Junior Girls (15-17)
      ...[42, 44, 46, 49, 52, 55, 59, 63, 68].map(w => ({ age: 'Junior', g: 'Female', min: w === 42 ? 0 : w - 2, max: w, n: `Under ${w}kg` })),
      { age: 'Junior', g: 'Female', min: 68.01, max: 999, n: 'Over 68kg' },

      // Senior Men (18+)
      ...[54, 58, 63, 68, 74, 80, 87].map(w => ({ age: 'Senior', g: 'Male', min: w === 54 ? 0 : w - 4, max: w, n: `Under ${w}kg` })),
      { age: 'Senior', g: 'Male', min: 87.01, max: 999, n: 'Over 87kg' },
      // Senior Women (18+)
      ...[46, 49, 53, 57, 62, 67, 73].map(w => ({ age: 'Senior', g: 'Female', min: w === 46 ? 0 : w - 3, max: w, n: `Under ${w}kg` })),
      { age: 'Senior', g: 'Female', min: 73.01, max: 999, n: 'Over 73kg' }
    ];

    const insertStmt = sqliteDb.prepare(`INSERT INTO weight_categories (age_group, gender, min_weight, max_weight, name) VALUES (?, ?, ?, ?, ?)`);
    sqliteDb.transaction(() => {
      for (const cat of seedCategories) {
        insertStmt.run(cat.age, cat.g, cat.min, cat.max, cat.n);
      }
    })();
    console.log("✅ Seeded Official WT Weight Categories");
  }
  
  // Seed an initial admin user if none exists
  const adminCount = sqliteDb.prepare("SELECT COUNT(*) as count FROM admin_users").get();
  if (adminCount.count === 0) {
    sqliteDb.prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)").run('admin', 'admin123');
  }

  // Hotfix: Inject Sub-Junior categories if they don't exist yet but the DB is already created.
  const subJuniorCount = sqliteDb.prepare("SELECT COUNT(*) as count FROM weight_categories WHERE age_group = 'Cadet (Sub-Junior)'").get();
  if (subJuniorCount.count === 0) {
    const subJuniors = [
      ...[18, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 50].map(w => ({ age: 'Cadet (Sub-Junior)', g: 'Male', min: w === 18 ? 0 : w - 3, max: w, n: `Under ${w}kg` })),
      { age: 'Cadet (Sub-Junior)', g: 'Male', min: 50.01, max: 999, n: 'Over 50kg' },
      ...[18, 21, 23, 25, 27, 29, 32, 35, 38, 41, 44, 50].map(w => ({ age: 'Cadet (Sub-Junior)', g: 'Female', min: w === 18 ? 0 : w - 3, max: w, n: `Under ${w}kg` })),
      { age: 'Cadet (Sub-Junior)', g: 'Female', min: 50.01, max: 999, n: 'Over 50kg' }
    ];
    const insertStmt = sqliteDb.prepare(`INSERT INTO weight_categories (age_group, gender, min_weight, max_weight, name) VALUES (?, ?, ?, ?, ?)`);
    sqliteDb.transaction(() => {
      for (const cat of subJuniors) {
        insertStmt.run(cat.age, cat.g, cat.min, cat.max, cat.n);
      }
    })();
    console.log("✅ Hot-patched Sub-Junior Weight Categories");
  }

  try {
    sqliteDb.exec("ALTER TABLE players ADD COLUMN father_name TEXT");
    console.log("✅ Added father_name column to players table");
  } catch (err: any) {
    // Ignore error if column already exists
  }

  console.log("✅ SQLite database initialized");
}

// --- Schemas (for MongoDB) ---
const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
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

const News = mongoose.model("News", NewsSchema);
const Admission = mongoose.model("Admission", AdmissionSchema);

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- API Routes ---
app.get("/api/news", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      const news = await News.find().sort({ date: -1 });
      res.json(news);
    } else {
      const news = sqliteDb.prepare("SELECT * FROM news ORDER BY date DESC").all();
      res.json(news);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.post("/api/admission", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      const admission = new Admission(req.body);
      await admission.save();
    } else {
      const { name, email, phone, course, message } = req.body;
      sqliteDb.prepare("INSERT INTO admissions (name, email, phone, course, message) VALUES (?, ?, ?, ?, ?)")
        .run(name, email, phone, course, message);
    }
    res.json({ success: true, message: "Admission request submitted" });
  } catch (err) {
    console.error("Admission error:", err);
    res.status(500).json({ error: "Failed to submit admission request" });
  }
});

// --- Admin API Routes ---

// 1. Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  
  try {
    const user = sqliteDb.prepare("SELECT * FROM admin_users WHERE username = ? AND password = ?").get(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Simplistic token for local demo
    res.json({ token: "admin_mock_token_123", username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 2. Weight Categories CRUD
app.get("/api/categories", (req, res) => {
  try {
    const categories = sqliteDb.prepare("SELECT * FROM weight_categories ORDER BY age_group, gender, min_weight").all();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/api/categories", (req, res) => {
  const { age_group, gender, min_weight, max_weight, name } = req.body;
  try {
    const result = sqliteDb.prepare(`
      INSERT INTO weight_categories (age_group, gender, min_weight, max_weight, name)
      VALUES (?, ?, ?, ?, ?)
    `).run(age_group, gender, min_weight, max_weight, name);
    res.json({ id: result.lastInsertRowid, success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  try {
    // Check if category is used by players
    const playersCount = sqliteDb.prepare("SELECT COUNT(*) as count FROM players WHERE weight_category_id = ?").get(id);
    if (playersCount.count > 0) {
      return res.status(400).json({ error: "Cannot delete category in use by players" });
    }
    // Delete matches bound to this category to prevent SQLite constraint failures
    sqliteDb.prepare("DELETE FROM matches WHERE category_id = ?").run(id);
    
    sqliteDb.prepare("DELETE FROM weight_categories WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Category Delete Error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// 3. Players API
app.get("/api/players", (req, res) => {
  try {
    const players = sqliteDb.prepare(`
      SELECT p.*, c.name as category_name
      FROM players p
      LEFT JOIN weight_categories c ON p.weight_category_id = c.id
      ORDER BY p.date_registered DESC
    `).all();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

app.post("/api/players", (req, res) => {
  const { name, father_name, gender, dob, address, weight } = req.body;
  
  if (!name || !father_name || !gender || !dob || !address || weight === undefined) {
    return res.status(400).json({ error: "All fields are required" });
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

    // 2. Determine Age Group (5-11 Sub-Junior, 12-14 Cadet, 15-17 Junior, 18+ Senior)
    let age_group = "Unknown";
    if (age >= 5 && age <= 11) age_group = "Cadet (Sub-Junior)";
    else if (age >= 12 && age <= 14) age_group = "Cadet";
    else if (age >= 15 && age <= 17) age_group = "Junior";
    else if (age >= 18) age_group = "Senior";
    else {
        return res.status(400).json({ error: "Age must be 5 or above to participate" });
    }

    // 3. Auto-determine Weight Category
    const categories = sqliteDb.prepare("SELECT * FROM weight_categories WHERE age_group = ? AND gender = ?").all(age_group, gender);
    let matchedCategoryId = null;
    
    for (const cat of categories) {
      if (cat.min_weight === 0) { // e.g., 0 to 18
        if (weight >= cat.min_weight && weight <= cat.max_weight) {
          matchedCategoryId = cat.id;
          break;
        }
      } else { // e.g., > 18 to 21
        if (weight > cat.min_weight && weight <= cat.max_weight) {
          matchedCategoryId = cat.id;
          break;
        }
      }
    }

    if (!matchedCategoryId) {
      return res.status(400).json({ error: `Please create a valid weight division in Categories for ${age_group} ${gender} at ${weight}kg` });
    }

    // 4. Insert player
    const result = sqliteDb.prepare(`
      INSERT INTO players (name, father_name, gender, dob, address, weight, age, age_group, weight_category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, father_name, gender, dob, address, weight, age, age_group, matchedCategoryId);

    const insertedPlayer = sqliteDb.prepare(`
      SELECT p.*, c.name as category_name
      FROM players p
      LEFT JOIN weight_categories c ON p.weight_category_id = c.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    res.json({ success: true, player: insertedPlayer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register player" });
  }
});

app.delete("/api/players/:id", (req, res) => {
  const { id } = req.params;
  try {
    // Delete matches involving this player to satisfy FOREIGN KEY definitions
    sqliteDb.prepare("DELETE FROM matches WHERE player1_id = ? OR player2_id = ? OR winner_id = ?").run(id, id, id);
    
    // Now delete the player
    sqliteDb.prepare("DELETE FROM players WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error", err);
    res.status(500).json({ error: "Failed to delete player" });
  }
});

// 4. Tiesheets / Matches API
app.get("/api/tiesheets/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  try {
    const matches = sqliteDb.prepare(`
      SELECT m.*, 
             p1.name as player1_name, p1.weight as player1_weight,
             p2.name as player2_name, p2.weight as player2_weight
      FROM matches m
      LEFT JOIN players p1 ON m.player1_id = p1.id
      LEFT JOIN players p2 ON m.player2_id = p2.id
      WHERE m.category_id = ?
      ORDER BY m.round_number DESC, m.match_number ASC
    `).all(categoryId);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tiesheets" });
  }
});

app.post("/api/tiesheets/generate", (req, res) => {
  try {
    // 1. Get all categories that have players
    const categoriesWithPlayers = sqliteDb.prepare(`
      SELECT DISTINCT weight_category_id FROM players
    `).all();

    sqliteDb.transaction(() => {
      // Clear all existing matches to regenerate freshly
      sqliteDb.prepare("DELETE FROM matches").run();

      for (const cat of categoriesWithPlayers) {
        const catId = cat.weight_category_id;
        
        // Fetch players assigned to this category
        const players = sqliteDb.prepare(`
            SELECT id FROM players WHERE weight_category_id = ? ORDER BY RANDOM()
        `).all(catId);
        
        let numPlayers = players.length;
        if (numPlayers < 2) continue; // Skip categories with 0 or 1 player
        
        // Calculate closest power of 2
        let nextPow2 = 1;
        while (nextPow2 < numPlayers) {
          nextPow2 *= 2;
        }
        
        const numByes = nextPow2 - numPlayers;
        const totalFirstRoundMatches = nextPow2 / 2;
        
        // Create an array mapping visual positions (1 to NextPow2) to player IDs or 'BYE'
        const bracketPositions: (number | null)[] = Array(nextPow2).fill(null);
        
        // Distribute Byes evenly. A common way is to give byes to top seeds, 
        // here we distribute them randomly among the positions.
        let playersIdx = 0;
        for (let i = 0; i < nextPow2; i++) {
            if (i < numByes) {
                // Next numByes slots get a player matched with a BYE in the pairing phase
                // Actually it's simpler: just put all players in, and pad the rest with NULLs.
                bracketPositions[i] = players[playersIdx++].id;
            } else {
                bracketPositions[i] = playersIdx < numPlayers ? players[playersIdx++].id : null;
            }
        }
        
        // Shuffle the bracket positions to randomize bye placements
        for (let i = bracketPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bracketPositions[i], bracketPositions[j]] = [bracketPositions[j], bracketPositions[i]];
        }
        
        // Ensure no BYE faces a BYE (if possible, but numByes < N so it's guaranteed if we pair properly)
        // Simplest algorithm: pair positions [0,1], [2,3], ...
        // If both are null, that's a problem, but numByes < N so we can avoid it by placing Nulls carefully.
        
        const safePositions: (number | null)[] = [];
        let pIdx = 0;
        // Place one player in every match first
        for(let i=0; i<totalFirstRoundMatches; i++) {
           safePositions[i*2] = players[pIdx++].id;
           safePositions[i*2+1] = null; // Temporary
        }
        // Fill remaining players into the second slots
        for(let i=0; i<totalFirstRoundMatches; i++) {
           if(pIdx < numPlayers) {
               safePositions[i*2+1] = players[pIdx++].id;
           }
        }
        
        // Generate the tournament tree layer by layer
        let currentRoundPlayers = safePositions.length;
        let roundNumber = Math.log2(nextPow2); // e.g. 8 => 3 (Quarterfinals)
        let totalMatchesCreated = 0;
        
        // We will store the match IDs of the current round to link them as next_match_id 
        // to the previous round. It's easier to build from Final up to First Round.
        
        const insertMatch = sqliteDb.prepare(`
           INSERT INTO matches (category_id, round_number, match_number, player1_id, player2_id, next_match_id, winner_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        // We build from bottom (first round) to top (final), or top to bottom.
        // Let's build top to bottom (Final first, then semis, etc.) so we know the next_match_id.
        let matchNodes: any[] = [];
        
        // Final
        let matchCounter = 1;
        let rootMatch = insertMatch.run(catId, 1, matchCounter++, null, null, null, null);
        matchNodes.push({ id: rootMatch.lastInsertRowid, round: 1, isLeaf: roundNumber === 1 });
        
        let previousRoundNodes = [matchNodes[0]];
        
        for (let r = 2; r <= roundNumber; r++) {
           let currentRoundNodes = [];
           for (let parentNode of previousRoundNodes) {
               // Create 2 children for each parent
               let child1 = insertMatch.run(catId, r, matchCounter++, null, null, parentNode.id, null);
               let child2 = insertMatch.run(catId, r, matchCounter++, null, null, parentNode.id, null);
               currentRoundNodes.push({ id: child1.lastInsertRowid, round: r, isLeaf: r === roundNumber });
               currentRoundNodes.push({ id: child2.lastInsertRowid, round: r, isLeaf: r === roundNumber });
           }
           previousRoundNodes = currentRoundNodes;
        }
        
        // previousRoundNodes now holds exactly totalFirstRoundMatches nodes (leaf nodes)
        // Assign the players (safePositions) to these leaf nodes
        let posIdx = 0;
        const updateLeaf = sqliteDb.prepare("UPDATE matches SET player1_id = ?, player2_id = ?, winner_id = ? WHERE id = ?");
        for (let leafNode of previousRoundNodes) {
           const p1 = safePositions[posIdx++];
           const p2 = safePositions[posIdx++];
           // If it's a BYE (p2 is null), p1 automatically wins this round
           const winner = (p1 && !p2) ? p1 : ((!p1 && p2) ? p2 : null);
           updateLeaf.run(p1, p2, winner, leafNode.id);
        }
      }
    })();
    
    res.json({ success: true, message: "Tiesheets generated successfully" });
  } catch (err) {
    console.error("Tiesheet Generation Error:", err);
    res.status(500).json({ error: "Failed to generate tiesheets" });
  }
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
