"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ========================================
// NAVBAR — coquille unique, logo unique
// + état de connexion (comptes web)
// ========================================
export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainLinks = [
    { href: "/application", label: "Application" },
    { href: "/bibliotheque", label: "Bibliothèque" },
    { href: "/comparateur", label: "Comparateur" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    window.location.href = "/connexion?deconnecte=1";
  };

  // Initiale de l'utilisateur pour l'avatar
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo texte — unique, partout */}
          <Link href="/" className="flex items-center">
            <span
              className="font-bold text-2xl tracking-[0.02em]"
              style={{ fontFamily: "var(--serif)", color: "#2D4A35" }}
            >
              Kessel<span style={{ color: "#BA7517" }}> Agritech</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-forest-700 hover:text-forest-900 font-medium transition-colors"
              >
                <Home size={18} />
                Accueil
              </Link>
            )}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-forest-700 hover:text-forest-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="text-forest-700 hover:text-forest-900 font-medium transition-colors"
            >
              Contact
            </Link>

            {/* Auth — Desktop */}
            {!authLoading &&
              (user ? (
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: "#2D4A35" }}
                    title={user.email ?? ""}
                  >
                    {userInitial}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-forest-700 hover:text-forest-900 font-medium transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/connexion"
                  className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <LogIn size={18} />
                  Connexion
                </Link>
              ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-forest-700"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-forest-100">
          <div className="px-4 py-4 space-y-1">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-3 py-3 text-forest-700 hover:text-forest-900 font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Home size={20} className="text-forest-400" />
                Accueil
              </Link>
            )}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-forest-700 hover:text-forest-900 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="block py-3 text-forest-700 hover:text-forest-900 font-medium border-t border-forest-100"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {/* Auth — Mobile */}
            <div className="pt-3 border-t border-forest-100">
              {!authLoading &&
                (user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: "#2D4A35" }}
                      >
                        {userInitial}
                      </div>
                      <span className="text-sm text-gray-600 truncate">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 w-full text-forest-700 hover:text-forest-900 font-semibold py-3 rounded-xl border border-forest-200 transition-colors"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/connexion"
                    className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white font-semibold py-3 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={18} />
                    Connexion
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

