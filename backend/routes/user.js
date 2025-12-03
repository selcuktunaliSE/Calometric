const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const { calculateBMI, calculateDailyCalorieTarget } = require("../utils/health");

const router = express.Router();

// GET /api/user/me
router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, age, gender, height_cm, weight_kg FROM users WHERE id = $1",
      [req.userId]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const bmi = calculateBMI(user.weight_kg, user.height_cm);
    const calorieTarget = calculateDailyCalorieTarget({
      gender: user.gender,
      weight_kg: user.weight_kg,
      height_cm: user.height_cm,
      age: user.age,
    });

    res.json({ user, bmi, calorieTarget });
  } catch (err) {
    console.error("Get me error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/me  -> profili güncelle
router.put("/me", auth, async (req, res) => {
  try {
    const { name, age, gender, height_cm, weight_kg } = req.body;
    const result = await pool.query(
      `UPDATE users
       SET name = $1, age = $2, gender = $3, height_cm = $4, weight_kg = $5
       WHERE id = $6
       RETURNING id, email, name, age, gender, height_cm, weight_kg`,
      [name || null, age || null, gender || null, height_cm || null, weight_kg || null, req.userId]
    );

    const user = result.rows[0];
    const bmi = calculateBMI(user.weight_kg, user.height_cm);
    const calorieTarget = calculateDailyCalorieTarget({
      gender: user.gender,
      weight_kg: user.weight_kg,
      height_cm: user.height_cm,
      age: user.age,
    });

    res.json({ user, bmi, calorieTarget });
  } catch (err) {
    console.error("Update me error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;