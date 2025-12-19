# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # Turn OFF CSRF checks for JSON/API requests (we use JWT instead).
  # HTML (admin) requests still get normal CSRF protection.
  skip_forgery_protection if: -> { request.format.json? }

  # Expose current_user for controllers & views
  attr_reader :current_user
  helper_method :current_user

  private

  def encode_token(payload)
    JWT.encode(
      payload,
      Rails.application.secret_key_base,
      "HS256"
    )
  end

  def auth_header
    request.headers["Authorization"]
  end

  def decoded_token
    return nil unless auth_header&.start_with?("Bearer ")

    token = auth_header.split(" ")[1]

    begin
      JWT.decode(
        token,
        Rails.application.secret_key_base,
        true,
        algorithm: "HS256"
      )
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end

  def authorize_request
    decoded = decoded_token
    unless decoded
      render json: { error: "Missing token" }, status: :unauthorized and return
    end

    user_id = decoded[0]["user_id"]
    @current_user = User.find_by(id: user_id)

    unless @current_user
      render json: { error: "User not found" }, status: :unauthorized and return
    end
  end
end