
let resoudre = () => {
  init();

  let l = document.getElementsByClassName("lettre");
  let d = document.getElementsByClassName("duree");
  let p = document.getElementsByClassName("pred");

  let graphe = Array();

  // tableau pour vérifier si l'utilisateur n'a pas mis de sommets en double
  let memo_lettres = Array();

  for (let index = 0; index < l.length; index++) {
    let lettre = l[index].value;
    let duree = d[index].value;

    try {
      verif_erreurs_utilisateur(memo_lettres, lettre, duree);
    } catch (err) {
      colorier_inputs(err);
      throw "script arrếté!!!";
    }
    memo_lettres.push(lettre);
    graphe.push({ lettre: l[index].value, duree: parseInt(d[index].value) });
  }

  // ajout des prédécesseurs à chaque objet
  for (let index = 0; index < l.length; index++) {
    //transformation en tableau de lettres :
    let pred = p[index].value.split(",");

    graphe[index].pred = ajouter_predecesseurs(pred, graphe);
  }

  return graphe;
};

let verif_erreurs_utilisateur = (memo_lettres, lettre, duree) => {
  // utilisateur n'a pas rempli la case
  if (lettre == "") throw lettre;
  // utilisateur a mis une lettre en double
  else {
    for (let index = 0; index < memo_lettres.length; index++) {
      if (memo_lettres[index] == lettre) throw lettre;
    }
  }
  // la durée d'une tâche ne doit être > 0
  if (!(duree > 0)) {
    console.log(duree);
    throw duree;
  }
};

let colorier_inputs = (err) => {
  console.log(err);

  let message;
  let liste;
  if (err == "") {
    message = "Veuillez remplir tous les champs du tableau !";
    liste = document.getElementsByClassName("lettre");
  } else if (isNaN(err)) {
    message = "La tâche " + err + " est saisie plusieurs fois";
    liste = document.getElementsByClassName("lettre");
  } else {
    liste = document.getElementsByClassName("duree");
    message = "La durée doit être un nombre positif";
  }

  for (let index = 0; index < liste.length; index++) {
    if (liste[index].value == err) liste[index].style.borderColor = "red";
  }
  afficher_erreurs(message);
};

let afficher_erreurs = (message) => {
  let erreurs = document.getElementById("erreurs");
  let input = document.createElement("input");
  input.setAttribute("readonly", true);
  input.setAttribute("value", message);
  erreurs.appendChild(input);
};

// Pour chaque objet tache, ajout des taches antécédents, sauf arrêt en cas d'erreur utilisateur
let ajouter_predecesseurs = (tableau_de_predecesseurs, graphe) => {
  let resultats = Array();
  if (tableau_de_predecesseurs[0] == "") return resultats;

  tableau_de_predecesseurs.forEach((lettre) => {
    try {
      let sommet = chercherSommet(graphe)(lettre);
      resultats.push(sommet);
      // arrêt du programme - inputs frontend à corriger
    } catch (e) {
      let liste = document.getElementsByClassName("pred");
      for (let index = 0; index < liste.length; index++) {
        let arr = liste[index].value.split(",");
        arr.forEach((lettre) => {
          if (lettre == e) liste[index].style.borderColor = "red";
        });
      }

      let message = "Pas d'antécédent ayant " + e + " pour lettre!!!";
      afficher_erreurs(message);
      throw message;
    }
  });
  return resultats;
};

// fonction utilitaire, recherche dans un tableau de sommets l'objet ayant la lettre à chercher
// et retourjne cet objet
let chercherSommet = (tab) => (lettre) => {
  for (let index = 0; index < tab.length; index++) {
    if (tab[index].lettre == lettre) return tab[index];
  }
  throw lettre;
};

// retourne le temps au min pour un sommet
let temps_au_min = (sommet) => {
  //algo
  //1: tmps min = temps des prédécesseurs + duree
  if (sommet.pred.length == 0) {
    console.log("Temps min de " + sommet.lettre + " = 0");
    return 0;
  }
  // 2: si un ou +sieurs prédécesseurs, récursion jusqu'au premier sommet
  let resultats = Array();

  sommet.pred.forEach((pred) => {
    resultats.push(temps_au_min(pred) + pred.duree);
  });

  console.log("Temps min de " + sommet.lettre + " = " + resultats);
  // return de la solution au sommet suivant
  return Math.max(...resultats);
};


