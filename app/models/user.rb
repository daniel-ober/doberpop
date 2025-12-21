class User < ApplicationRecord
  has_secure_password

  has_many :recipes, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_recipes, through: :favorites, source: :recipe

  validates :username, presence: true, uniqueness: true
  validates :email,    presence: true, uniqueness: true

  # Only allow username change once every 90 days
  validate :username_change_cooldown, if: :will_save_change_to_username?

  # When username DOES change, stamp the time
  before_update :stamp_username_changed_at, if: :will_save_change_to_username?

  private

  def username_change_cooldown
    # If never changed before, allow it
    return if username_changed_at.nil?

    if username_changed_at > 90.days.ago
      days_left = ((username_changed_at + 90.days - Time.current) / 1.day).ceil
      errors.add(
        :username,
        "can only be changed once every 90 days. Please try again in #{days_left} day#{'s' if days_left != 1}."
      )
    end
  end

  def stamp_username_changed_at
    self.username_changed_at = Time.current
  end
end