
const fs = require("node:fs/promises"); 
const filePath = "data/recipes.json";
exports.getAllRecipes = async () => {
    //this is an asynchronous function as it contains file read operation
//     const recipes = [
// {
//     id: 1,
//     title: "Spaghetti Carbonara",
//     description: "Creamy Italian pasta with bacon",
//     ingredients: "Pasta, Eggs, Bacon, Cheese",
//     image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
// },
// {
//     id: 2,
//     title: "Margherita Pizza",
//     description: "Classic tomato and mozzarella pizza",
//     ingredients: "Flour, Tomato Sauce, Mozzarella",
//     image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
// }
// ]
    try {
        let recipes = []
        const jsonData = await fs.readFile(filePath,"utf-8");
        if (jsonData){
            recipes = JSON.parse(jsonData);
        }
        return recipes
    }catch (error){
        console.error("Error reading JSON from file:",error)
    }
    
//return recipes
    
}

