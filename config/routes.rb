Rails.application.routes.draw do
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
  resources :ingredients, only: :index
  resources :recipes
  resources :users, only: :create
  post '/recipes/:recipe_id/ingredients/:id', to: 'ingredients#add_recipe'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
