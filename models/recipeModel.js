
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
    ratings: {
        type: [
        {
            email: String,   // store email here
            rating: Number
        }
    ],
    default: []
    },
    email:{
        type:String,
        required: [true, 'A recipe must have user email']

    },
    avgRating: {
        type: Number,
        default: 0
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
    },
    role: {
        type: String,
        required: [true, 'A user must have a role']
    },
    favourites: {
        type: Array
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

//Create recipes
exports.createRecipe = async function(newRecipe){
    return recipes.create(newRecipe)
}

//Read all recipes
exports.getAllRecipes = function (){
    return recipes.find();
}

//Find recipes by title
exports.findRecipesByTitle = async function(title) {
    
    //we need to wait first for database to find all the recipes first
   let allRecipes = await recipes.find(); 
   //once we get all recipes, we will convert each recipe in database to lowercase and compare from there
    return allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(title.toLowerCase())
    );
}

exports.addRating = function (recipeId, email, rating) {
    return recipes.updateOne(
        { _id: recipeId },
        {
            $push: {
                ratings: {
                    email: email,
                    rating: rating
                }
            }
        }
    );
};

exports.hasUserRated = function (recipeId, email) {
    return recipes.findOne({
        _id: recipeId,
        "ratings.email": email
    });
};

exports.updateAverageRating = async function(recipeId){
    const recipe = await recipes.findOne({ 
        _id: recipeId //Find the record where _id = recipeId
    }); // check the databse and find recipe based on RecipeID, and store it in recipe variable

    if (!recipe) {
        throw new Error("Recipe not found");
    }

    const ratingsArray = recipe.ratings; 

    let total = 0;

    for (let i = 0; i < ratingsArray.length; i++) {
        total += ratingsArray[i].rating;
    }

    let avg = 0;

    if (ratingsArray.length > 0) {
        avg = total / ratingsArray.length;
    }

    return recipes.updateOne(
        { _id: recipeId },
        { $set: { avgRating: avg } }
    );
};


//edit recipes casper
exports.editRecipes = function(title, email, description, ingredients, steps) {
    return recipes.updateOne({title: title, email: email}, {description : description, ingredients: ingredients, steps: steps});
}

exports.findByTitle = (title) => {
    return recipes.findOne({title: title})
}

// exports.findRecipeByID = function(recipeID) {
//     return recipes.findById(recipeID);  // Uses MongoDB's _id field
// };


//add to favourites from recipes using email
exports.addToFavourites = async function(email, recipe) {
    return users.updateOne({email:email}, {$push: {recipe: recipe}})
};

exports.deleteFavourites = async (email, favName) => {
    return users.findOneAndUpdate(
            {email: email },
            { $pull: { favourites: favName } },  // Pull matching string from array
            { new: true });
};

//delete recipe by title(sm)
exports.deleteRecipe = (title) => {
    return recipes.deleteOne({title: title})
};

