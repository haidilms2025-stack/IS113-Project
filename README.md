## Recipe Page

A full-stack web application for users to view food recipes, rate & comment on recipes, and save their favourites. Users can also upload their own food recipes, and parse the ingredients they want into a Shopping Cart!

## Features

- **Food Recipe Page**: View a wide selection of recipes!
- **Customer Reviews**: Feel free to comment and rate the many recipes on our page!
- **Upload recipes**: Upload your own recipes for the world to enjoy!
- **Manage Recipes**: Not satisfied with your recipes? You can amend them!

-**Search Bar**: Search for your favourite foods!

-**Sorting**: Sort the page by author’s name of your recipe, difficulty level, or ratings!

- **Favorite Recipes**:  Have recipes that you simply love? Favourite them!

-**Shopping Cart**: Have a bunch of recipes you want to cook? Add ingredients from various recipes into your shopping list, and use it on your next trip to the store!

- **User Account**: Create User Account and Log In/Out

## Tech Stack

- **Backend**: Express.js with MVC architecture, Bcrypt for passwords
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML
- **Templates**: EJS
- **Environment**: Node.js

## Project Structure

IS113-Project/
├── controllers/          # MVC Controllers
│   ├── ashrel_authController.js
│   ├── cartController.js
│   ├── index.js
│   ├── myRecipesController(sm).js
│   └── recipeController.js
├── middleware/           # Utility functions
│   └── auth-middleware.js
├── models/               # MongoDB Models
│   ├── cartModel.js
│   └── recipeModel.js
├── routes/               # Express Routes
│   ├── ashrel_auth.js
│   ├── cartRoutes.js
│   ├── myRecipes(sm).js
│   ├── recipeRoute.js
│   └── test.js
├── views/                # EJS Templates
│   ├── ashrel_admin_profile.ejs
│   ├── ashrel_delete_success.ejs
│   ├── ashrel_delete.ejs
│   ├── ashrel_login.ejs
│   ├── ashrel_register.ejs
│   ├── ashrel_update_success.ejs
│   ├── ashrel_update.ejs
│   ├── cart.ejs
│   ├── casper_editRecipe.ejs
│   ├── create_recipe_ronald.ejs
│   ├── favourites.ejs
│   ├── index.ejs
│   ├── myRecipes(sm).ejs
│   ├── recipe-detail.ejs
│   ├── recipes.ejs
│   └── ronald_Create_Recipe.ejs
├── config.env            # Environment variables
├── package.json
├── package-lock.json
├── README.md
└── server.js             # Main application file

## Installation & Setup Guide

1. Clone & Install

   git clone `<your-repo-url>`

   cd IS113-Project
2. Install dependencies

   npm install

   npm install bcrypt

   npm install dotenv

   npm install ejs

   npm install express

   npm install express-session

   npm install mongoose

   npm install nodemon
3. Set up MongoDB

   Install MongoDB locally or use MongoDB Atlas

   Ensure IP address is whitelisted to connect to the server.

   Paste connection string in config.env file into MongoDB to connect to the database.
4. Start the application

   npm start

    npm run dev

5. Open your browser

    http://localhost:3000

## Usage

### For Customers

