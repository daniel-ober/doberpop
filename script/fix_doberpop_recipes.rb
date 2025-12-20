# script/fix_doberpop_recipes.rb
#
# Run in development:
#   DISABLE_SPRING=1 rails runner script/fix_doberpop_recipes.rb
#
# Run against Render (production):
#   DATABASE_URL="postgresql://..." RAILS_ENV=production DISABLE_SPRING=1 \
#     rails runner script/fix_doberpop_recipes.rb

# ----------------------------------------
# INGREDIENTS – newline-separated strings
# ----------------------------------------
INGREDIENT_SETS = {
  "Cookies & Cream" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp refined coconut oil (for popping)
    2 cups white chocolate chips
    1 1/2 cups Oreo-style sandwich cookies, crushed (divided)
    Pinch of salt
  TEXT

  "Maple & Bourbon" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp refined coconut oil (for popping)
    1/3 cup pure maple syrup
    2 tbsp unsalted butter
    1–2 tbsp bourbon (to taste; optional cook-off)
    Pinch of kosher salt
  TEXT

  "Chicago Style" => <<~TEXT.strip,
    1/2 cup mushroom kernels (divided for 2 batches)
    2 tbsp neutral oil (for popping)
    1/3 cup caramel sauce
    1/3 cup cheddar cheese powder
    3 tbsp butter (melted, divided)
    Pinch of flaky sea salt
  TEXT

  "Bacon & Cheddar" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    1/3 cup cheddar cheese powder
    1/4–1/3 cup finely crumbled cooked bacon
    Pinch of black pepper
    Pinch of salt (optional, depending on bacon)
  TEXT

  "Birthday Cake" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp refined coconut oil (for popping)
    1 1/2 cups white chocolate chips
    1/3 cup dry cake mix (vanilla or funfetti)
    1/4 cup rainbow sprinkles (plus extra for topping)
    Pinch of salt
  TEXT

  "Buffalo Ranch" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter
    2 tbsp hot sauce (Frank’s-style)
    2–3 tbsp ranch seasoning
    Pinch of garlic powder
    Pinch of salt (to taste)
  TEXT

  "Classic Butter" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3–4 tbsp butter (melted)
    Kosher salt, to taste
  TEXT

  "Classic Cheddar" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    1/3 cup cheddar cheese powder
    Pinch of salt (if needed)
  TEXT

  "Cracked Pepper & Asiago" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    1/3 cup finely grated asiago cheese
    1–2 tsp freshly cracked black pepper
    Pinch of salt
  TEXT

  "Dill Pickle" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    2–3 tbsp dill pickle seasoning
    Pinch of garlic powder
    Pinch of salt (to taste)
  TEXT

  "English Toffee Candy (Holiday)" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    1/2 cup unsalted butter
    1/2 cup granulated sugar
    2 tbsp light corn syrup (optional, for stability)
    1/4 tsp kosher salt
    1/2 tsp vanilla extract
    Red gel food coloring
    Green gel food coloring
  TEXT

  "Jalapeño & Cheddar" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    1/4 cup cheddar cheese powder
    2–3 tbsp jalapeño seasoning
  TEXT

  "Jalapeño" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    2–3 tbsp melted butter or neutral oil
    2–3 tbsp jalapeño seasoning
  TEXT

  "Nacho Cheddar" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    1/3 cup nacho cheddar powder
    Pinch of smoked paprika (optional)
  TEXT

  "Peppermint Cookie" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp coconut oil (for popping)
    1 1/3 cups white chocolate chips
    1/2 tsp peppermint extract (optional, to taste)
    3/4–1 cup crushed sandwich cookies
    1/3–1/2 cup crushed peppermint candy
  TEXT

  "Pepperoni Pizza" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    2–3 tbsp pizza seasoning
    2 tbsp finely grated parmesan
    2–3 tbsp finely chopped fully cooked pepperoni
  TEXT

  "Ranch" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    2–3 tbsp ranch seasoning
  TEXT

  "Salted Caramel & Dark Chocolate" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp coconut oil (for popping)
    1/4 cup caramel sauce
    1/4 cup dark chocolate chips
    Pinch of flaky sea salt
  TEXT

  "Salted Caramel" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp coconut oil (for popping)
    1/3 cup caramel sauce
    Pinch of flaky sea salt
  TEXT

  "Sour Cream & Onion" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    2–3 tbsp sour cream & onion seasoning
  TEXT

  "Spicy Sriracha" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    1–2 tbsp sriracha
    1–2 tbsp honey
    Pinch of garlic powder
  TEXT

  "Tex Mex" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp neutral oil (for popping)
    3 tbsp butter (melted)
    2–3 tbsp Tex-Mex or taco seasoning
    Pinch of smoked paprika or chili powder (optional)
  TEXT

  "Blast-Off Chedda n Ranch" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp refined coconut oil (for popping)
    4 tbsp butter (or coconut oil)
    1/3 cup cheddar powder
    2–3 tbsp ranch seasoning
    Black pepper
    Pinch of cayenne (optional)
    Pinch of salt
  TEXT

  "Peanut Butter CupCorn" => <<~TEXT.strip,
    1/4 cup mushroom kernels
    1 tbsp coconut oil (for popping)
    1 1/2 cups milk chocolate chips
    1/2 cup creamy peanut butter
    Pinch of salt
  TEXT

  "Breakfast of Champions" => <<~TEXT.strip,
    1/4 cup Wisconsin Birch kernels (or similar hearty kernel)
    1 tbsp coconut oil (for popping)
    1 1/2 cups white chocolate chips
    1–2 tsp vanilla or marshmallow flavoring
    1–1 1/2 cups Fruity Pebbles cereal
    Pinch of salt
  TEXT
}

