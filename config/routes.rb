Rails.application.routes.draw do
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
  resources :ingredients
  resources :recipes
  resources :users, only: :create
  get '/recipes/:recipe_id/ingredients/', to: 'ingredients#index'
  post '/recipes/:recipe_id/ingredients/:id', to: 'ingredients#add_recipe'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end