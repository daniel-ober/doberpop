class AddImagesToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :hero_image_url, :string
    add_column :recipes, :additional_photo_urls, :json, default: [], null: false
  end
end