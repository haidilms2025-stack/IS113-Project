const userModel = require("../models/recipeModel")


exports.displayRegister = (req,res)=>{
    res.render("ashrel_register",{error:null})
}

exports.registerSubmission = async(req,res)=>{

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    if(!username || !email || !password){
        return res.render("ashrel_register",{error:"All fields are required"})
    }

    if(password.length < 6){
        return res.render("ashrel_register",{error:"Password must be at least 6 characters"})
    }

    try{
        const existingUser = await userModel.findUserByEmail(email)
        if(existingUser){
            return res.render("ashrel_register",{error:"Email already registered"})
        }
        await userModel.addUser({ username, email, password })

        res.redirect("/login")

    } catch(error){
        console.error(error)
        res.send("error in registerSubmission")
    }
}   

exports.displayLogin = (req,res)=>{
    res.render("ashrel_login",{error:null})
}

exports.loginSubmission = async(req,res)=>{

    const email = req.body.email
    const password = req.body.password

    if(!email || !password){
        return res.render("ashrel_login",{error:"All fields are required"})
    }

    try {
       
        let users = await userModel.retrieveAll()

        const user = users.find(u => u.email === email)

        if(!user){
            return res.render("ashrel_login",{error:"User not found"})
        }

        if(user.password !== password){
            return res.render("ashrel_login",{error:"Incorrect password"})
        }

        res.redirect("/")

    } catch (error) {
        console.error(error);
        res.send("Error reading database");
    }
}