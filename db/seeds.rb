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


users = {
        username: "dober",
        email: "dober@doberpop.com",
        password: "321321",
    }

@user = User.create!(users)

@oil = Ingredient.create!(name: 'oil')
@salt = Ingredient.create!(name: 'salt')
@butter = Ingredient.create!(name: 'butter')
@seasoning = Ingredient.create!(name: 'seasoning')

recipes = [
    {
        user: @user,
        name: "Cookies and Cream",
        description: "soft blend of oreo cookie mixed with melted vanilla fudge, sprinkled with crushed oreo",
        kernel_type: "Mushroom",
        instructions: "-melt 1 tablespoon of white coconut oil in popper
        -add 1/4 cup of mushroom kernel_types
        -remove from stove once popping slows
        -melt 2 cups of white chocolate on stovetop or in microwave
        -add 3/4 cup of crushed oreo to melted chocolate and quickly mix
        -drizzle on popcorn and sprinkle on remaining oreos",
        yield: "5",
        ingredients: [@oil, @butter]
    },
    {
        user: @user,
        name: "Maple & Bourbon",
        description: "a candy like maple glaze popcorn, infused with one of the finest double barreled bourbons, lightly sprinkled with some cinnemon sugar",
        kernel_type: "Jumbo",
        instructions: "-melt 1 tablespoon of white coconut oil popper,
        -add 1/4 cup of jumbo kernel_types
        -remove from stove once popping slows
        -over medium heat, add 1/4 cup of maple syrup
        -once syrup becomes easy to stir, add in 2 oz. of Woodford Reserve Double Oaked bourbon
        -stir over medium heat and bring to a boil
        -once brought to a boil, remove from heat and continue stirring for 2 minutes
        -drizzle over popcorn and make sure to stir popcorn well, covering all pieces
        -lightly sprinkle some cinnemon sugar
        -refridgerate for 2 hour, making sure to take out from fridge to stir every 20 minutes",
        yield: "6",
        ingredients: [@oil, @salt]
    },
    {
        user: @user,
        name: "Chicago Style",
        description: "classic cheddar cheese mixed with caramel corn",
        kernel_type: "Mushroom",
        instructions: "-melt 1 tablespoon of white coconut oil in popper
        -add 1/4 cup of mushroom kernel_types
        -remove from stove once popping slows
        -mix 1/3 cup of cheese powder with 4 tablespoons of yellow coconut oil
        -microwave for 1 minute, stirring half way through and at the end
        -drizzle cheddar mix over popcorn",
        yield: "8",
        ingredients: [@oil, @butter, @caramel]
    },
]

Recipe.create!(recipes)
