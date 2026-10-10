const bn = "০১২৩৪৫৬৭৮৯";
export const toBn = (n) => String(n).replace(/\d/g, (d) => bn[d]);
export const toEn = (s) => String(s).replace(/[০-৯]/g, (d) => bn.indexOf(d));
export const num = (v) => {
  const n = parseFloat(toEn(v ?? "").replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};
export const fmtPrice = (n) => toBn(Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }));
export const fmtPct = (n) => toBn(Math.abs(n).toFixed(1));
export const banglaDate = () =>
  new Date().toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
