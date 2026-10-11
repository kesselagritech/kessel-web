"use client";
// components/SiteTracker.tsx — [visites v1]
// Note chaque page ouverte (chemin seul, jamais les parametres d'URL) vers /api/track.
// Badge visiteur : kessel_vid (localStorage, permanent). Visite : kessel_sess, coupee apres 30 min d'inactivite.
// Actif uniquement sur le domaine de production (pas en local ni sur les previews Vercel).

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const VID_KEY = "kessel_vid";
const SESS_KEY = "kessel_sess";
const IDLE_MS = 30 * 60 * 1000;

function getIds(): { vid: string; sid: string; isNewSession: boolean } | null {
  try {
    let vid = localStorage.getItem(VID_KEY);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(VID_KEY, vid);
    }
    const now = Date.now();
    let sess: { id?: unknown; last?: unknown } | null = null;
    try {
      sess = JSON.parse(localStorage.getItem(SESS_KEY) || "null");
    } catch {
      sess = null;
    }
    let isNewSession = false;
    let sid: string;
    if (!sess || typeof sess.id !== "string" || typeof sess.last !== "number" || now - sess.last > IDLE_MS) {
      sid = crypto.randomUUID();
      isNewSession = true;
    } else {
      sid = sess.id;
    }
    localStorage.setItem(SESS_KEY, JSON.stringify({ id: sid, last: now }));
    return { vid, sid, isNewSession };
  } catch {
    return null;
  }
}

export function SiteTracker() {
  const pathname = usePathname();
  const { session, loading } = useAuth();
  const tokenRef = useRef<string | null>(null);
  const lastSent = useRef<string | null>(null);

  tokenRef.current = session?.access_token ?? null;

  useEffect(() => {
    if (loading || !pathname) return; // attendre de savoir si le visiteur est connecte
    if (lastSent.current === pathname) return;
    if (!/(^|\.)kesselagritech\.com$/i.test(window.location.hostname)) return;

    const ids = getIds();
    if (!ids) return;
    lastSent.current = pathname;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (tokenRef.current) headers.Authorization = `Bearer ${tokenRef.current}`;

    fetch("/api/track", {
      method: "POST",
      keepalive: true,
      headers,
      body: JSON.stringify({
        vid: ids.vid,
        sid: ids.sid,
        path: pathname,
        ref: ids.isNewSession ? document.referrer || null : null,
      }),
    }).catch(() => {});
  }, [pathname, loading]);

  return null;
}
