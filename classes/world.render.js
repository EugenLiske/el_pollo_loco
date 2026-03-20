/**
 * Renders the game canvas and all objects.
 */
World.prototype.drawCanvas = function () {
  if (!this.isGameRunning) {
    return;
  }
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.translate(this.camera_x, 0);
  this.addObjectsToMap(this.level.backgroundObjects);
  this.addObjectsToMap(this.level.clouds);
  this.addToMap(this.character);
  this.addObjectsToMap(this.level.enemies);
  this.addObjectsToMap(this.throwableObjects);
  this.addObjectsToMap(this.level.coins);
  this.addObjectsToMap(this.level.bottles);
  this.ctx.translate(-this.camera_x, 0);

  this.addToMap(this.statusBar);
  this.addToMap(this.statusBarCoins);
  this.addToMap(this.statusBarBottles);
  this.addToMap(this.statusBarEndbossHealth);

  this.ctx.translate(this.camera_x, 0);
  this.ctx.translate(-this.camera_x, 0);
  this.animationFrameID = requestAnimationFrame(() => this.drawCanvas());
};

/**
 * Adds multiple objects to the canvas.
 */
World.prototype.addObjectsToMap = function (objects) {
  objects.forEach((object) => {
    this.addToMap(object);
  });
};

/**
 * Draws a single object on the canvas with optional flipping.
 */
World.prototype.addToMap = function (movableObject) {
  if (movableObject.otherDirection) {
    this.flipImage(movableObject);
  }
  movableObject.drawSingleObject(this.ctx);
  if (movableObject.otherDirection) {
    this.flipImageBack(movableObject);
  }
};

/**
 * Flips an object horizontally.
 */
World.prototype.flipImage = function (movableObject) {
  this.ctx.save();
  this.ctx.translate(movableObject.width, 0);
  this.ctx.scale(-1, 1);
  movableObject.x = movableObject.x * -1;
};

/**
 * Restores the original orientation after flipping.
 */
World.prototype.flipImageBack = function (movableObject) {
  movableObject.x = movableObject.x * -1;
  this.ctx.restore();
};