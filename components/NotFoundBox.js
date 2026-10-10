import Link from "next/link";
export default function NotFoundBox({ text = "দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি।" }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <p className="text-7xl font-bold text-brand">404</p>
      <p className="mt-3 text-gray-600">{text}</p>
      <Link href="/" className="btn bg-brand text-white hover:bg-green-800 mt-6">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
