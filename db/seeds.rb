puts "Seeding recipes…"

# Pick a user to own seeded recipes.
# Uses first existing user; if none exists, creates a seed user.
seed_user =
  if defined?(User) && User.count > 0
    User.first
  else
    User.create!(
      username: "seed_user",
      email: "seed@doberpop.local",
      password: "password"
    )
  end

# Helper: store ingredients as a newline-separated text field
def attach_ingredients!(recipe, names)
  return unless names && names.any?

  list = names.map(&:to_s).map(&:strip).reject(&:empty?).join("\n")
  recipe.ingredients = list
  recipe.save!
end

# ===============================
# SAFE UPSERT — NEVER OVERWRITE
# ===============================
def upsert_recipe!(seed_user, attrs)
  ingredients = attrs.delete(:ingredients) || []

  recipe = Recipe.find_or_initialize_by(name: attrs[:name])

  if recipe.new_record?
    # Create brand-new recipe only
    recipe.user_id ||= seed_user.id
    recipe.assign_attributes(attrs)
    recipe.save!
    puts "➕ Created recipe #{recipe.name}"
  else
    
    # DO NOT TOUCH EXISTING RECIPES
    if recipe.user_id.blank?
      recipe.update!(user_id: seed_user.id)
      puts "✔ Linked #{recipe.name} to #{seed_user.username}"
    else
      puts "• Skipped existing recipe #{recipe.name} (NO CHANGES)"
    end
  end

  recipe
end

