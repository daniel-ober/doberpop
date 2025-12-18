# app/controllers/authentication_controller.rb

class AuthenticationController < ApplicationController
  before_action :authorize_request, except: :login

  # POST /auth/login
  #
  # Accepts username OR email via `authentication.identifier`
  # Always returns a general error message on auth failure (anti-enumeration).
  def login
    identifier = login_params[:identifier].to_s.strip
    password   = login_params[:password].to_s

    # Find by username OR email (case-insensitive)
    @user = User.where(
      "lower(username) = ? OR lower(email) = ?",
      identifier.downcase,
      identifier.downcase
    ).first

    if @user&.authenticate(password) # authenticate provided by has_secure_password
      token = encode({ id: @user.id })

      render json: {
        user: @user.attributes.except("password_digest"),
        token: token
      }, status: :ok
    else
      render json: { errors: "Invalid username/email or password." }, status: :unauthorized
    end
  end

  # GET /auth/verify
  def verify
    render json: @current_user.attributes.except("password_digest"), status: :ok
  end

  private

  def login_params
    # Supports new payload:
    # { authentication: { identifier: "usernameOrEmail", password: "..." } }
    # (You can keep sending username too, but identifier is the preferred field.)
    params.require(:authentication).permit(:identifier, :username, :password)
  end
end