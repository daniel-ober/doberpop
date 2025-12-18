class User < ApplicationRecord
  # existing associations...

  has_many :favorites, dependent: :destroy
  has_many :favorite_recipes, through: :favorites, source: :recipe
end