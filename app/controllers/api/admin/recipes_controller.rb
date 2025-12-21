# app/controllers/api/admin/recipes_controller.rb
class Api::Admin::RecipesController < Api::Admin::BaseController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  # GET /api/admin/recipes
  def index
    recipes = Recipe.includes(:user).order(:id)

    favorite_counts          = {}
    favorite_users_by_recipe = Hash.new { |h, k| h[k] = [] }

    # Only try to use Favorite if the model exists
    if defined?(Favorite)
      recipe_ids = recipes.map(&:id)

      favorites = Favorite.includes(:user)
                          .where(recipe_id: recipe_ids)

      # counts per recipe
      favorite_counts = favorites.group_by(&:recipe_id)
                                 .transform_values(&:size)

      # favorites grouped per recipe for user list
      favorite_users_by_recipe = favorites.group_by(&:recipe_id)
    end

    render json: recipes.map { |recipe|
      # start with whatever attributes Recipe already has
      base = recipe.as_json

      # attach compact user info for the Owner column
      if recipe.respond_to?(:user) && recipe.user
        base["user"] = {
          "id"       => recipe.user.id,
          "username" => recipe.user.username,
          "email"    => recipe.user.email
        }
      end

      favs_for_recipe = favorite_users_by_recipe[recipe.id] || []

      base["favorites_count"] = favorite_counts[recipe.id] || 0
      base["favorited_users"] = favs_for_recipe.map { |fav|
        u = fav.respond_to?(:user) ? fav.user : nil
        next unless u

        {
          "id"       => u.id,
          "username" => (u.respond_to?(:username) ? u.username : nil),
          "email"    => (u.respond_to?(:email)    ? u.email    : nil)
        }
      }.compact

      base
    }
  end

  # PATCH/PUT /api/admin/recipes/:id
  # Used by the admin dashboard “Showing / Hidden” sampler toggle.
  def update
    recipe = Recipe.find(params[:id])

    if recipe.update(admin_recipe_params)
      render json: recipe.as_json
    else
      render json: { error: recipe.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  # DELETE /api/admin/recipes/:id
  def destroy
    recipe = Recipe.find(params[:id])
    recipe.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recipe not found" }, status: :not_found
  end

  private

  # Only allow sampler-related fields to be changed via the admin API.
  def admin_recipe_params
    params.permit(:show_in_sampler, :sampler_position)
  end
end