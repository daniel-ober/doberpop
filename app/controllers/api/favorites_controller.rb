class Api::FavoritesController < ApplicationController
  before_action :authorize_request

  def index
    ids = Favorite.where(user_id: current_user.id).pluck(:recipe_id)
    render json: { recipe_ids: ids }, status: :ok
  end

  def create
    recipe = Recipe.find(params[:recipe_id])
    fav = Favorite.new(user_id: current_user.id, recipe_id: recipe.id)

    if fav.save
      render json: { ok: true }, status: :created
    else
      render json: { errors: fav.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    fav = Favorite.find_by!(user_id: current_user.id, recipe_id: params[:recipe_id])
    fav.destroy
    head :no_content
  end
end
