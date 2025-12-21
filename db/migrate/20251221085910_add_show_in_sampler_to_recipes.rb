class AddShowInSamplerToRecipes < ActiveRecord::Migration[7.0] # match your app's version
  def change
    add_column :recipes, :show_in_sampler, :boolean, null: false, default: false
    add_index  :recipes, :show_in_sampler
  end
end