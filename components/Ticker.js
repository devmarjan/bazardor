import { fmtPct, fmtPrice } from "@/lib/format";
export default function Ticker({ products }) {
  const items = [...products, ...products];
  return (
    <div className="bg-white border-b border-base-200 overflow-hidden py-2 text-sm">
      <div className="marquee">
        {items.map((p, i) => (
          <span key={i} className="px-4 border-r border-base-200 whitespace-nowrap">
            {p.emoji} {p.name} {fmtPrice(p.price)} টাকা/{p.unitShort}{" "}
            {p.change > 0 && <span className="text-red-600">▲ {fmtPct(p.change)}%</span>}
            {p.change < 0 && <span className="text-green-600">▼ {fmtPct(p.change)}%</span>}
            {p.change === 0 && <span className="text-gray-500">— ০.০%</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
