const express = require("express")
const session = require("express-session")

const authRoutes = require("./routes/ashrel_auth")

const app = express()

app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:"recipeSecret",
    resave:false,
    saveUninitialized:true
}))

app.set("view engine","ejs")

app.use("/",authRoutes)

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})