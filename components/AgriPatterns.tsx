// Motifs hexagonaux subtils pour les headers des pages internes
export default function AgriPatterns() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Hexagone - droite */}
      <svg className="absolute -right-[8%] top-[10%] w-[30%] opacity-[0.06]" viewBox="0 0 200 230" fill="none" stroke="white" strokeWidth="1.5">
        <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" />
      </svg>
      
      {/* Hexagone plus petit - gauche */}
      <svg className="absolute -left-[5%] -bottom-[20%] w-[22%] opacity-[0.04]" viewBox="0 0 200 230" fill="none" stroke="white" strokeWidth="1">
        <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" />
      </svg>
    </div>
  );
}
