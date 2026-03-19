/**
 * Base class for all drawable game objects.
 * Handles image loading, rendering and optional debug drawing.
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImageIndex = 0;
  x = 100;
  y = 180;
  width = 100;
  height = 250;

  /**
   * Loads a single image and assigns it to this object.
   * 
   * @param {string} path - The path to the image.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * 
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawSingleObject(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a blue bounding box around the object (for debugging).
   * 
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Coin ||
      this instanceof Endboss ||
      this instanceof SalsaBottle ||
      this instanceof ThrowableObject
    ) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Draws a red hitbox frame based on the object's offset (for debugging).
   * 
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawFrameWithOffset(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Coin ||
      this instanceof Endboss ||
      this instanceof SalsaBottle ||
      this instanceof ThrowableObject
    ) {
      const hitboxX = this.x + this.offset.left;
      const hitboxY = this.y + this.offset.top;
      const hitboxWidth = this.width - this.offset.left - this.offset.right;
      const hitboxHeight = this.height - this.offset.top - this.offset.bottom;

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "red";
      ctx.rect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
      ctx.stroke();
    }
  }

  /**
   * Loads multiple images and stores them in the image cache.
   * 
   * @param {string[]} array - Array of image paths.
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}