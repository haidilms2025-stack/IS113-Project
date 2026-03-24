exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/authentication/login');
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/authentication/login');
    }
    if (req.session.user.role !== "admin") {
        console.log("Not an admin user, redirecting to /");
        return res.redirect('/');
    }
    next();
}