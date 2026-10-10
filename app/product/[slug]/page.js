import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import { getCategories, getProduct } from "@/lib/api";
import { fmtPrice } from "@/lib/format";

export default async function ProductPage({ params }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === p.category);
  const stat = [
    ["সর্বনিম্ন দাম", p.min, "text-green-700"],
    ["সর্বাধিক দাম", p.max, "text-red-600"],
    ["গড় দাম", p.avg, "text-brand"],
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <p className="text-xs text-gray-500">
        <Link href="/">হোম</Link> › {cat && <Link href={`/category/${cat.slug}`}>{cat.name}</Link>} › {p.name}
      </p>
      <section className="bg-white rounded-2xl border border-base-200 p-5 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <span className="w-16 h-16 rounded-2xl bg-base-200 grid place-items-center text-3xl">{p.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{p.name}</h1>
            <p className="text-xs text-gray-500">{p.unit}{cat && ` · ${cat.name}`}</p>
            {p.description && <p className="text-sm mt-1">{p.description}</p>}
            <div className="flex gap-2 mt-2 flex-wrap">
              {(p.tags.length ? p.tags : cat ? [cat.name] : []).map((t, i) => <span key={i} className="badge badge-outline">{typeof t === "string" ? t : t.name}</span>)}
            </div>
          </div>
        </div>
        <div className="bg-base-200 rounded-xl p-4 text-center min-w-36">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="text-3xl font-bold">{fmtPrice(p.price)}</p>
          <p className="text-xs text-gray-500">টাকা / {p.unit.replace("প্রতি ", "")}</p>
          <Badge change={p.change} />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-base-200 p-5">
        <h2 className="font-bold mb-3">দামের সারসংক্ষেপ</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {stat.map(([l, v, c]) => (
            <div key={l} className="border border-base-200 rounded-xl p-3">
              <p className="text-xs text-gray-500">{l}</p>
              <p className={`text-2xl font-bold ${c}`}>{fmtPrice(v)} <span className="text-sm">টাকা</span></p>
            </div>
          ))}
        </div>
        <h2 className="font-bold mt-6 mb-3">বাজারভিত্তিক আজকের দাম</h2>
        {p.markets.length === 0 ? (
          <p className="text-sm text-gray-500">বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
        ) : (
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
        )}
      </section>
    </div>
  );
}
