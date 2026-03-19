/**
 * Base class for all movable objects in the game.
 * Handles movement, physics, collisions and animations.
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;
  lastHit = 0;
  currentAnimation = null;

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * Applies gravity to the object by updating vertical position over time.
   */
  applyGravity() {
    startIntervalAndSaveID(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks collision using full bounding boxes.
   * 
   * @param {MovableObject} movableObject - The object to check collision with.
   * @returns {boolean}
   */
  isColliding(movableObject) {
    return (
      this.x + this.width > movableObject.x &&
      this.y + this.height > movableObject.y &&
      this.x < movableObject.x + movableObject.width &&
      this.y < movableObject.y + movableObject.height
    );
  }

  /**
   * Checks collision using offset-based hitboxes.
   * 
   * @param {MovableObject} movableObject - The object to check collision with.
   * @returns {boolean}
   */
  isCollidingWith(movableObject) {
    return (
      this.x + this.width - this.offset.right >
        movableObject.x + movableObject.offset.left &&
      this.y + this.height - this.offset.bottom >
        movableObject.y + movableObject.offset.top &&
      this.x + this.offset.left <
        movableObject.x + movableObject.width - movableObject.offset.right &&
      this.y + this.offset.top <
        movableObject.y + movableObject.height - movableObject.offset.bottom
    );
  }

  /**
   * Checks if the object is currently in a hurt state.
   * @returns {boolean}
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean}
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Sets a new animation if it differs from the current one.
   * 
   * @param {string} animationKey - Identifier for the animation.
   * @param {string[]} images - Array of image paths.
   * @param {boolean} [loop=true] - Whether the animation should loop.
   */
  setAnimation(animationKey, images, loop = true) {
    if (this.currentAnimation !== animationKey) {
      this.currentAnimation = animationKey;
      this.currentImageIndex = 0;
    }

    this.playAnimation(images, loop);
  }

  /**
   * Plays an animation by cycling through image frames.
   * 
   * @param {string[]} images - Array of image paths.
   * @param {boolean} [loop=true] - Whether the animation should loop.
   */
  playAnimation(images, loop = true) {
    let index = this.currentImageIndex;

    if (loop) {
      index = index % images.length;
      this.currentImageIndex++;
    } else {
      if (this.currentImageIndex < images.length - 1) {
        this.currentImageIndex++;
      }
    }

    const path = images[index];
    this.img = this.imageCache[path];
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Applies an upward force to simulate a jump.
   */
  jump() {
    this.speedY = 23;
  }
}