# ----------------------------------------
# INSTRUCTIONS – only recipes we explicitly
# re-wrote together; others keep DB value
# ----------------------------------------
INSTRUCTION_SETS = {
  "Jalapeño & Cheddar" => <<~TEXT.strip,
    1. Prep: Measure cheddar powder and jalapeño seasoning. Set up a large mixing bowl.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil in a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into the bowl and remove unpopped kernels.
    4. Cheese base: Melt 3 tbsp butter over low heat and whisk in 1/4 cup cheddar powder until smooth.
    5. Coat: Drizzle the cheddar mixture over the popcorn in stages, tossing constantly.
    6. Heat layer: Sprinkle 2–3 tbsp jalapeño seasoning over the warm, cheesy popcorn; toss again so the heat is evenly distributed.
    7. KernelSet™ Cycle: Rest 5–10 minutes so the cheddar sets up slightly and the seasoning adheres.
    8. Serve: Serve warm with a little extra jalapeño seasoning on top if desired.
    9. Storage: Store airtight at room temperature up to 2 days.
  TEXT

  "Nacho Cheddar" => <<~TEXT.strip,
    1. Prep: Measure nacho cheddar powder and optional smoked paprika.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil over medium-high heat, shaking frequently.
    3. Transfer: Pour into a large bowl and remove unpopped kernels.
    4. Cheese base: Melt 3 tbsp butter over low heat and whisk in 1/3 cup nacho cheddar powder until uniform.
    5. Coat: Drizzle the nacho cheese mixture over the popcorn in several passes, tossing constantly.
    6. Optional smoke: Dust with a pinch of smoked paprika for extra depth and toss again.
    7. KernelSet™ Cycle: Let rest 5–10 minutes so the coating grabs and excess surface moisture evaporates.
    8. Serve & store: Serve warm. Store airtight at room temperature up to 2 days.
  TEXT

  "Peppermint Cookie" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Crush sandwich cookies and peppermint candy.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp coconut oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Melt: Gently melt 1 1/3 cups white chocolate chips in the microwave or over a double boiler. Stir in 1/2 tsp peppermint extract if using.
    5. Coat: Drizzle the mint white chocolate over the popcorn, tossing gently between additions until evenly coated.
    6. Cookie & candy: Sprinkle crushed cookies and peppermint candy over the coated popcorn and toss so they speckle every handful.
    7. KernelSet™ Cycle: Spread onto the parchment-lined sheet in a single layer and cool 20–25 minutes until firm.
    8. Break & serve: Break into festive clusters and serve.
    9. Storage: Store airtight at cool room temperature up to 3 days.
  TEXT

  "Pepperoni Pizza" => <<~TEXT.strip,
    1. Prep: Finely dice fully cooked pepperoni and grate parmesan. Line a tray with parchment.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl; remove unpopped kernels.
    4. Butter: Melt 3 tbsp butter over low heat.
    5. Coat: Drizzle butter over the popcorn while tossing constantly.
    6. Season: Sprinkle 2–3 tbsp pizza seasoning and 2 tbsp grated parmesan over the popcorn; toss well.
    7. Pepperoni: Add 2–3 tbsp finely chopped pepperoni and toss again to distribute.
    8. KernelSet™ Cycle: Spread onto a parchment-lined tray and let rest 10–15 minutes so surface oils settle.
    9. Serve: Enjoy warm. For best food safety, serve the same day due to meat.
    10. Storage: If needed, refrigerate airtight up to 1 day and re-warm briefly in a low oven to re-crisp before serving.
  TEXT

  "Ranch" => <<~TEXT.strip,
    1. Prep: Measure ranch seasoning. Line a tray with parchment if desired.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Butter: Melt 3 tbsp butter over low heat.
    5. Coat: Drizzle the melted butter over the popcorn while tossing constantly.
    6. Season: Sprinkle 2–3 tbsp ranch seasoning over the warm popcorn, tossing until the powder clings evenly.
    7. KernelSet™ Cycle: Rest 5–10 minutes so the seasoning sets and the surface loses excess moisture.
    8. Serve & store: Serve immediately. Store airtight at room temperature up to 2 days.
  TEXT

  "Salted Caramel & Dark Chocolate" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Measure caramel, dark chocolate chips, and flaky sea salt.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp coconut oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Caramel coat: Warm 1/4 cup caramel until pourable. Drizzle over the popcorn while tossing to lightly coat.
    5. KernelSet™, round 1: Spread on the parchment and cool 10–15 minutes so the caramel layer sets enough to handle.
    6. Chocolate: Melt 1/4 cup dark chocolate chips until smooth. Drizzle over the caramel popcorn in thin zigzags.
    7. Salt: While the chocolate is still soft, sprinkle a light pinch of flaky sea salt evenly over the tray.
    8. KernelSet™, round 2: Cool another 20–25 minutes until chocolate is fully set.
    9. Break & serve: Break into snackable clusters and serve.
    10. Storage: Store airtight at cool room temperature up to 3 days.
  TEXT

  "Salted Caramel" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Warm caramel sauce slightly if very thick.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp coconut oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Caramel: In a small saucepan or microwave-safe cup, gently warm 1/3 cup caramel sauce until fluid and pourable.
    5. Coat: Drizzle caramel over the popcorn in thin ribbons while tossing non-stop so it coats lightly and evenly.
    6. Salt: Sprinkle a pinch of flaky sea salt over the caramel-coated popcorn; toss once more.
    7. KernelSet™ Cycle: Spread onto the parchment-lined sheet in a single layer and cool 20–25 minutes until the caramel is set but still slightly chewy.
    8. Break & serve: Break into clusters and serve.
    9. Storage: Store airtight at room temperature up to 3 days in a cool, dry spot.
  TEXT

  "Sour Cream & Onion" => <<~TEXT.strip,
    1. Prep: Measure sour cream & onion seasoning.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a bowl; remove unpopped kernels.
    4. Butter: Melt 3 tbsp butter over low heat.
    5. Coat: Drizzle the butter over the popcorn in stages, tossing constantly.
    6. Season: Sprinkle 2–3 tbsp sour cream & onion seasoning over the popcorn, tossing until every handful tastes balanced.
    7. KernelSet™ Cycle: Let rest 5–10 minutes so the seasoning adheres firmly.
    8. Serve & store: Serve fresh. Store airtight at room temperature up to 2 days.
  TEXT

  "Spicy Sriracha" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Measure butter, sriracha, honey, and garlic powder.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove any unpopped kernels.
    4. Sauce: In a small saucepan, melt 3 tbsp butter over low heat. Whisk in 1–2 tbsp sriracha, 1–2 tbsp honey, and a pinch of garlic powder until smooth.
    5. Coat: Drizzle the spicy-sweet sauce over the popcorn in several passes, tossing constantly to avoid soggy spots.
    6. KernelSet™ Cycle: Spread onto the parchment-lined sheet in a single layer and let dry 10–15 minutes, until surface is mostly tack-free.
    7. Break & serve: Break apart gently and return to a serving bowl.
    8. Storage: Store airtight at room temperature up to 2 days; stir or shake before serving.
  TEXT

  "English Toffee Candy (Holiday)" => <<~TEXT.strip,
    1. Prep pans: Line 2 baking sheets with parchment and lightly oil 2 heatproof spatulas.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop over medium-high heat, shaking often until popping slows.
    3. Divide: Pour the popcorn into a large bowl, remove any unpopped kernels, then divide the popcorn evenly between 2 large heatproof bowls (one for red, one for green).
    4. Toffee base (stovetop): In a medium, heavy-bottomed saucepan, combine 1/2 cup unsalted butter, 1/2 cup sugar, 2 tbsp light corn syrup (if using), and 1/4 tsp kosher salt.
    5. Cook: Place over medium heat, stirring until the butter melts and the mixture looks smooth. Then cook, stirring frequently, until the toffee turns a deep golden amber and thickens (about 5–7 minutes; 285–295°F if using a thermometer).
    6. Finish: Remove from heat and carefully stir in 1/2 tsp vanilla extract (it will bubble). Immediately pour half of the hot toffee into a heatproof measuring cup or bowl labeled “RED,” and the other half into a second cup labeled “GREEN.”
    7. Color: Quickly add a few drops of red gel food coloring to the first cup and green gel food coloring to the second. Stir each until the color is vivid and even.
    8. Coat red batch: Working fast, drizzle the red toffee over the first bowl of popcorn in thin streams while tossing constantly with the oiled spatula until most kernels are lightly coated.
    9. Coat green batch: Repeat with the green toffee and the second bowl of popcorn, tossing to coat as evenly as possible.
    10. KernelSet™ Cycle: Spread the red popcorn onto one prepared baking sheet and the green popcorn onto the other in single layers. Cool 20–25 minutes, or until the toffee is fully set and dry to the touch.
    11. Mix & serve: Break up any large clusters, then combine the red and green batches into one big bowl for a festive holiday mix where every kernel is either red or green with a crisp toffee shell.
    12. Storage: Store airtight at cool room temperature (away from direct heat or sun) for up to 3 days. If it ever loses a bit of crunch, a brief rest on parchment at room temp usually brings it back.
  TEXT

  "Blast-Off Chedda n Ranch" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment and set out a large mixing bowl.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil; remove any unpopped kernels.
    3. Butter: Melt 4 tbsp butter (or coconut oil) over low heat.
    4. Cheese base: Whisk 1/3 cup cheddar powder into the melted butter until smooth.
    5. Coat: Drizzle the cheddar mixture over the popcorn in passes, tossing constantly to avoid soggy spots.
    6. Ranch & heat: Sprinkle 2–3 tbsp ranch seasoning, a pinch of black pepper, and optional cayenne over the warm popcorn; toss again until evenly seasoned.
    7. KernelSet™ Cycle: Spread the popcorn on parchment and let dry 10–15 minutes so the coating sets.
    8. Break & store: Break apart any large clusters and store airtight up to 2 days.
  TEXT

  "Peanut Butter CupCorn" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment and lightly oil a spatula.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp coconut oil; remove any unpopped kernels.
    3. Melt: In a microwave-safe bowl, combine 1 1/2 cups milk chocolate chips and 1/2 cup creamy peanut butter. Heat in 20–30 second bursts, stirring between each, until smooth and glossy.
    4. Salt: Stir in a pinch of salt to balance the sweetness.
    5. Coat: Pour the chocolate–peanut butter mixture over the warm popcorn and fold gently until every kernel is coated.
    6. KernelSet™ Cycle: Spread the coated popcorn on the parchment-lined sheet in an even layer and let set completely, about 20–30 minutes.
    7. Break & store: Break into clusters and store airtight at room temperature up to 3 days.
  TEXT

  "Breakfast of Champions" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment and lightly oil a spatula. Measure Fruity Pebbles and flavoring.
    2. Pop: Pop 1/4 cup Wisconsin Birch kernels (or similar) in 1 tbsp coconut oil; remove any unpopped kernels.
    3. Melt: In a microwave-safe bowl, melt 1 1/2 cups white chocolate chips in short bursts, stirring until smooth.
    4. Flavor: Stir in 1–2 tsp vanilla or marshmallow flavoring and a pinch of salt.
    5. Mix-ins: Fold 1–1 1/2 cups Fruity Pebbles into the warm white chocolate.
    6. Coat: Quickly pour the cereal–chocolate mixture over the warm popcorn and toss to coat before it sets.
    7. KernelSet™ Cycle: Spread the coated popcorn on the parchment-lined sheet in an even layer and let set completely, about 20–30 minutes.
    8. Break & store: Break into clusters and store airtight at room temperature up to 3 days.
  TEXT

    "Cookies & Cream" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Crush Oreo-style cookies; set aside.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove any unpopped kernels.
    4. Melt: In a microwave-safe bowl, melt 2 cups white chocolate chips in 20–30 second bursts, stirring between each, until smooth. Stir in a pinch of salt.
    5. Fold: Quickly fold about 3/4 of the crushed cookies into the warm white chocolate.
    6. Coat: Pour the cookie–white chocolate mixture over the popcorn in stages, tossing gently until every kernel is lightly coated.
    7. Top: Sprinkle the remaining crushed cookies over the coated popcorn and toss lightly so they speckle throughout.
    8. KernelSet™ Cycle: Spread onto a parchment-lined baking sheet in an even layer and cool 20–25 minutes, until the coating is firm and dry to the touch.
    9. Break & store: Break into clusters and store airtight at cool room temperature up to 3 days.
  TEXT

  "Maple & Bourbon" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Measure maple syrup, butter, bourbon, and salt.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove any unpopped kernels.
    4. Glaze base: In a small saucepan, combine 1/3 cup maple syrup, 2 tbsp butter, 1–2 tbsp bourbon, and a pinch of kosher salt.
    5. Cook: Bring to a gentle simmer over medium-low heat, stirring often, until slightly thickened and glossy (2–4 minutes). If you want most of the alcohol cooked off, simmer an extra minute.
    6. Coat: Drizzle the hot maple–bourbon glaze over the popcorn in thin streams, tossing constantly so it coats as evenly as possible.
    7. KernelSet™ Cycle: Spread the glazed popcorn onto the parchment-lined sheet in a single layer and cool 15–20 minutes, until the surface is tack-free.
    8. Break & store: Break into clusters. Store airtight at cool room temperature up to 3 days.
  TEXT

  "Chicago Style" => <<~TEXT.strip,
    1. Prep: Line 2 baking sheets with parchment and set out 2 large bowls (one for caramel, one for cheddar).
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp oil; transfer to a bowl and remove unpopped kernels. Repeat with another 1/4 cup kernels and 1 tbsp oil so you have 2 batches of popcorn.
    3. Divide: Place one batch of popcorn in each bowl.
    4. Caramel side: Warm 1/3 cup caramel sauce until pourable. Drizzle over the first bowl of popcorn while tossing to lightly coat. Spread this batch on one parchment-lined sheet and let set 15–20 minutes.
    5. Cheddar side – butter: Melt about 1 1/2 tbsp butter over low heat. Drizzle over the second bowl of popcorn, tossing to lightly coat.
    6. Cheddar side – cheese: Sprinkle 1/3 cup cheddar cheese powder over the buttery popcorn in stages, tossing until every kernel has a cheesy dusting. Add a pinch of flaky sea salt if desired.
    7. KernelSet™ Cycle: Spread the cheddar batch on the second parchment-lined sheet and let rest 10–15 minutes so the coating sets and surface moisture evaporates.
    8. Mix & serve: Once both trays are set and dry to the touch, combine caramel and cheddar batches in a large bowl for that classic sweet–savory mix.
    9. Storage: Store airtight at cool room temperature up to 3 days.
  TEXT

  "Bacon & Cheddar" => <<~TEXT.strip,
    1. Prep: Cook bacon until crisp, drain, and crumble finely. Line a baking sheet with parchment.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil; pour into a large bowl and remove any unpopped kernels.
    3. Cheese base: Melt 3 tbsp butter over low heat. Whisk in 1/3 cup cheddar cheese powder until smooth.
    4. Coat: Drizzle the cheddar butter over the popcorn in thin passes, tossing constantly so the cheese coating stays light and even.
    5. Bacon: Sprinkle 1/4–1/3 cup finely crumbled bacon over the warm cheesy popcorn, along with a pinch of black pepper and salt if desired. Toss again so bacon is evenly distributed.
    6. KernelSet™ Cycle: Spread onto the parchment-lined sheet in a single layer and let rest 10–15 minutes so surface oils settle and the coating clings.
    7. Serve & store: Enjoy slightly warm. For best quality, store airtight in the fridge up to 1 day due to bacon, then re-crisp briefly on a low oven if needed.
  TEXT

  "Birthday Cake" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Measure cake mix, sprinkles, and white chocolate.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp refined coconut oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Melt: In a microwave-safe bowl, melt 1 1/2 cups white chocolate chips in short bursts, stirring until smooth.
    5. Cake mix: Whisk 1/3 cup dry cake mix into the melted white chocolate until fully combined. Add a pinch of salt to balance the sweetness.
    6. Coat: Pour the cake-batter chocolate over the popcorn in stages, tossing gently until every kernel is coated.
    7. Sprinkles: Sprinkle 1/4 cup rainbow sprinkles (plus extra if desired) over the coated popcorn and toss just enough to distribute without dissolving the color.
    8. KernelSet™ Cycle: Spread onto the parchment-lined sheet and cool 20–25 minutes, until the coating is firm and dry to the touch.
    9. Break & store: Break into colorful clusters. Store airtight at cool room temperature up to 3 days.
  TEXT

  "Buffalo Ranch" => <<~TEXT.strip,
    1. Prep: Line a baking sheet with parchment. Measure butter, hot sauce, ranch seasoning, and garlic powder.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop over medium-high heat, shaking often.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Buffalo butter: In a small saucepan, melt 3 tbsp butter over low heat. Whisk in 2 tbsp hot sauce and a pinch of garlic powder until smooth.
    5. Coat: Drizzle the buffalo butter over the popcorn in passes, tossing constantly so the flavor coats lightly and evenly.
    6. Ranch layer: Sprinkle 2–3 tbsp ranch seasoning over the warm buffalo popcorn and toss again until every handful tastes balanced.
    7. KernelSet™ Cycle: Spread onto the parchment-lined sheet in a single layer and rest 10–15 minutes so the surface dries slightly and the seasoning clings.
    8. Serve & store: Serve warm for best punch. Store airtight at room temperature up to 2 days.
  TEXT

  "Classic Butter" => <<~TEXT.strip,
    1. Prep: Warm a large mixing bowl in the oven for a minute or two (optional, helps keep butter fluid).
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into the warm bowl and remove any unpopped kernels.
    4. Melt: Gently melt 3–4 tbsp butter over low heat or in the microwave.
    5. Coat: Drizzle the melted butter over the popcorn in thin streams, tossing constantly to distribute it without soggy pockets.
    6. Season: Sprinkle kosher salt over the buttered popcorn, tasting and adjusting until it hits your perfect movie-night level.
    7. KernelSet™ (mini): Let sit 3–5 minutes so the butter soaks in and surface moisture calms down.
    8. Serve: Enjoy immediately. Store any leftovers airtight at room temperature up to 1 day; re-warm briefly if desired.
  TEXT

  "Classic Cheddar" => <<~TEXT.strip,
    1. Prep: Set out a large mixing bowl. Measure cheddar powder and melt 3 tbsp butter.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into the bowl and remove unpopped kernels.
    4. Cheese base: Whisk 1/3 cup cheddar cheese powder into the warm melted butter until smooth and lump-free.
    5. Coat: Drizzle the cheddar butter over the popcorn in multiple thin passes, tossing constantly so the cheese coats evenly.
    6. Adjust: Taste and add a pinch of salt if needed, depending on the saltiness of your cheese powder.
    7. KernelSet™ Cycle: Let the popcorn rest 5–10 minutes so the coating firms slightly and excess moisture dissipates.
    8. Serve & store: Serve warm. Store airtight at room temperature up to 2 days.
  TEXT

   "Cracked Pepper & Asiago" => <<~TEXT.strip,
    1. Prep: Finely grate asiago cheese and crack black pepper. Line a tray with parchment if desired.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Butter: Melt 3 tbsp butter over low heat.
    5. Coat: Drizzle the butter over the popcorn while tossing constantly to create a light, even fat layer.
    6. Cheese & pepper: Sprinkle 1/3 cup asiago and 1–2 tsp freshly cracked black pepper over the warm popcorn, tossing until the cheese softens slightly and clings.
    7. Season: Add a small pinch of salt if needed and toss again.
    8. KernelSet™ Cycle: Spread onto a parchment-lined tray and rest 5–10 minutes so cheese and butter set.
    9. Serve & store: Serve slightly warm. Store airtight at room temperature up to 2 days.
  TEXT

  "Dill Pickle" => <<~TEXT.strip,
    1. Prep: Measure dill pickle seasoning and garlic powder. Line a tray with parchment if you want easier cleanup.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove unpopped kernels.
    4. Butter: Melt 3 tbsp butter over low heat.
    5. Coat: Drizzle the melted butter (or an equal amount of neutral oil) over the popcorn in a few passes, tossing constantly.
    6. Season: Sprinkle 2–3 tbsp dill pickle seasoning, a pinch of garlic powder, and salt to taste over the warm popcorn, tossing until every kernel has a tangy, speckled coating.
    7. KernelSet™ Cycle: Spread onto a parchment-lined tray and let rest 5–10 minutes so the seasoning adheres and the surface dries slightly.
    8. Serve & store: Serve fresh. Store airtight at room temperature up to 2 days.
  TEXT

   "Jalapeño" => <<~TEXT.strip,
    1. Prep: Measure jalapeño seasoning and line a tray with parchment if desired.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove any unpopped kernels.
    4. Fat coat: Drizzle 2–3 tbsp melted butter or neutral oil over the popcorn while tossing to create a light, tacky surface.
    5. Season: Dust generously with 2–3 tbsp jalapeño seasoning, tossing until the spice clings to every kernel.
    6. Adjust: Taste and add more seasoning for extra heat if needed.
    7. KernelSet™ Cycle: Spread onto a parchment-lined tray and rest 5–10 minutes to let the seasoning lock on.
    8. Serve & store: Return to a bowl for serving. Store airtight at room temperature up to 2 days.
  TEXT

   "Tex Mex" => <<~TEXT.strip,
    1. Prep: Measure Tex-Mex (or taco) seasoning and optional smoked paprika or chili powder.
    2. Pop: Pop 1/4 cup mushroom kernels in 1 tbsp neutral oil using a heavy pot or whirley-pop.
    3. Transfer: Pour popcorn into a large bowl and remove any unpopped kernels.
    4. Butter: Melt 3 tbsp butter over low heat.
    5. Coat: Drizzle the melted butter over the popcorn in thin streams, tossing constantly so every kernel gets a light sheen.
    6. Season: Sprinkle 2–3 tbsp Tex-Mex seasoning and a pinch of smoked paprika or chili powder (if using) over the warm popcorn. Toss until evenly coated.
    7. KernelSet™ Cycle: Spread the popcorn onto a parchment-lined tray and rest 5–10 minutes so the spices adhere and surface moisture settles.
    8. Serve & store: Serve warm with lime wedges on the side if desired. Store airtight at room temperature up to 2 days.
  TEXT
  }

# ----------------------------------------
# HERO IMAGE URL overrides (optional)
# ----------------------------------------
HERO_URLS = {
  # Example:
  # "Cookies & Cream" => "https://your-cdn.com/doberpop/cookies-and-cream.jpg",
  # Fill these in if/when you want to override hero_image_url.
}

puts "Fixing ingredients / instructions / hero_image_url…"

Recipe.where(source: "doberpop").find_each do |recipe|
  changed = false

  if (ing = INGREDIENT_SETS[recipe.name])
    recipe.ingredients = ing
    changed = true
  end

  if (inst = INSTRUCTION_SETS[recipe.name])
    recipe.instructions = inst
    changed = true
  end

  if (url = HERO_URLS[recipe.name])
    recipe.hero_image_url = url
    changed = true
  end

  if changed
    recipe.save!
    puts "✔ Updated #{recipe.name} (id=#{recipe.id})"
  else
    puts "• No overrides defined for #{recipe.name} (kept existing DB values)"
  end
end

puts "DONE."