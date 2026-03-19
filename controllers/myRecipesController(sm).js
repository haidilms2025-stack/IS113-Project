const fs = require("node:fs/promises")
const myRecipesModel = require("../models/recipeModel.js")
const { deleteModel } = require("mongoose")


exports.displayRecipes = async (req, res) => {
    try{
        let users = await myRecipesModel.retrieveAll()
        console.log(users)
        console.log("")
        // use as placeholder until a way to make user stay logged in is found

        let userEmail = "bloodster35@gmail.com"
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



function normalizeToArray(v) {
  // Nothing selected → empty array
  if (v === undefined || v === null) return [];

  // If already an array, keep it.
  // Otherwise, wrap the single value in an array.
  return Array.isArray(v) ? v : [v];
}



exports.removeRecipe = async(req, res) => {
    let titles = normalizeToArray(req.body.titles)
    console.log(titles)
    
    if (titles.length == 0){
        return res.redirect("/myRecipes")
    }
    
    try {
        for (let title of titles) {
            let success = await myRecipesModel.deleteRecipe(title)
            console.log(success)
        }
        res.redirect("/myRecipes")
    
    } catch(error) {
        console.error(error)
    }
}



