import { CardSkeletons } from "@/components/Skeletons";
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <p className="text-gray-500">লোড হচ্ছে…</p>
      <div className="skeleton h-20 rounded-2xl" />
      <CardSkeletons n={6} />
    </div>
  );
}
