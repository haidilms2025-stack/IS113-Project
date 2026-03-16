const express = require("express")
const router = express.Router()

const myRecipesController = require("../controllers/myRecipesController(sm)")
router.get("/", myRecipesController)



module.exports = router