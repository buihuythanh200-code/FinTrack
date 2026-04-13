const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const verifyToken = require("../middlewares/authMiddleware");

// Thêm verifyToken vào trước controller
router.get("/", verifyToken, dashboardController.getDashboardData);

module.exports = router;
