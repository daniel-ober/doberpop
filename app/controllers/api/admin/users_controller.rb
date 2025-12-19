# app/controllers/api/admin/users_controller.rb
module Api
  module Admin
    class UsersController < BaseController
      # GET /api/admin/users
      def index
        users = User.order(:id)
        render json: users.as_json(
          only: %i[id username email admin created_at updated_at]
        )
      end
    end
  end
end