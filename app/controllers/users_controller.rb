class UsersController < ApplicationController
  # Public registration
  def create
    user = User.new(user_params)
    user.email = user.email.to_s.downcase

    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
