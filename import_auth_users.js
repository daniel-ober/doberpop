const fs = require("fs");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json");
const data = JSON.parse(fs.readFileSync("./tmp/firestore_export.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function run() {
  const users = (data.users || [])
    .filter((u) => u.email && u.password_digest)
    .map((u) => ({
      uid: String(u.uid || u.id),
      email: u.email,
      displayName: u.username || "",
      passwordHash: Buffer.from(u.password_digest),
      customClaims: u.admin ? { admin: true } : {},
    }));

  const result = await admin.auth().importUsers(users, {
    hash: { algorithm: "BCRYPT" },
  });

  console.log("Imported:", result.successCount);
  console.log("Failed:", result.failureCount);

  if (result.errors.length) {
    result.errors.forEach((err) => {
      console.log(`Error at index ${err.index}:`, err.error.toString());
    });
  }
}

run().catch(console.error);