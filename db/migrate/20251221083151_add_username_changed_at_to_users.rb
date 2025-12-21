# db/migrate/XXXXXXXXXXXX_add_username_changed_at_to_users.rb
class AddUsernameChangedAtToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :username_changed_at, :datetime
  end
end