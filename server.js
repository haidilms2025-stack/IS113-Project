//Importing modules
const express = require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

const server = express();

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");

const authRoutes = require("./routes/ashrel_auth") //ash route
const recipesRoute = require("./routes/recipeRoute.js") //hadi route
const myRecipes = require("./routes/myRecipes(sm)") //sheng ming route



server.use("/", authRoutes);        // handles /login, /register ash part
server.use('/recipes', recipesRoute) //any path that starts with recipe, we wil send it to this route
server.use("/myRecipes", myRecipes)  //routes to recipe dashboard 

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

const hostname = "localhost";
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
