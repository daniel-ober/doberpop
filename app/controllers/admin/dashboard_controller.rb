module Admin
  class DashboardController < ApplicationController
    before_action :authorize_request
    before_action :authorize_admin!

    def index
      render plain: "Admin dashboard OK"
    end
  end
end