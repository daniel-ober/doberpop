# app/controllers/api/admin/recipes_controller.rb
class Api::Admin::RecipesController < Api::Admin::BaseController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  MAX_SAMPLER_SLOTS = 20

  # GET /api/admin/recipes
  def index
    recipes = Recipe.includes(:user).order(:id)

    favorite_counts          = {}
    favorite_users_by_recipe = Hash.new { |h, k| h[k] = [] }

    if defined?(Favorite)
      recipe_ids = recipes.map(&:id)

      favorites = Favorite.includes(:user)
                          .where(recipe_id: recipe_ids)

      favorite_counts = favorites.group_by(&:recipe_id)
                                 .transform_values(&:size)

      favorite_users_by_recipe = favorites.group_by(&:recipe_id)
    end

    render json: recipes.map { |recipe|
      base = recipe.as_json

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

  # GET /api/admin/recipes/sampler_lineup
  # Returns only recipes that are currently in the sampler, in display order,
  # plus max sampler slots + favorites_count for the lineup card.
  def sampler_lineup
    recipes = Recipe.where(show_in_sampler: true)
                    .order(:sampler_position, :id)

    render json: recipes.map { |recipe|
      base = recipe.as_json
      base["max_sampler_slots"] = MAX_SAMPLER_SLOTS
      base["favorites_count"]   = recipe.respond_to?(:favorites_count) ?
                                  recipe.favorites_count : 0
      base
    }
  end

  # PATCH /api/admin/recipes/sampler_order
  # Body: { sampler_order: [recipe_id_1, recipe_id_2, ...] }
  def sampler_order
    ids = Array(params[:sampler_order]).map(&:to_i).reject(&:zero?)

    Recipe.transaction do
      ids.each_with_index do |id, index|
        Recipe.where(id: id).update_all(sampler_position: index)
      end
    end

    head :no_content
  rescue => e
    render json: { error: "Failed to update sampler order: #{e.message}" },
           status: :unprocessable_entity
  end

  # PATCH/PUT /api/admin/recipes/:id
  # Used by the admin dashboard “Showing / Hidden” sampler toggle.
  def update
    recipe = Recipe.find(params[:id])
    attrs  = admin_recipe_params.to_h.symbolize_keys

    if attrs.key?(:show_in_sampler)
      # Normalize boolean from params
      new_flag = ActiveModel::Type::Boolean.new.cast(attrs[:show_in_sampler])

      if new_flag && !recipe.show_in_sampler
        # About to turn ON → enforce max slots
        current_slots = Recipe.where(show_in_sampler: true).count
        if current_slots >= MAX_SAMPLER_SLOTS
          return render json: {
            error: "You can only feature #{MAX_SAMPLER_SLOTS} sampler batches at a time."
          }, status: :unprocessable_entity
        end

        # If it doesn't already have a position, place it at the end
        attrs[:sampler_position] ||= Recipe.maximum(:sampler_position).to_i + 1
      elsif !new_flag
        # Turning OFF: you can optionally reset sampler_position to 0
        attrs[:sampler_position] = 0
      end

      attrs[:show_in_sampler] = new_flag
    end

    if recipe.update(attrs)
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

  def admin_recipe_params
    params.permit(:show_in_sampler, :sampler_position)
  end
end