const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isLoggedIn } = require('../middleware/auth-middleware');

router.use(isLoggedIn);

router.post('/add', cartController.addToCart);
router.get('/', cartController.viewCart);
router.post('/remove-recipe', cartController.removeRecipe);
router.post('/remove-item', cartController.removeItem);
router.post('/clear', cartController.clearCart);

module.exports = router;