1. **Account Creation**: Click on Get Started to register for a new account. You can choose to sign up for either an admin account or normal user account
2. **Login**: Click on ‘Login’ to login to your own account. If you are an admin, admin user page will be displayed and an indicator will be shown at the top of the task bar
3. **Manage Accounts**: Users can choose to update or delete their account username and password or delete their account by clicking on the respective buttons. Once account details are updated or deleted, the success page will be displayed.
4. **Browse Recipes**: Visit the home page and click on ‘View Recipes’ to browse all created recipes.The users can search for recipes with the search being case insensitive. The users can also sort recipe results by title, difficulty or rating.
5. **Recipe Features**: For each recipe, the users can view more details about the recipe when they click on ‘View’. They users are able to give a rating from 1 to 5 stars, update their ratings and delete their ratings. The users can also add or remove favourite recipes with a dashboard displaying their favourite recipes. The users can also leave a review for the recipe or delete and update their existing reviews. They can also view the reviews left by other users.
6. **Shopping Cart** : The users can add all their specified recipe’s ingredients to their own shopping list. This shopping list shows all recipe ingredients, organised by recipe, which they can dynamically remove. Users can delete specified ingredients,recipes, or the entire list from their cart.
7. **Manage Individual Recipe**: Users can Click on either Dashboard at the top or Manage My Recipes to access the dashboard showing the recipes they created. Users can click on +Create New Recipe to go to create recipe page where they can give it a title, description, difficulty rating, image url, ingredients and steps. Users can click on Edit on each of their created recipes to edit recipe image url, description, ingredients and steps. Users can also delete selected recipes from the dashboard.

## For Developers

- **Models**: Define data structures in the `models/` directory
- **Controllers**: Handle business logic in the `controllers/` directory
- **Routes**: Define API endpoints in the `routes/` directory
- **Views**: Create EJS templates in the `views/` directory
- **Middleware**: Handle authentication in the `middleware/` directory

## API Endpoints/Routes

### Recipes

- 'GET/recipes' - Display all recipes in the menu page
- ‘POST /recipes - For searching specific recipes
- ‘POST /recipes/rate - For updating recipe’s ratings (add/update/delete rating)
- ‘GET /recipes/favourites - Display the logged in user’s favourite recipe
- ‘POST /recipes/favourites - For adding/updating new user’s favourite recipes
- ‘POST /recipes/delete-favourites - For deleting a specific favourited recipe from favourites page
- ‘POST /recipes/review - For updating recipe’s review (add/update/delete review)

### Cart

- 'GET/cart' - Display the user's cart
- ‘POST /cart/add - For adding recipe’s ingredients into cart (from cart button in recipes page)
- ‘POST /cart/remove-recipe - For removing all of a specific recipe’s ingredients from cart (Remove all Button)
- ‘POST /cart/remove-item - For removing specific ingredients from cart (Remove Button)
- ‘POST /cart/clear - For clearing all recipes ingredients from cart (Clear All Recipes Button)

### User

- GET /authentication/register - User can register a new account here.
- POST /authentication/register - User account successfully created
- GET /authentication/login - Displays login page
- POST /authentication/login - User successfully logged in
- GET / authentication/update - Displays update page
- POST / authentication/update - Shows account successfully updated page
- GET /authentication/delete - Shows delete account page
- POST /authentication/delete - Shows account delete successfully account page
- Get /authentication/logout - Logs out the user from their account
- GET /authentication/admin-profile - Shows admin panel page

### Manage Recipes

- GET /myRecipes - Displays individual recipe dashboard
- POST /myRecipes - Delete selected recipes from dashboard before refreshing dashboard
- GET /myRecipes/create-recipe - Displays create recipe page
- POST /myRecipes/create-recipe - Create new recipe
- GET /myRecipes/edit-recipe - Displays edit recipe page
- POST /myRecipes/edit-recipe - Update recipe

### Database Schema

userSchema

- username: String, required
- email: String, required, unique
- password: String, required
- favourites: Array

recipeSchema

- title: String, required
- description: String, required
- image: String
- ingredients: Array, required
- steps: Array, required
- difficulty: Array, required
- ratings: Array of Objects containing email as String and rating as Number, default value is empty array
- reviews: Array of Objects containing email as String, username as String and review as String, default value is empty array
- email: String, required
- avgRating: Number, default 0
- username: String, required

cartItemSchema

* name: String, required
* recipeID: Referenced from recipeSchema, ObjectId, required
* recipeTitle: String, required

shoppingListSchema

* userID: Referenced from userSchema, ObjectId,Required
* items: Array

**
