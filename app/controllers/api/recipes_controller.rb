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
  # Logged out  -> ONLY sampler-flagged official Doberpop recipes
  # Logged in   -> full library (all published + your own drafts).
  # Admin       -> everything.
  #
  # If params[:sampler] is truthy, always return the public sampler
  # lineup (official Doberpop + show_in_sampler = true), regardless
  # of auth state. This is handy for homepage carousels, etc.
  #
  def index
    sampler_only = ActiveModel::Type::Boolean.new.cast(params[:sampler])

    base_scope =
      if sampler_only
        # Explicit sampler view
        Recipe.where(
          source: "doberpop",
          published: true,
          show_in_sampler: true
        )

      elsif current_user&.admin?
        # Admins can see everything
        Recipe.all

      elsif current_user.present?
        # Signed-in users:
        # - all published recipes (official + community)
        # - plus any recipe they own (even if unpublished)
        published = Recipe.where(published: true)
        mine      = Recipe.where(user_id: current_user.id)
        published.or(mine)

      else
        # Guests:
        # Only official Doberpop recipes that are explicitly flagged
        # for the public sampler (show_in_sampler = true).
        Recipe.where(
          source: "doberpop",
          published: true,
          show_in_sampler: true
        )
      end

    # default ordering by ID (stable base ordering)
    recipes = base_scope.order(:id)

    # ----- favorites count per recipe (for "Most favorited" sort) -----
    recipe_ids = recipes.pluck(:id)
    favorite_counts = {}

    if defined?(Favorite) && recipe_ids.any?
      # { recipe_id => count }
      favorite_counts = Favorite.where(recipe_id: recipe_ids)
                                .group(:recipe_id)
                                .count
    end

    # ----- TOTAL SIGNATURE COUNT (full library, not just sampler) -----
    #
    # "Signature batches" = official Doberpop recipes (non-user-submitted)
    # that are published. This intentionally ignores show_in_sampler so
    # guests can see how many are in the full library they’d unlock.
    total_signature_count = Recipe.where(
      source: "doberpop",
      published: true
    ).count

    render json: {
      recipes: recipes.map { |r|
        r.as_json.merge(
          favorites_count: favorite_counts[r.id] || 0
        )
      },
      total_signature_count: total_signature_count
    }
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
      :user_id,
      # 👇 sampler fields
      :show_in_sampler,
      :sampler_position
    )
  end
end