const userModel = require("../models/ashrel_userModel")


exports.displayRegister = (req,res)=>{
    res.render("ashrel_register",{error:null})
}

exports.registerSubmission = async(req,res)=>{

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    if(!username || !email || !password){ // if either field is empty or invalid show error
        return res.render("ashrel_register",{error:"All fields are required"})
    }

    if(password.length < 6){ // if password less than 6 char show error
        return res.render("ashrel_register",{error:"Password must be at least 6 characters"})
    }
    const users = await userModel.getUsers() // retreives user object from json file after convering it from json to js
    const existingUser = users.find(u => u.email === email) // finds from the users array if each user.email is already exisiting

    if(existingUser){ // if email is in user already gets error
        return res.render("ashrel_register",{error:"Email already registered"})
    }

    users.push({    // create each user as an object containing key: value pair of username,email,password
        username,
        email,
        password
    })
    await userModel.writeUsers(users) // writes registered users to users.json file
    res.redirect("/login") // brings you from register.ejs to login.ejs
}

exports.displayLogin = (req,res)=>{
    res.render("ashrel_login",{error:null})
}

exports.loginSubmission = async(req,res)=>{

    const email = req.body.email
    const password = req.body.password

    if(!email || !password){ //empty fields throw error
        return res.render("ashrel_login",{error:"All fields are required"})
    }
    const users = await userModel.getUsers() // retreives user object from json file after convering it from json to js
    const user = users.find(u => u.email === email) // finds from user object if account is created by checking if the email exists

    if(!user){ // if not in user array throw error
        return res.render("ashrel_login",{error:"User not found"})
    }

    if(user.password !== password){ //if password dont match throw error
        return res.render("ashrel_login",{error:"Incorrect password"})
    }


    res.redirect("/") //change this to index.ejs or index page
}