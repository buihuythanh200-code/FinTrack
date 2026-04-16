const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goalsController");
const verifyToken = require("../middlewares/authMiddleware");

// Middleware bảo vệ các routes bên dưới
router.use(verifyToken);
// Thêm verifyToken vào trước controller
router.get("/", goalsController.getGoals);
router.post("/:id/add-funds", goalsController.addFunds);

module.exports = router;
