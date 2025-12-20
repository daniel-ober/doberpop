# app/controllers/api/admin/base_controller.rb
module Api
  module Admin
    class BaseController < ApplicationController
      protect_from_forgery with: :null_session
      skip_before_action :verify_authenticity_token

      before_action :authorize_request
      before_action :require_admin!

      private

      def require_admin!
        unless current_user&.admin?
          render json: { error: "Forbidden" }, status: :forbidden
        end
      end
    end
  end
end