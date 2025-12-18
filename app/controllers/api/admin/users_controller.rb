module Api
  module Admin
    class UsersController < Api::Admin::BaseController
      # GET /api/admin/users
      def index
        users = User.order(created_at: :desc)
        render json: users.as_json(only: [:id, :username, :email, :admin, :created_at, :updated_at])
      end

      # DELETE /api/admin/users/:id
      def destroy
        user = User.find(params[:id])
        user.destroy!
        head :no_content
      end
    end
  end
end
