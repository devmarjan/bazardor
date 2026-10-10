"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { banglaDate } from "@/lib/format";

export default function Navbar({ categories }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);
  const user = session?.user;

  async function logout() {
    await authClient.signOut();
    setOpen(false);
    toast.success("সাইন আউট সফল হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-white/80 border-b border-base-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-brand grid place-items-center text-white text-xl">🛒</span>
          <span className="leading-tight">
            <span className="block font-bold text-lg">বাজার দর</span>
            <span className="block text-[11px] text-gray-500">{date}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 relative">
          {isPending ? (
            <div className="skeleton h-9 w-24" />
          ) : user ? (
            <>
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-medium">
                {user.image ? (
                  <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-brand text-white grid place-items-center">{user.name?.[0]}</span>
                )}
                <span className="hidden sm:inline">{user.name?.split(" ")[0]}</span> ▾
              </button>
              {open && (
                <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-lg border p-3 z-50 text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                  <Link href="/profile" onClick={() => setOpen(false)} className="block py-1 hover:text-brand">👤 আমার প্রোফাইল</Link>
                  <button onClick={logout} className="py-1 text-red-600">↩ সাইন আউট</button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md">সাইন ইন</Link>
              <Link href="/signup" className="btn bg-brand text-white hover:bg-green-800 btn-sm sm:btn-md">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>
      <nav className="border-t border-base-200 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2 w-max sm:w-auto">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link key={c.slug} href={`/category/${c.slug}`}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${active ? "bg-brand text-white" : "hover:bg-base-200"}`}>
                {c.emoji} {c.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
