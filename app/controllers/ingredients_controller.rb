class IngredientsController < ApplicationController
  before_action :set_ingredient, only: [:show, :update, :destroy]

  # GET /ingredients
 # GET /ingredients
 def index
  if params[:recipe_id]
    @recipe = Recipe.find(params[:recipe_id])
    render json: @recipe.ingredients
  else
  @ingredients = Ingredient.all
  render json: @ingredients, include: :recipes
  end
end

  # def add_ingredient
  #   @recipe = Recipe.find(params[:recipe_id])
  #   @ingredient = Ingredient.find(params[:id])
  #   @recipe.ingredients << @ingredient

  #   render json: @ingredients, include: :ingredients. 
  # end
  # GET /ingredients/1
  def show
    # @recipe = Recipe.find(params[:recipe_id])
    @ingredient = Ingredient.find(params[:id])
    render json: @ingredient
  end

  # POST /ingredients
  def create
    @ingredient = Ingredient.new(ingredient_params)

    if @ingredient.save
      render json: @ingredient, status: :created, location: @ingredient
    else
      render json: @ingredient.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ingredient
      @ingredient = Ingredient.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def ingredient_params
      params.require(:ingredient).permit(:name)
    end
end
