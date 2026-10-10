import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const e = process.env;
const socialProviders = {};
if (e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET)
  socialProviders.google = { clientId: e.GOOGLE_CLIENT_ID, clientSecret: e.GOOGLE_CLIENT_SECRET };
if (e.GITHUB_CLIENT_ID && e.GITHUB_CLIENT_SECRET)
  socialProviders.github = { clientId: e.GITHUB_CLIENT_ID, clientSecret: e.GITHUB_CLIENT_SECRET };

const config = {
  emailAndPassword: { enabled: true, autoSignIn: false, minPasswordLength: 8 },
  socialProviders,
};
// MONGODB_URI দিলে MongoDB ব্যবহার হবে (ডিপ্লয়ের জন্য), না দিলে লোকাল টেস্টের জন্য মেমরিতে চলবে
if (e.MONGODB_URI) config.database = mongodbAdapter(new MongoClient(e.MONGODB_URI).db());

export const auth = betterAuth(config);
