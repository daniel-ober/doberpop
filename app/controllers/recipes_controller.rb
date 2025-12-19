class RecipesController < ApplicationController
  before_action :authorize_request
  before_action :set_recipe, only: [:show, :update, :destroy]

  def create
    if creating_official?
      return render json: { error: "Forbidden" }, status: :forbidden unless current_user.is_admin

      @recipe = Recipe.new(recipe_params)
      @recipe.source = "doberpop"
      @recipe.published = true
      @recipe.user_id = current_user.id
    else
      @recipe = Recipe.new(recipe_params)
      @recipe.source = "user"
      @recipe.user_id = current_user.id
      @recipe.published = ActiveModel::Type::Boolean.new.cast(params.dig(:recipe, :published))
    end

    if @recipe.save
      render json: @recipe, status: :created
    else
      render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @recipe.source == "doberpop"
      return render json: { error: "Forbidden" }, status: :forbidden unless current_user.is_admin
      updates = recipe_params
      updates[:published] = true
      updates[:source] = "doberpop"
      updates[:user_id] = @recipe.user_id
    else
      return render json: { error: "Forbidden" }, status: :forbidden unless @recipe.user_id == current_user.id
      updates = recipe_params
      updates[:source] = "user"
      updates[:user_id] = current_user.id
    end

    if @recipe.update(updates)
      render json: @recipe
    else
      render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @recipe.source == "doberpop"
      return render json: { error: "Forbidden" }, status: :forbidden unless current_user.is_admin
    else
      return render json: { error: "Forbidden" }, status: :forbidden unless @recipe.user_id == current_user.id
    end

    @recipe.destroy
    head :no_content
  end

  private

  def set_recipe
    @recipe = Recipe.find(params[:id])
  end

  def creating_official?
    params.dig(:recipe, :source).to_s == "doberpop"
  end

  def recipe_params
    params.require(:recipe).permit(
      :name,
      :description,
      :instructions,
      :kernel_type,
      :hero_image_url,
      :published
    )
  end
end
