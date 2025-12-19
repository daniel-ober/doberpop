# app/controllers/favorites_controller.rb
class FavoritesController < ApplicationController
  before_action :authorize_request

  def create
    recipe = Recipe.find(params[:recipe_id])

    fav = Favorite.new(user: current_user, recipe: recipe)

    if fav.save
      render json: fav, status: :created
    else
      render json: { errors: fav.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    fav = Favorite.find_by!(user_id: current_user.id, recipe_id: params[:recipe_id])
    fav.destroy
    head :no_content
  end

  def index
    favorites = Favorite.includes(:recipe).where(user_id: current_user.id).order(created_at: :desc)
    render json: favorites.as_json(include: :recipe)
  end
end