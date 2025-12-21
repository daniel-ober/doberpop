class AddToolsAndSuppliesToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :tools_and_supplies, :text
  end
end
