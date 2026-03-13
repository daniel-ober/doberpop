const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./firebase-service-account.json");
const data = JSON.parse(fs.readFileSync("./tmp/firestore_export.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function toTimestamp(value) {
  if (!value) return null;
  return admin.firestore.Timestamp.fromDate(new Date(value));
}

async function run() {
  console.log("Importing users...");
  for (const user of data.users) {
    await db.collection("users").doc(String(user.id)).set(
      {
        username: user.username || "",
        email: user.email || "",
        admin: !!user.admin,
        usernameChangedAt: toTimestamp(user.username_changed_at),
        createdAt: toTimestamp(user.created_at),
        updatedAt: toTimestamp(user.updated_at),
      },
      { merge: true }
    );
  }

  console.log("Importing recipes...");
  for (const recipe of data.recipes) {
    await db.collection("recipes").doc(String(recipe.id)).set(
      {
        name: recipe.name || "",
        description: recipe.description || "",
        kernelType: recipe.kernel_type || "",
        yieldCups: recipe.yield || null,
        instructions: recipe.instructions || "",
        ingredients: recipe.ingredients || "",
        toolsAndSupplies: recipe.tools_and_supplies || "",
        heroImageUrl: recipe.hero_image_url || "",
        additionalPhotoUrls: Array.isArray(recipe.additional_photo_urls)
          ? recipe.additional_photo_urls
          : [],
        source: recipe.source || "user",
        published: !!recipe.published,
        showInSampler: !!recipe.show_in_sampler,
        samplerPosition: recipe.sampler_position ?? null,
        userId: recipe.user_id ?? null,
        favoritesCount: recipe.favorites_count || 0,
        createdAt: toTimestamp(recipe.created_at),
        updatedAt: toTimestamp(recipe.updated_at),
      },
      { merge: true }
    );
  }

  console.log("Importing favorites...");
  for (const favorite of data.favorites) {
    await db.collection("favorites").doc(String(favorite.id)).set(
      {
        userId: favorite.user_id,
        recipeId: favorite.recipe_id,
        createdAt: toTimestamp(favorite.created_at),
        updatedAt: toTimestamp(favorite.updated_at),
      },
      { merge: true }
    );
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});