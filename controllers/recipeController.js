const recipeModel = require("../models/recipeModel")

exports.displayRecipes = async (req, res) => {
  try {
    let recipes = await recipeModel.getAllRecipes();

    const sort = req.query.sort;

    // 🔃 SORT (only if user selected something)
    if (sort === "asc") {
      recipes.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
    }
    else if (sort === "desc") {
      recipes.sort((a, b) =>
        b.username.localeCompare(a.username)
      );
    }
    else if (sort === "diff") {
      recipes.sort((a, b) =>
        a.difficulty - b.difficulty
      );
    }

    res.render("recipes", { recipes, titlesearch: null, sort, isSearch: false });

  } catch (error) {
    console.error(error);
    res.send("Error reading database");
  }
}

exports.filterRecipes = async (req, res) => {
  // Haidil's Code goes here\

  let titlesearch = req.body.titlesearch
  const sort = req.body.sort || '';
  let title = req.body.titlesearch.toLowerCase();
  try {
    let recipes = await recipeModel.findRecipesByTitle(title);// fetch all the list    
    console.log(recipes)
    res.render("recipes", { recipes, titlesearch, sort, isSearch: true }); // Render the EJS form view and pass the recipes
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.updateRating = async (req, res) => {
  const rating = parseInt(req.body.rating);
  const recipeId = req.body.recipeId;
  try {
    await recipeModel.addRating(recipeId, rating);
    await recipeModel.updateAverageRating(recipeId);

    res.redirect("/recipes");

  } catch (error) {
    console.error(error);
    res.send(error.toString());
  }

}

exports.showCreateRecipe = (req,res) => {
  res.render('create_recipe_ronald')
}

exports.addRecipes = async (req, res) => {
  let title = req.body.title;// get title
  let description = req.body.description;// get description
  let image = req.body.image;// get image
  let ingredients = req.body.ingredient; // get ingridients
  let steps = req.body.steps;// get steps
  let difficulty = req.body.difficulty
  let username = "test username"
  let email = "test@email.com"

  //cleaning up ingredients and steps arrat
  ingredients = ingredients.map(item => item.trim());
  const cleanIngredients = ingredients.filter(item => item !== "");
  steps = steps.map(item => item.trim());
  const cleanSteps = steps.filter(item => item !== "");

  let newRecipe ={
    title:title,
    description:description,
    image:image,
    ingredients: cleanIngredients,
    steps:cleanSteps,
    difficulty:difficulty,
    email:email,
    username:username
  }
  try {
    let result = await recipeModel.createRecipe(newRecipe)
    res.redirect("/recipes");
  } catch (error) {
    console.log(error)
  }

}

exports.updateRecipes = async (req, res) => {

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
  } catch (error) {
    console.error(error)
  }

}
// casper's code to get from my_recipes to edit
exports.viewRecipes = async (req, res) => {

  let title = req.query.title;
  console.log(title);

  try {
    let result = await recipeModel.findByTitle(title)
    res.render("casper_editRecipe", { result })
  } catch (error) {
    console.error("unable to find recipe")
  }
} 
