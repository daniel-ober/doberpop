# app/controllers/api/admin/recipes_controller.rb
class Api::Admin::RecipesController < Api::Admin::BaseController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  # GET /api/admin/recipes
  def index
    render json: Recipe.order(created_at: :desc)
  end

  # DELETE /api/admin/recipes/:id
  def destroy
    recipe = Recipe.find(params[:id])
    recipe.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end
end