const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const walletsRoutes = require("./routes/walletsRoutes");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/dashboard/categories", categoriesRoutes);
app.use("/api/dashboard/wallets", walletsRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((req, res, next) => {
  console.log(`>>> Request tới: ${req.method} ${req.url}`);
  next();
});
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
