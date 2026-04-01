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


//delete selected recipes by title from user dashboard
exports.removeRecipe = async(req, res) => {
    let titles = normalizeToArray(req.body.titles)
    let email = req.session.user.email
    console.log(titles)
    
    if (titles.length == 0){
        return res.redirect("/myRecipes")
    }
    
    try {
        for (let title of titles) {
            let success = await myRecipesModel.deleteRecipe(title, email)
            console.log(success)
        }
        res.redirect("/myRecipes")
    
    } catch(error) {
        console.error(error)
    }
}


//add recipe code
exports.showCreateRecipe = (req, res) => {
  let recipe={
    ingredients:[],
    steps:[]
  }
  res.render('create_recipe_ronald',{recipe})
}

exports.addRecipes = async (req, res) => {
  let title = req.body.title;// get title
  let description = req.body.description;// get description
  let image = req.body.image;// get image
  let ingredients = req.body.ingredient; // get ingridients
  let steps = req.body.steps;// get steps
  let difficulty = req.body.difficulty
  let username = req.session.user.username
  let email = req.session.user.email

  //cleaning up ingredients and steps arrays
  ingredients = ingredients.map(item => item.trim());
  const cleanIngredients = ingredients.filter(item => item !== "");
  steps = steps.map(item => item.trim());
  const cleanSteps = steps.filter(item => item !== "");

  if(!title || !description || !difficulty ||cleanSteps.length == 0 ||cleanIngredients.length == 0){
    let newrecipe={
      title: title,
      description: description,
      image: image,
      ingredients: cleanIngredients,
      steps: cleanSteps,
      difficulty: difficulty,
    }
    console.log(newrecipe)
    res.render('create_recipe_ronald',{recipe:newrecipe})
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


//edit recipe
exports.viewRecipes = async (req, res) => {
    let title = req.query.title;
    console.log(title);

    try {
        let result = await myRecipesModel.findByTitle(title)
        res.render("casper_editRecipe", { result })
    } catch (error) {
        console.error("unable to find recipe")
    }
}


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

