const recipeModel = require("../models/recipeModel")

exports.displayRecipes = async (req, res) => {
  try {
    let recipes = await recipeModel.getAllRecipes();
    let userEmail = ""
    let userRating = ""
    if (req.session.user) {
      userEmail = req.session.user.email;

    }

    const sort = req.query.sort;

    if (req.session.user) {
      recipes.forEach(recipe => { // for each recipe in the database, we will assign a hasRated variable
        recipe.hasRated = recipe.ratings.some(r => r.email === userEmail); //if the recipe's rating already has the user's email, it means they already rated it

        const userRatingObj = recipe.ratings.find(r =>
          r.email === userEmail
        );

        recipe.userRating = userRatingObj ? userRatingObj.value : null;
      });
    }

    if (sort === "asc") {
      recipes.sort((a, b) => {
        const A = a.username.toLowerCase();
        const B = b.username.toLowerCase();

        if (A < B) return -1;
        if (A > B) return 1;
        return 0;
      });
    }
    else if (sort === "desc") {
      recipes.sort((a, b) => {
        const A = a.username.toLowerCase();
        const B = b.username.toLowerCase();

        if (A > B) return -1;
        if (A < B) return 1;
        return 0;
      });
    }
    else if (sort === "diffhigh") {
      recipes.sort((a, b) => {
        if (b.difficulty < a.difficulty) return -1;
        if (b.difficulty > a.difficulty) return 1;
        return 0;
      });
    }
    else if (sort === "difflow") {
      recipes.sort((a, b) => {
        if (a.difficulty < b.difficulty) return -1;
        if (a.difficulty > b.difficulty) return 1;
        return 0;
      });
    }
    else if (sort === "ratinghigh") {
      recipes.sort((a, b) => {
        if (b.avgRating < a.avgRating) return -1;
        if (b.avgRating > a.avgRating) return 1;
        return 0;
      });
    }
    else if (sort === "ratinglow") {
      recipes.sort((a, b) => {
        if (a.avgRating < b.avgRating) return -1;
        if (a.avgRating > b.avgRating) return 1;
        return 0;
      });
    }

    res.render("recipes", { recipes, titlesearch: null, sort, isSearch: false, userRating });

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

  const action = req.body.action
  const rating = parseInt(req.body.rating); //we need to parse the value into an integer, as of rn its a string
  const recipeId = req.body.recipeId; //get the recipeId from the rating form, we will use it for updating later
  const email = req.session.user.email //get the email fro mthe session

  try {
    if (action == "submitRating") {
      const existing = await recipeModel.hasUserRated(recipeId, email); //check if user already rated the recipe based on their email

      if (existing) { //if it returns a record, means user already submitted a rating
        await recipeModel.updateRating(recipeId, email, rating);
      }
      else {
        //else we add the rating
        await recipeModel.addRating(recipeId, email, rating);
      }
    } else if (action == "deleteRating") {
      await recipeModel.deleteRating(recipeId, email)
    }

    await recipeModel.updateAverageRating(recipeId);
    res.redirect('/recipes');

  } catch (error) {
    console.error(error);
    res.send(error.toString());
  }

}

exports.updateReviews = async (req, res) => {


  const action = req.body.action;
  const review = req.body.review; 
  const recipeId = req.body.recipeId; //get the recipeId from the rating form, we will use it for updating later
  const email = req.session.user.email; //get the email fro mthe session
  const username = req.session.user.username;
  try {
      if (action == "submitReview") {
      const existing = await recipeModel.hasUserReviewed(recipeId, email); 
      
        if (existing) { //if it returns a record, means user already submitted a review
          await recipeModel.updateReview(recipeId, email, review);
        } else { //else we add the review
          await recipeModel.addReview(recipeId, email, username, review);
        }
    } else if (action == "deleteReview") {
      await recipeModel.deleteReview(recipeId,email)
    }    
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.send(error.toString());
  }

}
//create and update recipes controller moved to myRecipesController(sm)
exports.showCreateRecipe = (req, res) => {
  const user = req.session.user
  res.render('create_recipe_ronald', { user })
}

exports.addRecipes = async (req, res) => {
  let title = req.body.title;// get title
  let description = req.body.description;// get description
  let image = req.body.image;// get image
  let ingredients = req.body.ingredient; // get ingridients
  let steps = req.body.steps;// get steps
  let difficulty = req.body.difficulty
  let userName = req.body.userName
  let email = req.body.userEmail

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
    username: userName
  }
  try {
    let result = await recipeModel.createRecipe(newRecipe)
    res.redirect("/recipes");
  } catch (error) {
    console.log(error)
  }

}

