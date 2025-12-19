class AddUserRefToRecipes < ActiveRecord::Migration[6.1]
  def change
    return if column_exists?(:recipes, :user_id)

    add_reference :recipes, :user, foreign_key: true, null: true
  end
end