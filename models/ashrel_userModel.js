const fs = require("node:fs/promises"); 
const filePath = "data/ashrel_users.json";

exports.getUsers = async() =>{ // reading the user.json file and converting json data in js object
    const jsonData = await fs.readFile(filePath,"utf-8");
    const data = JSON.parse(jsonData); //convert json text from json file into js object
    return data;
}
exports.writeUsers = async(users) =>{ // writing to the file the user object
    const jsonData  = JSON.stringify(users, null, 2); //convert js object into json text to write to json file
    await fs.writeFile(filePath, jsonData);
    

}