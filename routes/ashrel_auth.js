const express = require("express")
const router = express.Router()

// temporary fake user change when got database
let users = []

// REGISTER PAGE renders register page is empty
router.get("/register",(req,res)=>{
    res.render("ashrel_register",{error:null})
})


// REGISTER
router.post("/register",(req,res)=>{

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    if(!username || !email || !password){ // if either field is empty or invalid show error
        return res.render("ashrel_register",{error:"All fields are required"})
    }

    if(password.length < 6){ // if password less than 6 char show error
        return res.render("ashrel_register",{error:"Password must be at least 6 characters"})
    }

    const existingUser = users.find(u => u.email === email) // finds from the users array if each user.email is already exisiting

    if(existingUser){ // if email is in user already gets error
        return res.render("ashrel_register",{error:"Email already registered"})
    }

    users.push({    // create each user as an object containing key: value pair of username,email,password
        username,
        email,
        password
    })

    res.redirect("/login") // brings you from register.ejs to login.ejs
})


// LOGIN PAGE renders login page as empty
router.get("/login",(req,res)=>{
    res.render("ashrel_login",{error:null})
})


// LOGIN
router.post("/login",(req,res)=>{

    const email = req.body.email
    const password = req.body.password

    if(!email || !password){ //empty fields throw error
        return res.render("ashrel_login",{error:"All fields are required"})
    }

    const user = users.find(u => u.email === email) // finds from user array if account is created

    if(!user){ // if not in user array throw error
        return res.render("ashrel_login",{error:"User not found"})
    }

    if(user.password !== password){ //if password dont match throw error
        return res.render("ashrel_login",{error:"Incorrect password"})
    }


    res.redirect("/index.ejs") //change this if the file name changes
})

module.exports = router