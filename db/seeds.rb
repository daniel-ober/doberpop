# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Ingredient.destroy_all
Recipe.destroy_all
User.destroy_all

# Recipe.destroy_all
# Ingredient.destroy.all
# User.destroy_all

# @admin = User.create!(username: 'admin', email: 'admin@email.com', password: '321321')

# puts "#{User.count} users created"

# @oil = Ingredient.create!(name: 'oil')
# @salt = Ingredient.create!(name: 'salt')
# @butter = Ingredient.create!(name: 'butter')
# @seasoning = Ingredient.create!(name: 'seasoning')

# puts "#{Ingredient.count} ingredients created"

# Recipe.create!(name: 'cookies and cream', user: @admin, ingredients: [@oil, @butter, @seasoning])
# @cookies_and_cream = Recipe.create!(name: 'cookies and cream', user: @admin)

# @cookies_and_cream.ingredients.push(@oil, @butter, @seasoning)

# @maple_and_bourbon = Recipe.create!(name: 'maple and bourbon', user: @admin)

# puts "#{Recipe.count} recipes created"

users = {
        username: "dober",
        email: "dober@doberpop.com",
        password: "321321",
    }

@user = User.create!(users)

recipes = [
    {
        user: @user,
        name: "Cookies and Cream",
        description: "soft blend of oreo cookie mixed with melted vanilla fudge, sprinkled with crushed oreo",
        kernal: "Mushroom",
        instructions: "-melt 1 tablespoon of white coconut oil in popper
        -add 1/4 cup of mushroom kernals
        -remove from stove once popping slows
        -melt 2 cups of white chocolate on stovetop or in microwave
        -add 3/4 cup of crushed oreo to melted chocolate and quickly mix
        -drizzle on popcorn and sprinkle on remaining oreos",
        yield: "6",
    },
    {
        user: @user,
        name: "Maple & Bourbon",
        description: "a candy like maple glaze popcorn, infused with one of the finest double barreled bourbons, lightly sprinkled with some cinnemon sugar",
        kernal: "Jumbo",
        instructions: "-melt 1 tablespoon of white coconut oil popper,
        -add 1/4 cup of jumbo kernals
        -remove from stove once popping slows
        -over medium heat, add 1/4 cup of maple syrup
        -once syrup becomes easy to stir, add in 2 oz. of Woodford Reserve Double Oaked bourbon
        -stir over medium heat and bring to a boil
        -once brought to a boil, remove from heat and continue stirring for 2 minutes
        -drizzle over popcorn and make sure to stir popcorn well, covering all pieces
        -lightly sprinkle some cinnemon sugar
        -refridgerate for 2 hour, making sure to take out from fridge to stir every 20 minutes",
        yield: "6",
    },
]

ingredients = [
    {
        name: "coconut oil",
    },
    {
        name: "salt",
    },
    {
        name: "butter",
    },
    {
        name: "corn syrup",
    },
    {
        name: "flavor seasoning",
    },
    {
        name: "oreo cookies",
    },
    {
        name: "cereal",
    },
    {
        name: "sugar",
    },
    {
        name: "pepper",
    },
    {
        name: "Flavacol",
    },
    {
        name: "white chocolate chips/wafers",
    },
    {
        name: "dark chocolate chips/wafers",
    },
    {
        name: "milk chocolate chips/wafers",
    },
    {
        name: "flavored stevia",
    },
    {
        name: "vanilla extract",
    },
]

Recipe.create!(recipes)
Ingredient.create!(ingredients)