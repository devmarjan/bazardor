const BASES = [
  process.env.API_BASE_1 || "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];
async function get(path) {
  for (const b of BASES) {
    try {
      const r = await fetch(b + path, { next: { revalidate: 300 } });
      if (r.ok) return await r.json();
    } catch {}
  }
  return null;
}
const UNITS = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };

export function normProduct(p) {
  const pct = Math.abs(Number(p.change?.pct) || 0);
  const dir = p.change?.dir;
  const change = dir === "down" ? -pct : dir === "up" ? pct : 0;
  const markets = (p.markets || [])
    .map((m) => ({
      name: m.market,
      division: m.division,
      min: m.min,
      max: m.max,
      avg: (m.min + m.max) / 2,
    }))
    .sort((a, b) => a.avg - b.avg);
  const lowest = markets.length ? [...markets].sort((a, b) => a.min - b.min)[0] : null;
  const highest = markets.length ? [...markets].sort((a, b) => b.max - a.max)[0] : null;
  const unitShort = UNITS[p.unit] || p.unit || "কেজি";
  return {
    id: p.id,
    slug: p.slug,
    name: p.nameBn,
    emoji: p.image || p.categoryIcon || "🛒",
    unit: `প্রতি ${unitShort}`,
    unitShort,
    category: p.category,
    categoryName: p.categoryNameBn,
    price: p.today,
    yesterday: p.yesterday,
    change,
    markets,
    min: lowest ? lowest.min : p.today,
    max: highest ? highest.max : p.today,
    avg: p.today,
    minMarket: lowest?.name || "",
    maxMarket: highest?.name || "",
  };
}
export async function getProducts() {
  const d = await get("/products");
  return Array.isArray(d) ? d.map(normProduct) : [];
}
export async function getProduct(slug) {
  const d = await get(`/products?slug=${encodeURIComponent(slug)}`);
  const one = Array.isArray(d) ? d[0] : null;
  if (one) return normProduct(one);
  return (await getProducts()).find((p) => p.slug === slug || String(p.id) === slug) || null;
}
export async function getCategories() {
  const d = await get("/categories");
  return Array.isArray(d) ? d.map((c) => ({ slug: c.slug, name: c.nameBn, emoji: c.icon })) : [];
}
