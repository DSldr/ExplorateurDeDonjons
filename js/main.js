let tableau = [];
let rangees = 15;
let colonnes = 25;

for (let ran = 0; ran < rangees; ran++) {
    tableau[ran] = [];
  for (let col = 0; col < colonnes; col++) {
    tableau[ran][col] = col;
  }
}

RemplirTableau();
RemplirDonjon();


function RemplirTableau(){
    for (let ran = 0; ran < rangees; ran++) {
        for (let col = 0; col < colonnes; col++) {
            let nbAuHasard = Math.floor(Math.random() * 101);
            if (nbAuHasard < 90){
                tableau[ran][col] = 0;
            }else{
                tableau[ran][col] = 1;
            }
        }
    }
}

function RemplirDonjon(){
    for (let ran = 0; ran < rangees; ran++) {
        for (let col = 0; col < colonnes; col++) {
            const donjonDiv = document.querySelector(".donjon")
            if (tableau[ran][col] == 0){
                donjonDiv.innerHTML = donjonDiv.innerHTML + '<div class="tuile piege">'+ran+'</div>'
            } else {
                donjonDiv.innerHTML = donjonDiv.innerHTML + '<div class="tuile tresor">'+ran+'</div>'
            }
        }
    }
}