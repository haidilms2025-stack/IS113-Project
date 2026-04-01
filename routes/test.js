const express = require('express');
const router = express.Router();
const displayPage = require("../controllers/index");
router.get("/", displayPage.displayPage);


module.exports = router

