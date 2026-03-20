/**
 * Checks all collision types in the game.
 */
World.prototype.checkCollisions = function () {
  this.checkCoinCollection();
  this.checkBottleCollection();
  this.checkEnemyCollision();
  this.checkBottleWithBottomCollision();
  this.checkBottleWithEnemyCollision();
};

/**
 * Checks coin collection collisions.
 */
World.prototype.checkCoinCollection = function () {
  for (let i = this.level.coins.length - 1; i >= 0; i--) {
    const coin = this.level.coins[i];
    if (this.characterIsCollectionCoin(coin)) this.characterCollectsCoin(i);
  }
};

/**
 * Checks if character collides with a coin.
 * 
 * @param {MovableObject} coin
 * @returns {boolean}
 */
World.prototype.characterIsCollectionCoin = function (coin) {
  return this.character.isCollidingWith(coin);
};

/**
 * Handles coin collection logic.
 * 
 * @param {number} i - Index of the coin.
 */
World.prototype.characterCollectsCoin = function (i) {
  this.character.collectCoin();
  SfxManager.play(SfxManager.collectCoin);
  let percent =
    (this.character.collectedCoins / this.character.maxCoins) * 100;
  this.statusBarCoins.updateStatusBar(percent);
  this.level.coins.splice(i, 1);
};

/**
 * Checks bottle collection collisions.
 */
World.prototype.checkBottleCollection = function () {
  for (let i = this.level.bottles.length - 1; i >= 0; i--) {
    const bottle = this.level.bottles[i];
    if (this.characterIsCollectingBottle(bottle))
      this.characterCollectsBottle(i);
  }
};

/**
 * Checks if character collides with a bottle.
 * 
 * @param {MovableObject} bottle
 * @returns {boolean}
 */
World.prototype.characterIsCollectingBottle = function (bottle) {
  return this.character.isCollidingWith(bottle);
};

/**
 * Handles bottle collection logic.
 * 
 * @param {number} i - Index of the bottle.
 */
World.prototype.characterCollectsBottle = function (i) {
  this.character.collectBottle();
  SfxManager.play(SfxManager.collectBottle);
  let percent =
    (this.character.collectedBottles / this.character.maxBottles) * 100;
  this.statusBarBottles.updateStatusBar(percent);
  this.level.bottles.splice(i, 1);
};

/**
 * Checks collisions between character and enemies.
 */
World.prototype.checkEnemyCollision = function () {
  for (let i = this.level.enemies.length - 1; i >= 0; i--) {
    const enemy = this.level.enemies[i];

    if (enemy instanceof Chicken && enemy.isDeadChicken) {
      continue;
    }

    if (this.character.isCollidingWith(enemy)) {
      if (this.isRegularEnemyAndJumpFromAbove(enemy))
        this.regularEnemyDiesByJump(enemy);
      else if (enemy instanceof Endboss) this.characterHurtByEndboss();
      else this.characterHurtByRegularEnemy();
    }
  }
};

/**
 * Checks if enemy is a regular one and stomped from above.
 */
World.prototype.isRegularEnemyAndJumpFromAbove = function (enemy) {
  return enemy instanceof Chicken && this.isCharacterStompingEnemy(enemy);
};

/**
 * Checks if character is stomping an enemy.
 */
World.prototype.isCharacterStompingEnemy = function (enemy) {
  const charBottom =
    this.character.y + this.character.height - this.character.offset.bottom;
  const enemyTop = enemy.y + enemy.offset.top;
  const isFalling =
    this.character.speedY < 0 && this.character.isAboveGround();
  return isFalling && charBottom > enemyTop;
};

/**
 * Handles enemy death by jumping.
 */
World.prototype.regularEnemyDiesByJump = function (enemy) {
  enemy.die();
  if (enemy instanceof MiniChicken) {
    SfxManager.play(SfxManager.smallChickenDead, 0.1);
    setTimeout(() => {
      SfxManager.stop(SfxManager.smallChickenDead);
    }, 750);
  } else if (enemy instanceof Chicken) {
    SfxManager.play(SfxManager.chickenDead, 0.1);
  }
  this.character.speedY = 1;
  setTimeout(() => {
    const index = this.level.enemies.indexOf(enemy);
    if (index > -1) {
      this.level.enemies.splice(index, 1);
    }
  }, 500);
};

/**
 * Applies damage to character from endboss.
 */
World.prototype.characterHurtByEndboss = function () {
  this.character.hitByEndboss();
  this.statusBar.updateStatusBar(this.character.energy);
};

/**
 * Applies damage to character from regular enemy.
 */
World.prototype.characterHurtByRegularEnemy = function () {
  this.character.hitByEnemy();
  this.statusBar.updateStatusBar(this.character.energy);
};