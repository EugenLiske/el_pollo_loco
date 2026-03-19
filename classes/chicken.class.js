/**
 * Represents a basic enemy chicken with movement and death behavior.
 */
class Chicken extends MovableObject {
  static existingEnemies = [];

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  y = 350;
  width = 75;
  height = 75;
  isDeadChicken = false;

  /**
   * Creates a new chicken, positions it with distance to others and starts animation.
   */
  constructor() {
    super();

    this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.offset = {
      top: 20,
      left: 10,
      right: 10,
      bottom: 10,
    };

    this.placeWithMinDistanceX();
    Chicken.existingEnemies.push(this);

    this.speed = 0.2 + Math.random() * 0.5;

    this.animate();
  }

  /**
   * Places the chicken on the x-axis while maintaining a minimum distance to other enemies.
   */
  placeWithMinDistanceX() {
    const maxTries = 100;
    const MIN_DISTANCE_X = 250;
    let tries = 0;
    let positionOk = false;
    while (!positionOk && tries < maxTries) {
      this.x = 750 + Math.random() * 5250;
      positionOk = true;
      Chicken.existingEnemies.forEach((existingEnemy) => {
        if (Math.abs(this.x - existingEnemy.x) < MIN_DISTANCE_X) {
          positionOk = false;
        }
      });
      tries++;
    }
  }

  /**
   * Marks the chicken as dead and plays the death animation.
   */
  die() {
    this.isDeadChicken = true;
    this.speed = 0;
    this.setAnimation("dead", this.IMAGES_DEAD, false);
  }

  /**
   * Starts movement and animation intervals.
   */
  animate() {
    startIntervalAndSaveID(() => this.moveChicken(), 1000 / 60);
    startIntervalAndSaveID(() => this.playChickenAnimation(), 200);
  }

  /**
   * Moves the chicken to the left if it is alive.
   */
  moveChicken() {
    if (!this.isDeadChicken) {
      this.moveLeft();
    }
  }

  /**
   * Plays the walking animation if the chicken is alive.
   */
  playChickenAnimation() {
    if (!this.isDeadChicken) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}