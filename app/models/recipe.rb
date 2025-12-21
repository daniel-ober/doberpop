# app/models/recipe.rb
class Recipe < ApplicationRecord
  belongs_to :user, optional: true

  has_many :favorites, dependent: :destroy
  has_many :favorited_users, through: :favorites, source: :user

  # how many times this recipe has been favorited
  def favorites_count
    favorites.size
  end

  # compact list of users for the admin modal
  def favorited_users_for_admin
    favorited_users
      .select(:id, :username, :email)
      .map { |u| { id: u.id, username: u.username, email: u.email } }
  end

  # Ensure the admin API + public API always see clean sampler fields
  def as_json(options = {})
    super(options).merge(
      show_in_sampler: show_in_sampler == true, # coerce nil → false
      sampler_position: sampler_position
    )
  end
end