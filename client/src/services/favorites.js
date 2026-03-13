import { db } from "../firebase";

// GET favorites for a user
export const getFavorites = async (userId) => {
  const snapshot = await db
    .collection("favorites")
    .where("userId", "==", userId)
    .get();

  const recipe_ids = snapshot.docs.map((doc) => doc.data().recipeId);

  return { recipe_ids };
};

// ADD favorite
export const favoriteRecipe = async (userId, recipeId) => {
  const docId = `${userId}_${recipeId}`;

  await db.collection("favorites").doc(docId).set({
    userId,
    recipeId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true };
};

// REMOVE favorite
export const unfavoriteRecipe = async (userId, recipeId) => {
  const docId = `${userId}_${recipeId}`;
  await db.collection("favorites").doc(docId).delete();
  return { success: true };
};