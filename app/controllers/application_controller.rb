# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  SECRET_KEY = Rails.application.secrets.secret_key_base.to_s

  def encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(decoded)
  end

  def authorize_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header

    begin
      @decoded = decode(token)
      @current_user = User.find(@decoded[:id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end

  # For admin-only routes
  # Admin is allowed if:
  # - user.admin? returns true (if you have that)
  # OR
  # - email/username matches your explicit admin allowlist
  def authorize_admin!
    authorize_request
    return if performed?

    is_admin =
      (@current_user.respond_to?(:admin?) && @current_user.admin?) ||
      @current_user&.email == "danober.dev@gmail.com" ||
      @current_user&.username == "ober31"

    unless is_admin
      render json: { errors: "Forbidden" }, status: :forbidden
    end
  end
end