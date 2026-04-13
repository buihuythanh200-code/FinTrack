const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
// Khai báo route GET
router.get("/", categoriesController.getCategoriesForForm);

module.exports = router;
