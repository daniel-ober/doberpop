# app/controllers/password_resets_controller.rb
class PasswordResetsController < ApplicationController
  # These endpoints are public – user is not logged in yet

  # POST /auth/password/forgot
  # Body: { email: "user@example.com" }
  def create
    email = params[:email].to_s.downcase
    user  = User.find_by(email: email)

    if user
      token = SecureRandom.urlsafe_base64(48)

      user.update(
        reset_password_token: token,
        reset_password_sent_at: Time.current
      )

      reset_url = "#{client_base_url}/reset-password?token=#{token}"

      begin
        # Using Resend gem
        Resend.api_key = ENV["RESEND_API_KEY"]

        Resend::Emails.send(
          from: "Doberpop <#{ENV.fetch("RESEND_FROM_EMAIL", "noreply-doberpopgourmet@gmail.com")}>",
          to: user.email,
          subject: "Reset your Doberpop password",
          html: <<~HTML
            <p>Hi #{user.username || "there"},</p>
            <p>You requested to reset your Doberpop password.</p>
            <p>
              <a href="#{reset_url}">Click here to reset your password</a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          HTML
        )
      rescue => e
        Rails.logger.error("Password reset email send failed: #{e.class} - #{e.message}")
        # Even if email fails, do NOT reveal that to the client (avoid account enumeration).
      end
    end

    # Always respond with generic success message to avoid user enumeration
    render json: {
      message: "If your email exists in our system, you'll receive a reset link shortly."
    }
  end

  # POST /auth/password/reset
  # Body: { token, password, password_confirmation }
  def update
    token = params[:token].to_s
    user  = User.find_by(reset_password_token: token)

    if user.nil? || token_expired?(user)
      return render json: { error: "Invalid or expired reset token." }, status: :unprocessable_entity
    end

    password              = params[:password].to_s
    password_confirmation = params[:password_confirmation].to_s

    if password.blank?
      return render json: { error: "Password is required." }, status: :unprocessable_entity
    end

    if password != password_confirmation
      return render json: { error: "Passwords do not match." }, status: :unprocessable_entity
    end

    if user.update(
      password: password,
      reset_password_token: nil,
      reset_password_sent_at: nil
    )
      render json: { message: "Password updated successfully." }
    else
      render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def token_expired?(user)
    user.reset_password_sent_at.blank? || user.reset_password_sent_at < 2.hours.ago
  end

  def client_base_url
    ENV.fetch("CLIENT_BASE_URL", "http://localhost:3000")
  end
end