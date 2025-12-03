const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const {
      food_id,
      custom_name,
      custom_calories,
      custom_carbs,
      custom_protein,
      custom_fat,
      quantity,
      entry_date,
    } = req.body;

    if (!entry_date) {
      return res.status(400).json({ message: "entry_date required" });
    }

    const result = await pool.query(
      `INSERT INTO diary_entries
       (user_id, food_id, custom_name, custom_calories, custom_carbs, custom_protein, custom_fat, quantity, entry_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        req.userId,
        food_id || null,
        custom_name || null,
        custom_calories || null,
        custom_carbs || null,
        custom_protein || null,
        custom_fat || null,
        quantity || 1,
        entry_date,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create diary error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/diary/summary?date=YYYY-MM-DD
router.get("/summary", auth, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date required" });

    const result = await pool.query(
      `SELECT
          COALESCE(SUM(
            COALESCE(de.custom_calories, f.calories) * de.quantity
          ),0) AS total_calories,
          COALESCE(SUM(
            COALESCE(de.custom_carbs, f.carbs) * de.quantity
          ),0) AS total_carbs,
          COALESCE(SUM(
            COALESCE(de.custom_protein, f.protein) * de.quantity
          ),0) AS total_protein,
          COALESCE(SUM(
            COALESCE(de.custom_fat, f.fat) * de.quantity
          ),0) AS total_fat
       FROM diary_entries de
       LEFT JOIN foods f ON de.food_id = f.id
       WHERE de.user_id = $1 AND de.entry_date = $2`,
      [req.userId, date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Diary summary error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/diary/list?date=YYYY-MM-DD
router.get("/list", auth, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "date required" });

    const result = await pool.query(
      `SELECT de.*,
              f.name AS food_name,
              f.calories AS food_calories,
              f.carbs AS food_carbs,
              f.protein AS food_protein,
              f.fat AS food_fat
       FROM diary_entries de
       LEFT JOIN foods f ON de.food_id = f.id
       WHERE de.user_id = $1 AND de.entry_date = $2
       ORDER BY de.created_at DESC`,
      [req.userId, date]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Diary list error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;