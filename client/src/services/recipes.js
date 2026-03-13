// client/src/services/recipes.js
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const recipesCollection = collection(db, "recipes");

function normalizeRecipe(id, data) {
  return {
    id,

    name: data.name || "",
    description: data.description || "",
    instructions: data.instructions || "",
    ingredients: data.ingredients || "",

    kernel_type: data.kernelType ?? data.kernel_type ?? "",
    yield: data.yieldCups ?? data.yield ?? null,

    hero_image_url: data.heroImageUrl ?? data.hero_image_url ?? "",
    additional_photo_urls:
      data.additionalPhotoUrls ?? data.additional_photo_urls ?? [],

    source: data.source ?? "user",
    published: data.published === true,

    show_in_sampler:
      data.showInSampler === true || data.show_in_sampler === true,

    sampler_position:
      data.samplerPosition ?? data.sampler_position ?? null,

    tools_and_supplies:
      data.toolsAndSupplies ?? data.tools_and_supplies ?? "",

    user_id: data.userId ?? data.user_id ?? null,
    favorites_count: data.favoritesCount ?? data.favorites_count ?? 0,

    created_at: data.createdAt?.toDate?.().toISOString?.() || null,
    updated_at: data.updatedAt?.toDate?.().toISOString?.() || null,
  };
}

/**
 * Always returns:
 * { recipes: [...], totalSignatureCount: number }
 */
export const getRecipesWithMeta = async () => {
  const snapshot = await getDocs(recipesCollection);

  const recipes = snapshot.docs.map((docSnap) =>
    normalizeRecipe(docSnap.id, docSnap.data())
  );

  const totalSignatureCount = recipes.filter(
    (r) => r.source === "doberpop"
  ).length;

  return { recipes, totalSignatureCount };
};

export const getRecipes = async () => {
  const { recipes } = await getRecipesWithMeta();
  return recipes;
};

export const getAllRecipes = async () => {
  return getRecipes();
};

export const getSamplerRecipes = async () => {
  const qRef = query(
    recipesCollection,
    where("showInSampler", "==", true),
    orderBy("samplerPosition", "asc")
  );

  const snapshot = await getDocs(qRef);
  return snapshot.docs.map((docSnap) =>
    normalizeRecipe(docSnap.id, docSnap.data())
  );
};

export const getOneRecipe = async (id) => {
  const docRef = doc(db, "recipes", String(id));
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Recipe not found");
  }

  return normalizeRecipe(snapshot.id, snapshot.data());
};

export const createRecipe = async (payload) => {
  const docData = {
    name: payload.name || "",
    description: payload.description || "",
    ingredients: payload.ingredients || "",
    instructions: payload.instructions || "",
    kernelType: payload.kernel_type ?? "",
    yieldCups: payload.yield ?? null,
    published: payload.published === true,
    source: payload.source || "user",
    showInSampler: payload.show_in_sampler === true,
    samplerPosition: payload.sampler_position ?? null,
    heroImageUrl: payload.hero_image_url ?? "",
    additionalPhotoUrls: payload.additional_photo_urls ?? [],
    toolsAndSupplies: payload.tools_and_supplies ?? "",
    userId: payload.user_id ?? null,
    favoritesCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ref = await addDoc(recipesCollection, docData);
  return { id: ref.id, ...normalizeRecipe(ref.id, docData) };
};

export const updateRecipe = async (id, payload) => {
  const docRef = doc(db, "recipes", String(id));

  const updateData = {
    name: payload.name,
    description: payload.description,
    ingredients: payload.ingredients,
    instructions: payload.instructions,
    kernelType: payload.kernel_type,
    yieldCups: payload.yield,
    published: payload.published,
    showInSampler: payload.show_in_sampler,
    samplerPosition: payload.sampler_position,
    heroImageUrl: payload.hero_image_url,
    additionalPhotoUrls: payload.additional_photo_urls,
    toolsAndSupplies: payload.tools_and_supplies,
    updatedAt: new Date(),
  };

  Object.keys(updateData).forEach((key) => {
    if (typeof updateData[key] === "undefined") {
      delete updateData[key];
    }
  });

  await updateDoc(docRef, updateData);

  const updatedSnap = await getDoc(docRef);
  return normalizeRecipe(updatedSnap.id, updatedSnap.data());
};

export const deleteRecipe = async (id) => {
  await deleteDoc(doc(db, "recipes", String(id)));
  return { success: true };
};