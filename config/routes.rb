# config/routes.rb
Rails.application.routes.draw do
  # ============================
  # AUTH (JWT)
  # ============================
  post "/auth/login",    to: "authentication#login"
  post "/auth/register", to: "authentication#register"
  get  "/auth/verify",   to: "authentication#verify"

  # ============================
  # ADMIN HTML (Frontend App)
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
    # RECIPES API  (used by /recipes page)
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
    get    "/favorites",                    to: "favorites#index"
    post   "/recipes/:recipe_id/favorite",  to: "favorites#create"
    delete "/recipes/:recipe_id/favorite",  to: "favorites#destroy"

    # ----------------------------
    # ADMIN API (JWT protected)
    # ----------------------------
    namespace :admin do
      resources :users,   only: [:index, :destroy]
      resources :recipes, only: [:index, :destroy]
    end
  end
end