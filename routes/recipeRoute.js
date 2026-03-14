const express = require('express')
const router = express.Router();
const recipeController = require("../controllers/recipeController")

//Haidil's Code 

//Show user all the recipes at first glance
router.get('/', recipeController.displayRecipes);

//If user wants to browse for pecific recipes, they will submit, and we will filter the recipes to display
router.post('/', recipeController.filterRecipes);

module.exports = router;



