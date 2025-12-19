# app/controllers/authentication_controller.rb
class AuthenticationController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:login, :register]
  before_action :authorize_request, only: [:verify]

  # POST /auth/login
  def login
    # Allow either {identifier, password} or {authentication: {identifier, password}}
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
    render json: { user: safe_user_json(@current_user) }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end

  def safe_user_json(user)
    user.as_json(only: [:id, :username, :email, :admin, :created_at, :updated_at])
  end
end