source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.4"

# =============================
# Core Rails Dependencies
# =============================
gem 'rails', '~> 6.1.3', '>= 6.1.3.1'

# FIX compatibility
gem 'globalid', '~> 1.2'
gem 'nokogiri', '~> 1.15'

# =============================
# Database / Server
# =============================
gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'

# =============================
# Auth
# =============================
gem 'bcrypt', '~> 3.1.7'
gem 'jwt'

# =============================
# CORS
# =============================
gem 'rack-cors'

# =============================
# Email (RESET PASSWORD / NOTIFICATIONS)
# =============================
gem "resend"

# =============================
# Dev & Test
# =============================
group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'listen', '~> 3.3'
  gem 'spring'
  gem 'pry-rails'
  gem 'awesome_print'
end

# =============================
# Windows
# =============================
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]