/**
 * Represents a moving cloud in the background.
 */
class Cloud extends MovableObject {
  y = 20;
  width = 1000;
  height = 250;

  /**
   * Creates a new cloud at a given starting position.
   * 
   * @param {number} startingPoint - The initial x position of the cloud.
   */
  constructor(startingPoint) {
    super();
    this.loadImage("img/5_background/layers/4_clouds/full.png");

    this.x = startingPoint;
    this.animate();
  }

  /**
   * Starts the cloud movement to the left.
   */
  animate() {
    startIntervalAndSaveID(() => this.moveLeft(), 1000 / 60);
  }
}