//Importing modules
const dotenv = require('dotenv');
const express = require("express");
const mongoose = require('mongoose');
const fs = require('fs');
const session = require('express-session');
dotenv.config({path: './config.env'})

const server = express();

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");


const secret = process.env.SECRET;
console.log(secret)
server.use(session({
    secret: secret, // sign the session ID cookie. should be a long, random, and secure string, preferably stored in an environment variable
    resave: false, // Prevents the session from being saved back to the session store if nothing has changed.
    saveUninitialized: false // Prevents a new, empty session from being saved to the store.
}));

server.use((req, res, next) => { // makes it so that every ejs file has access to the user session
    res.locals.user = req.session.user || null;
    next();
});

const authRoutes = require("./routes/ashrel_auth") //ash route
const recipesRoute = require("./routes/recipeRoute.js") //hadi route
const myRecipes = require("./routes/myRecipes(sm)") //sheng ming route
const index = require("./routes/test") //qr route
const cartRoute = require("./routes/cartRoutes.js") //qr cart route


server.use("/authentication", authRoutes);        // handles /login, /register ash part
server.use('/recipes', recipesRoute) //any path that starts with recipe, we wil send it to this route
server.use("/myRecipes", myRecipes)  //routes to recipe dashboard 
server.use("/cart",cartRoute) // routes to cart
server.use('/',index); //index must be last



// DataBase Set UP
// Specify the path to the environment variablef file 'config.env'
dotenv.config({ path: './config.env' }); 
// async function to connect to DB
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; // Define server hostname
  const port = 8000;// Define port number
 
  // Start the server and listen on the specified hostname and port
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}                                                                                                                 

// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);


