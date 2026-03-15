const recipeModel = require("../models/recipeModel")

exports.displayRecipes = async (req,res) => {
    
    //Haidil's Code goes here
    const recipes = await recipeModel.getAllRecipes();
    res.render('recipes', {recipes});
}

exports.filterRecipes = async (req,res) => {
    // Haidil's Code goes here

}

exports.addRecipes = async (req,res) => {

    //Ronald's Code goes here
   
}

exports.editRecipes = async(req,res) => {

    //Casper's Code goes here
}

