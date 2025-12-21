# config/boot.rb
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup'   # Set up gems listed in the Gemfile.
require 'bootsnap/setup'  # Speed up boot time by caching expensive operations.
require 'logger'          # Ensure Logger is loaded for Ruby 3.1 + Rails 6.1