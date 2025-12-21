# config/routes.rb
Rails.application.routes.draw do
  # ============================
  # AUTH (JWT)
  # ============================
  post  "/auth/login",    to: "authentication#login"
  post  "/auth/register", to: "authentication#register"
  get   "/auth/verify",   to: "authentication#verify"
  patch "/auth/account",  to: "authentication#update_account"
  post  "/auth/password/forgot", to: "password_resets#create"
  post  "/auth/password/reset",  to: "password_resets#update"

  # ============================
  # ADMIN HTML (Doberpop admin panel)
  # ============================
  namespace :admin do
    root to: "dashboard#index"
    get "/users",   to: "users#index"
    get "/recipes", to: "recipes#index"
  end

  # ============================
  # JSON API
  # ============================
  namespace :api, path: "/api" do
    # ----------------------------
    # RECIPES API  (used by React /recipes)
    # ----------------------------
    resources :recipes

    # ----------------------------
    # INGREDIENTS
    # ----------------------------
    resources :ingredients

    get  "/recipes/:recipe_id/ingredients",
         to: "ingredients#index"

    post "/recipes/:recipe_id/ingredients/:id",
         to: "ingredients#add_recipe"

    # ----------------------------
    # FAVORITES
    # ----------------------------
    get    "/favorites",                   to: "favorites#index"
    post   "/recipes/:recipe_id/favorite", to: "favorites#create"
    delete "/recipes/:recipe_id/favorite", to: "favorites#destroy"

    # ----------------------------
    # ACCOUNT (current user profile)
    # Use a singular resource to guarantee GET/PATCH/PUT/DELETE /api/account
    # ----------------------------
    resource :account, only: [:show, :update, :destroy], controller: "account"

    # ----------------------------
    # ADMIN API (JWT protected)
    # ----------------------------
    namespace :admin do
      resources :users, only: [:index, :destroy]

      resources :recipes, only: [:index, :update, :destroy] do
        collection do
          # Sampler lineup admin-only routes
          get   :sampler_lineup    # GET  /api/admin/recipes/sampler_lineup
          patch :sampler_order     # PATCH /api/admin/recipes/sampler_order
        end
      end
    end
  end
end