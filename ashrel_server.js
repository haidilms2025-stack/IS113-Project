const express = require("express")

const authRoutes = require("./routes/ashrel_auth")

const app = express()

app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")

app.use("/",authRoutes)

app.listen(8000,()=>{
    console.log("Server running on port 8000")
})