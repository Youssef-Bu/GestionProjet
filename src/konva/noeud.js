class Noeud {
  constructor(sommet) {
    this.sommet = sommet;
    this.width = 50;
    this.height = 75;
    //this.bloc_lettre = bloc_lettre
    //this.bloc_min = bloc_min
    //this.bloc_max = bloc_max
    this.bloc_lettre = new Bloc(50, 50, this.sommet.lettre);
    this.bloc_min = new Bloc(25, 25, this.sommet.min.toString());
    this.bloc_max = new Bloc(25, 25, this.sommet.max.toString());

    this.groupe = new Konva.Group({
      draggable: true,
    });

    this.antecedents = new Array();
  }

  dessiner() {
    this.bloc_min.pos(0, 0);
    this.bloc_max.pos(25, 0);
    this.bloc_lettre.pos(0, 25);
    this.add(this.bloc_min);
    this.add(this.bloc_max);
    this.add(this.bloc_lettre);

    this.groupe.on("mouseover", () => {
      document.body.style.cursor = "pointer";
    });

    this.groupe.on("mouseout", () => {
      document.body.style.cursor = "default";
    });

    return this.groupe;
  }

  pos(x, y) {
    this.groupe.position({ x: x, y: y });
  }

  add(bloc) {
    this.groupe.add(bloc.groupe);
  }

  ajouterAntecedent(a) {
    this.antecedents.push(a);
  }

  isCritique() {
    return this.sommet.max - this.sommet.min == 0;
  }
}
