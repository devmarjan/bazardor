# 🛒 বাজার দর (BazarDor)

বাংলাদেশের প্রয়োজনীয় পণ্য (চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ, মসলা) এর আজকের দাম, দামের ওঠানামা ও বাজারভিত্তিক তুলনা এক জায়গায়।

## Technologies
Next.js 14 (App Router) · Tailwind CSS · DaisyUI · Better Auth (Email + Google + GitHub) · MongoDB · react-hot-toast

## Features
1. লাইভ প্রাইস টিকার (infinite marquee) ও Bangla date সহ Navbar
2. আজ দাম বেড়েছে / কমেছে — Top 6 সেকশন ও সব পণ্যের responsive grid
3. ক্যাটাগরি পেজ — skeleton loading, empty/404 state এবং Bengali-numeral-safe sort
4. Protected পণ্য বিস্তারিত পেজ — min/max/avg ও বাজারভিত্তিক দামের টেবিল
5. Better Auth দিয়ে Sign in/up, Google/GitHub login, toast notification ও প্রোফাইল আপডেট

## Run locally
```bash
npm install
cp .env.example .env   # মানগুলো বসাও
npm run dev
```
OAuth callback: `{BASE_URL}/api/auth/callback/google` ও `/github`.
