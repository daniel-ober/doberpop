# app/controllers/api/admin/recipes_controller.rb
module Api
  module Admin
    class RecipesController < ApplicationController
      before_action :authorize_request
      before_action :require_admin!

      # GET /api/admin/recipes
      def index
        recipes = Recipe.includes(:user).order(created_at: :desc)

        render json: recipes.as_json(
          only: [
            :id,
            :name,
            :source,
            :published,
            :created_at,
            :updated_at
          ],
          include: {
            user: {
              only: [:id, :username, :email]
            }
          }
        )
      end

      # DELETE /api/admin/recipes/:id
      def destroy
        recipe = Recipe.find(params[:id])
        recipe.destroy
        head :no_content
      end

      private

      def require_admin!
        unless @current_user&.admin?
          render json: { error: "Forbidden" }, status: :forbidden
        end
      end
    end
  end
end