# app/controllers/api/favorites_controller.rb
class Api::FavoritesController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  before_action :require_login!

  # GET /api/favorites
  # → { recipe_ids: [1, 5, 9] }
  def index
    ids = @current_user.favorites.pluck(:recipe_id)
    render json: { recipe_ids: ids }
  end

  # POST /api/recipes/:recipe_id/favorite
  def create
    recipe = Recipe.find(params[:recipe_id])

    fav = @current_user.favorites.find_or_create_by!(recipe_id: recipe.id)

    render json: { recipe_id: fav.recipe_id }, status: :created
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  # DELETE /api/recipes/:recipe_id/favorite
  def destroy
    fav = @current_user.favorites.find_by(recipe_id: params[:recipe_id])
    fav&.destroy
    head :no_content
  end

  private

  def require_login!
    unless current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    else
      @current_user = current_user
    end
  end
end