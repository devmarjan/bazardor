import { getProducts, getRawProducts } from "@/lib/api";
export const dynamic = "force-dynamic";
export default async function Debug() {
  const raw = await getRawProducts();
  const items = Array.isArray(raw) ? raw : raw?.data || raw?.products || [];
  const norm = (await getProducts())[0];
  return (
    <div className="max-w-4xl mx-auto p-4 text-xs">
      <h1 className="text-lg font-bold mb-2">Debug: API-র প্রথম পণ্য (এই পেজের স্ক্রিনশট পাঠাও)</h1>
      <pre className="bg-white p-3 rounded overflow-auto">{JSON.stringify(raw === null ? "API থেকে ডাটা আসেনি" : items[0] ?? raw, null, 2).slice(0, 3000)}</pre>
      <h2 className="font-bold mt-4">আমাদের কোড যা বুঝেছে:</h2>
      <pre className="bg-white p-3 rounded overflow-auto">{JSON.stringify(norm, null, 2)}</pre>
    </div>
  );
}
