/**
 * Checks if bottles hit the ground.
 */
World.prototype.checkBottleWithBottomCollision = function () {
  const GROUND_Y = 450;

  for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
    const bottle = this.throwableObjects[i];
    const bottleBottom = bottle.y + bottle.height - bottle.offset.bottom;

    if (this.bottleFallsToGround(bottle, bottleBottom, GROUND_Y))
      this.bottleBreaksAndSplashes(bottle);
  }
};

/**
 * Checks if a bottle has reached the ground.
 */
World.prototype.bottleFallsToGround = function (bottle, bottleBottom, GROUND_Y) {
  return !bottle.isBroken && bottleBottom >= GROUND_Y;
};

/**
 * Handles bottle breaking and splash animation.
 */
World.prototype.bottleBreaksAndSplashes = function (bottle) {
  SfxManager.play(SfxManager.bottleBreaks);
  bottle.isBroken = true;
  bottle.speedY = 0;
  bottle.acceleration = 0;
  bottle.setAnimation("splash", bottle.IMAGES_BOTTLE_SPLASH, false);

  setTimeout(() => {
    const index = this.throwableObjects.indexOf(bottle);
    if (index > -1) {
      this.throwableObjects.splice(index, 1);
    }
  }, 500);
};

/**
 * Checks bottle collisions with enemies.
 */
World.prototype.checkBottleWithEnemyCollision = function () {
  for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
    const bottle = this.throwableObjects[i];
    if (bottle.isBroken) {
      continue;
    }
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (enemy instanceof Chicken && enemy.isDeadChicken) {
        continue;
      }
      if (bottle.isCollidingWith(enemy)) {
        this.bottleBreaksAndSplashes(bottle);
        if (enemy instanceof Endboss) this.endbossIsDamagedByCharacter(enemy);
        if (enemy instanceof Chicken) this.regularEnemyDiesByBottle(enemy);
        break;
      }
    }
  }
};

/**
 * Applies damage to the endboss.
 */
World.prototype.endbossIsDamagedByCharacter = function (enemy) {
  enemy.hitByPepe();
  this.statusBarEndbossHealth.updateStatusBar(enemy.energy);
};

/**
 * Handles enemy death caused by bottle.
 */
World.prototype.regularEnemyDiesByBottle = function (enemy) {
  enemy.die();
  if (enemy instanceof MiniChicken) {
    SfxManager.play(SfxManager.smallChickenDead, 0.1);
    setTimeout(() => {
      SfxManager.stop(SfxManager.smallChickenDead);
    }, 750);
  } else if (enemy instanceof Chicken) {
    SfxManager.play(SfxManager.chickenDead, 0.1);
  }
  setTimeout(() => {
    const index = this.level.enemies.indexOf(enemy);
    if (index > -1) {
      this.level.enemies.splice(index, 1);
    }
  }, 500);
};