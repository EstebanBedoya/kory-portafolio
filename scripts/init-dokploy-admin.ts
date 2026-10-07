import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
try {
  const users = await payload.count({ collection: "users" });
  if (users.totalDocs === 0) {
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;
    if (!email || !password || password.length < 12) {
      throw new Error("A fresh database requires INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD (12+ characters)");
    }
    await payload.create({ collection: "users", data: { email, password } });
    console.log("Initial admin created; change its password after signing in");
  } else {
    console.log("Admin accounts already exist; left unchanged");
  }
} finally {
  await payload.destroy();
}
// Payload/tsx may retain background handles after the DB pool is closed.
// All writes and cleanup above are awaited; Compose must see the job finish.
process.exit(0);
