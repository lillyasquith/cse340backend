// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const itemCont = require("../controllers/itemController");

// Route to build inventory by classification view
router.get("/inv/type/:classificationId/detail/:itemId", itemCont.buildByClassificationId);

module.exports = router;