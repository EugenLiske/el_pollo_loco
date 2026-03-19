class Cloud extends MovableObject {
  y = 20;
  width = 1000;
  height = 250;

  constructor(startingPoint) {
    super();
    this.loadImage("img/5_background/layers/4_clouds/full.png");

    this.x = startingPoint;
    this.animate();
  }

  animate() {
    startIntervalAndSaveID(() => this.moveLeft(), 1000 / 60);
  }
}
