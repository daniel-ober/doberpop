# app/controllers/api/account_controller.rb
class Api::AccountController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  # All account actions require a valid JWT
  before_action :authorize_request

  # =========================
  # GET /api/account
  # =========================
  # Returns the current user's profile (no password).
  def show
    user = current_user

    render json: user.as_json(
      only: %i[id username email admin created_at updated_at]
    )
  end

  # =========================
  # PATCH/PUT /api/account
  # =========================
  # Allows the current user to:
  # - change username
  # - change email
  # - optionally change password (with current_password)
  def update
    user = current_user

    permitted = params.permit(
      :username,
      :email,
      :current_password,
      :password,
      :password_confirmation
    )

    # Apply username / email changes if present
    user.username = permitted[:username] if permitted.key?(:username)
    user.email    = permitted[:email]    if permitted.key?(:email)

    # Handle optional password change
    if permitted[:password].present?
      unless user.authenticate(permitted[:current_password].to_s)
        return render json: { error: "Current password is incorrect" },
                      status: :unprocessable_entity
      end

      user.password              = permitted[:password]
      user.password_confirmation = permitted[:password_confirmation]
    end

    if user.save
      render json: user.as_json(
        only: %i[id username email admin created_at updated_at]
      )
    else
      render json: { error: user.errors.full_messages },
             status: :unprocessable_entity
    end
  end
end