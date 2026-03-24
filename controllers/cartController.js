const cartModel = require("../models/recipeModel")

exports.addToCart = async(req,res) =>{
    userId = req.body.id //have to make changes to ejs
    userCart = cartModel.displayCart(userId)
    res.render(userCart)
}