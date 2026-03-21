
const fs = require("node:fs/promises"); 
const filePath = "data/recipes.json";
const mongoose = require('mongoose');

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
}


//delete recipe by title(sm)
exports.deleteRecipe = (title) => {
    return recipes.deleteOne({title: title})
}

//Create DB for Shopping List
const shoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 1 },
  unit: { type: String, trim: true },
});

const items = mongoose.model('items',shoppingItemSchema,'items')

// below is not confirmed yet, need to know how to have indiv list for logged in user
const shoppingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: String,
  items: [shoppingItemSchema],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] //do we want this function? hmm
});

const shoppingList = mongoose.model('shoppingList',shoppingListSchema,'shoppingList')