RECIPES = [
  # --- Existing 3 (kept exactly, cleaned kernel_types typo) ---
  {
    name: "Cookies & Cream",
    kernel_type: "Mushroom",
    yield: 5,
    description: "Soft Oreo crumble folded into vanilla-white chocolate drizzle with a finishing dust of cookie.",
    instructions: <<~TXT.strip,
      - Melt 1 tbsp refined coconut oil in a heavy pot or whirley-pop.
      - Add 1/4 cup mushroom kernels; cover and pop until slow.
      - Pour popped corn into a large bowl; remove unpopped kernels.
      - Melt 2 cups white chocolate (microwave 20s bursts or double boiler).
      - Quickly fold in 3/4 cup crushed Oreos.
      - Drizzle over popcorn and toss gently to coat.
      - Sprinkle remaining crushed Oreos on top; cool 15–20 min before bagging.
    TXT
    ingredients: ["coconut oil", "mushroom kernels", "white chocolate", "oreo cookies", "salt"]
  },
  {
    name: "Maple & Bourbon",
    kernel_type: "Jumbo",
    yield: 6,
    description: "Candy-glaze maple popcorn with a warm bourbon note and a cinnamon sugar finish.",
    instructions: <<~TXT.strip,
      - Pop 1/4 cup jumbo kernels in 1 tbsp refined coconut oil; transfer to a large bowl.
      - In a small saucepan over medium heat: warm 1/4 cup maple syrup until loose and bubbling.
      - Stir in 2 oz bourbon; bring back to a gentle boil.
      - Reduce heat and whisk 2 minutes until slightly thickened.
      - Drizzle over popcorn while tossing continuously.
      - Finish with a light sprinkle of cinnamon sugar; cool 20 minutes.
    TXT
    ingredients: ["coconut oil", "jumbo kernels", "maple syrup", "bourbon", "cinnamon", "sugar", "salt"]
  },
  {
    name: "Chicago Style",
    kernel_type: "Mushroom",
    yield: 8,
    description: "A classic sweet-and-savory combo: caramel + cheddar on sturdy mushroom corn.",
    instructions: <<~TXT.strip,
      - Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil; transfer to a large bowl.
      - Toss half the batch with cheddar coating (see below).
      - For caramel batch: warm caramel glaze until pourable; drizzle and toss to coat.
      - Combine both batches lightly for the classic Chicago mix.
      - Cheddar coating: mix 1/3 cup cheddar powder with 4 tbsp melted coconut oil; drizzle and toss.
    TXT
    ingredients: ["coconut oil", "mushroom kernels", "cheddar powder", "caramel", "salt"]
  },

  # --- All additional flavors from your list ---
  {
    name: "Bacon & Cheddar",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Savory cheddar popcorn finished with smoky bacon and a little black pepper.",
    instructions: <<~TXT.strip,
      - Pop 1/4 cup mushroom kernels in 1 tbsp coconut oil; transfer to bowl.
      - Melt 4 tbsp coconut oil or butter; whisk in 1/3 cup cheddar powder.
      - Drizzle over popcorn while tossing; coat evenly.
      - Add 3–4 tbsp bacon bits and a pinch of black pepper; toss again.
    TXT
    ingredients: ["coconut oil", "mushroom kernels", "cheddar powder", "bacon bits", "black pepper", "salt"]
  },
  {
    name: "Birthday Cake",
    kernel_type: "Mushroom",
    yield: 5,
    description: "White-chocolate cake batter vibe with sprinkles and a tiny vanilla pop.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 1 1/2 cups white chocolate; stir in 1 tsp vanilla.
      - Drizzle and toss to coat.
      - Dust lightly with 2–3 tbsp cake mix (optional) and add sprinkles.
      - Cool until set.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "white chocolate", "vanilla", "sprinkles", "cake mix", "salt"]
  },
  {
    name: "Buffalo Ranch",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Buffalo heat + cool ranch dust — game-day popcorn that actually tastes like wings.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 3 tbsp butter; whisk in 2 tbsp hot sauce.
      - Drizzle over popcorn while tossing.
      - Dust with 2 tbsp ranch seasoning + pinch of garlic powder.
      - Toss and let dry 10 minutes.
    TXT
    ingredients: ["mushroom kernels", "butter", "hot sauce", "ranch seasoning", "garlic powder", "salt"]
  },
  {
    name: "Classic Butter",
    kernel_type: "Jumbo",
    yield: 6,
    description: "Simple, rich, movie-theater butter flavor with a clean salt finish.",
    instructions: <<~TXT.strip,
      - Pop jumbo kernels in coconut oil.
      - Melt 4 tbsp butter; drizzle while tossing.
      - Finish with fine salt to taste.
    TXT
    ingredients: ["jumbo kernels", "coconut oil", "butter", "salt"]
  },
  {
    name: "Classic Cheddar",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Straight cheddar goodness on sturdy mushroom corn.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 4 tbsp coconut oil; whisk in 1/3 cup cheddar powder.
      - Drizzle and toss until evenly coated.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "cheddar powder", "salt"]
  },
  {
    name: "Cracked Pepper & Asiago",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Cheesy asiago with a peppery bite — savory and upscale.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 3 tbsp butter; drizzle and toss.
      - Dust with 2–3 tbsp asiago powder (or finely grated asiago) and cracked pepper.
      - Toss again; finish with salt.
    TXT
    ingredients: ["mushroom kernels", "butter", "asiago", "black pepper", "salt"]
  },
  {
    name: "Dill Pickle",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Tangy dill pickle seasoning with a little garlic and vinegar zing.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Mist lightly with melted butter or oil (2–3 tbsp total).
      - Dust with dill pickle seasoning; toss well.
      - Add pinch of citric acid (optional) for extra tang.
    TXT
    ingredients: ["mushroom kernels", "butter", "dill pickle seasoning", "citric acid", "salt"]
  },
  {
    name: "English Toffee Candy (Holiday)",
    kernel_type: "Mushroom",
    yield: 5,
    description: "Buttery toffee glaze with a holiday crunch — sweet, rich, and snacky.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Warm toffee bits or toffee sauce until pourable.
      - Drizzle and toss to coat.
      - Optional: finish with a pinch of flaky salt; cool to set.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "toffee", "butter", "salt"]
  },
  {
    name: "Jalapeño & Cheddar",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Classic cheddar with a jalapeño kick — spicy, cheesy, addictive.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 4 tbsp coconut oil; whisk in cheddar powder.
      - Drizzle and toss; then dust with jalapeño powder/seasoning.
      - Toss and finish with salt.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "cheddar powder", "jalapeno seasoning", "salt"]
  },
  {
    name: "Jalapeño",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Straight jalapeño heat with a clean salty finish.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Mist or drizzle with 2–3 tbsp melted butter/oil.
      - Dust with jalapeño seasoning and toss well.
    TXT
    ingredients: ["mushroom kernels", "butter", "jalapeno seasoning", "salt"]
  },
  {
    name: "Nacho Cheddar",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Bold nacho-style cheese flavor with a touch of paprika.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 4 tbsp coconut oil; whisk in nacho cheese powder.
      - Drizzle and toss; add a pinch of paprika if desired.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "nacho cheese powder", "paprika", "salt"]
  },
  {
    name: "Peppermint Cookie",
    kernel_type: "Mushroom",
    yield: 5,
    description: "White chocolate + peppermint + cookie crumble — holiday dessert popcorn.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 1 1/2 cups white chocolate; stir in 1/2 tsp peppermint extract.
      - Drizzle and toss.
      - Sprinkle crushed peppermint candies + cookie crumbs; cool to set.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "white chocolate", "peppermint extract", "peppermint candy", "cookies", "salt"]
  },
  {
    name: "Pepperoni Pizza",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Pizza seasoning + parmesan + pepperoni bits — it weirdly works.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Melt 3 tbsp butter; drizzle and toss.
      - Dust with pizza seasoning + parmesan.
      - Add 2–3 tbsp finely chopped pepperoni (or pepperoni powder); toss.
    TXT
    ingredients: ["mushroom kernels", "butter", "pizza seasoning", "parmesan", "pepperoni", "salt"]
  },
  {
    name: "Ranch",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Cool ranch seasoning on crisp popcorn — simple and solid.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Drizzle with 2–3 tbsp melted butter.
      - Dust with ranch seasoning; toss well.
    TXT
    ingredients: ["mushroom kernels", "butter", "ranch seasoning", "salt"]
  },
  {
    name: "Salted Caramel & Dark Chocolate",
    kernel_type: "Mushroom",
    yield: 5,
    description: "Deep caramel glaze + dark chocolate drizzle + sea salt finish.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Drizzle caramel over popcorn and toss.
      - Melt dark chocolate; drizzle in thin ribbons.
      - Finish with flaky sea salt; cool to set.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "caramel", "dark chocolate", "sea salt"]
  },
  {
    name: "Salted Caramel",
    kernel_type: "Mushroom",
    yield: 5,
    description: "Buttery caramel glaze with a clean sea salt finish.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Warm caramel until pourable; drizzle and toss.
      - Finish with flaky sea salt; cool to set.
    TXT
    ingredients: ["mushroom kernels", "coconut oil", "caramel", "sea salt"]
  },
  {
    name: "Sour Cream & Onion",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Savory tang with onion-forward seasoning.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Drizzle with 2–3 tbsp melted butter.
      - Dust with sour cream & onion seasoning; toss well.
    TXT
    ingredients: ["mushroom kernels", "butter", "sour cream & onion seasoning", "salt"]
  },
  {
    name: "Spicy Sriracha",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Sweet heat sriracha glaze with a light garlic finish.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Warm 2 tbsp sriracha + 2 tbsp honey + 2 tbsp melted butter; whisk.
      - Drizzle over popcorn while tossing.
      - Optional: dust with garlic powder; let dry 10 minutes.
    TXT
    ingredients: ["mushroom kernels", "butter", "sriracha", "honey", "garlic powder", "salt"]
  },
  {
    name: "Tex Mex",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Chili-lime + cumin + cheddar vibes — taco-night popcorn.",
    instructions: <<~TXT.strip,
      - Pop mushroom kernels; transfer to bowl.
      - Drizzle with 2–3 tbsp melted butter.
      - Dust with chili-lime seasoning, cumin, and a touch of smoked paprika.
      - Toss well; finish with salt.
    TXT
    ingredients: ["mushroom kernels", "butter", "chili lime seasoning", "cumin", "smoked paprika", "salt"]
  },
  {
    name: "Blast-Off Chedda n Ranch",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Softer-crunch mushroom popcorn totally dominated by cheddar with extra blasts of cheddar and ranch. Loud, snacky, and ridiculous in the best way.",
    instructions: <<~TXT.strip,
      - Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil; transfer to a large bowl and remove unpopped kernels.
      - In a small bowl, melt 4 tbsp butter (or coconut oil).
      - Whisk in 1/3 cup cheddar powder and 2–3 tbsp ranch seasoning until smooth.
      - Drizzle over the warm popcorn while tossing constantly for even coverage.
      - Finish with a pinch of black pepper and a tiny pinch of cayenne (optional) for extra “blast-off.”
      - Spread on a parchment-lined sheet to dry 10–15 minutes before bagging.
    TXT
    ingredients: [
      "mushroom kernels",
      "coconut oil",
      "butter",
      "cheddar powder",
      "ranch seasoning",
      "black pepper",
      "cayenne",
      "salt"
    ]
  },
  {
    name: "Peanut Butter CupCorn",
    kernel_type: "Mushroom",
    yield: 6,
    description: "Milk chocolate infused with peanut butter poured thick over mushroom popcorn. Melts in your mouth (and hands) with classic peanut butter cup vibes.",
    instructions: <<~TXT.strip,
      - Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil; transfer to a large bowl and remove unpopped kernels.
      - In a microwave-safe bowl, combine 1 1/2 cups milk chocolate chips and 1/2 cup creamy peanut butter.
      - Microwave in 20–30 second bursts, stirring between each, until fully melted and smooth.
      - Pour the warm peanut butter chocolate over the popcorn while tossing gently with a spatula.
      - Keep folding until the popcorn is evenly coated and glossy.
      - Spread onto a parchment-lined baking sheet and let set 20–30 minutes (or chill briefly) before breaking into clusters.
    TXT
    ingredients: [
      "mushroom kernels",
      "coconut oil",
      "milk chocolate chips",
      "peanut butter",
      "salt"
    ]
  },
  {
    name: "Breakfast of Champions",
    kernel_type: "Wisconsin Birch",
    yield: 6,
    description: "Fruity Pebbles folded into a creamy white chocolate coating. Smooth, balanced, fun, fruity — basically cereal milk popcorn.",
    instructions: <<~TXT.strip,
      - Pop 1/4 cup Wisconsin Birch (or similar hearty) kernels in 1 tbsp refined coconut oil; transfer to a large bowl and pull out unpopped kernels.
      - In a microwave-safe bowl, melt 1 1/2 cups white chocolate chips in 20–30 second bursts, stirring until smooth.
      - Stir in 1–2 tsp vanilla or marshmallow flavoring (optional) for that cereal-milk note.
      - Gently fold in 1 to 1 1/2 cups Fruity Pebbles cereal until evenly suspended in the chocolate.
      - Quickly drizzle and fold the cereal–chocolate mixture through the warm popcorn until coated.
      - Spread on a parchment-lined sheet and let set completely before breaking into clusters.
    TXT
    ingredients: [
      "wisconsin birch kernels",
      "coconut oil",
      "white chocolate chips",
      "vanilla extract",
      "fruity pebbles cereal",
      "salt"
    ]
  }
]

RECIPES.each do |attrs|
  upsert_recipe!(seed_user, attrs.dup)
end

puts "✅ Seeded #{RECIPES.length} recipes for user_id=#{seed_user.id}"