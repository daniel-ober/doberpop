# app/controllers/authentication_controller.rb
class AuthenticationController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:login, :register, :update_account]
  before_action :authorize_request, only: [:verify, :update_account]

  # POST /auth/login
  def login
    auth = params[:authentication] || params

    identifier = auth[:identifier].to_s.strip.downcase
    password   = auth[:password].to_s

    user = User.find_by(email: identifier) || User.find_by(username: identifier)

    unless user&.authenticate(password)
      render json: { error: "Invalid username/email or password" }, status: :unauthorized
      return
    end

    token = encode_token(user_id: user.id)
    render json: { user: safe_user_json(user), token: token }, status: :ok
  end

  # POST /auth/register
  def register
    user = User.new(user_params)

    if user.save
      token = encode_token(user_id: user.id)
      render json: { user: safe_user_json(user), token: token }, status: :created
    else
      render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  # GET /auth/verify
  def verify
    render json: { user: safe_user_json(current_user) }, status: :ok
  end

  # PATCH /auth/account
  def update_account
    user = current_user
    unless user
      render json: { error: "Unauthorized" }, status: :unauthorized
      return
    end

    username         = params[:username].to_s.strip
    email            = params[:email].to_s.strip
    current_password = params[:current_password].to_s
    new_password     = params[:new_password].to_s

    # If changing password, verify current password first
    if new_password.present?
      unless user.authenticate(current_password)
        render json: { error: "Current password is incorrect" }, status: :unprocessable_entity
        return
      end
      user.password = new_password
    end

    user.username = username if username.present? && username != user.username
    user.email    = email if email.present? && email != user.email

    if user.save
      render json: { user: safe_user_json(user) }, status: :ok
    else
      render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end

  def safe_user_json(user)
    return nil unless user

    user.as_json(only: [:id, :username, :email, :admin, :created_at, :updated_at])
  end
end