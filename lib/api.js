import { num } from "./format";
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
const list = (d) => (Array.isArray(d) ? d : d?.data || d?.products || d?.categories || d?.items || d?.markets || []);
const pick = (o, keys, def) => {
  for (const k of keys) if (o?.[k] != null) return o[k];
  return def;
};

// NOTE: API-র field নাম অনুযায়ী এখানে adjust করতে পারো
export function normProduct(p) {
  let ch = num(pick(p, ["change", "changePercent", "change_percent", "percentChange", "changePct", "percent"], 0));
  const t = String(pick(p, ["trend", "direction", "status"], "")).toLowerCase();
  if (/down|fall|dec/.test(t)) ch = -Math.abs(ch);
  else if (/up|rise|inc/.test(t)) ch = Math.abs(ch);
  const markets = list(pick(p, ["markets", "bazars", "bazaars", "marketPrices", "market_prices"], [])).map((m) => ({
    name: pick(m, ["name", "market", "bazar", "bazaar"], ""),
    division: pick(m, ["division", "region", "area", "location"], ""),
    min: num(pick(m, ["min", "minPrice", "min_price"], 0)),
    max: num(pick(m, ["max", "maxPrice", "max_price"], 0)),
    avg: num(pick(m, ["avg", "average", "avgPrice", "avg_price"], 0)),
  }));
  const price = num(pick(p, ["price", "todayPrice", "today_price", "currentPrice", "current_price", "avgPrice"], 0));
  const mins = markets.map((m) => m.min).filter(Boolean);
  const maxs = markets.map((m) => m.max).filter(Boolean);
  const avgs = markets.map((m) => m.avg).filter(Boolean);
  const tags = pick(p, ["tags", "categories"], []);
  return {
    id: p.id,
    slug: String(p.slug ?? p.id),
    name: pick(p, ["name", "title", "nameBn", "name_bn"], ""),
    emoji: pick(p, ["emoji", "icon", "image"], "🛒"),
    unit: pick(p, ["unit", "unitBn", "unit_bn"], "প্রতি কেজি"),
    category: String(pick(p, ["category", "categorySlug", "category_slug"], "")),
    description: pick(p, ["description", "summary", "subtitle"], ""),
    tags: Array.isArray(tags) ? tags : [],
    price,
    change: ch,
    markets,
    min: num(pick(p, ["minPrice", "min_price", "min"], 0)) || (mins.length ? Math.min(...mins) : price),
    max: num(pick(p, ["maxPrice", "max_price", "max"], 0)) || (maxs.length ? Math.max(...maxs) : price),
    avg: num(pick(p, ["avgPrice", "avg_price", "average", "avg"], 0)) || (avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : price),
  };
}
export async function getProducts() {
  return list(await get("/products")).map(normProduct);
}
export async function getProduct(slug) {
  const d = await get(`/products/${encodeURIComponent(slug)}`);
  const raw = d && (d.data && !Array.isArray(d.data) ? d.data : d.product || d);
  if (raw && !Array.isArray(raw) && (raw.id != null || raw.name)) return normProduct(raw);
  return (await getProducts()).find((p) => p.slug === slug) || null;
}
export async function getCategories() {
  return list(await get("/categories")).map((c) => ({
    slug: String(pick(c, ["slug", "id"], "")),
    name: pick(c, ["name", "title", "nameBn"], ""),
    emoji: pick(c, ["emoji", "icon"], "🛒"),
  }));
}
