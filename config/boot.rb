# config/boot.rb

# Ensure the standard Logger constant is loaded before ActiveSupport
require 'logger'

# Point Bundler at the Gemfile
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

# Set up gems listed in the Gemfile
require 'bundler/setup'

# IMPORTANT: We are *not* loading bootsnap at all anymore.
# No `require "bootsnap/setup"` here.