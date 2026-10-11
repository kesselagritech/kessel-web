"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { SiteTracker } from "@/components/SiteTracker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteTracker />
      {children}
    </AuthProvider>
  );
}
