/**
 * Represents a background object in the game world.
 * Background objects are positioned side by side to build the scenery.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new background object with the given image and x position.
   * 
   * @param {string} imagePath - The path to the background image.
   * @param {number} x - The horizontal position of the background object.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}