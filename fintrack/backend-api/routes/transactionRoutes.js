const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const verifyToken = require("../middlewares/authMiddleware"); // Import file bạn vừa gửi

// Thêm verifyToken vào giữa route và controller
router.get("/", verifyToken, transactionController.getTransactions);
router.post("/", verifyToken, transactionController.createTransaction);

module.exports = router;
