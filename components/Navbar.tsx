"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

// ========================================
// LOGO KESSEL - Conforme a la charte graphique
// ========================================
function KesselLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={"flex items-center gap-3 " + className}>
      {/* Hexagone SVG avec K */}
      <svg
        width="40"
        height="44"
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M20 0L38.6603 11V33L20 44L1.33975 33V11L20 0Z"
          fill="#2D4A35"
        />
        <text
          x="20"
          y="29"
          textAnchor="middle"
          fill="white"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="700"
          fontSize="22"
        >
          K
        </text>
      </svg>
      <span
        className="font-serif font-bold text-2xl tracking-[0.04em]"
        style={{ color: "#2D4A35" }}
      >
        Kessel
      </span>
    </Link>
  );
}

// ========================================
// NAVBAR PRINCIPALE
// ========================================
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [];

  const resourceLinks = [
    { href: "/guide", label: "Guide d'utilisation" },
    { href: "/zones", label: "Zones agro-ecologiques" },
    { href: "/itk", label: "Itineraires techniques" },
    { href: "/speculations", label: "Speculations" },
    { href: "/faq", label: "FAQ" },
    { href: "/a-propos", label: "A propos" },
  ];

  return (
    <nav
      className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <KesselLogo />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-forest-700 hover:text-forest-900 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-1 text-forest-700 hover:text-forest-900 font-medium transition-colors"
              >
                Ressources
                <ChevronDown
                  size={18}
                  className={"transition-transform " + (resourcesOpen ? "rotate-180" : "")}
                />
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-forest-100 py-2">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-forest-700 hover:bg-forest-50 hover:text-forest-900 transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="text-forest-700 hover:text-forest-900 font-medium transition-colors"
            >
              Contact
            </Link>

            <Link
              href="https://expo.dev/@kessel/kessel"
              target="_blank"
              className="bg-amber hover:bg-amber-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Telecharger
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-forest-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-forest-100">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-forest-700 hover:text-forest-900 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="py-3 border-t border-forest-100">
              <p className="text-sm font-semibold text-forest-400 uppercase tracking-wide mb-2">
                Ressources
              </p>
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-forest-700 hover:text-forest-900"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              className="block py-3 text-forest-700 hover:text-forest-900 font-medium border-t border-forest-100"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <Link
              href="https://expo.dev/@kessel/kessel"
              target="_blank"
              className="block mt-4 bg-forest-700 hover:bg-forest-800 text-white text-center px-5 py-3 rounded-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Telecharger l'app
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}