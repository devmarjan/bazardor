import { fmtPct } from "@/lib/format";
export default function Badge({ change }) {
  if (change > 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">▲ {fmtPct(change)}%</span>;
  if (change < 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">▼ {fmtPct(change)}%</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">— ০.০%</span>;
}
