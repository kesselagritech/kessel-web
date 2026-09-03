/**
 * Helper central pour la redirection post-authentification.
 *
 * - authHref(pathname)     -> construit un lien vers /connexion en preservant
 *                             le chemin courant dans ?redirect=
 * - sanitizeRedirect(raw)  -> valide un ?redirect= recu en URL et refuse les
 *                             tentatives de redirection externe (open redirect)
 *
 * A utiliser partout ou l'on veut proposer un lien vers /connexion depuis
 * une page ou l'utilisateur devrait retomber apres avoir authentifie.
 */

const DEFAULT_FALLBACK = "/";

// Chemins pour lesquels ajouter un redirect n'a pas de sens
const SKIP_PATHS = new Set(["/", "/connexion", "/inscription", "/mot-de-passe-oublie"]);
const SKIP_PREFIXES = ["/auth/"];

/**
 * Construit un href vers /connexion en preservant le chemin courant.
 *
 * @param pathname Le chemin actuel (via usePathname() de next/navigation).
 *   Peut etre null : dans ce cas, on retourne "/connexion" sans redirect.
 * @param opts.mode "login" (defaut) ou "register" pour ouvrir directement
 *   l'onglet inscription.
 * @returns Un href type "/connexion?redirect=/collaborateurs&mode=register"
 *
 * @example
 *   const pathname = usePathname();
 *   <Link href={authHref(pathname)}>Connexion</Link>
 *   <Link href={authHref(pathname, { mode: "register" })}>Creer un compte</Link>
 */
export function authHref(
  pathname: string | null | undefined,
  opts?: { mode?: "login" | "register" },
): string {
  const params = new URLSearchParams();

  if (pathname && shouldPreserveRedirect(pathname)) {
    params.set("redirect", pathname);
  }

  if (opts?.mode === "register") {
    params.set("mode", "register");
  }

  const query = params.toString();
  return query ? `/connexion?${query}` : "/connexion";
}

function shouldPreserveRedirect(pathname: string): boolean {
  if (SKIP_PATHS.has(pathname)) return false;
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return false;
  return true;
}

/**
 * Valide un parametre ?redirect= recu en URL cote /connexion ou /auth/callback.
 * Refuse les URLs externes, protocol-relative (//), backslash-escapes,
 * et les tentatives d'encodage double.
 *
 * @param raw La valeur brute recue via searchParams.get("redirect")
 * @param fallback Chemin de repli si raw est invalide (defaut : "/")
 * @returns Un chemin interne sur (commence par / mais pas par //)
 */
export function sanitizeRedirect(
  raw: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (!raw) return fallback;

  // Doit commencer par / (chemin interne)
  if (!raw.startsWith("/")) return fallback;

  // Mais pas par // (protocol-relative = URL externe deguisee)
  if (raw.startsWith("//")) return fallback;

  // Bloque /\evil.com (variante d'attaque sur certains parsers)
  if (raw.startsWith("/\\")) return fallback;

  // Bloque tentative d'encodage : /%2F%2Fevil.com decodable en ///evil.com
  const decoded = safeDecodeURI(raw);
  if (decoded.startsWith("//") || decoded.startsWith("/\\")) return fallback;

  return raw;
}

function safeDecodeURI(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
