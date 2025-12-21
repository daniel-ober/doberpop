class AddSamplerFieldsToRecipes < ActiveRecord::Migration[6.1]
  def change
    add_column :recipes, :show_in_sampler, :boolean
    add_column :recipes, :sampler_position, :integer
  end
end
