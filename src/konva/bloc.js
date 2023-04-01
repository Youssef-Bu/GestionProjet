class Bloc {

    constructor(width, height, lettre) {
        this.width = width
        this.height = height
        this.lettre = lettre
        this.groupe = new Konva.Group()
        this.creer()
    }

    creer() {

        this.groupe.add(new Konva.Rect({
            width: this.width,
            height: this.height,
            stroke: 'black',
            fill: 'white',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 5, y: 5 },
        }))

        this.groupe.add(new Konva.Text({
            text: this.lettre,
            align: 'center',
            verticalAlign: 'middle',
            width: this.width,
            height: this.height,
        }))


        return this.groupe
    }

    pos(x, y) {
        this.groupe.position({ x: x, y: y })
    }

}