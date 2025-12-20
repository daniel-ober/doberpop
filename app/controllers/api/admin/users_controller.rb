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

      # DELETE /api/admin/users/:id
      def destroy
        user = User.find(params[:id])

        # Safety: don't let the current admin delete themself
        if user == current_user
          return render json: { error: "You can't delete your own account." },
                        status: :unprocessable_entity
        end

        user.destroy!

        # Frontend doesn't care about body, just needs a 2xx.
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      rescue ActiveRecord::RecordNotDestroyed => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end