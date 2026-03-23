
const fs = require("node:fs/promises"); 
const filePath = "data/recipes.json";
const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");

// exports.getAllRecipes = async () => {

//     try {
//         let recipes = []
//         const jsonData = await fs.readFile(filePath,"utf-8");
//         if (jsonData){
//             recipes = JSON.parse(jsonData);
//         }
//         return recipes
//     }catch (error){
//         console.error("Error reading JSON from file:",error)
//     }
    
// //return recipes
// }

//DB for Recipes
const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A recipe must have a title']
        
    },
    description: {
        type: String,
        required: [true, 'A recipe must have a description']
        
    },
    image: {
        type: String, //not required
    },
    ingredients: {
        type: Array,
        required: [true, 'A recipe must have ingredients']
    },
    steps: {
        type: Array,
        required: [true, 'A recipe must have steps']
    },
    difficulty: {
        type: Array,
        required: [true, 'A recipe must have a difficulty']
    },
    rating: {
        type: Array
    },
    email:{
        type:String,
        required: [true, 'A recipe must have user email']

    },
    username:{
        type:String,
        required:[true, 'A recipe must have username']
    }
});

const recipes = mongoose.model('recipes', recipeSchema,'recipes');

//DB For users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A user must have a username'],
        
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true
        
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
    }
});

const users = mongoose.model('users', userSchema,'users');

//Put your functions below!!!!!!!!

// ------------------
// User Functions
// ------------------

// CREATE user (used in register)
exports.addUser = function(newUser){
    return users.create(newUser)
    // inserts a new user document into MongoDB
}


// READ all users (used in login - your current approach)
exports.retrieveAll = function(){
    return users.find()
    // returns an array of all users in the collection
}


// READ one user by email (used in register + login)
exports.findUserByEmail = function(email){
    return users.findOne({ email: email })
    // returns ONE user object if found, otherwise null
}

exports.getAllRecipes = function (){
    return recipes.find();
}

exports.addRating = function(recipeId, rating){
    return recipes.updateOne(
        { _id: new ObjectId(recipeId) },
        { $push: { rating: rating } }
    );
};

exports.updateAverageRating = async function(recipeId){
    const recipe = await recipes.findOne({
        _id: new ObjectId(recipeId)
    });

    const ratings = recipe.rating || [];

    let avg = 0;
    if (ratings.length > 0) {
        avg = ratings.reduce((a,b) => a + b, 0) / ratings.length;
    }

    return recipes.updateOne(
        { _id: new ObjectId(recipeId) },
        { $set: { rating: avg } }
    );
};

exports.findRecipesByTitle = async function(title) {
    
    //we need to wait first for database to find all the recipes first
   let allRecipes = await recipes.find(); 
   //once we get all recipes, we will convert each recipe in database to lowercase and compare from there
    return allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(title.toLowerCase())
    );
}

//edit recipes casper
exports.editRecipes = async function(email, userName, newDesc, newIngredients, newSteps) {
    return recipes.updateOne({email, userName}, {newDesc, newIngredients, newSteps});
} //does this one work?


//delete recipe by title(sm)
exports.deleteRecipe = (title) => {
    return recipes.deleteOne({title: title})
}

//Create DB for Shopping List

//session element
const shoppingListSchema = new mongoose.Schema({
  email: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: Array},
});

const shoppingList = mongoose.model('shoppingList',shoppingListSchema,'shoppingList')
