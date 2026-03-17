const express = require("express")
const router = express.Router()

const myRecipesController = require("../controllers/myRecipesController(sm)")

router.get("/", myRecipesController.displayRecipes)

router.post("/", myRecipesController.removeRecipe)



module.exports = router