class AddLastUsernameChangeAtToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :last_username_change_at, :datetime
  end
end
