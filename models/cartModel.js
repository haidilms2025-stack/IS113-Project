const fs = require("node:fs/promises"); 
const filePath = "data/recipes.json";
const mongoose = require('mongoose');
const { ObjectId } = require("mongodb");

// Create Schema
const shoppingListSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: Array, default: [] },
});

// Check if model exists before creating (prevents OverwriteModelError)
const shoppingList = mongoose.models.shoppingList || mongoose.model('shoppingList', shoppingListSchema, 'shoppingList');

// Display cart
exports.displayCart = async (userID) => {
    try {
        const cart = await shoppingList.findOne({ userID: userID });
        return cart;
    } catch (error) {
        throw new Error(`Error displaying cart: ${error.message}`);
    }
};

// Add items to cart
exports.addItems = async (userID, itemsArray) => {
    try {
        const cart = await shoppingList.findOneAndUpdate(
            { userID: userID },
            { 
                $push: { 
                    items: { $each: itemsArray }
                } 
            },
            { upsert: true, returnDocument: 'after' }
        );
        return cart;
    } catch (error) {
        throw new Error(`Error adding items: ${error.message}`);
    }
};

// Delete item from cart
exports.deleteItem = async (userID, itemName) => {
    try {
        const cart = await shoppingList.findOneAndUpdate(
            { userID: userID },
            { $pull: { items: itemName } },
            { returnDocument: 'after' }
        );
        return cart;
    } catch (error) {
        throw new Error(`Error deleting item: ${error.message}`);
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