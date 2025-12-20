# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      "http://localhost:3000",
      "http://doberpop.com",
      "http://www.doberpop.com",
      "https://doberpop.com",
      "https://www.doberpop.com"
    )

    # Auth endpoints (login/register) – use cookies
    resource "/auth/*",
             headers: :any,
             methods: %i[post options],
             credentials: true

    # All API endpoints (including /api/admin/users, /api/admin/recipes)
    resource "/api/*",
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end