"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfile() {
  const { data } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name").trim();
    if (!name) return toast.error("নাম লিখুন");
    setLoading(true);
    const { error } = await authClient.updateUser({ name });
    setLoading(false);
    if (error) return toast.error(error.message || "আপডেট ব্যর্থ হয়েছে");
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">তথ্য আপডেট করুন</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-base-200 p-5 space-y-3">
        <label className="text-sm">নাম</label>
        <input key={data?.user?.name} name="name" defaultValue={data?.user?.name || ""} className="input input-bordered w-full" />
        <button disabled={loading} className="btn w-full bg-brand text-white hover:bg-green-800">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "আপডেট"}
        </button>
      </form>
    </div>
  );
}
