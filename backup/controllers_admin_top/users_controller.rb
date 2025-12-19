# app/controllers/api/admin/users_controller.rb
class Api::Admin::UsersController < ApplicationController
  before_action :authorize_request
  before_action :require_admin

  def index
    users = User.order(created_at: :desc)
    render json: users.as_json(
      only: [:id, :username, :email, :admin, :created_at, :updated_at]
    )
  end
end