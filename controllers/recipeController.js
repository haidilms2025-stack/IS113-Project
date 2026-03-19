const recipeModel = require("../models/recipeModel")

exports.displayRecipes = async (req, res) => {
  try {
    let recipes = await recipeModel.getAllRecipes();// fetch all the list    

    res.render("recipes", { recipes }); // Render the EJS form view and pass the recipes
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.filterRecipes = async (req, res) => {
  // Haidil's Code goes here\

  let title = req.body.titlesearch.toLowerCase();
  try {
    let recipes = await recipeModel.findByTitle(title);// fetch all the list    
    // recipes.map(recipe=>recipe.title = recipe.title.toLowercase());
    console.log(recipes)
    res.render("recipes", { recipes }); // Render the EJS form view and pass the recipes
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.addRecipes = async (req, res) => {

  //Ronald's Code goes here

}

exports.updateRecipes = async(req,res) => {

    //Casper's Code goes here
    //const recipes = await recipeModel.getAllRecipes();
    let newDesc = req.body.description
    let newIngredients = req.body.Ingredients
    let newSteps = req.body.steps
    let email = req.body.email
    let userName = req.body.userName

    try {
        let success = await recipeModel.editRecipes(email, userName, newDesc, newIngredients, newSteps)
        console.log("Sucess")
        res.send("Recipe has been succesfully updated")
    } catch(error) { 
        console.error(error)
    }
   
}
// casper's code to get from my_recipes to edit
exports.viewRecipes = async(req,res) => {

  let title = req.query.title;
  console.log(title);
  
  try {
    let result = await recipeModel.findByTitle(title)
    res.render("/casper_editRecipe", {result})
  } catch (error) {
    console.error("unable to find recipe")
  }
} 
