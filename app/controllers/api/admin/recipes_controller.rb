# app/controllers/api/admin/recipes_controller.rb
class Api::Admin::RecipesController < Api::Admin::BaseController
  def index
    # Base recipe list (you can reorder in React; here we'll just go by created_at)
    recipes = Recipe.includes(:user)

    # Precompute favorite counts for all recipes in one query:
    # { recipe_id => count }
    favorite_counts = Favorite.group(:recipe_id).count

    # Preload all favorites + users and group them by recipe_id
    # { recipe_id => [Favorite, Favorite, ...] }
    favorites_by_recipe = Favorite.includes(:user).group_by(&:recipe_id)

    render json: recipes.map { |r|
      favs_for_recipe = favorites_by_recipe[r.id] || []

      {
        id:          r.id,
        name:        r.name,
        title:       r.name,          # front-end uses title || name
        kernel_type: r.kernel_type,
        created_at:  r.created_at,

        # owner info
        user_id:   r.user_id,
        username:  r.user&.username,
        email:     r.user&.email,

        # favorites info for AdminDashboard
        favorites_count: favorite_counts[r.id] || 0,
        favorited_users: favs_for_recipe.map do |fav|
          u = fav.user
          next unless u

          {
            id:       u.id,
            username: u.username,
            email:    u.email,
          }
        end.compact
      }
    }
  end
end