// exports.updateRecipes = async (req, res) => {

//   //Casper's Code goes here
//   //const recipes = await recipeModel.getAllRecipes();
//   let newDesc = req.body.description
//   let newIngredients = req.body.Ingredients
//   let newSteps = req.body.steps
//   let email = req.body.email
//   let userName = req.body.userName

//   try {
//     let success = await recipeModel.editRecipes(email, newDesc, newIngredients, newSteps)
//     console.log("Success")
//     res.send("Recipe has been succesfully updated")
//   } catch (error) {
//     console.error(error)
//   }

// }
// casper's code to get from my_recipes to edit WORK IN PROGRESS
// exports.viewRecipes = async (req, res) => {

//   let title = req.query.title;
//   console.log(title);

//   try {
//     let result = await recipeModel.findByTitle(title)
//     res.render("casper_editRecipe", { result })
//   } catch (error) {
//     console.error("unable to find recipe")
//   }
// }

//Casper's code to update favourites list from haildil's recipe page
exports.updateFavourites = async (req, res) => {
  if(!req.session.user) { // no log in then kena sent back to login page L bozo
    return res.redirect("/authentication/login")
  }
  const email = req.session.user.email
  const recipeID = req.body.recipeId

  console.log("Adding to favourites - Email:", email, "RecipeID:", recipeID)

  try {
    const recipe = await recipeModel.findRecipeByID(recipeID) // from the models page
    if (!recipe) {
      return res.status(404).send("Recipe not found") // if cannot find recipe send this
    }

    // Check if recipe is already in favourites
    const isDuplicate = await recipeModel.isRecipeInFavourites(email, recipeID) // using thing from recipe mode page
    console.log("Is duplicate?:", isDuplicate) //check if got duplicate anot
    
    if (isDuplicate) {
      console.log("Recipe already in favourites, skipping add")
      return res.redirect("/recipes/favourites") //if duplicate then dont add, jusr redirect to fav page
    }
    
    await recipeModel.addToFavourites(email, recipe) //if not then add to favourites using the thing from models page
    console.log("Added to favourites successfully!") //if it works then send this
    res.redirect("/recipes/favourites") // reload page
  } catch (error) {
    console.error("Error adding to favourites:", error)
    res.status(500).send(error.toString())
  }
}

//Casper's code to delete favourites from favourites page
exports.deleteFavourites = async (req, res) => {
  if(!req.session.user) { // no log in then kena sent back to login page L bozo
    return res.redirect("/authentication/login")
  }
  const email = req.session.user.email
  const recipeID = req.body.recipeID

  console.log("Deleting from favourites - Email:", email, "RecipeID:", recipeID)

  try {
      const result = await recipeModel.deleteFavourites(email, recipeID) //from recipe.model
      console.log("Delete result:", result)
      
      if (!result) {
        console.log("Recipe not found in favourites or user not found") //if cannot find recipe or user the send this
      } else {
        console.log("Removed from favourites successfully!") // if not send this
      }
      res.redirect("/recipes/favourites") //reload the fav page
  } catch (error) {
    console.error("Error deleting from favourites:", error)
    res.status(500).send(error.toString())
  }
}

// View a single recipe by ID
exports.viewRecipe = async (req, res) => {
  try {
    const recipeID = req.params.id
    const recipe = await recipeModel.findRecipeByID(recipeID) //find one recipe using its id
    
    if (!recipe) {
      return res.status(404).send("Recipe not found") // good ol error 404
    }

    let userEmail = "" // initialise email is empty string
    if (req.session.user) { // if user is logged in
      userEmail = req.session.user.email // change userEmail to the user's email
      recipe.hasRated = recipe.ratings.some(r => r.email === userEmail) //return true if user's email(unique) is inside ratings 
      recipe.hasReviewed = recipe.reviews.some(r => r.email === userEmail)
       
    } else {
      recipe.hasRated = false //if no user log in, then is default havent rate yet 
      recipe.hasReviewed = false
    }

    res.render("recipe-detail", { recipe }) // render recipe-detail.ejs with recipe
  } catch (error) {
    console.error(error)
    res.status(500).send("Error fetching recipe")
  }
}

// Display user's favourites page
exports.displayFavourites = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/authentication/login")
  }

  try {
    const email = req.session.user.email
    const user = await recipeModel.findUserByEmail(email)

    if (!user) {
      return res.status(404).send("User not found")
    }

    // Ensure favourites array exists
    if (!user.favourites) {
      user.favourites = []
    }

    res.render("favourites", { user: user })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error loading favourites")
  }
}