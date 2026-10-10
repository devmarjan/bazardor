"use client";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { toBn } from "@/lib/format";

export default function CategoryList({ products }) {
  const [sort, setSort] = useState("default");
  const sorted = useMemo(() => {
    const a = [...products];
    if (sort === "asc") a.sort((x, y) => x.price - y.price);
    if (sort === "desc") a.sort((x, y) => y.price - x.price);
    return a;
  }, [products, sort]);
  return (
    <>
      <div className="bg-white rounded-2xl border border-base-200 p-4 flex justify-end items-center gap-2 text-sm">
        <label htmlFor="sort">সাজান</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered select-sm">
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
      </div>
      <p className="text-sm text-gray-500 my-4">মোট {toBn(sorted.length)}টি পণ্য দেখানো হচ্ছে</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sorted.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </>
  );
}
