import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { toBn } from "@/lib/format";

export default async function Home() {
  const products = await getProducts();
  const risers = products.filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = products.filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);
  const grid = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <section className="bg-white rounded-2xl border border-base-200 p-6 sm:p-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <span className="inline-block text-xs bg-green-50 text-brand px-3 py-1 rounded-full">আজকের বাজার দর</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">আজকের বাজারের দাম এক নজরে</h1>
          <p className="text-gray-600 mt-3">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
          <a href="#সব-পণ্য" className="btn bg-brand text-white hover:bg-green-800 mt-5">সব পণ্য দেখুন</a>
        </div>
        <img src="/hero.svg" alt="বাজারের ঝুড়ি" className="w-full max-w-xs mx-auto" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4"><span className="text-red-600">▲</span> আজ দাম বেড়েছে</h2>
        <div className={grid}>{risers.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4"><span className="text-green-600">▼</span> আজ দাম কমেছে</h2>
        <div className={grid}>{fallers.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section id="সব-পণ্য" className="scroll-mt-4">
        <h2 className="text-xl font-bold">সব পণ্য</h2>
        <p className="text-sm text-gray-500 mb-4">মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে</p>
        <div className={`${grid} xl:grid-cols-4`}>{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </div>
  );
}
