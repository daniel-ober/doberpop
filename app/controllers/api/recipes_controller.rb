# app/controllers/api/recipes_controller.rb
module Api
  class RecipesController < ApplicationController
    before_action :authorize_request

    # GET /api/recipes
    def index
      recipes = Recipe.includes(:user).order(created_at: :desc)

      render json: recipes.as_json(
        only: [
          :id,
          :name,
          :kernel_type,
          :instructions,
          :yield,
          :description,
          :hero_image_url,
          :additional_photo_urls,
          :ingredients,
          :source,
          :published,
          :created_at,
          :updated_at
        ],
        include: {
          user: {
            only: [:id, :username, :email]
          }
        }
      )
    end

    # GET /api/recipes/:id
    def show
      recipe = Recipe.includes(:user).find(params[:id])

      render json: recipe.as_json(
        only: [
          :id,
          :name,
          :kernel_type,
          :instructions,
          :yield,
          :description,
          :hero_image_url,
          :additional_photo_urls,
          :ingredients,
          :source,
          :published,
          :created_at,
          :updated_at
        ],
        include: {
          user: {
            only: [:id, :username, :email]
          }
        }
      )
    end
  end
end