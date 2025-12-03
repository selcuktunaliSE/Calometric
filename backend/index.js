const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const diaryRoutes = require("./routes/diary");
const foodRoutes = require("./routes/food");

const app = express();

app.use(cors());
app.use(express.json());

// basit healthcheck
app.get("/", (req, res) => {
  res.json({ message: "Calometric API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/foods", foodRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Calometric backend running on port ${PORT}`);
});