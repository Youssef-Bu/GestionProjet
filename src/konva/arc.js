class Arc {
  constructor(from, to) {
    //this.arc = new Konva.Arrow()
    this.duree = from.sommet.duree;
    this.from = from;
    this.to = to;
    this.groupe = new Konva.Group();
    this.arrow = new Konva.Arrow({
      x: 0,
      y: 0,
      pointerLength: 10,
      pointerWidth: 10,
      fill: "black",
      stroke: "black",
      strokeWidth: 4,
      shadowColor: "black",
      shadowBlur: 12,
      shadowOffset: { x: 5, y: 5 },
    });
    this.text = new Konva.Text({
      text: this.duree.toString(),
      fill: "black",
      fontSize: 20,
      fontFamily: "Calibri",
    });
  }

  dessiner() {
    this.colorier();
    this.update();

    this.groupe.add(this.arrow);
    this.groupe.add(this.text);
    console.log("test function dessiner");
    return this.groupe;
  }

  pos(x, y) {
    this.groupe.position({ x: x, y: y });
  }

  update() {
    this.updatePoints();
    this.updateText();
  }

  updatePoints() {
    let deb = this.from.groupe.position();
    let fin = this.to.groupe.position();
    let padding = 10;

    //placements des points relativement à x et y :
    this.arrow.points([
      deb.x + this.from.width + padding,
      deb.y + this.from.height / 2,
      fin.x - 2 * padding,
      fin.y + this.to.height / 2,
    ]);
  }

  colorier() {
    if (this.from.isCritique() && this.to.isCritique()) {
      this.arrow.fill("red");
      this.arrow.stroke("red");
      this.text.fill("red");
    }
  }

  updateText() {
    let x =
      this.from.groupe.position().x +
      (this.to.groupe.position().x - this.from.groupe.position().x) / 2;
    let y =
      this.from.groupe.position().y +
      (this.to.groupe.position().y - this.from.groupe.position().y) / 2;

    this.text.position({ x: x, y: y });
  }
}
