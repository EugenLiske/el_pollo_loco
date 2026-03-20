/**
 * Handles bottle throwing logic with cooldown.
 */
World.prototype.checkThrowObjects = function () {
  const COOLDOWN_MS = 500;
  const now = Date.now();
  if (this.characterCanThrow(COOLDOWN_MS, now)) {
    this.characterThrowsBottle();
    let percent =
      (this.character.collectedBottles / this.character.maxBottles) * 100;
    this.statusBarBottles.updateStatusBar(percent);
    this.lastThrowTime = now;
  }
};

/**
 * Checks if the character is allowed to throw a bottle.
 * 
 * @param {number} COOLDOWN_MS - Cooldown time in milliseconds.
 * @param {number} now - Current timestamp.
 * @returns {boolean}
 */
World.prototype.characterCanThrow = function (COOLDOWN_MS, now) {
  return (
    this.keyboard.SPACE &&
    this.character.currentAnimation !== "idleSleep" &&
    this.character.collectedBottles > 0 &&
    now - this.lastThrowTime >= COOLDOWN_MS
  );
};

/**
 * Creates and throws a new bottle.
 */
World.prototype.characterThrowsBottle = function () {
  this.character.idleToSleepCounter = 0;
  const directionLeft = this.character.otherDirection;
  const spawnX = directionLeft
    ? this.character.x - 13
    : this.character.x + 55;
  const spawnY = this.character.y + 130;
  const bottle = new ThrowableObject(spawnX, spawnY, directionLeft);
  this.throwableObjects.push(bottle);
  SfxManager.play(SfxManager.throwBottle);
  this.character.collectedBottles--;
};