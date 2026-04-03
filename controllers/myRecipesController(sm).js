//import recipe model 
const myRecipesModel = require("../models/recipeModel.js")


//normalise user input to array
function normalizeToArray(v) {
  // Nothing selected → empty array
  if (v === undefined || v === null) return [];

  // If already an array, keep it.
  // Otherwise, wrap the single value in an array.
  return Array.isArray(v) ? v : [v];
}

//display userdashboard
exports.displayRecipes = async (req, res) => {
    try{
        let userEmail = req.session.user.email
        console.log(`User email: ${userEmail}`)
        let RawRecipes = await myRecipesModel.getAllRecipes();
        RawRecipes = JSON.parse(JSON.stringify(RawRecipes));
        let recipeList = RawRecipes.filter((recipe) => {return recipe.email === userEmail})
        console.log(recipeList)
        
        res.render("myRecipes(sm)", {recipeList})
        
    } catch(error) {
        console.error(error)
        res.send("Error reading database")
    }
}


//delete selected recipes by title and email from user dashboard
exports.removeRecipe = async(req, res) => {
    let titles = normalizeToArray(req.body.titles)
    let email = req.session.user.email
    console.log(titles)
    
    if (titles.length == 0){
        return res.redirect("/myRecipes")
    }
    
    try {
        //recipe titles stored as array
        for (let title of titles) {
            let success = await myRecipesModel.deleteRecipe(title, email)
            console.log(success)
        }

        //find recipe id from recipe and delete recipe from favourite
        // for (let title of titles) {
        //     let recipe = await myRecipesModel.findByTitle(title)
        //     let recipeID = recipe.__id
        //     console.log(`Recipe ID: ${recipeID} Recipe title: ${recipe.title} `)

        //     //remove deleted recipes from favourite
        //     let deletedFromFav = await myRecipesModel.deleteFavourites(email, recipeID)
        //     console.log(`Deleted Recipe: ${deletedFromFav}`)
              
        // }
        
        res.redirect("/myRecipes")
    
    } catch(error) {
        console.error(error)
    }
}


//display add create recipe page
exports.showCreateRecipe = (req, res) => {
  let errorArr=[]
  let recipe={
    ingredients:[],
    steps:[]
  }
  res.render('create_recipe_ronald',{recipe, errorArr})
}


//add recipe
exports.addRecipes = async (req, res) => {
  let title = req.body.title; // get title
  let description = req.body.description; // get description
  let image = req.body.image; // get image
  let ingredients = req.body.ingredient; // get ingridients
  let steps = req.body.steps; // get steps
  let difficulty = Number(req.body.difficulty); // get difficulty
  let username = req.session.user.username; //get username
  let email = req.session.user.email; //get email
  const existingTitle = await myRecipesModel.findUserRecipeTitle(email,title);
  let errorArr =[];
  let cleanIngredients=[];
  let cleanSteps=[];

  //cleaning up all the values
  title = title.trim();
  description = description.trim();
  if(ingredients){
  ingredients = ingredients.map(item => item.trim());
  cleanIngredients = ingredients.filter(item => item !== "");
  }
  if(steps){
  steps = steps.map(item => item.trim());
  cleanSteps = steps.filter(item => item !== ""); 
  }

  //check for any missing fields or duplicate
  if(!title){
    errorArr.push("Need a title")
  } else if(existingTitle){
    errorArr.push("Need a new title")
  }
  if (!description){
    errorArr.push("Need a description")
  }
  if (!difficulty){
    errorArr.push("Select a difficulty rating")
  }
  if (cleanSteps.length == 0) {
    errorArr.push("Insert at least one step")
  }
  if (cleanIngredients.length == 0){
    errorArr.push("Insert at least one ingredient")
  }
  

  //check if any field is empty
  //if empty, go back to create recipe page, else create the recipe
  if(errorArr.length > 0){ 
    
    let newrecipe={
      title: title,
      description: description,
      image: image,
      ingredients: cleanIngredients,
      steps: cleanSteps,
      difficulty: difficulty,
    }
    //console.log(newrecipe)
    res.render('create_recipe_ronald',{recipe:newrecipe,errorArr})
  }else{
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
    let result = await myRecipesModel.createRecipe(newRecipe)
    res.redirect("/recipes");
  } catch (error) {
    console.log(error)
  }
  }
}


//display edit recipes
exports.viewRecipes = async (req, res) => {
    let title = req.query.title;
    let email = req.session.user.email
    //console.log(title);

    try {
        let result = await myRecipesModel.findUserRecipeTitle(email,title)
        res.render("casper_editRecipe", { result })
    } catch (error) {
        console.error("unable to find recipe")
    }
}


//update recipes
exports.updateRecipes = async (req, res) => {
  let newDesc = req.body.description
  let newIngredients = req.body.ingredients
  let image = req.body.image
  let newSteps = req.body.steps
  let title = req.body.title
  let email = req.session.user.email
  

  try {
    let success = await myRecipesModel.editRecipes(title, email, newDesc, newIngredients, newSteps, image)
    console.log(`Success: ${success}`)
    res.redirect("/myRecipes")
  } catch (error) {
    console.error(error)
  }
}

