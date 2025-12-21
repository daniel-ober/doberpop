class AddSamplerPositionToRecipes < ActiveRecord::Migration[6.1]
  def change
    # Only add the column if it does NOT already exist
    return if column_exists?(:recipes, :sampler_position)

    add_column :recipes, :sampler_position, :integer, null: false, default: 0
  end
end