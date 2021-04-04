class RecipesController < ApplicationController
  before_action :set_recipe, only: [:show, :update, :destroy]
  before_action :authorize_request, only: [:create, :update, :destroy]

  # GET /recipes
  def index
    @recipes = Recipe.all
    render json: @recipes, include: :ingredients
  end

  # GET /recipes/1
  def show
    render json: @recipe, include: :ingredients
  end

  # POST /recipes
  def create

    # @user = User.find(params[:user_id])
    @recipe = Recipe.new(recipe_params.except(:ingredients))
    @recipe.user = @current_user
    @ingredients = recipe_params[:ingredients].map do |ingredient|
      Ingredient.find_or_create_by(ingredient)
    end
    @recipe.ingredients = @ingredients
    if @recipe.save
      render json: @recipe, include: :ingredients
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /recipes/1
  def update
    @ingredients = recipe_params[:ingredients].map do |ingredient|
      Ingredient.find_or_create_by(ingredient)
    end
    @recipe.ingredients = @ingredients
    if @recipe.update(recipe_params.except(:ingredients))
      render json: @recipe, include: :ingredients
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

  # DELETE /recipes/1
  def destroy
    @recipe.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def recipe_params
      params.require(:recipe).permit(:name, :description, :kernel_type, :instructions, :yield, ingredients: [:name])
    end
end