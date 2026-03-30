
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
    email: {
        type: String,
        required: [true, 'A recipe must have user email']

    },
    avgRating: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        required: [true, 'A recipe must have username']
    }
});

const recipes = mongoose.model('recipes', recipeSchema, 'recipes');

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

const users = mongoose.model('users', userSchema, 'users');

//Put your functions below!!!!!!!!

// ------------------
// User Functions
// ------------------

// CREATE user (used in register)
exports.addUser = function (newUser) {
    return users.create(newUser)
    // inserts a new user document into MongoDB
}


// READ all users (used in login - your current approach)
exports.retrieveAll = function () {
    return users.find()
    // returns an array of all users in the collection
}


// READ one user by email (used in register + login)
exports.findUserByEmail = function (email) {
    return users.findOne({ email: email })
    // returns ONE user object if found, otherwise null
}
//delete user based on an email
exports.deleteUser = function(email){
    return users.deleteOne({email:email})
}
//update user username or password based on an email
//Update ONLY the fields inside updateData using $set, leave everything else unchanged cause they can update username or/and password
 exports.updateUser = function(email, updateData){
    return users.updateOne({ email: email }, { $set: updateData });
}


//Create recipes
exports.createRecipe = async function (newRecipe) {
    return recipes.create(newRecipe)
}

//Read all recipes
exports.getAllRecipes = function () {
    return recipes.find();
}

//Search recipes by title
exports.findRecipesByTitle = async function (title) {

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

exports.updateRating = function (recipeId, email, rating) {
    return recipes.updateOne(
        { _id: recipeId, "ratings.email": email }, //condition: find the recipe and the email coressponding to it
        { $set: { "ratings.$.rating": rating } } // set the rating to be the new rating
    );
}

exports.deleteRating = function(recipeId,email) {
    return recipes.updateOne(
    { _id: recipeId },
    { $pull: { ratings: { email: email } } }
  );
}

exports.hasUserRated = function (recipeId, email) {
    return recipes.findOne({
        _id: recipeId,
        "ratings.email": email
    });
};

exports.updateAverageRating = async function (recipeId) {
    const recipe = await recipes.findOne({
        _id: recipeId //Find the recipe to update
    }); 

    if (!recipe) {
        throw new Error("Recipe not found");
    }

    const ratingsArray = recipe.ratings; //get all the ratings from all the users

    let total = 0;

    for (let i = 0; i < ratingsArray.length; i++) { //for each rating, we add up the total
        total += ratingsArray[i].rating;
    }

    let avg = 0;

    if (ratingsArray.length > 0) {
        avg = total / ratingsArray.length; // we only calculate average if theres more than 1 rating
    }

    return recipes.updateOne(
        { _id: recipeId },
        { $set: { avgRating: avg } }
    );
};

//create recipe Ronald
exports.createRecipe = async function(newRecipe){
    return recipes.create(newRecipe)
}

//edit recipes casper
exports.editRecipes = function (title, email, description, ingredients, steps, image) {
    return recipes.updateOne({ title: title, email: email }, { description: description, ingredients: ingredients, steps: steps, image: image});
}

exports.findByTitle = (title) => {
    return recipes.findOne({ title: title })
}

exports.findRecipeByID = function (recipeID) {
    return recipes.findById(recipeID);  // Uses MongoDB's _id field
};


//add to favourites from recipes using email
exports.addToFavourites = async function (email, recipe) {
    return users.updateOne({ email: email }, { $push: { favourites: recipe } })
    //push the recipe into the favourites array of the user document with the matching email
};

//check if recipe is already in favourites
exports.isRecipeInFavourites = async function (email, recipeId) {
    try {
        console.log("Checking for duplicate - Email:", email, "RecipeId:", recipeId) //check if function is called with correct values

        const user = await users.findOne({ email: email }); // async function to search mongo for user with matching email

        if (!user || !user.favourites) {    //if user not found or user no favs, return false
            console.log("User not found or no favourites")
            return false;
        }

        // Compare recipe IDs as strings
        const isDuplicate = user.favourites.some(fav => //for a recipe in user's favs, 
            fav._id.toString() === recipeId // check if recipe id when turned to a string is same as recipe id being sent
        );

        console.log("Is duplicate?:", isDuplicate) //shows on console if its duplicate
        return isDuplicate;
    } catch (error) {
        console.error("Error in isRecipeInFavourites:", error)
        return false;
    }
};

exports.deleteFavourites = async (email, recipeId) => {
    try {
        console.log("Deleting recipe - Email:", email, "RecipeId:", recipeId) // check for correct vlaues 

        const result = await users.findOneAndUpdate( //find a user with same email, update 
            { email: email },
            { $pull: { favourites: { _id: new mongoose.Types.ObjectId(recipeId) } } }, // update by pulling the recipe with same id from the mongo array
            { new: true }
        );

        console.log("Delete result - User found?:", result !== null) // check if user is found
        if (result) {
            console.log("Remaining favourites count:", result.favourites?.length || 0) // check how many favs left
        }
        return result;
    } catch (error) {
        console.error("Error in deleteFavourites:", error)
        throw error;
    }
};

//delete recipe by title(sm)
exports.deleteRecipe = (title) => {
    return recipes.deleteOne({ title: title })
};

