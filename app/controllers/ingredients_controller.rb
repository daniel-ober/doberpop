class IngredientsController < ApplicationController
  before_action :authorize_request

  def index
    ingredients = if params[:recipe_id]
      Recipe.find(params[:recipe_id]).ingredients
    else
      Ingredient.all
    end

    render json: ingredients
  end

  def add_recipe
    recipe = Recipe.find(params[:recipe_id])
    ingredient = Ingredient.find(params[:id])
    recipe.ingredients << ingredient unless recipe.ingredients.include?(ingredient)
    head :no_content
  end
end
