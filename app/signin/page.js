import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
export default function Page() {
  return <Suspense fallback={<div className="skeleton h-96 max-w-md mx-auto mt-10" />}><AuthForm mode="signin" /></Suspense>;
}
