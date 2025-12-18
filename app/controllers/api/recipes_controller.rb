module Api
  class RecipesController < ApplicationController
    before_action :authorize_request

    def index
      recipes = Recipe.order(created_at: :desc)
      render json: recipes
    end

    def show
      recipe = Recipe.find(params[:id])
      render json: recipe
    end

    def create
      recipe = Recipe.new(recipe_params)
      recipe.user_id = @current_user.id if recipe.respond_to?(:user_id=) && @current_user
      recipe.save!
      render json: recipe, status: :created
    end

    def update
      recipe = Recipe.find(params[:id])
      recipe.update!(recipe_params)
      render json: recipe
    end

    def destroy
      recipe = Recipe.find(params[:id])
      recipe.destroy!
      head :no_content
    end

    private

    def recipe_params
      params.require(:recipe).permit(:title, :name, :content, :description, :instructions, :ingredients)
    end
  end
end