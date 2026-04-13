const express = require("express");
const router = express.Router();
const walletsController = require("../controllers/walletsController");
// Khai báo route GET
router.get("/", walletsController.getWalletsForForm);

module.exports = router;
