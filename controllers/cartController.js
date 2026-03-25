const cartModel = require("../models/cartModel");
const recipeModel = require("../models/recipeModel");

exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const recipeID = req.body.recipeId;
        
        // Get recipe with ingredients
        const recipe = await recipeModel.findRecipeByID(recipeID);
        console.log('Recipe ID from form:', recipeID);
        
        if (!recipe) {
            console.log('recipe no have')
            return res.redirect('');
        }
        
        // Add ingredients to cart
        const updatedCart = await cartModel.addItems(userId, recipe.ingredients);
        
        // Redirect to cart page
        res.redirect('/cart');
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.redirect('');
    }
};

exports.viewCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const userID = req.session.user._id;
        const cart = await cartModel.displayCart(userID);
        
        res.render('cart', { 
            cart: cart || { items: [] },
            user: req.session.user
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading cart');
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const userID = req.session.user._id;
        const itemName = req.body.item;  // Get item name from form
        console.log(itemName)
        if (!itemName) {
            return res.redirect('/cart');
        }
        
        await cartModel.deleteItem(userID, itemName);
        
        res.redirect('/cart');
        
    } catch (error) {
        console.error('Error removing item:', error);
        res.redirect('/cart');
    }
};

exports.clearCart = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const userID = req.session.user._id;
        
        await cartModel.clearCart(userID);
        
        res.redirect('/cart');
        
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.redirect('/cart');
    }
};