let calculer_tps_max = (graphe) => {
    

  let fin;
  try {
    fin = trouver_sommet(graphe, "Fin");
  } catch (e) {
    throw e;
  }
  for (let cle of graphe.keys()) {
    graphe.get(cle).forEach((sommet) => {
      sommet["max"] = fin["min"];
    });
  }

  tps_au_max(fin);

  return graphe;
};


let tps_au_max = (sommet) => {
  sommet.pred.forEach((antecedent) => {
    let temps = sommet.max - antecedent.duree;
    if (temps < antecedent.max) {
      antecedent.max = temps;
      tps_au_max(antecedent);
    }
  });
};

// ajout d'un attribut "min" à chaque objet tâche
let calculer_tps_min = (graphe) => {
  for (let cle of graphe.keys()) {
    //récupèration d'un tableau de sommets
    graphe.get(cle).forEach((sommet) => {
      sommet["min"] = temps_au_min(sommet);
    });
  }
  return graphe;
};

// test de closure -- utile pour les tests frontend pour les event des button
let executerGraphe = (f) => {
  let sommets = resoudre();
  let graphe = ordonnerGraphe(sommets);

  return f(graphe);
};

let construire_graphe = () => {
  let sommets = resoudre();
  let graphe = ordonnerGraphe(sommets);

  // ajouter les min et max
  graphe = calculer_tps_min(graphe);
  graphe = calculer_tps_max(graphe);

  return graphe;
};


let ordonnerGraphe = (tableau_de_sommets) => {
  let graphe = new Map();

  tableau_de_sommets.forEach((sommet) => {
    let position = positionSommet(sommet);

    // insertion dans dessin, suivant la position comme clé
    if (graphe.has(position)) graphe.get(position).push(sommet);
    else graphe.set(position, [sommet]);
  });

  // ajout des tâches debut et oméga au graphe
  graphe = ajouterdebutfin(graphe);

  return graphe;
};



let ajouterdebutfin = (graphe) => {

    
  let taches = document.getElementsByClassName("lettre");
  let antecedents = document.getElementsByClassName("pred");
  // à l'aide de structures set pour faire une opération de différence sur des ensembles :
  let setA = new Set();
  for (let i = 0; i < taches.length; i++) {
    setA.add(taches[i].value);
  }
  let setB = new Set();
  for (let i = 0; i < antecedents.length; i++) {
    // création d'une liste de lettres
    let liste = antecedents[i].value.split(",");
    liste.forEach((lettre) => {
      setB.add(lettre);
    });
  }

  let diff = difference(setA, setB);

  // les tâches à rattacher à Oméga sont dans diff, qui contient seulement leurs lettres
  // transformation du Set de lettres en liste de sommets antécédents à fin
  let finAnt = new Array();
  diff.forEach((lettre) => {
    finAnt.push(trouver_sommet(graphe, lettre));
  });

  
  graphe.set(graphe.size + 1, [{ lettre: "Fin", duree: 0, pred: finAnt }]);

  // ajout d'debut
  // raccrochage des sommets de la colonne 1 à debut, ces taches n'ont pas d'antécédents
  graphe.set(0, [{ lettre: "Début", duree: 0, pred: Array() }]);
  graphe.get(1).forEach((sommet) => {
    sommet.pred.push(graphe.get(0)[0]);
  });

  return graphe;
};

// fonctiion ensembliste pour faire la différence entre 2 sets
function difference(setA, setB) {
  var difference = new Set(setA);
  for (var elem of setB) {
    difference.delete(elem);
  }
  return difference;
}

// retourne la position (colonne) d'un sommet dans un dessin
let positionSommet = (sommet) => {
  //algo
  //1: tmps min = temps des prédécesseurs + duree
  if (sommet.pred.length == 0) {
    console.log("sommet " + sommet.lettre + " en position 1");
    return 1;
  }
  // 2: si ou +sieurs prédécesseurs, récursion jusqu'au premier sommet
  let resultats = Array();

  sommet.pred.forEach((pred) => {
    resultats.push(positionSommet(pred) + 1);
  });

  console.log("sommet " + sommet.lettre + " en position(s) " + resultats);
  // return de la solution au sommet suivant
  return Math.max(...resultats);
};

let trouver_sommet = (graphe, lettre) => {
  for (let sommets of graphe.values()) {

    let res = trouver(sommets, lettre);

    if (res != undefined) return res;
  }

  throw "lettre " + lettre + " n'est pas dans le graphe";
};

let trouver = (tab, lettre) => {
  for (let sommet of tab) {
    if (sommet.lettre == lettre) return sommet;
  }
};
