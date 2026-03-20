/**
 * Represents the main game world, handling rendering, game logic and interactions.
 */
class World {
  character = new Character();
  level = level_1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  animationFrameID;
  isGameRunning = true;
  gameEnded = false;
  statusBar = new StatusBar(20, -5, "health");
  statusBarCoins = new StatusBar(20, 35, "coins");
  statusBarBottles = new StatusBar(20, 75, "bottles");
  statusBarEndbossHealth = new StatusBar(550, 0, "endbossHealth");
  throwableObjects = [];
  lastThrowTime = 0;

  /**
   * Creates the game world and initializes rendering and logic.
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.drawCanvas();
    this.setWorld();
    this.runGameLogic();
  }

  /**
   * Links world reference to character and endboss.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  /**
   * Starts the main game loop for logic updates.
   */
  runGameLogic() {
    startIntervalAndSaveID(() => {
      if (this.gameEnded) return;
      this.checkCollisions();
      this.checkIfPepeIsDead();
      this.checkIfEndbossIsDead();
      this.checkThrowObjects();
    }, 1000 / 25);
  }

  /**
   * Stops rendering the canvas.
   */
  stopDrawing() {
    this.isGameRunning = false;
    cancelAnimationFrame(this.animationFrameID);
  }
}