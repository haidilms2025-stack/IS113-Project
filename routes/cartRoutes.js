const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isLoggedIn } = require('../middleware/auth-middleware');

router.use(isLoggedIn);

// POST route for /cart/add
router.post('/add',cartController.addToCart);

// GET route for viewing cart
router.get('/',cartController.viewCart);

// POST route for removing items
router.post('/remove',cartController.removeFromCart); 

// POST route for clearing cart
router.post('/clear',cartController.clearCart);       

module.exports = router;