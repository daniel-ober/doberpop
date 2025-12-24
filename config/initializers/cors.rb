Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      'http://localhost:3000',
      'http://localhost:3001',
      # ✅ Netlify frontend (primary for now)
      'https://doberpop.netlify.app',
      'http://doberpop.netlify.app',
      # ✅ Keep these so they’ll still work later when you fix SSL
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