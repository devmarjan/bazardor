export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="skeleton h-4 w-48" />
      <div className="skeleton h-32 rounded-2xl" />
      <div className="skeleton h-80 rounded-2xl" />
    </div>
  );
}
