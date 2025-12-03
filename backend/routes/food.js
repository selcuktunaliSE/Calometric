const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// basit CRUD yapabiliriz; şimdilik ekleme & listeleme

// POST /api/foods
router.post("/", auth, async (req, res) => {
  try {
    const { name, calories, carbs, protein, fat } = req.body;
    const result = await pool.query(
      `INSERT INTO foods (name, calories, carbs, protein, fat)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [name, calories, carbs, protein, fat]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create food error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/foods?search=...
router.get("/", auth, async (req, res) => {
  try {
    const { search } = req.query;
    let result;
    if (search) {
      result = await pool.query(
        "SELECT * FROM foods WHERE LOWER(name) LIKE LOWER($1) LIMIT 50",
        [`%${search}%`]
      );
    } else {
      result = await pool.query("SELECT * FROM foods LIMIT 50");
    }
    res.json(result.rows);
  } catch (err) {
    console.error("List foods error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;