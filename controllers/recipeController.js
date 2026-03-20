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

        res.render("recipes", { recipes, titlesearch:null, sort, isSearch:false});

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
    res.render("recipes", { recipes, titlesearch, sort, isSearch:true}); // Render the EJS form view and pass the recipes
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
