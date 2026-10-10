"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthForm({ mode }) {
  const signup = mode === "signup";
  const router = useRouter();
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);
  const shown = useRef(false);
  useEffect(() => {
    if (sp.get("auth") === "required" && !shown.current) {
      shown.current = true;
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন");
    }
  }, [sp]);

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get("name"), email = f.get("email"), password = f.get("password");
    if (password.length < 8) return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (signup && password !== f.get("confirm")) return toast.error("পাসওয়ার্ড মিলছে না");
    setLoading(true);
    const { error } = signup
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message || "কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    if (signup) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন");
      router.push("/signin");
    } else {
      toast.success("সাইন ইন সফল হয়েছে");
      router.push(sp.get("redirect") || "/");
      router.refresh();
    }
  }
  const social = async (provider) => {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error("এই সোশ্যাল লগইনের key এখনো সেটআপ করা হয়নি");
  };
  const field = "input input-bordered w-full";

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center">{signup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}</h1>
      <p className="text-center text-sm text-gray-500 mb-5">
        {signup ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।" : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
      </p>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-base-200 p-5 space-y-3">
        {signup && <><label className="text-sm">নাম</label><input name="name" required placeholder="যেমন: রহিম উদ্দিন" className={field} /></>}
        <label className="text-sm block">ইমেইল</label>
        <input name="email" type="email" required placeholder="you@example.com" className={field} />
        <label className="text-sm block">পাসওয়ার্ড</label>
        <input name="password" type="password" required placeholder="কমপক্ষে ৮ অক্ষর" className={field} />
        {signup && <><label className="text-sm block">পাসওয়ার্ড নিশ্চিত করুন</label><input name="confirm" type="password" required placeholder="আবার লিখুন" className={field} /></>}
        <button disabled={loading} className="btn w-full bg-brand text-white hover:bg-green-800">
          {loading ? <span className="loading loading-spinner loading-sm" /> : signup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </button>
        <div className="divider text-xs">অথবা</div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => social("google")} className="btn btn-outline btn-sm sm:btn-md">Google দিয়ে চালিয়ে যান</button>
          <button type="button" onClick={() => social("github")} className="btn btn-outline btn-sm sm:btn-md">GitHub দিয়ে চালিয়ে যান</button>
        </div>
        <p className="text-center text-sm">
          {signup ? "অ্যাকাউন্ট আছে? " : "অ্যাকাউন্ট নেই? "}
          <Link href={signup ? "/signin" : "/signup"} className="text-brand">{signup ? "সাইন ইন করুন" : "সাইন আপ করুন"}</Link>
        </p>
      </form>
      <p className="text-center mt-5 text-sm"><Link href="/" className="text-gray-500">← হোম পেজে ফিরে যান</Link></p>
    </div>
  );
}
