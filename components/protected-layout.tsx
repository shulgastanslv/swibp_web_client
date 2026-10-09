"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthModal } from "@/components/auth";

/**
 * Gates the editor behind authentication.
 * While signed out, the auth modal stays open and cannot be dismissed.
 */
export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);

  const unauthenticated = status === "unauthenticated";
  const loading = status === "loading";

  useEffect(() => {
    if (unauthenticated) setAuthOpen(true);
    if (status === "authenticated") setAuthOpen(false);
  }, [status, unauthenticated]);

  return (
    <>
      {children}
      {!loading && (
        <AuthModal
          required={unauthenticated}
          isOpen={authOpen || unauthenticated}
          onOpenChange={(open) => {
            if (unauthenticated && !open) return;
            setAuthOpen(open);
          }}
        />
      )}
    </>
  );
}
