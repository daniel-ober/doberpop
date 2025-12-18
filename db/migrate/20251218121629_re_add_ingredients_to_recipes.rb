class ReAddIngredientsToRecipes < ActiveRecord::Migration[6.1]
  def up
    unless column_exists?(:recipes, :ingredients)
      add_column :recipes, :ingredients, :text
    end
  end

  def down
    if column_exists?(:recipes, :ingredients)
      remove_column :recipes, :ingredients
    end
  end
end