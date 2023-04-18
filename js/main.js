//Déclaration des variables nécessaire
let tableau = [];
let rangees = 15;
let colonnes = 25;
var energie = 40;
var points = 0;
let rangeeMineur = 7;
let colonneMineur = 12;
let activerObstacles = true;
let activerDiamants = true;

//Declaration des élement qui seront utilisé dans le html de base
const donjonDiv = document.querySelector(".donjon");
const divScore = document.getElementById("score");
const divFinalScore = document.getElementById("finalScore");
const divEnergie = document.getElementById("progressfill");

//Création d'un tableau de deux dimensions
for (let ran = 0; ran < rangees; ran++) {
  tableau[ran] = [];
  for (let col = 0; col < colonnes; col++) {
    tableau[ran][col] = col;
  }
}

//Remplissage du tableau avec les numéro qui correspondent à des éléments du jeu
RemplirTableau();

//Actualisation du html de la page selon le tableau des éléments
ActualiserDonjon();

//Ajout des event listeners pour les bouton de la page
document
  .getElementById("boutonMonter")
  .addEventListener("click", (e) => DeplacerTravailleur("haut"));
document
  .getElementById("boutonGauche")
  .addEventListener("click", (e) => DeplacerTravailleur("gauche"));
document
  .getElementById("boutonDroite")
  .addEventListener("click", (e) => DeplacerTravailleur("droite"));
document
  .getElementById("boutonDescendre")
  .addEventListener("click", (e) => DeplacerTravailleur("bas"));
document
  .getElementById("boutonRegles")
  .addEventListener("click", (e) => activerOverlay("overlayRegles"));
document
  .getElementById("boutonOptions")
  .addEventListener("click", (e) => activerOverlay("overlayOptions"));
document
  .getElementById("boutonSortir")
  .addEventListener("click", (e) => close());

//Fonction pour generer un numéro aleatoirement de 0 jusqu'à 100 et affecter le valeur à des indices du tableau selon le pourcentage.
function RemplirTableau() {
  for (let ran = 0; ran < rangees; ran++) {
    for (let col = 0; col < colonnes; col++) {
      let nbAuHasard = Math.floor(Math.random() * 101);

      if (activerObstacles == true) {
        //Si le numéro est plus grand que 90, cela veut dire qu'il est dans 10% de cas.
        //Cela veut dire que dans 10% de cas, le positions du tableau vont avoir un '1' comme valeur.
        if (nbAuHasard > 90) {
          tableau[ran][col] = 1;
          //Dans autres 10% de cas, le positions du tableau vont avoir un '9' comme valeur.
        } else if (nbAuHasard >= 80 && nbAuHasard <= 90) {
          tableau[ran][col] = 9;
          //Dans les autres 80% de cas, le positions du tableau vont avoir un '0' comme valeur.
        } else {
          tableau[ran][col] = 0;
        }
      } else {
        //Cela veut dire que dans 10% de cas, le positions du tableau vont avoir un '1' comme valeur.
        if (nbAuHasard > 90) {
          tableau[ran][col] = 1;
        } else {
          //Dans les autres 90% de cas, le positions du tableau vont avoir un '0' comme valeur.
          tableau[ran][col] = 0;
        }
      }
    }
  }
  if (activerDiamants == true) {
    ajouterDiamants();
  }
}

