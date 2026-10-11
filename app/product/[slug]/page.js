import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import { getProduct } from "@/lib/api";
import { fmtPrice } from "@/lib/format";

export default async function ProductPage({ params }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const diff = p.price - p.yesterday;
  const stat = [
    ["সর্বনিম্ন দাম", p.min, "text-green-700", p.minMarket ? `সবচেয়ে কম দামের বাজার: ${p.minMarket}` : ""],
    ["সর্বাধিক দাম", p.max, "text-red-600", p.maxMarket ? `সবচেয়ে বেশি দামের বাজার: ${p.maxMarket}` : ""],
    ["গড় দাম", p.avg, "text-brand", `${p.unit}-এর হিসাব`],
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <p className="text-xs text-gray-500">
        <Link href="/">হোম</Link> › <Link href={`/category/${p.category}`}>{p.categoryName}</Link> › {p.name}
      </p>
      <section className="bg-white rounded-2xl border border-base-200 p-5 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <span className="w-16 h-16 rounded-2xl bg-base-200 grid place-items-center text-3xl">{p.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{p.name}</h1>
            <p className="text-xs text-gray-500">{p.unit} · {p.categoryName}</p>
            <p className="text-sm mt-1">
              গতকালের তুলনায় আজ দাম <b>{diff === 0 ? "অপরিবর্তিত" : `${fmtPrice(Math.abs(diff))} টাকা ${diff > 0 ? "বেশি" : "কম"}`}</b>
            </p>
            <div className="flex gap-2 mt-2"><span className="badge badge-outline">{p.categoryName}</span></div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-4 text-center min-w-36">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-3xl font-bold">{fmtPrice(p.price)}</p>
          <p className="text-xs text-gray-500">টাকা / {p.unitShort}</p>
          <Badge change={p.change} />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-base-200 p-5">
        <h2 className="font-bold mb-3">দামের সারসংক্ষেপ</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {stat.map(([l, v, c, note]) => (
            <div key={l} className="border border-base-200 rounded-xl p-3">
              <p className="text-xs text-gray-500">{l}</p>
              <p className={`text-2xl font-bold ${c}`}>{fmtPrice(v)} <span className="text-sm">টাকা</span></p>
              <p className="text-[11px] text-gray-500">{note}</p>
            </div>
          ))}
        </div>
        <h2 className="font-bold mt-6 mb-3">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বাধিক</th><th>গড়</th></tr></thead>
            <tbody>
              {p.markets.map((m, i) => (
                <tr key={i}>
                  <td className="font-medium">{m.name}</td><td>{m.division}</td>
                  <td>{fmtPrice(m.min)} টাকা</td><td>{fmtPrice(m.max)} টাকা</td>
                  <td className="font-bold">{fmtPrice(m.avg)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
