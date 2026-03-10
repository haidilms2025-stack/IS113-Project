const express = require("express")
const router = express.Router()

// temporary fake user
let users = []

// REGISTER PAGE
router.get("/register",(req,res)=>{
    res.render("ashrel_register",{error:null})
})


// REGISTER
router.post("/register",(req,res)=>{

    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.render("ashrel_register",{error:"All fields are required"})
    }

    if(password.length < 6){
        return res.render("ashrel_register",{error:"Password must be at least 6 characters"})
    }

    const existingUser = users.find(u => u.email === email)

    if(existingUser){
        return res.render("ashrel_register",{error:"Email already registered"})
    }

    users.push({
        username,
        email,
        password
    })

    res.redirect("/login")
})


// LOGIN PAGE
router.get("/login",(req,res)=>{
    res.render("ashrel_login",{error:null})
})


// LOGIN
router.post("/login",(req,res)=>{

    const {email,password} = req.body

    if(!email || !password){
        return res.render("ashrel_login",{error:"All fields are required"})
    }

    const user = users.find(u => u.email === email)

    if(!user){
        return res.render("ashrel_login",{error:"User not found"})
    }

    if(user.password !== password){
        return res.render("ashrel_login",{error:"Incorrect password"})
    }

    req.session.user = user

    res.redirect("/")
})

module.exports = router