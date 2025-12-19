class AddSourceAndPublishedToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :source, :string, null: false, default: "user"
    add_column :recipes, :published, :boolean, null: false, default: false

    add_index :recipes, :source
    add_index :recipes, :published
  end
end