//Fonction pour actualiser visuallement les information de la page en suivant les données remplies dans le tableau
function ActualiserDonjon() {
  let htmlString = "";
  donjonDiv.innerHTML = "";
  for (let ran = 0; ran < rangees; ran++) {
    for (let col = 0; col < colonnes; col++) {
      let valeur = tableau[ran][col];

      if (ran == rangeeMineur && col == colonneMineur) {
        htmlString +=
          '<div class="tuile mineur"><img src="img/miner.png"></div>';
        tableau[rangeeMineur][colonneMineur] = 2;
        continue;
      }
      //Le 0 est utilisé pour les pièges
      if (valeur == 0) {
        htmlString +=
          '<div class="tuile piege"><img src="img/piege.png"></div>';
        continue;
      }
      //Le 1 est utilisé pour les trèsors
      if (valeur == 1) {
        htmlString +=
          '<div class="tuile tresor"><img src="img/treasure.png"></div>';
        continue;
      }
      //Le 2 est utilisé pour les case où l'utilisateur a déjà passé par dessus.
      if (valeur == 2) {
        htmlString += '<div class="tuile blanc"></div>';
        continue;
      }
      //Le 8 est utilisé pour les diamants
      if (valeur == 8) {
        htmlString +=
          '<div class="tuile diamant"><img src="img/diamant.png"></div>';
        continue;
      }
      //Le 9 est utilisé pour les roches gris foncé
      if (valeur == 9) {
        htmlString +=
          '<div class="tuile obstacle"><img src="img/obstacle.png"></div>';
        continue;
      }
    }
  }
  //Actualisation de le html en utilisant le string avec tout les éléments
  donjonDiv.innerHTML = htmlString;
}

//Fonctions pour déplacer le travailleur dans une direction donnée (haut, bas, gauche ou droite.)
function DeplacerTravailleur(direction) {
  if (deplacementValide(direction) == false) {
    //Si le deplacement est vers une case invalide, finaliser la fonction.
    return;
  }
  let valeur;

  //Switch pour calculer les coordonnées
  switch (direction) {
    case "haut":
      valeur = tableau[rangeeMineur - 1][colonneMineur];
      rangeeMineur--;
      tableau[rangeeMineur][colonneMineur] = 2;
      break;
    case "bas":
      valeur = tableau[rangeeMineur + 1][colonneMineur];
      rangeeMineur++;
      tableau[rangeeMineur][colonneMineur] = 2;
      break;
    case "gauche":
      valeur = tableau[rangeeMineur][colonneMineur - 1];
      colonneMineur--;
      tableau[rangeeMineur][colonneMineur] = 2;
      break;
    case "droite":
      valeur = tableau[rangeeMineur][colonneMineur + 1];
      colonneMineur++;
      tableau[rangeeMineur][colonneMineur] = 2;
      break;
  }

  //S'il marche sur une case piège, il perds 50 points de score et 1 d'energie.
  if (valeur == 0) {
    modifierPoints(-50);
    abaisserEnergie();
  }
  //S'il marche sur une case tresor, il gagne 100 points de score.
  if (valeur == 1) {
    modifierPoints(1000);
  }
  //S'il marche sur une case blanc, il perd 10 points de score.
  if (valeur == 2) {
    modifierPoints(-10);
  }
  //S'il marche sur une case diamant, il gagne 4000 points de score.
  if (valeur == 8) {
    modifierPoints(4000);
  }

  //Appel à la fonction pour actualiser le html de la page.
  ActualiserDonjon();
}

//Fonction pour vérifier si le deplacement souhaité est valide.
//Retourne true s'il est valide est false s'il n'est pas valide.
function deplacementValide(direction) {
  switch (direction) {
    case "haut":
      if (
        rangeeMineur - 1 < 0 ||
        tableau[rangeeMineur - 1][colonneMineur] == 9
      ) {
        return false;
      }
      break;
    case "bas":
      if (
        rangeeMineur + 1 > 14 ||
        tableau[rangeeMineur + 1][colonneMineur] == 9
      ) {
        return false;
      }
      break;
    case "gauche":
      if (
        colonneMineur - 1 < 0 ||
        tableau[rangeeMineur][colonneMineur - 1] == 9
      ) {
        return false;
      }
      break;
    case "droite":
      if (
        colonneMineur + 1 > 24 ||
        tableau[rangeeMineur][colonneMineur + 1] == 9
      ) {
        return false;
      }
      break;
  }
  return true;
}

