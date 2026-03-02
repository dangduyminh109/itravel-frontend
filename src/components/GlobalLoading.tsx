"use client";

import { useLoadingStore } from "@/store/loading.store";
import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-secondary-foreground/50 z-50 flex items-center justify-center">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}
