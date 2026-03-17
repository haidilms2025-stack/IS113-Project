const userModel = require("../models/recipeModel") // import the model file so we can access database functions


// renders the register page
exports.displayRegister = (req,res)=>{
    res.render("ashrel_register",{error:null}) // render register.ejs and pass error variable (null by default)
}


// handles form submission from the register page
exports.registerSubmission = async(req,res)=>{

    // retrieve values sent from the HTML form (req.body comes from POST form submission)
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    // validation: check if any field is empty
    if(!username || !email || !password){
        return res.render("ashrel_register",{error:"All fields are required"})
        // return stops the function so the rest of the code does not run
    }

    // validation: password must be at least 6 characters
    if(password.length < 6){
        return res.render("ashrel_register",{error:"Password must be at least 6 characters"})
    }

    try{

        // call database function to check if a user with this email already exists
        const existingUser = await userModel.findUserByEmail(email)
        // await pauses execution until the database query finishes

        // if a user is found, show error on the same register page
        if(existingUser){
            return res.render("ashrel_register",{error:"Email already registered"})
        }

        // create a new user in the database
        await userModel.addUser({ username, email, password })
        // this inserts the user document into the MongoDB users collection

        // after successful registration redirect user to login page
        res.redirect("/login")

    } catch(error){
        // catch runs if something fails during database operations
        console.error(error) // prints error in terminal for debugging
        res.send("error in registerSubmission") // send simple error response
    }
}   


// renders login page
exports.displayLogin = (req,res)=>{
    res.render("ashrel_login",{error:null}) // show login.ejs with no error initially
}


// handles login form submission
exports.loginSubmission = async(req,res)=>{

    // get login credentials from form
    const email = req.body.email
    const password = req.body.password

    // validation: check if user left fields empty
    if(!email || !password){
        return res.render("ashrel_login",{error:"All fields are required"})
    }

    try {
       
        // retrieve all users from database
        let users = await userModel.retrieveAll()
        // retrieveAll() returns an array of user objects

        // search the array to find a user with matching email
        const user = users.find(u => u.email === email)
        // .find() returns the first matching user or undefined if none found

        // if no user with that email exists
        if(!user){
            return res.render("ashrel_login",{error:"User not found"})
        }

        // check if password matches the stored password
        if(user.password !== password){
            return res.render("ashrel_login",{error:"Incorrect password"})
        }

        // if login successful redirect to homepage
        res.redirect("/")

    } catch (error) {

        // if database retrieval fails
        console.error(error); // log error in terminal
        res.send("Error reading database"); // send error response
    }
}