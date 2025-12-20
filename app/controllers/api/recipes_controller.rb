# app/controllers/api/recipes_controller.rb
class Api::RecipesController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  # Require login for mutating actions only
  before_action :authorize_request, only: [:create, :update, :destroy]

  # =========================
  # GET /api/recipes
  # =========================
  #
  # Immediate-safe version: return all recipes and let the
  # front-end do the tab filtering (Doberpop / Mine / Community)
  #
  def index
    recipes = Recipe.order(:id)
    render json: recipes
  rescue => e
    Rails.logger.error("[Api::RecipesController#index] #{e.class}: #{e.message}")
    render json: { status: 500, error: "Internal Server Error" }, status: :internal_server_error
  end

  # =========================
  # GET /api/recipes/:id
  # =========================
  def show
    recipe = Recipe.find(params[:id])

    # If NOT published, only the owner or an admin may see it.
    if !recipe.published?
      unless current_user && (current_user.id == recipe.user_id || current_user.admin?)
        return render json: { error: "Recipe not found" }, status: :not_found
      end
    end

    render json: recipe
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  # =========================
  # POST /api/recipes
  # =========================
  def create
    recipe = Recipe.new(recipe_params)
    recipe.user_id ||= current_user.id if current_user
    recipe.source  ||= "user"

    if recipe.save
      render json: recipe, status: :created
    else
      render json: { error: recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # =========================
  # PUT/PATCH /api/recipes/:id
  # =========================
  def update
    recipe = Recipe.find(params[:id])

    unless current_user && (current_user.admin? || recipe.user_id == current_user.id)
      return render json: { error: "Forbidden" }, status: :forbidden
    end

    if recipe.update(recipe_params)
      render json: recipe
    else
      render json: {
        error: "Validation failed",
        messages: recipe.errors.full_messages
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  # =========================
  # DELETE /api/recipes/:id
  # =========================
  def destroy
    recipe = Recipe.find(params[:id])

    unless current_user && (current_user.admin? || recipe.user_id == current_user.id)
      return render json: { error: "Forbidden" }, status: :forbidden
    end

    recipe.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  private

  def recipe_params
    params.permit(
      :name,
      :description,
      :kernel_type,
      :yield,
      :instructions,
      :ingredients,
      :hero_image_url,
      :additional_photo_urls,
      :published,
      :source,
      :user_id
    )
  end
end