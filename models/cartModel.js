const mongoose = require('mongoose');

// Cart item schema
const cartItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    recipeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Recipe', 
        required: true 
    },
    recipeTitle: { type: String, required: true }
});

const shoppingListSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

const shoppingList = mongoose.models.shoppingList || mongoose.model('shoppingList', shoppingListSchema);

// Add recipe to cart
exports.addRecipeToCart = async (userID, recipeId, recipeTitle, ingredients) => {
    try {
        const cartItems = ingredients.map(ingredient => ({
            name: ingredient,
            recipeId: recipeId,
            recipeTitle: recipeTitle
        }));

        const cart = await shoppingList.findOneAndUpdate(
            { userID: userID },
            { $push: { items: { $each: cartItems } } },
            { upsert: true, returnDocument: 'after' }
        );
        return cart;
    } catch (error) {
        throw new Error(`Error adding recipe to cart: ${error.message}`);
    }
};

// Get cart grouped by recipe (using Object instead of Map)
exports.getCartGroupedByRecipe = async (userID) => {
    try {
        const cart = await shoppingList.findOne({ userID: userID });
        
        if (!cart) return { recipes: [] };
        
        const recipesObj = {};  // Using object instead of Map
        
        cart.items.forEach(item => {
            const recipeId = item.recipeId.toString();
            
            // If this recipe doesn't exist in the object, create it
            if (!recipesObj[recipeId]) {
                recipesObj[recipeId] = {
                    recipeId: item.recipeId,
                    recipeTitle: item.recipeTitle,
                    items: []
                };
            }
            
            // Add the item to the recipe's items array
            recipesObj[recipeId].items.push({
                name: item.name,
                itemId: item._id
            });
        });
        
        return {
            recipes: Object.values(recipesObj),  // Convert object to array
            totalItems: cart.items.length
        };
    } catch (error) {
        throw new Error(`Error getting cart: ${error.message}`);
    }
};

// Remove entire recipe from cart
exports.removeRecipeFromCart = async (userID, recipeId) => {
    try {
        const cart = await shoppingList.findOneAndUpdate(
            { userID: userID },
            { $pull: { items: { recipeId: recipeId } } },
            { returnDocument: 'after' }
        );
        return cart;
    } catch (error) {
        throw new Error(`Error removing recipe: ${error.message}`);
    }
};

// Remove single item from a recipe
exports.removeItemFromRecipe = async (userID, itemId) => {
    try {
        const cart = await shoppingList.findOneAndUpdate(
            { userID: userID },
            { $pull: { items: { _id: itemId } } },
            { returnDocument: 'after' }
        );
        return cart;
    } catch (error) {
        throw new Error(`Error removing item: ${error.message}`);
    }
};

// Clear entire cart
exports.clearCart = async (userID) => {
    try {
        const cart = await shoppingList.findOneAndUpdate(
            { userID: userID },
            { $set: { items: [] } },
            { returnDocument: 'after' }
        );
        return cart;
    } catch (error) {
        throw new Error(`Error clearing cart: ${error.message}`);
    }
};

// Display cart (simple version)
exports.displayCart = async (userID) => {
    try {
        return await shoppingList.findOne({ userID: userID });
    } catch (error) {
        throw new Error(`Error displaying cart: ${error.message}`);
    }
};