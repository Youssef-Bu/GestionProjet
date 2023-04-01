class Croix {
    constructor(width) {
      this.groupe = new Konva.Group({
        x: width - 120,
        y: 30,
      });
  
      this.rect = new Konva.Rect({
        x: 0,
        y: 0,

        strokeWidth: 2,
        cornerRadius: 5,
        shadowColor: '#000',
        shadowBlur: 10,
        shadowOffset: { x: 2, y: 2 },
      });
  
      this.croix = new Konva.Text({
        text: 'X',
        fontSize: 20,
        fontStyle: 'bold',
        width: 25, 
        height: 25, 
        align: 'center',
        verticalAlign: 'middle',
        color: 'red',
      });
  
      this.groupe.on('click', () => {
        stage.width(0);
        stage.height(0);
      });
  
      this.groupe.on('mouseover', () => {
        document.body.style.cursor = 'pointer';
      });
  
      this.groupe.on('mouseout', () => {
        document.body.style.cursor = 'default';
      });
  
      this.groupe.add(this.rect);
      this.groupe.add(this.croix);
      return this.groupe;
    }
  }
  