"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriPatterns from "@/components/AgriPatterns";

const categories = [
  { id: "all", label: "Toutes" },
  { id: "vivrier", label: "Cultures vivrieres" },
  { id: "maraicher", label: "Maraichage" },
  { id: "rente", label: "Cultures de rente" },
  { id: "fruitier", label: "Arboriculture" },
  { id: "elevage", label: "Elevage" },
];

const speculations = [
  // ==================== CULTURES VIVRIERES ====================
  { 
    name: "Mais", famille: "Poacees", cat: "vivrier", 
    zones: ["Hauts Plateaux", "Savanes Guineennes", "Forets Bimodales"], 
    cycle: "90-120 jours", rendement: "2-5 t/ha",
    description: "Cereale de base de l'alimentation camerounaise, cultivee dans presque toutes les regions.",
    economie: { prixMoyen: "180-220 FCFA/kg", marches: ["Bafoussam", "Yaounde", "Garoua"], debouches: "Alimentation humaine, provenderie, brasserie", exportation: "Marche sous-regional CEMAC" },
    itk: { preparation: "Labour profond (20-25 cm), hersage, fumure de fond NPK", semis: "Ecartement 80x25 cm, 2-3 graines par poquet", entretien: "2 sarclages, buttage, apport uree", protection: "Foreurs de tige, chenilles legionnaires", recolte: "Sechage sur pied jusqu'a 14% humidite" },
    specificites: ["Exigeant en eau a la floraison", "Rotation avec legumineuses", "Varietes hybrides plus productives"]
  },
  { 
    name: "Manioc", famille: "Euphorbiacees", cat: "vivrier", 
    zones: ["Forets Bimodales", "Forets Monomodales", "Savanes Guineennes"], 
    cycle: "12-18 mois", rendement: "15-30 t/ha",
    description: "Culture de securite alimentaire, resistante a la secheresse et aux sols pauvres.",
    economie: { prixMoyen: "100-150 FCFA/kg", marches: ["Douala", "Yaounde", "Kribi"], debouches: "Consommation directe, gari, tapioca, batons", exportation: "Amidon industriel" },
    itk: { preparation: "Defrichement, labour leger, billonnage", semis: "Boutures 20-25 cm, inclinees a 45deg, 1mx1m", entretien: "Sarclages 4 premiers mois, buttage", protection: "Cochenille farineuse, mosaique", recolte: "Arrachage manuel, recolte echelonnee" },
    specificites: ["Tolere sols acides et pauvres", "Varietes douces vs ameres", "Association mais/arachide"]
  },
  { 
    name: "Plantain", famille: "Musacees", cat: "vivrier", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "12-15 mois", rendement: "8-15 t/ha",
    description: "Feculent majeur de la zone forestiere, consomme sous de nombreuses formes.",
    economie: { prixMoyen: "200-300 FCFA/kg", marches: ["Douala", "Yaounde", "Buea"], debouches: "Consommation directe, chips, farine", exportation: "Marche local" },
    itk: { preparation: "Trouaison 50x50x50 cm, fumure organique", semis: "Rejets oeilletonnes, 1600 pieds/ha", entretien: "Oeilletonnage, tuteurage, paillage", protection: "Charancon, cercosporiose noire", recolte: "Coupe du regime a maturite" },
    specificites: ["Sols riches et bien draines", "Sensible au vent", "Replantation tous les 5-7 ans"]
  },
  { 
    name: "Macabo", famille: "Aracees", cat: "vivrier", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "10-12 mois", rendement: "8-15 t/ha",
    description: "Tubercule apprecie pour sa chair violette ou blanche, base de plats traditionnels.",
    economie: { prixMoyen: "250-400 FCFA/kg", marches: ["Yaounde", "Douala", "Ebolowa"], debouches: "Consommation directe, transformation", exportation: "Diaspora" },
    itk: { preparation: "Labour, billonnage, fumure organique", semis: "Fragments de tubercules, 1mx0.8m", entretien: "Sarclages, buttage, cendres", protection: "Pourriture en sol mal draine", recolte: "Arrachage a maturite" },
    specificites: ["Sols riches en matiere organique", "Ombre partielle possible", "Conservation delicate"]
  },
  { 
    name: "Arachide", famille: "Fabacees", cat: "vivrier", 
    zones: ["Soudano-Sahelienne", "Savanes Guineennes", "Forets Bimodales"], 
    cycle: "90-120 jours", rendement: "1-2 t/ha",
    description: "Legumineuse oleagineuse majeure, source de proteines et d'huile.",
    economie: { prixMoyen: "400-600 FCFA/kg", marches: ["Garoua", "Maroua", "Ngaoundere"], debouches: "Huilerie, pate d'arachide", exportation: "Huile, tourteaux" },
    itk: { preparation: "Labour leger, hersage fin, chaulage", semis: "En ligne 40x15 cm, 2 graines/poquet", entretien: "Sarclage-buttage, pas d'azote", protection: "Aflatoxines, rosette", recolte: "Arrachage au jaunissement" },
    specificites: ["Ameliore la fertilite (azote)", "Sensible exces d'eau", "Rotation avec cereales"]
  },
  { 
    name: "Igname", famille: "Dioscoreacees", cat: "vivrier", 
    zones: ["Savanes Guineennes", "Forets Bimodales"], 
    cycle: "8-12 mois", rendement: "10-25 t/ha",
    description: "Tubercule noble, tres prise dans le Nord et l'Ouest du Cameroun.",
    economie: { prixMoyen: "300-500 FCFA/kg", marches: ["Garoua", "Bamenda", "Yaounde"], debouches: "Consommation directe, pile, frites", exportation: "Demande diaspora" },
    itk: { preparation: "Buttes de 40-50 cm, fumure organique", semis: "Semenceaux 200-300g, 1mx1m", entretien: "Tuteurage, sarclages", protection: "Anthracnose, nematodes", recolte: "Arrachage manuel a maturite" },
    specificites: ["Sols profonds et meubles", "Tuteurage obligatoire", "Conservation 2-3 mois possible"]
  },
  { 
    name: "Haricot", famille: "Fabacees", cat: "vivrier", 
    zones: ["Hauts Plateaux", "Savanes Guineennes", "Soudano-Sahelienne"], 
    cycle: "70-90 jours", rendement: "0.8-1.5 t/ha",
    description: "Legumineuse a grains, source majeure de proteines vegetales.",
    economie: { prixMoyen: "600-900 FCFA/kg", marches: ["Bafoussam", "Foumban", "Maroua"], debouches: "Consommation directe, conserverie", exportation: "Marche sous-regional" },
    itk: { preparation: "Labour leger, planches", semis: "En ligne 40x20 cm, 2 graines/poquet", entretien: "Sarclages, pas d'azote", protection: "Anthracnose, bruches", recolte: "Recolte gousses seches" },
    specificites: ["Fixation azote atmospherique", "Sensible humidite excessive", "Stockage avec insecticide"]
  },
  { 
    name: "Sorgho", famille: "Poacees", cat: "vivrier", 
    zones: ["Soudano-Sahelienne", "Savanes Guineennes"], 
    cycle: "90-150 jours", rendement: "1-3 t/ha",
    description: "Cereale rustique du Nord, tolerante a la secheresse.",
    economie: { prixMoyen: "150-200 FCFA/kg", marches: ["Maroua", "Garoua", "Kousseri"], debouches: "Alimentation, bouillie, biere locale (bil-bil)", exportation: "Local" },
    itk: { preparation: "Labour leger, semis direct", semis: "A la volee ou en ligne 60x20 cm", entretien: "1-2 sarclages", protection: "Striga, mineuse des tiges", recolte: "Coupe des panicules a maturite" },
    specificites: ["Tres tolerant secheresse", "Adapte sols pauvres", "Base alimentation Grand Nord"]
  },
  { 
    name: "Mil", famille: "Poacees", cat: "vivrier", 
    zones: ["Soudano-Sahelienne"], 
    cycle: "75-120 jours", rendement: "0.5-1.5 t/ha",
    description: "Cereale traditionnelle de l'Extreme-Nord, tres rustique.",
    economie: { prixMoyen: "180-250 FCFA/kg", marches: ["Maroua", "Kousseri", "Mokolo"], debouches: "Bouillie, couscous, biere", exportation: "Local" },
    itk: { preparation: "Semis direct apres premiere pluie", semis: "A la volee ou poquets 50x50 cm", entretien: "Sarclage-demariage", protection: "Oiseaux, mildiou", recolte: "Coupe chandelles" },
    specificites: ["Le plus tolerant a la secheresse", "Sols sableux", "Culture de subsistance"]
  },
  { 
    name: "Riz", famille: "Poacees", cat: "vivrier", 
    zones: ["Forets Monomodales", "Savanes Guineennes", "Soudano-Sahelienne"], 
    cycle: "120-150 jours", rendement: "2-5 t/ha",
    description: "Cereale en forte demande, cultivee en pluvial et irrigue.",
    economie: { prixMoyen: "350-500 FCFA/kg", marches: ["Yaounde", "Douala", "Garoua"], debouches: "Consommation directe", exportation: "Forte importation a substituer" },
    itk: { preparation: "Planage, amenagement hydraulique (irrigue)", semis: "Pepiniere puis repiquage ou semis direct", entretien: "Desherbage, gestion eau", protection: "Pyriculariose, foreurs", recolte: "Moisson a maturite, battage" },
    specificites: ["Irrigue plus productif que pluvial", "Forte demande nationale", "Politique d'autosuffisance"]
  },
  // ==================== MARAICHAGE ====================
  { 
    name: "Tomate", famille: "Solanacees", cat: "maraicher", 
    zones: ["Toutes zones"], 
    cycle: "90-120 jours", rendement: "20-40 t/ha",
    description: "Legume-fruit le plus cultive au Cameroun, base de la cuisine locale.",
    economie: { prixMoyen: "200-500 FCFA/kg", marches: ["Tous marches urbains"], debouches: "Frais, concentre", exportation: "Transformation" },
    itk: { preparation: "Pepiniere 3 semaines, planches surelevees", semis: "Repiquage 50x40 cm, tuteurage", entretien: "Ebourgeonnage, irrigation", protection: "Mildiou, Tuta absoluta", recolte: "Echelonnee tous les 3-4 jours" },
    specificites: ["Tres sensible maladies fongiques", "Goutte-a-goutte ideal", "Prix tres volatil"]
  },
  { 
    name: "Piment", famille: "Solanacees", cat: "maraicher", 
    zones: ["Toutes zones"], 
    cycle: "90-150 jours", rendement: "5-15 t/ha",
    description: "Condiment incontournable de la cuisine camerounaise.",
    economie: { prixMoyen: "500-1500 FCFA/kg", marches: ["Tous marches"], debouches: "Frais, seche, poudre", exportation: "Demande regionale" },
    itk: { preparation: "Pepiniere, planches drainees", semis: "Repiquage 50x40 cm", entretien: "Sarclages, tuteurage", protection: "Anthracnose, pucerons", recolte: "Cueillette echelonnee" },
    specificites: ["Plusieurs varietes locales", "Sechage au soleil", "Bonne conservation"]
  },
  { 
    name: "Oignon", famille: "Alliacees", cat: "maraicher", 
    zones: ["Soudano-Sahelienne", "Hauts Plateaux"], 
    cycle: "120-150 jours", rendement: "15-30 t/ha",
    description: "Legume bulbe tres demande, production concentree au Nord.",
    economie: { prixMoyen: "300-600 FCFA/kg", marches: ["Maroua", "Garoua", "Yaounde"], debouches: "Frais, seche", exportation: "Tchad, RCA, Gabon" },
    itk: { preparation: "Pepiniere, planches bien nivelees", semis: "Repiquage 15x10 cm", entretien: "Irrigation reguliere, desherbage", protection: "Thrips, mildiou", recolte: "Arrachage a verse des feuilles" },
    specificites: ["Saison seche ideale", "Stockage 3-6 mois", "Forte demande nationale"]
  },
  { 
    name: "Chou", famille: "Brassicacees", cat: "maraicher", 
    zones: ["Hauts Plateaux", "Forets Bimodales"], 
    cycle: "90-120 jours", rendement: "25-40 t/ha",
    description: "Legume feuille tres populaire dans l'Ouest et les grandes villes.",
    economie: { prixMoyen: "150-300 FCFA/kg", marches: ["Bafoussam", "Yaounde", "Douala"], debouches: "Frais", exportation: "Local" },
    itk: { preparation: "Pepiniere, planches fumees", semis: "Repiquage 60x50 cm", entretien: "Arrosages, buttage", protection: "Chenilles, pucerons", recolte: "Coupe pomme ferme" },
    specificites: ["Prefere climat frais", "Ouest = zone ideale", "Sensible chaleur"]
  },
  { 
    name: "Carotte", famille: "Apiacees", cat: "maraicher", 
    zones: ["Hauts Plateaux"], 
    cycle: "90-120 jours", rendement: "20-35 t/ha",
    description: "Legume racine cultive principalement dans l'Ouest.",
    economie: { prixMoyen: "300-500 FCFA/kg", marches: ["Bafoussam", "Yaounde", "Douala"], debouches: "Frais, jus", exportation: "Local" },
    itk: { preparation: "Sol meuble profond, planches", semis: "Semis direct en ligne", entretien: "Eclaircissage, desherbage", protection: "Mouche de la carotte", recolte: "Arrachage a maturite" },
    specificites: ["Sol sans cailloux", "Climat frais", "Demande urbaine croissante"]
  },
  { 
    name: "Gombo", famille: "Malvacees", cat: "maraicher", 
    zones: ["Toutes zones"], 
    cycle: "60-90 jours", rendement: "8-15 t/ha",
    description: "Legume fruit mucilagineux, ingredient cle des sauces.",
    economie: { prixMoyen: "400-700 FCFA/kg", marches: ["Tous marches"], debouches: "Frais, seche", exportation: "Regional" },
    itk: { preparation: "Labour, fumure organique", semis: "Poquets 60x40 cm", entretien: "Sarclages", protection: "Jassides, chenilles", recolte: "Cueillette tous les 2 jours" },
    specificites: ["Croissance rapide", "Recolte frequente", "Sechage possible"]
  },
  { 
    name: "Laitue", famille: "Asteracees", cat: "maraicher", 
    zones: ["Hauts Plateaux", "Forets Bimodales"], 
    cycle: "45-60 jours", rendement: "15-25 t/ha",
    description: "Salade verte prisee en milieu urbain.",
    economie: { prixMoyen: "200-400 FCFA/pied", marches: ["Yaounde", "Douala", "Bafoussam"], debouches: "Frais, restauration", exportation: "Local" },
    itk: { preparation: "Pepiniere courte, planches ombragees", semis: "Repiquage 25x25 cm", entretien: "Arrosages frequents", protection: "Pucerons, limaces", recolte: "Coupe pomme formee" },
    specificites: ["Cycle tres court", "Demande hotels/restaurants", "Sensible chaleur"]
  },
  { 
    name: "Concombre", famille: "Cucurbitacees", cat: "maraicher", 
    zones: ["Toutes zones"], 
    cycle: "50-70 jours", rendement: "20-35 t/ha",
    description: "Legume fruit rafraichissant, demande urbaine croissante.",
    economie: { prixMoyen: "200-400 FCFA/kg", marches: ["Yaounde", "Douala"], debouches: "Frais, salade", exportation: "Local" },
    itk: { preparation: "Poquets enrichis, paillage", semis: "3-4 graines par poquet, 1mx0.5m", entretien: "Palissage possible, irrigation", protection: "Oidium, pucerons", recolte: "Cueillette fruits jeunes" },
    specificites: ["Croissance rapide", "Irrigation indispensable", "Tuteurage augmente rendement"]
  },
  { 
    name: "Pastèque", famille: "Cucurbitacees", cat: "maraicher", 
    zones: ["Soudano-Sahelienne", "Savanes Guineennes"], 
    cycle: "80-100 jours", rendement: "25-40 t/ha",
    description: "Fruit d'eau populaire en saison seche.",
    economie: { prixMoyen: "100-200 FCFA/kg", marches: ["Maroua", "Garoua", "Yaounde"], debouches: "Frais", exportation: "Local" },
    itk: { preparation: "Poquets espaces 2mx2m, fumure", semis: "3-4 graines par poquet", entretien: "Paillage, 1-2 sarclages", protection: "Anthracnose, pucerons", recolte: "Son mat au tapotement" },
    specificites: ["Forte chaleur toleree", "Gros fruits = transport delicat", "Saison seche ideale"]
  },
  { 
    name: "Poivron", famille: "Solanacees", cat: "maraicher", 
    zones: ["Hauts Plateaux", "Forets Bimodales"], 
    cycle: "90-120 jours", rendement: "15-25 t/ha",
    description: "Piment doux, demande croissante en milieu urbain.",
    economie: { prixMoyen: "600-1000 FCFA/kg", marches: ["Yaounde", "Douala", "Bafoussam"], debouches: "Frais, restauration", exportation: "Local" },
    itk: { preparation: "Pepiniere, planches paillees", semis: "Repiquage 50x40 cm", entretien: "Tuteurage, irrigation", protection: "Pucerons, acariens", recolte: "Cueillette fruits colores" },
    specificites: ["Prix eleve", "Marche de niche", "Climat tempere prefere"]
  },
  { 
    name: "Aubergine", famille: "Solanacees", cat: "maraicher", 
    zones: ["Toutes zones"], 
    cycle: "90-120 jours", rendement: "20-35 t/ha",
    description: "Legume fruit violet ou blanc, ingredient des sauces.",
    economie: { prixMoyen: "200-400 FCFA/kg", marches: ["Tous marches"], debouches: "Frais", exportation: "Local" },
    itk: { preparation: "Pepiniere, planches fumees", semis: "Repiquage 60x50 cm", entretien: "Tuteurage leger", protection: "Acariens, fletrissement", recolte: "Cueillette fruits brillants" },
    specificites: ["Variete locale = petite ronde", "Assez rustique", "Production etalee"]
  },
  { 
    name: "Morelle noire", famille: "Solanacees", cat: "maraicher", 
    zones: ["Toutes zones"], 
    cycle: "45-60 jours", rendement: "5-10 t/ha",
    description: "Legume feuille traditionnel (zom, ndole).",
    economie: { prixMoyen: "300-600 FCFA/botte", marches: ["Tous marches"], debouches: "Frais", exportation: "Local" },
    itk: { preparation: "Planches ombragees", semis: "Semis direct ou repiquage", entretien: "Arrosages frequents", protection: "Peu de ravageurs", recolte: "Cueillette feuilles" },
    specificites: ["Tres populaire", "Cycle court", "Culture facile"]
  },

  // ==================== CULTURES DE RENTE ====================
  { 
    name: "Cacao", famille: "Malvacees", cat: "rente", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "3-5 ans (entree prod.)", rendement: "400-800 kg/ha",
    description: "Culture d'exportation majeure, pilier de l'economie rurale du Sud.",
    economie: { prixMoyen: "1200-1800 FCFA/kg", marches: ["Yaounde", "Douala"], debouches: "Export feves, transformation locale", exportation: "Europe, Asie - 5e producteur mondial" },
    itk: { preparation: "Defrichement partiel, ombrage provisoire", semis: "Pepiniere 6 mois, plantation 3mx3m", entretien: "Taille, desherbage, ombrage", protection: "Pourriture brune, mirides, swollen shoot", recolte: "Cabossage, fermentation 6 jours, sechage" },
    specificites: ["Ombrage obligatoire jeunes plants", "Certification qualite = premium", "Renouvellement vergers vieillissants"]
  },
  { 
    name: "Cafe Arabica", famille: "Rubiacees", cat: "rente", 
    zones: ["Hauts Plateaux"], 
    cycle: "3-4 ans (entree prod.)", rendement: "500-1500 kg/ha",
    description: "Cafe d'altitude de l'Ouest, qualite reconnue.",
    economie: { prixMoyen: "1500-2500 FCFA/kg", marches: ["Bafoussam", "Dschang"], debouches: "Export, torrefaction locale", exportation: "Europe, marche specialty" },
    itk: { preparation: "Trouaison, ombrage leger", semis: "Pepiniere 1 an, plantation 2.5mx2.5m", entretien: "Taille, egourmandage, paillage", protection: "Scolytes, rouille", recolte: "Cueillette selective cerises mures" },
    specificites: ["Altitude >1000m", "Qualite = prix premium", "Main d'oeuvre intensive recolte"]
  },
  { 
    name: "Cafe Robusta", famille: "Rubiacees", cat: "rente", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "2-3 ans (entree prod.)", rendement: "800-2000 kg/ha",
    description: "Cafe de basse altitude, plus rustique que l'Arabica.",
    economie: { prixMoyen: "800-1200 FCFA/kg", marches: ["Yaounde", "Douala"], debouches: "Export, instant coffee", exportation: "Marche mondial" },
    itk: { preparation: "Defrichement, trouaison", semis: "Boutures ou graines, 3mx3m", entretien: "Recepage, egourmandage", protection: "Scolytes, trachéomycose", recolte: "Cueillette ou gaulage" },
    specificites: ["Plus productif qu'Arabica", "Tolerant basse altitude", "Prix inferieur"]
  },
  { 
    name: "Palmier a huile", famille: "Arecacees", cat: "rente", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "3-4 ans (entree prod.)", rendement: "15-25 t regimes/ha",
    description: "Oleagineux majeur, huile rouge traditionnelle et industrielle.",
    economie: { prixMoyen: "60-100 FCFA/kg regimes", marches: ["Douala", "Kribi", "Edea"], debouches: "Huile rouge, huile raffinee, savonnerie", exportation: "Deficit national = importation" },
    itk: { preparation: "Defrichement, piquetage 9mx9m", semis: "Plants selectionnes de pepiniere agreee", entretien: "Fauchage, elagage, fertilisation", protection: "Fusariose, rats", recolte: "Coupe regimes murs (oranges)" },
    specificites: ["Culture perenne 25-30 ans", "Varietes ameliorees = meilleur rendement", "Forte demande nationale"]
  },
  { 
    name: "Hevea", famille: "Euphorbiacees", cat: "rente", 
    zones: ["Forets Monomodales", "Forets Bimodales"], 
    cycle: "6-7 ans (entree prod.)", rendement: "1.5-2.5 t caoutchouc/ha",
    description: "Arbre a latex, base de l'industrie du caoutchouc.",
    economie: { prixMoyen: "400-700 FCFA/kg latex", marches: ["Douala"], debouches: "Export latex, transformation locale", exportation: "Asie, Europe" },
    itk: { preparation: "Defrichement, lignes a 6mx3m", semis: "Plants greffes de pepiniere", entretien: "Desherbage, fertilisation", protection: "Fomes, phytophtora", recolte: "Saignee quotidienne des panneaux" },
    specificites: ["Saigneur = metier specialise", "Culture industrielle surtout", "Cycle tres long"]
  },
  { 
    name: "Coton", famille: "Malvacees", cat: "rente", 
    zones: ["Soudano-Sahelienne", "Savanes Guineennes"], 
    cycle: "150-180 jours", rendement: "1-2 t/ha",
    description: "Culture de rente du Grand Nord, fibre textile.",
    economie: { prixMoyen: "250-300 FCFA/kg", marches: ["SODECOTON"], debouches: "Fibre textile, huile, tourteaux", exportation: "Fibre vers Asie" },
    itk: { preparation: "Labour profond, fumure NPK", semis: "Semis en ligne apres premieres pluies", entretien: "Sarclages, ecimage", protection: "Chenilles carpophages (6-8 traitements)", recolte: "Recolte manuelle capsules ouvertes" },
    specificites: ["Culture encadree SODECOTON", "Intrants a credit", "Forte pression phytosanitaire"]
  },
  // ==================== ARBORICULTURE ====================
  { 
    name: "Avocat", famille: "Lauracees", cat: "fruitier", 
    zones: ["Hauts Plateaux", "Forets Bimodales"], 
    cycle: "4-6 ans (entree prod.)", rendement: "8-15 t/ha",
    description: "Fruit oleagineux en forte demande locale et export.",
    economie: { prixMoyen: "500-1000 FCFA/kg", marches: ["Bafoussam", "Yaounde", "Douala"], debouches: "Frais, huile, export", exportation: "Europe (Hass)" },
    itk: { preparation: "Trouaison 60x60x60 cm, fumure fond", semis: "Plants greffes, 8mx8m", entretien: "Taille formation, paillage", protection: "Anthracnose, phytophthora", recolte: "Cueillette fruits murs" },
    specificites: ["Variete Hass = export", "Altitude 1000-2000m ideale", "Marche en expansion"]
  },
  { 
    name: "Mangue", famille: "Anacardiacees", cat: "fruitier", 
    zones: ["Soudano-Sahelienne", "Savanes Guineennes"], 
    cycle: "4-5 ans (entree prod.)", rendement: "10-20 t/ha",
    description: "Fruit tropical majeur du Nord Cameroun.",
    economie: { prixMoyen: "200-400 FCFA/kg", marches: ["Garoua", "Maroua", "Yaounde"], debouches: "Frais, sechee, jus", exportation: "Potentiel sous-exploite" },
    itk: { preparation: "Trouaison, plantation saison pluies", semis: "Plants greffes (varietes ameliorees)", entretien: "Taille, desherbage cuvette", protection: "Mouche des fruits, anthracnose", recolte: "Cueillette manuelle" },
    specificites: ["Saison courte = glut de production", "Sechage solaire = valeur ajoutee", "Varietes Kent/Amelie = export"]
  },
  { 
    name: "Papaye", famille: "Caricacees", cat: "fruitier", 
    zones: ["Toutes zones"], 
    cycle: "9-12 mois (entree prod.)", rendement: "30-60 t/ha",
    description: "Fruit tropical a croissance rapide, tres productif.",
    economie: { prixMoyen: "150-300 FCFA/kg", marches: ["Tous marches"], debouches: "Frais, papaine (latex)", exportation: "Local principalement" },
    itk: { preparation: "Sol bien draine, trous 40x40x40", semis: "Graines ou plants, 2.5mx2.5m", entretien: "Fertilisation reguliere, irrigation", protection: "Viroses (PRSV), cochenilles", recolte: "Cueillette fruits virant jaune" },
    specificites: ["Entree production rapide", "Sensible froid et exces eau", "Duree vie 3-4 ans"]
  },
  { 
    name: "Agrumes", famille: "Rutacees", cat: "fruitier", 
    zones: ["Toutes zones"], 
    cycle: "3-5 ans (entree prod.)", rendement: "15-30 t/ha",
    description: "Oranges, mandarines, citrons - demande nationale forte.",
    economie: { prixMoyen: "300-600 FCFA/kg", marches: ["Tous marches"], debouches: "Frais, jus", exportation: "Local" },
    itk: { preparation: "Trouaison 60x60x60, drainage", semis: "Plants greffes sur porte-greffe adapte", entretien: "Taille, fertilisation, irrigation", protection: "Greening, cochenilles, mouche", recolte: "Cueillette fruits colores" },
    specificites: ["Porte-greffe = cle reussite", "Irrigation saison seche", "Vergers en expansion"]
  },
  { 
    name: "Ananas", famille: "Bromeliacees", cat: "fruitier", 
    zones: ["Forets Monomodales", "Forets Bimodales"], 
    cycle: "14-18 mois", rendement: "40-60 t/ha",
    description: "Fruit export majeur, production industrielle et paysanne.",
    economie: { prixMoyen: "200-400 FCFA/kg", marches: ["Douala", "Yaounde"], debouches: "Frais, jus, conserve, export", exportation: "Europe - produit phare" },
    itk: { preparation: "Labour profond, billons", semis: "Rejets ou couronnes, densite 50000/ha", entretien: "Desherbage, TIF (induction florale)", protection: "Symphyles, cochenilles", recolte: "Cueillette fruit colore a la base" },
    specificites: ["Traitement induction florale", "Main d'oeuvre intensive", "Certification GlobalGAP = export"]
  },
  { 
    name: "Banane dessert", famille: "Musacees", cat: "fruitier", 
    zones: ["Forets Monomodales", "Forets Bimodales"], 
    cycle: "9-12 mois", rendement: "30-50 t/ha",
    description: "Fruit d'exportation majeur, plantations industrielles.",
    economie: { prixMoyen: "200-350 FCFA/kg", marches: ["Douala", "Export"], debouches: "Export frais, marche local", exportation: "Europe - 1er produit agricole export" },
    itk: { preparation: "Defrichement, drainage, trouaison", semis: "Vitroplants ou rejets, 1600-2000/ha", entretien: "Effeuillage, haubanage, gainage", protection: "Cercosporiose (traitements aeriens)", recolte: "Coupe regimes verts, murisseries" },
    specificites: ["Culture industrielle surtout", "Certification exigeante", "Chaine du froid indispensable"]
  },
  { 
    name: "Safou", famille: "Burseracees", cat: "fruitier", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "5-7 ans (entree prod.)", rendement: "50-150 kg/arbre",
    description: "Fruit oleagineux traditionnel, tres prise localement.",
    economie: { prixMoyen: "500-1000 FCFA/kg", marches: ["Yaounde", "Douala", "Ebolowa"], debouches: "Frais (bouilli/grille)", exportation: "Diaspora (demande forte)" },
    itk: { preparation: "Trouaison, ombrage initial", semis: "Semis direct ou plants, 10mx10m", entretien: "Peu exigeant une fois etabli", protection: "Peu de ravageurs", recolte: "Cueillette ou ramassage" },
    specificites: ["Arbre forestier traditionnel", "Saisonnalite courte (2-3 mois)", "Potentiel export diaspora"]
  },
  { 
    name: "Cola", famille: "Malvacees", cat: "fruitier", 
    zones: ["Forets Bimodales", "Forets Monomodales"], 
    cycle: "6-8 ans (entree prod.)", rendement: "200-500 kg/ha",
    description: "Noix stimulante, valeur culturelle et commerciale.",
    economie: { prixMoyen: "2000-4000 FCFA/kg", marches: ["Foumban", "Yaounde", "Nord"], debouches: "Consommation traditionnelle, ceremonies", exportation: "Nigeria, Niger, Mali" },
    itk: { preparation: "Ombrage forestier ou cacaoyere", semis: "Graines fraiches, 8mx8m", entretien: "Tres peu exigeant", protection: "Charançons de stockage", recolte: "Ramassage cabosses, extraction noix" },
    specificites: ["Culture associee cacao", "Stockage = perte de poids", "Commerce transfrontalier"]
  },

  // ==================== ELEVAGE ====================
  { 
    name: "Poulet de chair", famille: "Aviculture", cat: "elevage", 
    zones: ["Toutes zones"], 
    cycle: "45-60 jours", rendement: "2-2.5 kg/sujet",
    description: "Elevage a cycle court, forte demande urbaine.",
    economie: { prixMoyen: "2500-3500 FCFA/kg vif", marches: ["Tous marches urbains"], debouches: "Vif, abattu, rotisseries", exportation: "Local (concurrence import)" },
    itk: { preparation: "Batiment ventile, litiere", semis: "Poussins 1 jour de couvoir agree", entretien: "Aliment starter/croissance, eau propre", protection: "Newcastle, Gumboro, coccidiose", recolte: "Vente a 45-60 jours, 2-2.5 kg" },
    specificites: ["Aliment = 70% du cout", "Vaccination stricte", "Marges serrees"]
  },
  { 
    name: "Poule pondeuse", famille: "Aviculture", cat: "elevage", 
    zones: ["Toutes zones"], 
    cycle: "18 mois production", rendement: "280-320 oeufs/poule",
    description: "Production d'oeufs de consommation, demande constante.",
    economie: { prixMoyen: "80-120 FCFA/oeuf", marches: ["Tous marches"], debouches: "Oeufs frais, boulangerie", exportation: "Local" },
    itk: { preparation: "Batiment avec pondoirs, cages ou sol", semis: "Poulettes 18 semaines vaccinees", entretien: "Aliment pondeuse, eclairage", protection: "Newcastle, bronchite, parasites", recolte: "Ramassage quotidien oeufs" },
    specificites: ["Entree ponte = 5-6 mois", "Reforme a 18 mois", "Aliment pondeuse specifique"]
  },
  { 
    name: "Porc", famille: "Porciculture", cat: "elevage", 
    zones: ["Hauts Plateaux", "Forets Bimodales"], 
    cycle: "6-8 mois", rendement: "80-120 kg/sujet",
    description: "Elevage a forte valeur ajoutee, demande Ouest et grandes villes.",
    economie: { prixMoyen: "1800-2500 FCFA/kg vif", marches: ["Bafoussam", "Yaounde", "Douala"], debouches: "Vif, charcuterie", exportation: "Local" },
    itk: { preparation: "Porcherie cimentee, fosses", semis: "Porcelets sevres de race amelioree", entretien: "Alimentation equilibree, eau", protection: "PPA, gale, vers", recolte: "Vente a 80-120 kg (6-8 mois)" },
    specificites: ["Interdit dans zones musulmanes", "Alimentation = cle rentabilite", "PPA = risque majeur"]
  },
  { 
    name: "Tilapia", famille: "Pisciculture", cat: "elevage", 
    zones: ["Toutes zones"], 
    cycle: "6-8 mois", rendement: "3-10 t/ha/an",
    description: "Poisson d'elevage le plus repandu au Cameroun.",
    economie: { prixMoyen: "1500-2500 FCFA/kg", marches: ["Tous marches"], debouches: "Frais, fume", exportation: "Local" },
    itk: { preparation: "Etang 400-1000 m2, arrivee eau", semis: "Alevins mono-sexes males, 2-3/m2", entretien: "Alimentation, fertilisation etang", protection: "Predateurs, qualite eau", recolte: "Vidange ou filet a 250-400g" },
    specificites: ["Mono-sexe = meilleure croissance", "Aliment flottant recommande", "Polyculture possible"]
  },
  { 
    name: "Poisson-chat (Clarias)", famille: "Pisciculture", cat: "elevage", 
    zones: ["Toutes zones"], 
    cycle: "6-10 mois", rendement: "5-20 t/ha/an",
    description: "Silure africain, chair appreciee, elevage intensif possible.",
    economie: { prixMoyen: "2000-3000 FCFA/kg", marches: ["Yaounde", "Douala"], debouches: "Frais, fume, braise", exportation: "Local" },
    itk: { preparation: "Bassins beton ou baches", semis: "Alevins de 5-10g, 20-50/m2 (intensif)", entretien: "Alimentation intensive, tri par taille", protection: "Cannibalisme, qualite eau", recolte: "Peche a 500g-1kg+" },
    specificites: ["Supporte haute densite", "Respire air atmospherique", "Carnivore = aliment proteique"]
  },
  { 
    name: "Bovin viande", famille: "Elevage bovin", cat: "elevage", 
    zones: ["Soudano-Sahelienne", "Hauts Plateaux", "Savanes Guineennes"], 
    cycle: "3-4 ans", rendement: "150-250 kg carcasse",
    description: "Elevage extensif traditionnel, source de viande rouge.",
    economie: { prixMoyen: "2500-3500 FCFA/kg vif", marches: ["Tous marches"], debouches: "Boucherie, export betail", exportation: "Nigeria, Gabon" },
    itk: { preparation: "Paturages, points d'eau", semis: "Achats jeunes ou naissage", entretien: "Paturage, complements saison seche", protection: "Trypanosomose, fievre aphteuse", recolte: "Vente 3-4 ans, 300-400 kg vif" },
    specificites: ["Elevage extensif dominant", "Transhumance Nord", "Embouche = valeur ajoutee"]
  },
  { 
    name: "Caprin", famille: "Elevage caprin", cat: "elevage", 
    zones: ["Soudano-Sahelienne", "Savanes Guineennes"], 
    cycle: "12-18 mois", rendement: "12-20 kg carcasse",
    description: "Petit ruminant rustique, eleve pour viande et ceremonies.",
    economie: { prixMoyen: "2500-4000 FCFA/kg vif", marches: ["Marches Nord", "Yaounde (fetes)"], debouches: "Vif (ceremonies), boucherie", exportation: "Local" },
    itk: { preparation: "Abri simple, paturage", semis: "Achat ou naissage local", entretien: "Paturage, complements", protection: "Parasites, PPR", recolte: "Vente selon besoins" },
    specificites: ["Tres rustique", "Demande fetes religieuses", "Peu exigeant"]
  },
  { 
    name: "Lapin", famille: "Cuniculture", cat: "elevage", 
    zones: ["Toutes zones"], 
    cycle: "3-4 mois", rendement: "2-2.5 kg/sujet",
    description: "Elevage familial, viande maigre dietetique.",
    economie: { prixMoyen: "3000-4500 FCFA/kg", marches: ["Yaounde", "Douala"], debouches: "Restauration, particuliers", exportation: "Local - marche niche" },
    itk: { preparation: "Clapiers surelevés, hygiene", semis: "Reproducteurs de race", entretien: "Fourrage + aliment compose", protection: "Coccidiose, gale", recolte: "Vente a 2.5-3 mois" },
    specificites: ["Reproduction rapide", "Aliment local possible", "Marche limite"]
  },
];

