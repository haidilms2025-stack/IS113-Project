const recipeModel = require("../models/recipeModel")

exports.displayRecipes = async (req,res) => {
    try {
    let recipes = await recipeModel.getAllRecipes();// fetch all the list    
    console.log(recipes);
    res.render("recipes", { recipes }); // Render the EJS form view and pass the recipes
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.filterRecipes = async (req,res) => {
    // Haidil's Code goes here\

    let title = req.body.titlesearch
    try {
    let recipes = await recipeModel.findByTitle(title);// fetch all the list    
   // recipes.map(recipe=>recipe.title = recipe.title.toLowercase());
   // console.log(recipes)
    res.render("recipes", { recipes }); // Render the EJS form view and pass the recipes
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.addRecipes = async (req,res) => {

    //Ronald's Code goes here
   
}

exports.editRecipes = async(req,res) => {

    //Casper's Code goes here
    //const recipes = await recipeModel.getAllRecipes();

    res.render('casper_editRecipe', {recipe})
}

