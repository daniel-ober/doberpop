class KernelType < ActiveRecord::Migration[6.1]
  def change
    rename_column :recipes, :kernal, :kernel_type
  end
end
