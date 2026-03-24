const recipeModel = require("../models/recipeModel")

exports.displayRecipes = async (req, res) => {
  try {
    let recipes = await recipeModel.getAllRecipes();
    const userEmail = req.session.user.email;
    console.log(userEmail)
    const sort = req.query.sort;

    recipes.forEach(recipe => { // for each recipe in the database, we will assign a hasRated variable
        recipe.hasRated = recipe.ratings.some(r => r.email === userEmail); //if the recipe's rating already has the user's email, it means they already rated it
    });

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

    res.render("recipes", { recipes, titlesearch: null, sort, isSearch: false});

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
    res.render("recipes", { recipes, titlesearch, sort, isSearch: true}); // Render the EJS form view and pass the recipes
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.updateRating = async (req, res) => {

  if (!req.session.user) { //if the user is not logged in, they cannot give a rating, redirect them back to login
    return res.redirect("/authentication/login")
  }

  const rating = parseInt(req.body.rating); //we need to parse the value into an integer, as of rn its a string
  const recipeId = req.body.recipeId; //get the recipeId from the rating form
  const email = req.session.user.email //get the email fro mthe session
  console.log(email)

  try {
    const existing = await recipeModel.hasUserRated(recipeId, email); //check if user already rated the recipe based on their email

    if (existing) { //if it returns a record, means user already submitted a rating
      const recipes = await recipeModel.getAllRecipes(); // get all the recipes to display

      return res.render('recipes', {recipes, titlesearch:null, sort:null, isSearch: false}); //set hasrated to true
    } //else we add the rating
    await recipeModel.addRating(recipeId, email, rating);
    await recipeModel.updateAverageRating(recipeId);

    res.redirect('/recipes');

  } catch (error) {
    console.error(error);
    res.send(error.toString());
  }

}

exports.showCreateRecipe = (req, res) => {
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

  let newRecipe = {
    title: title,
    description: description,
    image: image,
    ingredients: cleanIngredients,
    steps: cleanSteps,
    difficulty: difficulty,
    email: email,
    username: username
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
    let success = await recipeModel.editRecipes(email, newDesc, newIngredients, newSteps)
    console.log("Success")
    res.send("Recipe has been succesfully updated")
  } catch (error) {
    console.error(error)
  }

}
// casper's code to get from my_recipes to edit WORK IN PROGRESS
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

//Casper's code to update favourites list from haildil's recipe page
exports.updateFavourites = async (req, res) => {
  if(!req.session.user) {
    res.redirect("/login") //path might be wrong will fix later
  }
  let email = req.sesion.user.email
  let recipeID = req.body.recipeID
  try {
    //let result = await recipeModel.findRecipeByID(recipeID)
    await recipeModel.addToFavouritesFavourites(email, recipeID)
    console.log("success!")
    res.render("favourites", { user: req.session.user })
  } catch (error) {
    console.error(error)
  }
}

//Casper's code to delete favourites from favourites page
exports.deleteFavourites = async (req, res) => {
  let email = req.sesion.user.email
  let recipeID = req.body.recipeID

  try {
      await recipeModel.deleteFavourites(email, recipeID)
      console.log("success!")
      res.render("favourites", {user: req.session.user})
  } catch (error) {
    console.error(error)
  }
}