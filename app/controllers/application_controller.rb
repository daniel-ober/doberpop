# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # For API-style JSON endpoints, don't blow up on CSRF – just use a null session
  protect_from_forgery with: :null_session

  private

  def encode_token(payload)
    # You can swap this back to whatever you originally used – this is a sane default
    JWT.encode(payload, Rails.application.secret_key_base, "HS256")
  end

  def auth_header
    request.headers["Authorization"]
  end

  def decoded_token
    return nil unless auth_header&.start_with?("Bearer ")

    token = auth_header.split(" ")[1]

    begin
      JWT.decode(token, Rails.application.secret_key_base, true, algorithm: "HS256")
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