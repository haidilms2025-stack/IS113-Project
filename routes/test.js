const express = require('express');
const router = express.Router();
const displayPage = require("../controllers/index");
router.get("/", displayPage.displayPage);
router.get("/about",displayPage.displayAbout);


router.get('/debug-session', (req, res) => {
    if (req.session.user) {
        res.json({
            loggedIn: true,
            user: req.session.user,
            userId: req.session.user._id,
            userIdType: typeof req.session.user._id
        });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router

