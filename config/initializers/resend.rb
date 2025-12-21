# config/initializers/resend.rb
if defined?(Resend)
  api_key = ENV["RESEND_API_KEY"]

  if api_key.present?
    Resend.api_key = api_key
  else
    Rails.logger.warn("[Resend] RESEND_API_KEY is not set; email sending is disabled")
  end
end