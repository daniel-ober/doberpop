class CreateRecipes < ActiveRecord::Migration[6.1]
  def change
    create_table :recipes do |t|
      t.string :name
      t.string :kernal
      t.text :instructions
      t.integer :yield
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
