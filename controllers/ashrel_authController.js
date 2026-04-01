const userModel = require("../models/recipeModel") // import the model file so we can access database functions
const bcrypt = require('bcrypt');

// renders the register page
exports.displayRegister = (req, res) => {
    res.render("ashrel_register", { error: null }) // render register.ejs and pass error variable (null by default)
}


// handles form submission from the register page
exports.registerSubmission = async (req, res) => {

    // retrieve values sent from the HTML form (req.body comes from POST form submission)
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let role = req.body.role
    let hashPassword = await bcrypt.hash(password, 10)

    // validation: check if any field is empty
    if (!username || !email || !password) {
        return res.render("ashrel_register", { error: "All fields are required" })
        // return stops the function so the rest of the code does not run
    }

    // validation: password must be at least 6 characters
    if (password.length < 6) {
        return res.render("ashrel_register", { error: "Password must be at least 6 characters" })
    }
    let newUser = { // create a new user in the database
        //the keys must correspond to the fields in Model's schema
        username: username,
        email: email,
        password: hashPassword,
        role: role

    }


    try {

        // call database function to check if a user with this email already exists
        const existingUser = await userModel.findUserByEmail(email)
        // await pauses execution until the database query finishes

        // if a user is found, show error on the same register page
        if (existingUser) {
            return res.render("ashrel_register", { error: "Email already registered" })
        }

        // this inserts the user document into the MongoDB users collection
        await userModel.addUser(newUser)

        // after successful registration redirect user to login page
        res.redirect("/authentication/login")

    } catch (error) {
        // catch runs if something fails during database operations
        console.error(error) // prints error in terminal for debugging
        res.send("error in registerSubmission") // send simple error response
    }
}


// renders login page
exports.displayLogin = (req, res) => {
    res.render("ashrel_login", { error: null }) // show login.ejs with no error initially
}


// handles login form submission
exports.loginSubmission = async (req, res) => {

    // get login credentials from form
    let email = req.body.email
    let password = req.body.password


     if (!email || !password) {
            return res.render("ashrel_login", { error: "All fields are required" })
        }
    try {
        // validation: check if user left fields empty
        let user = await userModel.findUserByEmail(email)
       

        // if no user with that email exists
        if (!user) {
            return res.render("ashrel_login", { error: "User not found" })
        }

        // check if password matches the stored password
        let match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render("ashrel_login", { error: "Incorrect password" })
        }
        req.session.user = {
            _id: user._id, 
            username:user.username,
            email:user.email,
            role: user.role
        }
        if (user.role == 'admin') {
            return res.render("ashrel_admin_profile", {user: req.session.user});
        }
        else {
            return res.redirect('/');
        }

       

    } catch (error) {

        // if database retrieval fails
        console.error(error); // log error in terminal
        res.send("Error reading database"); // send error response
    }
}

exports.logout = (req, res) => { //logout function to logout the person from the account
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.send("Error logging out");
        }
        res.redirect("/"); // go back to homepage
    });
};
exports.displayUpdate = (req,res) =>{ //displays update account page
     res.render("ashrel_update", { error: null });
};
exports.updateAccount = async (req, res) => {

    // get the logged-in user's email from session (used to identify which user to update)
    let email = req.session.user.email; 

    // get new username from form, trim removes extra spaces
    let username = req.body.username?.trim();

    // get new password from form, trim removes extra spaces
    let password = req.body.password?.trim();

    // validation: if both fields are empty, show error
    if (!username && !password) {
        return res.render("ashrel_update", { error: "At least one field must be filled" });
    }

    try {

        // create an empty object to store fields that need updating
        let updateData = {};

        // if user provided a new username, add it to updateData
        if (username) {
            updateData.username = username;
        }

        // if user provided a new password
        if (password) {

            // validate password length
            if (password.length < 6) {
                return res.render("ashrel_update", { error: "Password must be at least 6 characters" });
            }

            // import bcrypt to hash password securely
            const bcrypt = require('bcrypt');

            // hash the password before storing in database
            updateData.password = await bcrypt.hash(password, 10);
        }

        // call model function to update user in database
        // $set will update only the fields inside updateData
        await userModel.updateUser(email, updateData);

        // update session so UI (e.g. navbar username) updates immediately
        if (username) {
            req.session.user.username = username;
        }

        // render success page after update
        return res.render("ashrel_update_success");

    } catch (error) {

        // log error in terminal for debugging
        console.error(error);

        // show error message on update page if something fails
        return res.render("ashrel_update", { error: "Error updating account" });
    }
};
exports.displayDelete = (req,res) => { //displays delete account page
    res.render("ashrel_delete", {error: null});
};
// handle deletion
exports.deleteAccount = async (req, res) => {
    let email = req.session.user.email;

    try {
        // delete all recipes user created
        let deletedRecipes = await userModel.deleteAllRecipes(email);
        console.log(`Delted recipes: ${deletedRecipes}`);

        // delete user from database
        await userModel.deleteUser(email);
        console.log(`Deleted user: ${email}`)
        
        // destroy session after deletion
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.send("Error deleting account");
            }

            // show success page
            return res.render("ashrel_delete_success");
        });

    } catch (error) {
        console.error(error);
        return res.render("ashrel_delete", { error: "Error deleting account" });
    }
};
exports.adminProfile = (req, res) => {
    
    // render admin page
    res.render('ashrel_admin_profile', {
        user: req.session.user
    });
};