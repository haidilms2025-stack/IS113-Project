const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const { isAuthenticated } = require('../middleware/auth');

// POST route for /cart/add
router.post('/add', cartController.addToCart); //add isAuthenticated after middleware is done

// GET route for viewing cart
router.get('/', cartController.viewCart);

// POST route for removing items
// router.post('/remove', cartController.removeFromCart); 

module.exports = router;