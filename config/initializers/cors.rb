# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      'http://localhost:3000',
      'http://localhost:3001',
      'https://doberpop.com',
      'http://doberpop.com',
      'https://www.doberpop.com',
      'http://www.doberpop.com'
    )

    # Auth endpoints (login/register)
    resource '/auth/*',
      headers: :any,
      methods: [:post, :options]

    # Public API endpoints (includes /api/recipes, favorites, etc.)
    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]

    # (Optional but explicit) Admin endpoints
    resource '/api/admin/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end