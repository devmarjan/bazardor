"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const u = data?.user;
  async function logout() {
    await authClient.signOut();
    toast.success("সাইন আউট সফল হয়েছে");
    router.push("/");
    router.refresh();
  }
  if (isPending || !u) return <div className="max-w-2xl mx-auto p-6"><div className="skeleton h-32 rounded-2xl" /></div>;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="text-sm text-gray-500 mb-4">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      <div className="bg-white rounded-2xl border border-base-200 p-5 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          {u.image ? <img src={u.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
            : <span className="w-16 h-16 rounded-xl bg-brand text-white text-2xl grid place-items-center">{u.name?.[0]}</span>}
          <div><p className="font-semibold text-lg">{u.name}</p><p className="text-gray-500 text-sm">{u.email}</p></div>
        </div>
        <div className="flex gap-2">
          <Link href="/profile/update" className="btn btn-sm bg-brand text-white hover:bg-green-800">আপডেট</Link>
          <button onClick={logout} className="btn btn-sm btn-outline btn-error">↩ সাইন আউট</button>
        </div>
      </div>
    </div>
  );
}
