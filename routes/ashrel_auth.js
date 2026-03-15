const express = require("express")
const router = express.Router()
const ashrel_authController = require("../controllers/ashrel_authController")



router.get("/register",ashrel_authController.displayRegister);
router.post("/register",ashrel_authController.registerSubmission);
router.get("/login",ashrel_authController.displayLogin);
router.post("/login",ashrel_authController.loginSubmission);


module.exports = router