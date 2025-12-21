# app/controllers/api/account_controller.rb
module Api
  class AccountController < ApplicationController
    before_action :authorize_request
    # We're a JSON API endpoint called from localhost:3001 (React),
    # so skip Rails' cookie-based CSRF check here.
    skip_before_action :verify_authenticity_token

    # GET /api/account
    def show
      render json: { user: serialized_user(@current_user) }
    end

    # PATCH/PUT /api/account
    def update
      user = @current_user
      username_before = user.username

      user.username = params[:username].to_s.strip if params.key?(:username)
      user.email    = params[:email].to_s.strip    if params.key?(:email)

      # Track username change timestamp if it changed
      if user.username.present? && user.username != username_before
        user.username_changed_at = Time.current
      end

      # Optional password change
      if params[:current_password].present? || params[:new_password].present?
        unless params[:current_password].present? && params[:new_password].present?
          return render json: {
            error: "Both current_password and new_password are required to change your password."
          }, status: :unprocessable_entity
        end

        unless user.authenticate(params[:current_password])
          return render json: { error: "Current password is incorrect." },
                        status: :unprocessable_entity
        end

        user.password = params[:new_password]
      end

      if user.save
        render json: { user: serialized_user(user) }, status: :ok
      else
        render json: { error: user.errors.full_messages.join(", ") },
               status: :unprocessable_entity
      end
    end

    # DELETE /api/account
    #
    # Self-service account deletion.
    # Assumes User has proper `dependent: :destroy`
    # relationships (favorites, batches, etc.)
    def destroy
      user = @current_user

      User.transaction do
        user.destroy!
      end

      render json: { message: "Account deleted successfully." }, status: :ok

    rescue ActiveRecord::RecordInvalid,
           ActiveRecord::RecordNotDestroyed => e

      Rails.logger.error "[ACCOUNT DELETE FAILED] #{e.message}"

      render json: {
        error: "Unable to delete account: #{e.message}"
      }, status: :unprocessable_entity
    end

    private

    def serialized_user(user)
      return nil unless user

      user.as_json(
        only: [
          :id,
          :username,
          :email,
          :created_at,
          :updated_at,
          :username_changed_at
        ]
      )
    end
  end
end