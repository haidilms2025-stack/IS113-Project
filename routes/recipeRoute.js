const express = require('express')
const router = express.Router();
const recipeController = require("../controllers/recipeController")

//Haidil's Code 

//Show user all the recipes at first glance
router.get('/', recipeController.displayRecipes);

//If user wants to browse for pecific recipes, they will submit, and we will filter the recipes to display
router.post('/', recipeController.filterRecipes);

router.post('/rate',recipeController.updateRating)


//create and edit recipes route moved to myRecipes(sm).js

//user wants to edit a recipe from my recipes
// router.get('/editrecipe', recipeController.updateRecipes);


// router.get('/create-recipe', recipeController.showCreateRecipe);

// router.post('/create-recipe', recipeController.addRecipes);

router.post("/favourites", recipeController.updateFavourites)

router.post("/delete-favourites", recipeController.deleteFavourites)

module.exports = router;



