// app/api/track/route.ts — Journal des pages vues du site — [visites v1]
// Recoit { vid, sid, path, ref } du composant SiteTracker et ecrit dans public.site_events
// (service_role). L'IP et la ville viennent des en-tetes Vercel, jamais du navigateur.
// Si le visiteur est connecte, tout son historique anonyme (meme badge) est rattache a son compte.
import { NextRequest, NextResponse } from 'next/server'
import { isIP } from 'node:net'
import { createServiceClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const BOT =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|pagespeed|curl|wget|python|axios|node-fetch|go-http/i
const OWN_HOST = /(^|\.)kesselagritech\.com$/i

const done = () => new NextResponse(null, { status: 204 })

function clientIp(req: NextRequest): string | null {
  const raw =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    ''
  const ip = raw.trim()
  return isIP(ip) ? ip : null
}

function deviceOf(ua: string): 'mobile' | 'tablette' | 'ordinateur' {
  if (/ipad|tablet/i.test(ua)) return 'tablette'
  if (/mobi|android|iphone/i.test(ua)) return 'mobile'
  return 'ordinateur'
}

function decodeHeader(v: string | null, max: number): string | null {
  if (!v) return null
  try {
    return decodeURIComponent(v).slice(0, max)
  } catch {
    return v.slice(0, max)
  }
}

function externalRefHost(ref: unknown): string | null {
  if (typeof ref !== 'string' || !ref) return null
  try {
    const host = new URL(ref).hostname
    return host && !OWN_HOST.test(host) ? host.slice(0, 300) : null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') ?? ''
    if (!ua || BOT.test(ua)) return done()

    const text = await req.text()
    if (text.length > 2000) return done()
    const body = JSON.parse(text) as { vid?: unknown; sid?: unknown; path?: unknown; ref?: unknown }

    const { vid, sid, path } = body
    if (typeof vid !== 'string' || !UUID.test(vid)) return done()
    if (typeof sid !== 'string' || !UUID.test(sid)) return done()
    if (typeof path !== 'string' || !path.startsWith('/') || path.length > 300) return done()

    const supabase = createServiceClient()

    // Compte connecte ? (jeton verifie cote serveur, jamais cru sur parole)
    let userId: string | null = null
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (token) {
      const { data } = await supabase.auth.getUser(token)
      userId = data.user?.id ?? null
    }

    const { error } = await supabase.from('site_events').insert({
      visitor_id: vid,
      session_id: sid,
      user_id: userId,
      path: path.split('?')[0].split('#')[0],
      referrer: externalRefHost(body.ref),
      ip: clientIp(req),
      country: decodeHeader(req.headers.get('x-vercel-ip-country'), 8),
      city: decodeHeader(req.headers.get('x-vercel-ip-city'), 80),
      device: deviceOf(ua),
    })
    if (error) console.error('[TRACK] insert:', error.message)

    // Rattrapage : les pages vues anonymes de ce meme badge passent sur le compte
    if (userId) {
      const { error: linkErr } = await supabase
        .from('site_events')
        .update({ user_id: userId })
        .eq('visitor_id', vid)
        .is('user_id', null)
      if (linkErr) console.error('[TRACK] link:', linkErr.message)
    }
  } catch (e) {
    console.error('[TRACK]', e)
  }
  return done()
}