//Fonction pour abaisser l'energie et aussi actualiser l'élément visuels qui montre l'energie.
function abaisserEnergie() {
  energie = energie - 1;
  divEnergie.innerText = energie + "/40";
  divEnergie.style.width = energie * (100 / 40) + "%";

  //si l'utilisateur n'as plus d'energie, finir le jeu.
  if (energie <= 0) {
    divFinalScore.innerText = "Score : " + points;
    activerOverlay("overlayGameover");
  }
}

//Fonction pour modifier le points de score.
//Prends en paramètre le numéro de points a augmenter ou abaisser .
function modifierPoints(pointsObtenus) {
  let resultat = points + pointsObtenus;
  if (resultat < 0) {
    points = 0;
  } else {
    points = resultat;
  }
  divScore.innerText = "Score : " + points;
}

//Focntion pour activer un overlay sur la page selon le type de overlay necessaire.
function activerOverlay(overlayName) {
  if (overlayName == "overlayRegles") {
    document.getElementById("overlayRegles").style.display = "block";
  }
  if (overlayName == "overlayOptions") {
    //Pour l'overlay options, verification si les checkbox pour activer les diamants et le roches doit être selectionné où pas.
    if (activerDiamants == true) {
      document.getElementById("checkboxDiamants").checked = true;
    }
    if (activerObstacles == true) {
      document.getElementById("checkboxRoches").checked = true;
    }

    document.getElementById("overlayOptions").style.display = "block";
  }
  if (overlayName == "overlayGameover") {
    document.getElementById("overlayGameover").style.display = "block";
  }
}

//Désactivation de tout les overlay
function deactiverOverlay() {
  document.getElementById("overlayRegles").style.display = "none";
  document.getElementById("overlayOptions").style.display = "none";
  document.getElementById("overlayGameover").style.display = "none";

  //Si l'energie est égale a 0, redemarrer le jeu.
  //Cela peut se produire quand l'utilisateur voit le overlayGameover.
  if (energie <= 0) {
    redemarrer();
  }
}

//Fonction pour deactiver l'overlay et rédemarrer le jeux
//Cette fonction est appelé uniquement pour l'overlayOptions
//Elle sauvegarde le changement et fait la reinitialisation du jeu
function deactiverOverlayAndReset() {
  document.getElementById("overlayOptions").style.display = "none";
  if (document.getElementById("checkboxDiamants").checked) {
    activerDiamants = true;
  } else {
    activerDiamants = false;
  }
  if (document.getElementById("checkboxRoches").checked) {
    activerObstacles = true;
  } else {
    activerObstacles = false;
  }

  redemarrer();
}

//Fonction pour faire la reinitialisation du jeu
function redemarrer() {
  energie = 40;
  points = 0;
  rangeeMineur = 7;
  colonneMineur = 12;
  divScore.innerText = "Score : " + points;
  divFinalScore.innerText = "Score : " + points;
  divEnergie.innerText = energie + "/40";
  divEnergie.style.width = "100%";
  RemplirTableau();
  ActualiserDonjon();
}

//Fonction pour ajouter des Diamants dans de case aleatoire.
//cette fonction prends le tableau déjà crée et modifique deux case pour contenir des diamants.
function ajouterDiamants() {
  if (activerDiamants == true) {
    for (let i = 0; i < 2; i++) {
      let rangee = Math.floor(Math.random() * 15);
      let colonne = Math.floor(Math.random() * 25);
      //Si les coordonnées obtenues sont à la position du travailleur, ignorer et trouver d'autres numéros aleatoires.
      if (rangee == 7 && colonne == 12) {
        rangee = Math.floor(Math.random() * 15);
        colonne = Math.floor(Math.random() * 25);
        i--;
        continue;
      }
      //Placement d'un 8 (diamant) dans le tableau à une position aleatoire
      tableau[rangee][colonne] = 8;
    }
  }
}
