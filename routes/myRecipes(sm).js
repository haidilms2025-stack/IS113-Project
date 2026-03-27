//imported libraries
const express = require("express")
const router = express.Router()

//local modules
const myRecipesController = require("../controllers/myRecipesController(sm)")
const authMiddleware = require('../middleware/auth-middleware');


//routes for display dashboard
router.get("/", authMiddleware.isLoggedIn, myRecipesController.displayRecipes)

router.post("/", myRecipesController.removeRecipe)


//routes for adding recipe
router.get('/create-recipe', authMiddleware.isLoggedIn, myRecipesController.showCreateRecipe);

router.post('/create-recipe', myRecipesController.addRecipes);

//routes for edit recipe
router.get('/edit-recipe', authMiddleware.isLoggedIn, myRecipesController.viewRecipes);

router.post('/edit-recipe', myRecipesController.updateRecipes)




module.exports = router