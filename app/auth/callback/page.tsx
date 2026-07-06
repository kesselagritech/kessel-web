"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setConfirmed(true);
        setTimeout(() => router.replace("/bibliotheque"), 2000);
      } else {
        router.replace("/connexion");
      }
    });
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {confirmed ? (
          <>
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
            <p className="text-lg font-semibold" style={{ color: "#2D4A35" }}>
              Compte confirmé !
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Redirection vers la bibliothèque...
            </p>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-[#2D4A35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Vérification en cours...</p>
          </>
        )}
      </div>
    </main>
  );
}
