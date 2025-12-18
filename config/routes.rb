Rails.application.routes.draw do
  # Auth
  post "/auth/login",  to: "authentication#login"
  get  "/auth/verify", to: "authentication#verify"

  # Public registration
  resources :users, only: [:create]

  # HTML Admin pages (frontend pages)
  namespace :admin do
    root to: "dashboard#index"
    get "/users",   to: "users#index"
    get "/recipes", to: "recipes#index"
  end

  # API (JSON only)
  namespace :api, path: "/api" do
    resources :recipes
    resources :ingredients

    get  "/recipes/:recipe_id/ingredients",     to: "ingredients#index"
    post "/recipes/:recipe_id/ingredients/:id", to: "ingredients#add_recipe"

    namespace :admin do
      resources :users,   only: [:index, :destroy]
      resources :recipes, only: [:index, :destroy]
    end
  end
end