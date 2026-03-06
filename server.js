const express = require("express");
const server = express();
const path = require("path");

server.use("/", express.static(path.join(__dirname, "public")))
server.use(express.urlencoded({ extended: true }));

//Start of Express Router Code


//End of Express Router Code

const hostname = "127.0.0.1";
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