function SpeculationModal({ spec, onClose }: { spec: typeof speculations[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-forest-dark text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber text-sm font-medium mb-1">{spec.famille}</p>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--serif)" }}>{spec.name}</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
          </div>
          <p className="text-white/80 mt-3">{spec.description}</p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">{spec.cycle}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">{spec.rendement}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Economie */}
          <div>
            <h3 className="text-lg font-semibold text-forest-dark mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Economie locale
            </h3>
            <div className="bg-amber-light/30 rounded-xl p-4 space-y-2">
              <p><span className="font-medium">Prix moyen :</span> <span className="text-amber font-semibold">{spec.economie.prixMoyen}</span></p>
              <p><span className="font-medium">Marches :</span> {spec.economie.marches.join(", ")}</p>
              <p><span className="font-medium">Debouches :</span> {spec.economie.debouches}</p>
              <p><span className="font-medium">Export :</span> {spec.economie.exportation}</p>
            </div>
          </div>

          {/* ITK */}
          <div>
            <h3 className="text-lg font-semibold text-forest-dark mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
              Itineraire technique
            </h3>
            <div className="bg-forest-light rounded-xl p-4 space-y-3 text-sm">
              <p><span className="font-semibold text-forest-dark">Preparation :</span> {spec.itk.preparation}</p>
              <p><span className="font-semibold text-forest-dark">Semis/Plantation :</span> {spec.itk.semis}</p>
              <p><span className="font-semibold text-forest-dark">Entretien :</span> {spec.itk.entretien}</p>
              <p><span className="font-semibold text-forest-dark">Protection :</span> {spec.itk.protection}</p>
              <p><span className="font-semibold text-forest-dark">Recolte :</span> {spec.itk.recolte}</p>
            </div>
          </div>

          {/* Specificites */}
          <div>
            <h3 className="text-lg font-semibold text-forest-dark mb-3">Specificites</h3>
            <ul className="space-y-2">
              {spec.specificites.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber mt-1">&#10003;</span>
                  <span className="text-ink-mid">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Zones */}
          <div>
            <h4 className="text-sm font-semibold text-forest-dark mb-2">Zones adaptees</h4>
            <div className="flex flex-wrap gap-2">
              {spec.zones.map((zone, i) => (
                <span key={i} className="bg-forest-light text-forest-dark px-3 py-1.5 rounded-full text-sm">{zone}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-mid p-4 bg-neutral flex justify-between items-center">
          <p className="text-ink-light text-sm">Fiche ITK complete dans l'application</p>
          <Link href="/#telecharger" className="bg-amber hover:bg-amber-dark text-white font-semibold px-6 py-2 rounded-xl transition-colors">
            Telecharger Kessel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SpeculationsPage() {
  useScrollReveal();
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<typeof speculations[0] | null>(null);

  const filtered = speculations.filter((s) => {
    const matchCat = activeCat === "all" || s.cat === activeCat;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.famille.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="bg-forest-dark pt-28 pb-20 relative">
        <AgriPatterns />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="reveal text-amber font-semibold text-sm uppercase tracking-wider mb-3">Catalogue</p>
          <h1 className="reveal reveal-delay-1 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            {speculations.length}+ speculations<br /><em className="text-amber-light">supportees.</em>
          </h1>
          <p className="reveal reveal-delay-2 text-lg text-white/70 max-w-3xl mx-auto">
            Cliquez sur une speculation pour decouvrir son economie locale, son itineraire technique et ses specificites.
          </p>
        </div>
      </section>

      {/* CATALOGUE */}
      <section className="py-24 bg-neutral">
        <div className="max-w-6xl mx-auto px-6">
          {/* Filtres */}
          <div className="reveal flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={"px-4 py-2 rounded-full text-sm font-medium transition-all " + (activeCat === cat.id ? "bg-forest text-white" : "bg-white text-forest-dark hover:bg-forest-light")}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="md:ml-auto">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-xl border border-neutral-mid focus:border-forest focus:ring-2 focus:ring-forest/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="reveal reveal-delay-1 mb-6">
            <p className="text-ink-light">{filtered.length} speculation{filtered.length > 1 ? "s" : ""} - cliquez pour voir les details</p>
          </div>

          {/* Grille */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((spec, i) => (
              <button
                key={i}
                onClick={() => setSelectedSpec(spec)}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-forest-dark group-hover:text-forest transition-colors">{spec.name}</h3>
                    <p className="text-ink-light text-sm">{spec.famille}</p>
                  </div>
                  <span className={"text-xs px-2 py-1 rounded-full font-medium " + (
                    spec.cat === "vivrier" ? "bg-green-100 text-green-700" :
                    spec.cat === "maraicher" ? "bg-orange-100 text-orange-700" :
                    spec.cat === "rente" ? "bg-amber-100 text-amber-700" :
                    spec.cat === "fruitier" ? "bg-pink-100 text-pink-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {spec.cat === "vivrier" ? "Vivrier" : spec.cat === "maraicher" ? "Maraichage" : spec.cat === "rente" ? "Rente" : spec.cat === "fruitier" ? "Fruitier" : "Elevage"}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-ink-light" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-ink-mid">{spec.cycle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-ink-light" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-amber font-medium">{spec.economie.prixMoyen}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-mid flex items-center justify-between">
                  <span className="text-xs text-ink-light">{spec.zones.length} zone(s)</span>
                  <span className="text-forest text-sm font-medium group-hover:underline">Voir details</span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-ink-light">Aucune speculation trouvee.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="reveal text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--serif)" }}>
            Votre culture n'est pas<br /><em className="text-amber-light">dans la liste ?</em>
          </h2>
          <p className="reveal reveal-delay-1 text-lg text-white/70 mb-10">
            Nous enrichissons regulierement notre catalogue. Contactez-nous pour suggerer une nouvelle speculation.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#telecharger" className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5">
              Telecharger l'app
            </Link>
            <a href="https://wa.me/237659374501" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl transition-colors">
              Suggerer une culture
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {selectedSpec && <SpeculationModal spec={selectedSpec} onClose={() => setSelectedSpec(null)} />}
    </>
  );
}