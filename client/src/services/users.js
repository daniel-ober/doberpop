import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: Number(docSnap.id),
      username: data.username || "",
      email: data.email || "",
      admin: data.admin === true,
      createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
      updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
    };
  });
};

export const deleteUser = async (userId) => {
  await deleteDoc(doc(db, "users", String(userId)));

  const favoritesQ = query(
    collection(db, "favorites"),
    where("userId", "==", Number(userId))
  );
  const favoritesSnap = await getDocs(favoritesQ);

  await Promise.all(favoritesSnap.docs.map((d) => deleteDoc(d.ref)));

  return { success: true };
};