let tableau = [];
let rangees = 15;
let colonnes = 25;
var energie = 40;
var points = 0;
let rangeeMineur = 7;
let colonneMineur = 12;
let ajouterObstacles = true;
const donjonDiv = document.querySelector(".donjon");
const divScore = document.getElementById("score")
const divFinalScore = document.getElementById("finalScore")
const divEnergie = document.getElementById("progressfill");

for (let ran = 0; ran < rangees; ran++) {
    tableau[ran] = [];
  for (let col = 0; col < colonnes; col++) {
    tableau[ran][col] = col;
  }
}

RemplirTableau();
ActualiserDonjon();

document.getElementById("boutonMonter").addEventListener("click", (e) =>(DeplacerTravailleur('haut')));
document.getElementById("boutonGauche").addEventListener("click", (e) =>(DeplacerTravailleur('gauche')));
document.getElementById("boutonDroite").addEventListener("click", (e) =>(DeplacerTravailleur('droite')));
document.getElementById("boutonDescendre").addEventListener("click", (e) =>(DeplacerTravailleur('bas')));



function RemplirTableau(){


    for (let ran = 0; ran < rangees; ran++) {
        for (let col = 0; col < colonnes; col++) {
            let nbAuHasard = Math.floor(Math.random() * 101);

            if(ajouterObstacles == true){
                if (nbAuHasard > 90){
                    tableau[ran][col] = 1;
                }
                else if((nbAuHasard >= 80) && (nbAuHasard <= 90)){
                    tableau[ran][col] = 9;
                }else{
                    tableau[ran][col] = 0;
                }
            }
            else{
                if (nbAuHasard > 90){
                    tableau[ran][col] = 1;
                }else{
                    tableau[ran][col] = 0;
                }
            }

        }
    }
}

function ActualiserDonjon(){
    let htmlString = "";
    donjonDiv.innerHTML = "";
    for (let ran = 0; ran < rangees; ran++) {
        for (let col = 0; col < colonnes; col++) {
            let valeur = tableau[ran][col];
            
            if((ran == rangeeMineur) && (col == colonneMineur)) {
                htmlString += '<div class="tuile mineur"><img src="img/miner.png"></div>'
                tableau[rangeeMineur][colonneMineur] = 2;
                continue;
            }
            if (valeur == 0){
                htmlString += '<div class="tuile piege"><img src="img/piege.png"></div>'
                continue;
            } 
            if(valeur == 1) {
                htmlString += '<div class="tuile tresor"><img src="img/treasure.png"></div>'
                continue;
            }
            if(valeur == 2) {
                htmlString += '<div class="tuile blanc"></div>'
                continue;
            }
            if(valeur == 9) {
                htmlString += '<div class="tuile obstacle"><img src="img/obstacle.png"></div>'
                continue;
            }
            
        }
    }
    donjonDiv.innerHTML = htmlString;
}

function DeplacerTravailleur(direction)
{
    if (deplacementValide(direction) == false){
        return;
    }
    let valeur;
    switch(direction) {
        case 'haut':
            valeur = tableau[rangeeMineur -1][colonneMineur];
            rangeeMineur--;
            tableau[rangeeMineur][colonneMineur] = 2;
            break;
        case 'bas':
            valeur = tableau[rangeeMineur +1][colonneMineur];
            rangeeMineur++;
            tableau[rangeeMineur][colonneMineur] = 2;
            break;
        case 'gauche':
            valeur = tableau[rangeeMineur][colonneMineur - 1];
            colonneMineur--;
            tableau[rangeeMineur][colonneMineur] = 2;
            break;
        case 'droite':
            valeur = tableau[rangeeMineur][colonneMineur + 1];
            colonneMineur++;
            tableau[rangeeMineur][colonneMineur] = 2;
            break;
    }

    if ((valeur == 0)){
        modifierPoints(-50)
        abaisserEnergie()
    }
    if ((valeur == 1)){
        modifierPoints(1000)
    }
    if ((valeur == 2)){
        modifierPoints(-10)
    }
    ActualiserDonjon();
}

function deplacementValide(direction){

    switch(direction) {
        case 'haut':
            if ((rangeeMineur - 1 < 0) || (tableau[rangeeMineur-1][colonneMineur] == 9)){
                return false;
            }
            break;
        case 'bas':
            if ((rangeeMineur + 1 > 14) || (tableau[rangeeMineur+1][colonneMineur] == 9)){
                return false;
            }
            break;
        case 'gauche':
            if ((colonneMineur - 1 < 0) || (tableau[rangeeMineur][colonneMineur-1] == 9)){
                return false;
            }
            break;
        case 'droite':
            if ((colonneMineur + 1 > 24) || (tableau[rangeeMineur][colonneMineur+1] == 9)){
                return false;
            }
            break;
    }








    return true;
}

function abaisserEnergie(){
    energie = energie - 1;
    divEnergie.innerText = energie + "/40";
    divEnergie.style.width = energie * (100 / 40) +'%';
    if (energie <= 0){
        divFinalScore.innerText = "Score : " + points;
        activerOverlay();
    }
}

function modifierPoints(pointsObtenus){
    let resultat = points + pointsObtenus;
    if ((resultat < 0)){
        points = 0;
    }else{
        points = resultat;
    }
    divScore.innerText = "Score : " + points;
}

function activerOverlay() {
    document.getElementById("overlay").style.display = "block";
  }
  
function deactiverOverlay() {
    document.getElementById("overlay").style.display = "none";
    redemarrer();
}

function redemarrer(){
    energie = 40;
    points = 0;
    rangeeMineur = 7;
    colonneMineur = 12;
    divScore.innerText = "Score : " + points;
    divFinalScore.innerText = "Score : " + points;
    divEnergie.innerText = energie + "/40";
    divEnergie.style.width = '100%';
    RemplirTableau();
    ActualiserDonjon();
}