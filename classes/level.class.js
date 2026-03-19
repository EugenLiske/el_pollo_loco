/**
 * Represents a game level containing all game elements.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 6480;

  /**
   * Creates a new level with all required game objects.
   * 
   * @param {MovableObject[]} enemies - Array of enemy objects.
   * @param {MovableObject[]} clouds - Array of cloud objects.
   * @param {DrawableObject[]} backgroundObjects - Array of background elements.
   * @param {MovableObject[]} coins - Array of collectible coins.
   * @param {MovableObject[]} bottles - Array of collectible bottles.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}