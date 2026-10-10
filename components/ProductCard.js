import Link from "next/link";
import Badge from "./Badge";
import { fmtPrice } from "@/lib/format";
export default function ProductCard({ p }) {
  return (
    <Link href={`/product/${p.slug}`} className="block bg-white rounded-2xl border border-base-200 p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-base-200 grid place-items-center text-xl">{p.emoji}</span>
        <div>
          <p className="font-semibold leading-tight">{p.name}</p>
          <p className="text-xs text-gray-500">{p.unit}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">আজকের দাম</p>
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg">{fmtPrice(p.price)} <span className="text-sm font-normal">টাকা</span></p>
        <Badge change={p.change} />
      </div>
    </Link>
  );
}
