import { num } from "./format";
const BASES = [
  process.env.API_BASE_1 || "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];
async function get(path) {
  for (const b of BASES) {
    try {
      const r = await fetch(b + path, { cache: "no-store" });
      if (r.ok) return await r.json();
    } catch {}
  }
  return null;
}
const list = (d) => {
  if (Array.isArray(d)) return d;
  if (!d || typeof d !== "object") return [];
  for (const k of ["data", "products", "categories", "items", "results", "markets", "prices"]) {
    if (Array.isArray(d[k])) return d[k];
    if (d[k] && typeof d[k] === "object") { const r = list(d[k]); if (r.length) return r; }
  }
  return [];
};
const flat = (o, d = 0, out = {}) => {
  for (const [k, v] of Object.entries(o || {})) {
    if (v && typeof v === "object" && !Array.isArray(v) && d < 2) flat(v, d + 1, out);
    else if (!(k.toLowerCase() in out)) out[k.toLowerCase()] = v;
  }
  return out;
};
const first = (f, keys) => { for (const k of keys) if (f[k] != null && f[k] !== "") return f[k]; };
const firstNum = (f, keys) => { for (const k of keys) if (f[k] != null && num(f[k]) > 0) return num(f[k]); return 0; };

export function normProduct(p) {
  const f = flat(p);
  const markets = list(first(f, ["markets", "bazars", "bazaars", "marketprices", "market_prices", "prices"]) ?? []).map((m) => {
    const g = flat(m);
    return {
      name: first(g, ["name", "market", "bazar", "bazaar", "marketname"]) ?? "",
      division: first(g, ["division", "region", "area", "location", "city"]) ?? "",
      min: firstNum(g, ["min", "minprice", "min_price", "lowest"]),
      max: firstNum(g, ["max", "maxprice", "max_price", "highest"]),
      avg: firstNum(g, ["avg", "average", "avgprice", "avg_price", "price", "today"]),
    };
  });
  const avgs = markets.map((m) => m.avg).filter(Boolean);
  let price = firstNum(f, ["price", "todayprice", "today_price", "currentprice", "current_price", "today", "current", "avgprice", "avg_price", "average", "avg", "value", "rate", "amount", "দাম"]);
  if (!price) {
    const k = Object.keys(f).find((k) => /price|rate|দাম|cost/.test(k) && !/prev|yesterday|old|last|min|max|change|percent/.test(k) && num(f[k]) > 0);
    if (k) price = num(f[k]);
  }
  if (!price && avgs.length) price = avgs.reduce((a, b) => a + b, 0) / avgs.length;

  const prev = firstNum(f, ["yesterdayprice", "yesterday_price", "yesterday", "previousprice", "previous_price", "previous", "prevprice", "prev_price", "prev", "oldprice", "old_price", "lastprice", "last_price"]);
  const rawCh = first(f, ["changepercent", "change_percent", "percentchange", "percent_change", "changepct", "change_pct", "percent", "pct", "changerate", "change", "diff"]);
  let ch = num(rawCh);
  if (prev > 0 && price > 0 && (rawCh == null || rawCh === "")) ch = ((price - prev) / prev) * 100;
  const hint = String(first(f, ["trend", "direction", "status", "arrow"]) ?? "") + String(rawCh ?? "");
  if (/down|fall|dec|▼|কম/i.test(hint)) ch = -Math.abs(ch);
  else if (/up|rise|inc|▲|বাড়/i.test(hint)) ch = Math.abs(ch);

  const cat = first(f, ["category", "categoryslug", "category_slug", "categoryid", "category_id"]);
  const c = p.category && typeof p.category === "object" ? p.category.slug ?? p.category.id ?? p.category.name : cat;
  const tags = p.tags ?? p.categories ?? [];
  return {
    id: p.id ?? first(f, ["_id", "slug"]),
    slug: String(p.slug ?? p.id ?? first(f, ["_id"])),
    name: first(f, ["name", "title", "namebn", "name_bn", "bn", "product"]) ?? "",
    emoji: first(f, ["emoji", "icon", "image", "img", "thumbnail"]) ?? "🛒",
    unit: first(f, ["unit", "unitbn", "unit_bn"]) ?? "প্রতি কেজি",
    category: String(c ?? ""),
    description: first(f, ["description", "summary", "subtitle"]) ?? "",
    tags: Array.isArray(tags) ? tags : [],
    price,
    change: ch,
    markets,
    min: firstNum(f, ["minprice", "min_price", "min", "lowest"]) || (markets.some((m) => m.min) ? Math.min(...markets.map((m) => m.min).filter(Boolean)) : price),
    max: firstNum(f, ["maxprice", "max_price", "max", "highest"]) || (markets.some((m) => m.max) ? Math.max(...markets.map((m) => m.max).filter(Boolean)) : price),
    avg: firstNum(f, ["avgprice", "avg_price", "average", "avg"]) || (avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : price),
  };
}
export async function getRawProducts() { return get("/products"); }
export async function getProducts() { return list(await get("/products")).map(normProduct); }
export async function getProduct(slug) {
  const d = await get(`/products/${encodeURIComponent(slug)}`);
  const raw = d && (d.data && !Array.isArray(d.data) ? d.data : d.product || d);
  if (raw && !Array.isArray(raw) && (raw.id != null || raw.name)) {
    const n = normProduct(raw);
    if (n.price > 0) return n;
  }
  return (await getProducts()).find((p) => p.slug === slug) || null;
}
export async function getCategories() {
  return list(await get("/categories")).map((c) => {
    const g = flat(c);
    return {
      slug: String(first(g, ["slug", "id"]) ?? ""),
      name: first(g, ["name", "title", "namebn"]) ?? "",
      emoji: first(g, ["emoji", "icon"]) ?? "🛒",
    };
  });
}
