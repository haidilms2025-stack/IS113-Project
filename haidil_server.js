
const express = require("express");
const server = express();

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");

const recipesRoute = require("./routes/recipeRoute.js")
server.use('/recipes', recipesRoute) //any path that starts with recipe, we wil send it to this route 

// END OF YOUR CODE HERE

const hostname = "localhost";
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
