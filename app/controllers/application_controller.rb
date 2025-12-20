class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  private

  # Encode a JWT with our secret
  def encode_token(payload)
    JWT.encode(payload, Rails.application.secret_key_base, "HS256")
  end

  # Read Authorization header (case-insensitive)
  def auth_header
    request.headers["Authorization"] || request.headers["authorization"]
  end

  # Decode the JWT payload (or nil if invalid/missing)
  def decoded_token
    return nil unless auth_header.present?

    token = auth_header.split(" ").last
    JWT.decode(
      token,
      Rails.application.secret_key_base,
      true,
      algorithm: "HS256"
    ).first
  rescue JWT::DecodeError, JWT::VerificationError
    nil
  end

  # Current user derived from JWT
  def current_user
    return @current_user if defined?(@current_user)

    @current_user =
      begin
        payload = decoded_token
        payload && User.find_by(id: payload["user_id"])
      rescue
        nil
      end
  end

  # Before_action for endpoints that REQUIRE login
  def authorize_request
    unless current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end
end