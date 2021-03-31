## Overview

**doberpop** is an upcoming Homemade Gourmet Popcorn shop located in Nashville, TN. What makes doberpop so unique is the variety of flavors it has to offer, featuring over 40 flavors! doberpop's 'Tastemaster' app is a tool designed for popcorn lovers to share their very own popcorn recipes and their wildest flavor ideas with the rest of the doberpop community. A simple signup process is required for viewing, adding, editing, and removing recipes and new flavors.Want to become part of the doberpop community today? Pop on over to doberpop to share your favorite popcorn recipe or your wildest idea for a popcorn flavor! 


<br>

## MVP

- _Build a Ruby on Rails server with RESTful JSON endpoints_
- _Database to contain SQL tables for at least 3 tables_
- _Include at least 1 association between tables_
- _Implement working generic controller actions for Full CRUD_
- _Demonstrate Full CRUD actions on the front end_
- _Deliver a functioning front end using React app_
- _Include at least 8 separate, rendered components_
- _Deploy the back-end via Heroku_
- _Deploy front-end via Netlify or Surge_
- _Use Flexbox or Grid in layout design_
- _Style app for 3 screen sizes: desktop, tablet, and mobile_
- _Have a minimum of 75 commits_

<br>

### Goals

- _Create a functioning app with authetication_
- _Full CRUD for both frontend and backend_
- _Keep CSS clean, simple, consistent, and organic_
- _Incorporate original design concepts_
- _No bugs_

<br>

### Libraries and Dependencies

|      Library      | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
|       Axios       | promise based HTTP client used for making API calls                          |
|      Bundle       | installs requied dependencies for Ruby                                       |
|       CORS        | used to enable when making API calls                                         |
|       JWT         | secure data submission used during authentication handling                   |
|      Bcrypt       | password hashing function used during authentication handling                |
|       React       | frontend client server used for rendering data                               |
|   React Router    | frontend navigation dependent on URL params, utilizing Link/Route components |
|       Rails       | seed and schema data setup                                                   |
|   Ruby on Rails   | backend database management used to store user data                          |


<br>

### Client (Front End)

#### Wireframes
- Landing Page
![Landing Page](https://i.imgur.com/454UcjD.png)

- Login / Register
![Register/Signin](https://i.imgur.com/uYamyuA.png)

- User - Main
![User - Main](https://i.imgur.com/5pgZd91.png)

- User - Recipes
![User - Recipes](https://i.imgur.com/thEU042.png)

- Users - Tastemaster Ideas
![User - Tastemaster Ideas](https://i.imgur.com/4t8fPVk.png)

User - Community
![User - Community](https://i.imgur.com/vWIRG8j.png)

- Mobile (all)
![Mobile View](https://i.imgur.com/gBe83jH.png)


#### Component Tree

![https://i.imgur.com/l0mX4xw.png](https://i.imgur.com/l0mX4xw.png)


#### Component Architecture


``` structure

src
|__ assets/
      |__ fonts
      |__ graphics
      |__ images
      |__ mockups
|__ layouts/
      |__ Layout.jsx
|__ screens/
      |__ Home.jsx
      |__ SignIn.jsx
      |__ Register.jsx
|__ components/
      |__ Header.jsx
      |__ Footer.jsx
      |__ Layout.jsx
      |__ UserRecipes.jsx
      |__ UserRecipeDetails.jsx
      |__ UserNewRecipe.jsx
      |__ UserTastemasters.jsx
      |__ UserTastemasterDetails.jsx
      |__ UserNewTastemaster.jsx
      |__ CommunityRecipes.jsx
      |__ CommunityTastemasters.jsx
|__ services/

```

#### Time Estimates


| Task                     |  Priority | Estimated Time | Time Invested | Actual Time |
| ------------------------ | :-------: | :------------: | :-----------: | :---------: |
| Psuedocode               |     H     |     2 hrs      |     - hrs     |    - hrs    |
| Schema / Models          |     H     |     2 hrs      |     - hrs     |    - hrs    |
| Backend: Seed Data       |     H     |     2 hrs      |     - hrs     |    - hrs    |
| Create CRUD Actions      |     H     |     6 hrs      |     - hrs     |    - hrs    |
| Setup React App          |     H     |     1 hrs      |     - hrs     |    - hrs    |
| Screens Setup            |     H     |     6 hrs      |     - hrs     |    - hrs    |
| Components Setup         |     H     |     6 hrs      |     - hrs     |    - hrs    |
| App.js Routes            |     H     |     2 hrs      |     - hrs     |    - hrs    |
| Services / Axios Calls   |     H     |     4 hrs      |     - hrs     |    - hrs    |
| Render Component Data    |     H     |     2 hrs      |     - hrs     |    - hrs    |
| CSS Styling              |     H     |     8 hrs      |     - hrs     |    - hrs    |
| Media Queries            |     H     |     4 hrs      |     - hrs     |    - hrs    |
| Debugging                |     H     |     4 hrs      |     - hrs     |    - hrs    |
| Deployment               |     H     |     1 hrs      |     - hrs     |    - hrs    |
| TOTAL                    |     H     |    50 hrs      |     - hrs     |    - hrs    |


<br>

### Server (Back End)

#### ERD Model

![https://i.imgur.com/PGd0bA5.png](https://i.imgur.com/PGd0bA5.png)


<br>

***

## Post-MVP

- _Add Sort for My Recipes (ie. alphebetically, creation date, etc.)_
- _Add 'Tastemaster Flavor of The Month Recipe Challenge'_
- _Allow users to save their favorite recipes_
- _Add community voting for flavor ideas (up/down voting structure, one vote per user, per flavor, cannot allow user to vote for own recipe)_
- _Add community rating for user recipes (5-start rating system, one vote per user, per recipe, cannot allow user to vote for own recipe)_
- _Build out e-commerce: Popcorn, Seasonings, Swag, Gift Cards, Subscriptions, checkout, etc._
- _Setup doberpop admin access to view/add/edit/remove features: inventory levels, non-community recipe notes, POS details, shipping statuses, etc._



***

## Code Showcase

> Use this section to include a brief code snippet of functionality that you are proud of and a brief description.

## Code Issues & Resolutions

> Use this section to list of all major issues encountered and their resolution.
