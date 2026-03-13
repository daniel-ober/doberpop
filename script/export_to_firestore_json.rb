require "json"

def time_or_nil(value)
  value&.iso8601
end

users = User.all.map do |u|
  {
    id: u.id,
    uid: u.id.to_s,
    username: u.username,
    email: u.email,
    admin: !!u.admin,
    password_digest: u.password_digest,
    username_changed_at: time_or_nil(u.username_changed_at),
    created_at: time_or_nil(u.created_at),
    updated_at: time_or_nil(u.updated_at)
  }
end

recipes = Recipe.all.map do |r|
  {
    id: r.id,
    name: r.name,
    description: r.description,
    kernel_type: r.kernel_type,
    yield: r.yield,
    instructions: r.instructions,
    ingredients: r.ingredients,
    tools_and_supplies: r.tools_and_supplies,
    hero_image_url: r.hero_image_url,
    additional_photo_urls: r.additional_photo_urls || [],
    source: r.source,
    published: !!r.published,
    show_in_sampler: !!r.show_in_sampler,
    sampler_position: r.sampler_position,
    user_id: r.user_id,
    favorites_count: r.favorites.count,
    created_at: time_or_nil(r.created_at),
    updated_at: time_or_nil(r.updated_at)
  }
end

favorites = Favorite.all.map do |f|
  {
    id: "#{f.user_id}_#{f.recipe_id}",
    user_id: f.user_id,
    recipe_id: f.recipe_id,
    created_at: time_or_nil(f.created_at),
    updated_at: time_or_nil(f.updated_at)
  }
end

payload = {
  users: users,
  recipes: recipes,
  favorites: favorites
}

File.write("tmp/firestore_export.json", JSON.pretty_generate(payload))

puts "Exported:"
puts "  Users: #{users.length}"
puts "  Recipes: #{recipes.length}"
puts "  Favorites: #{favorites.length}"
puts "  File: tmp/firestore_export.json"