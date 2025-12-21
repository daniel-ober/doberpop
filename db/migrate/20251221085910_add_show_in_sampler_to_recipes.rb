class AddShowInSamplerToRecipes < ActiveRecord::Migration[6.1]
  def change
    # Only add the column if it does NOT already exist
    return if column_exists?(:recipes, :show_in_sampler)

    add_column :recipes, :show_in_sampler, :boolean, null: false, default: false
  end
end