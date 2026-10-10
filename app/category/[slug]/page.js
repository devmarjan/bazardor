import CategoryList from "@/components/CategoryList";
import NotFoundBox from "@/components/NotFoundBox";
import { getCategories, getProducts } from "@/lib/api";
import { toBn } from "@/lib/format";

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const [cats, all] = await Promise.all([getCategories(), getProducts()]);
  const cat = cats.find((c) => c.slug === slug);
  const products = all.filter((p) => p.category === slug);
  if (!cat || products.length === 0) return <NotFoundBox text="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।" />;
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl border border-base-200 p-5 flex items-center gap-3">
        <span className="text-4xl">{cat.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold">{cat.name}</h1>
          <p className="text-xs text-gray-500">{toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>
      <CategoryList products={products} />
    </div>
  );
}
