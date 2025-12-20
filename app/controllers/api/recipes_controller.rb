# app/controllers/api/recipes_controller.rb
class Api::RecipesController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  # Require login for mutating actions only
  before_action :authorize_request, only: [:create, :update, :destroy]
  before_action :set_recipe, only: [:show, :update, :destroy]

  # =========================
  # GET /api/recipes
  # =========================
  def index
    # Return a plain ARRAY of recipes – the React app
    # expects `[ {id: 1, ...}, {id: 2, ...}, ... ]`
    recipes = Recipe.all.order(created_at: :asc)
    render json: recipes
  end

  # =========================
  # GET /api/recipes/:id
  # =========================
  def show
    # If NOT published, only the owner or an admin may see it.
    if !@recipe.published?
      unless current_user && (current_user.id == @recipe.user_id || current_user.admin?)
        return render json: { error: "Recipe not found" }, status: :not_found
      end
    end

    render json: @recipe
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  # =========================
  # POST /api/recipes
  # =========================
  def create
    recipe = Recipe.new(recipe_params)
    recipe.user_id = current_user.id
    recipe.source ||= "user"

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
    unless current_user && (current_user.admin? || @recipe.user_id == current_user.id)
      return render json: { error: "Forbidden" }, status: :forbidden
    end

    if @recipe.update(recipe_params)
      render json: @recipe
    else
      render json: {
        error: "Validation failed",
        messages: @recipe.errors.full_messages
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  # =========================
  # DELETE /api/recipes/:id
  # =========================
  def destroy
    unless current_user && (current_user.admin? || @recipe.user_id == current_user.id)
      return render json: { error: "Forbidden" }, status: :forbidden
    end

    @recipe.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  private

  def set_recipe
    @recipe = Recipe.find(params[:id])
  end

  def recipe_params
    params.permit(
      :name,
      :description,
      :kernel_type,
      :yield,
      :instructions,
      :published,
      :source,
      :ingredients,
      :hero_image_url,
      :additional_photo_urls,
      :user_id
    )
  end
end