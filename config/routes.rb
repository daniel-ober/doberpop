# config/routes.rb
Rails.application.routes.draw do
  # ============================
  # AUTH (JWT)
  # ============================
  post  "/auth/login",   to: "authentication#login"
post  "/auth/register", to: "authentication#register"
get   "/auth/verify",  to: "authentication#verify"
patch "/auth/account", to: "authentication#update_account"


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
    # ----------------------------
    get   "/account", to: "account#show"
    patch "/account", to: "account#update"
    put   "/account", to: "account#update"

    # ----------------------------
    # ADMIN API (JWT protected)
    # ----------------------------
    namespace :admin do
      resources :users,   only: [:index, :destroy]
      resources :recipes, only: [:index, :update, :destroy]
    end
  end
end