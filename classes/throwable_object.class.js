/**
 * Represents a throwable object (salsa bottle) with movement, rotation and splash behavior.
 */
class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_BOTTLE_ROTATION_LEFT = [
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
  ];

  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  isBroken = false;
  rotationImages;

  /**
   * Creates a throwable bottle with initial position and direction.
   * 
   * @param {number} x - The initial x position.
   * @param {number} y - The initial y position.
   * @param {boolean} otherDirection - Direction of the throw (true = left, false = right).
   */
  constructor(x, y, otherDirection) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_ROTATION_LEFT);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);

    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;

    this.otherDirection = otherDirection;

    this.rotationImages = this.otherDirection
      ? this.IMAGES_BOTTLE_ROTATION_LEFT
      : this.IMAGES_BOTTLE_ROTATION;

    this.offset = {
      top: 5,
      left: 10,
      right: 10,
      bottom: 5,
    };

    this.throw();
    this.animate();
  }

  /**
   * Initiates the throw by applying gravity and horizontal movement.
   */
  throw() {
    this.speedY = 15;
    this.applyGravity();
    startIntervalAndSaveID(() => this.bottleMovement(), 50);
  }

  /**
   * Handles horizontal bottle movement during flight.
   */
  bottleMovement() {
    if (this.isBroken) {
      return;
    }

    if (this.otherDirection) {
      this.x -= 15;
    } else {
      this.x += 15;
    }
  }

  /**
   * Starts the animation loop.
   */
  animate() {
    startIntervalAndSaveID(() => this.bottleAnimation(), 100);
  }

  /**
   * Plays rotation or splash animation depending on the bottle state.
   */
  bottleAnimation() {
    if (this.isBroken) {
      this.setAnimation("splash", this.IMAGES_BOTTLE_SPLASH, false);
    } else {
      this.playAnimation(this.rotationImages);
    }
  }
}