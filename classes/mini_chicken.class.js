/**
 * Represents a smaller variant of the Chicken enemy.
 */
class MiniChicken extends Chicken {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  y = 375;
  width = 50;
  height = 50;

  /**
   * Creates a new mini chicken with its own images and collision offset.
   */
  constructor() {
    super();

    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.offset = {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    };
  }
}