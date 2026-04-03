const cartModel = require("../models/cartModel");
const recipeModel = require("../models/recipeModel");

// Add recipe to cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.user._id; //References user 
        const recipeID = req.body.recipeId; //References Recipe
        const recipe = await recipeModel.findRecipeByID(recipeID);
        if (!recipe) {
            return res.redirect('back');
        }
        if (!recipe.ingredients || recipe.ingredients.length === 0) { //Error handling
            return res.redirect('back');
        }
        await cartModel.addRecipeToCart( //Passes recipe data to function
            userId, 
            recipe._id, 
            recipe.title, 
            recipe.ingredients
        );
        res.redirect('/cart'); //Displays the cart
    } catch (error) { 
        console.error('Error adding to cart:', error);
        res.redirect('back');
    }
};

// View cart 
exports.viewCart = async (req, res) => {
    try {
        const userID = req.session.user._id;
        const cartData = await cartModel.getCartGroupedByRecipe(userID);  //Organises cart by Recipe
        res.render('cart', { 
            recipes: cartData.recipes || [],
            totalItems: cartData.totalItems || 0, //Prevent null values
            user: req.session.user 
        });
    } catch (error) {
        console.error('Error viewing cart:', error);
        res.status(500).send('Error loading cart');
    }
};

// Remove entire recipe
exports.removeRecipe = async (req, res) => {
    try {
        const userID = req.session.user._id;
        const { recipeId } = req.body;
        await cartModel.removeRecipeFromCart(userID, recipeId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing recipe:', error);
        res.redirect('/cart');
    }
};

// Remove single item
exports.removeItem = async (req, res) => {
    try {
        const userID = req.session.user._id;
        const { itemId } = req.body;
        await cartModel.removeItemFromRecipe(userID, itemId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing item:', error);
        res.redirect('/cart');
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const userID = req.session.user._id;
        await cartModel.clearCart(userID);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.redirect('/cart');
    }
};