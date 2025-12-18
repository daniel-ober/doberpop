# app/controllers/api/admin/base_controller.rb
module Api
  module Admin
    class BaseController < ApplicationController
      before_action :authorize_request
      before_action :authorize_admin!

      private

      def authorize_admin!
        return if @current_user&.admin?

        render json: { error: "Forbidden" }, status: :forbidden
      end
    end
  end
end