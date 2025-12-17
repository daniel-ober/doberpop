class RecipesController < ApplicationController
  before_action :authorize_request, only: [:create, :update, :destroy]
  before_action :set_recipe, only: [:update, :destroy]

  # GET /recipes
  def index
    @recipes = Recipe.all
    render json: @recipes, include: :ingredients
  end

  # GET /recipes/:id
  def show
    @recipe = Recipe.find(params[:id])
    render json: @recipe, include: :ingredients
  end

  # POST /recipes
  def create
    @recipe = Recipe.new(recipe_params.except(:ingredients))
    @recipe.user = @current_user

    ingredients_param = recipe_params[:ingredients] || []
    @ingredients = ingredients_param.map do |ingredient|
      Ingredient.find_or_create_by(ingredient)
    end
    @recipe.ingredients = @ingredients

    if @recipe.save
      render json: @recipe, include: :ingredients
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /recipes/:id
  def update
    ingredients_param = recipe_params[:ingredients] || []
    @ingredients = ingredients_param.map do |ingredient|
      Ingredient.find_or_create_by(ingredient)
    end
    @recipe.ingredients = @ingredients

    if @recipe.update(recipe_params.except(:ingredients))
      render json: @recipe, include: :ingredients
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

  # DELETE /recipes/:id
  def destroy
    @recipe.destroy
    head :no_content
  end

  private

  def set_recipe
    @recipe = @current_user.recipes.find(params[:id])
  end

  def recipe_params
    params.require(:recipe).permit(
      :name,
      :description,
      :kernel_type,
      :instructions,
      :yield,
      :hero_image_url,
      additional_photo_urls: [],
      ingredients: [:name]
    )
  end
end