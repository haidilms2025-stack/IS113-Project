const express = require("express")
const router = express.Router()
const ashrel_authController = require("../controllers/ashrel_authController")
const authMiddleware = require('../middleware/auth-middleware');


router.get("/register",ashrel_authController.displayRegister);
router.post("/register",ashrel_authController.registerSubmission);
router.get("/login",ashrel_authController.displayLogin);
router.post("/login",ashrel_authController.loginSubmission);
router.get('/logout', ashrel_authController.logout);
router.get('/update', authMiddleware.isLoggedIn, ashrel_authController.displayUpdate);
router.post('/update', authMiddleware.isLoggedIn, ashrel_authController.updateAccount);
router.get('/delete', authMiddleware.isLoggedIn, ashrel_authController.displayDelete);
router.post('/delete', authMiddleware.isLoggedIn, ashrel_authController.deleteAccount);
router.get('/admin-profile', authMiddleware.isAdmin, ashrel_authController.adminProfile);
module.exports = router