import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-dark pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Marque */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-forest rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--serif)" }}>K</span>
              </div>
              <span className="text-white text-xl font-semibold" style={{ fontFamily: "var(--serif)" }}>Kessel</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Application de gestion de projets agricoles conçue pour les promoteurs camerounais.
            </p>
            <div className="space-y-1 text-sm">
              <a href="mailto:contact@kesselagritech.com" className="text-white/70 hover:text-amber transition-colors block">contact@kesselagritech.com</a>
              <a href="https://wa.me/237659374501" className="text-white/70 hover:text-amber transition-colors block">+237 659 374 501</a>
              <p className="text-white/40">Kribi, Cameroun</p>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#fonctionnalites" className="text-white/60 hover:text-amber transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/#marches" className="text-white/60 hover:text-amber transition-colors">Prix des marchés</Link></li>
              <li><Link href="/guide" className="text-white/60 hover:text-amber transition-colors">Guide d'utilisation</Link></li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/zones" className="text-white/60 hover:text-amber transition-colors">Zones agro-écologiques</Link></li>
              <li><Link href="/itk" className="text-white/60 hover:text-amber transition-colors">Itinéraires techniques</Link></li>
              <li><Link href="/speculations" className="text-white/60 hover:text-amber transition-colors">Spéculations</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-amber transition-colors">FAQ</Link></li>
              <li><Link href="/a-propos" className="text-white/60 hover:text-amber transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-amber transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cgu" className="text-white/60 hover:text-amber transition-colors">Conditions d'utilisation</Link></li>
              <li><Link href="/confidentialite" className="text-white/60 hover:text-amber transition-colors">Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="text-white/60 hover:text-amber transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">© 2026 Kessel Agritech. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/237659374501" className="text-white/40 hover:text-amber transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}