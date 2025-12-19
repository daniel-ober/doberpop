class Recipe < ApplicationRecord
  belongs_to :user
  has_many :favorites, dependent: :destroy

  # expose computed select aliases when present
  def favorites_count
    self[:favorites_count].to_i
  end

  def owner_username
    self[:owner_username]
  end
end
