import { CardSkeletons } from "@/components/Skeletons";
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="skeleton h-56 rounded-2xl" />
      <CardSkeletons n={9} />
    </div>
  );
}
