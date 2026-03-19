/**
 * Represents a status bar (health, coins, bottles, or endboss health).
 * Handles rendering and updating based on a percentage value.
 */
class StatusBar extends DrawableObject {
  IMAGES_HEALTH_BAR = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  IMAGES_COINS_BAR = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  IMAGES_BOTTLES_BAR = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  IMAGES_ENDBOSS_HEALTH = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
  ];

  percentage = 100;
  collectedCoinsPercentage = 0;
  collectedBottlesPercentage = 0;
  endbossHealthPercentage = 100;
  type;

  /**
   * Creates a new status bar with a specific type and position.
   * 
   * @param {number} x - The horizontal position of the status bar.
   * @param {number} y - The vertical position of the status bar.
   * @param {string} type - The type of status bar ('health', 'coins', 'bottles', 'endbossHealth').
   */
  constructor(x, y, type) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 45;

    this.loadImages(this.getImageArrayByType());
    this.updateStatusBar(this.getCurrentValueByType());
  }

  /**
   * Updates the status bar based on a given value.
   * 
   * @param {number} value - The new percentage value.
   */
  updateStatusBar(value) {
    this.setCurrentValueByType(value);

    let imageArray = this.getImageArrayByType();
    let path = imageArray[this.resolveImageIndex(value)];
    this.img = this.imageCache[path];
  }

  /**
   * Returns the image array corresponding to the status bar type.
   * 
   * @returns {string[]}
   */
  getImageArrayByType() {
    if (this.type === "health") {
      return this.IMAGES_HEALTH_BAR;
    } else if (this.type === "coins") {
      return this.IMAGES_COINS_BAR;
    } else if (this.type === "bottles") {
      return this.IMAGES_BOTTLES_BAR;
    } else if (this.type === "endbossHealth") {
      return this.IMAGES_ENDBOSS_HEALTH;
    }
  }

  /**
   * Returns the current value based on the status bar type.
   * 
   * @returns {number}
   */
  getCurrentValueByType() {
    if (this.type === "health") {
      return this.percentage;
    } else if (this.type === "coins") {
      return this.collectedCoinsPercentage;
    } else if (this.type === "bottles") {
      return this.collectedBottlesPercentage;
    } else if (this.type === "endbossHealth") {
      return this.endbossHealthPercentage;
    }
  }

  /**
   * Sets the current value based on the status bar type.
   * 
   * @param {number} value - The value to set.
   */
  setCurrentValueByType(value) {
    if (this.type === "health") {
      this.percentage = value;
    } else if (this.type === "coins") {
      this.collectedCoinsPercentage = value;
    } else if (this.type === "bottles") {
      this.collectedBottlesPercentage = value;
    } else if (this.type === "endbossHealth") {
      this.endbossHealthPercentage = value;
    }
  }

  /**
   * Resolves the correct image index based on the percentage value.
   * 
   * @param {number} value - The percentage value.
   * @returns {number}
   */
  resolveImageIndex(value) {
    if (value === 100) return 5;
    else if (value >= 80) return 4;
    else if (value >= 60) return 3;
    else if (value >= 40) return 2;
    else if (value >= 20) return 1;
    else return 0;
  }
}