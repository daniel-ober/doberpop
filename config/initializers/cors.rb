# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://doberpop.com',
      'https://doberpop.com',
      'http://www.doberpop.com',
      'https://www.doberpop.com'
    )

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end