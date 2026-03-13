class User < ApplicationRecord
  has_secure_password

  has_many :recipes, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorite_recipes, through: :favorites, source: :recipe

  validates :username, presence: true, uniqueness: true
  validates :email,    presence: true, uniqueness: true

  validate :username_change_cooldown, if: :will_save_change_to_username?
  before_update :stamp_username_changed_at, if: :will_save_change_to_username?

  validates :password,
    length: { minimum: 8 },
    format: {
      with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+\z/,
      message: "must include at least one lowercase letter, one uppercase letter, one number, and one special character"
    },
    if: :password_present?

  private

  def password_present?
    password.present?
  end

  def username_change_cooldown
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