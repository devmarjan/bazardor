const bn = "০১২৩৪৫৬৭৮৯";
export const toBn = (n) => String(n).replace(/\d/g, (d) => bn[d]);
export const toEn = (s) => String(s).replace(/[০-৯]/g, (d) => bn.indexOf(d));
export const num = (v) => {
  if (typeof v === "number") return isNaN(v) ? 0 : v;
  const m = toEn(v ?? "").replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
};
export const fmtPrice = (n) => toBn(Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }));
export const fmtPct = (n) => toBn(Math.abs(n).toFixed(1));
export const banglaDate = () =>
  new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
