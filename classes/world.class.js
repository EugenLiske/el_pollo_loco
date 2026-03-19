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

  /**
   * Checks all collision types in the game.
   */
  checkCollisions() {
    this.checkCoinCollection();
    this.checkBottleCollection();
    this.checkEnemyCollision();
    this.checkBottleWithBottomCollision();
    this.checkBottleWithEnemyCollision();
  }

  /**
   * Checks if the player is dead and triggers lose state.
   */
  checkIfPepeIsDead() {
    if (this.character.isDead()) {
      this.gameEnded = true;
      AudioManager.playLose();
      let losingScreen = document.querySelector(".losing_screen");
      setTimeout(() => {
        losingScreen.classList.remove("hidden");
      }, 1000);
    }
  }

  /**
   * Checks if the endboss is dead and triggers win state.
   */
  checkIfEndbossIsDead() {
    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (enemy instanceof Endboss && enemy.isDead()) {
        this.gameEnded = true;
        AudioManager.playWin();
        let winningScreen = document.querySelector(".winning_screen");
        winningScreen.classList.remove("hidden");
        setTimeout(() => {
          stopGame();
        }, 1000);
        return;
      }
    }
  }

  /**
   * Handles bottle throwing logic with cooldown.
   */
  checkThrowObjects() {
    const COOLDOWN_MS = 500;
    const now = Date.now();
    if (this.characterCanThrow(COOLDOWN_MS, now)) {
      this.characterThrowsBottle();
      let percent =
        (this.character.collectedBottles / this.character.maxBottles) * 100;
      this.statusBarBottles.updateStatusBar(percent);
      this.lastThrowTime = now;
    }
  }

  /**
   * Checks if the character is allowed to throw a bottle.
   * 
   * @param {number} COOLDOWN_MS - Cooldown time in milliseconds.
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  characterCanThrow(COOLDOWN_MS, now) {
    return (
      this.keyboard.SPACE &&
      this.character.currentAnimation !== "idleSleep" &&
      now - this.lastThrowTime >= COOLDOWN_MS
    );
  }

  /**
   * Creates and throws a new bottle.
   */
  characterThrowsBottle() {
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
  }

  /**
   * Checks coin collection collisions.
   */
  checkCoinCollection() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      const coin = this.level.coins[i];
      if (this.characterIsCollectionCoin(coin)) this.characterCollectsCoin(i);
    }
  }

  /**
   * Checks if character collides with a coin.
   * 
   * @param {MovableObject} coin
   * @returns {boolean}
   */
  characterIsCollectionCoin(coin) {
    return this.character.isCollidingWith(coin);
  }

  /**
   * Handles coin collection logic.
   * 
   * @param {number} i - Index of the coin.
   */
  characterCollectsCoin(i) {
    this.character.collectCoin();
    SfxManager.play(SfxManager.collectCoin);
    let percent =
      (this.character.collectedCoins / this.character.maxCoins) * 100;
    this.statusBarCoins.updateStatusBar(percent);
    this.level.coins.splice(i, 1);
  }

  /**
   * Checks bottle collection collisions.
   */
  checkBottleCollection() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.level.bottles[i];
      if (this.characterIsCollectingBottle(bottle))
        this.characterCollectsBottle(i);
    }
  }

  /**
   * Checks if character collides with a bottle.
   * 
   * @param {MovableObject} bottle
   * @returns {boolean}
   */
  characterIsCollectingBottle(bottle) {
    return this.character.isCollidingWith(bottle);
  }

  /**
   * Handles bottle collection logic.
   * 
   * @param {number} i - Index of the bottle.
   */
  characterCollectsBottle(i) {
    this.character.collectBottle();
    SfxManager.play(SfxManager.collectBottle);
    let percent =
      (this.character.collectedBottles / this.character.maxBottles) * 100;
    this.statusBarBottles.updateStatusBar(percent);
    this.level.bottles.splice(i, 1);
  }

  /**
   * Checks collisions between character and enemies.
   */
  checkEnemyCollision() {
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
  }

  /**
   * Checks if enemy is a regular one and stomped from above.
   */
  isRegularEnemyAndJumpFromAbove(enemy) {
    return enemy instanceof Chicken && this.isCharacterStompingEnemy(enemy);
  }

  /**
   * Checks if character is stomping an enemy.
   */
  isCharacterStompingEnemy(enemy) {
    const charBottom =
      this.character.y + this.character.height - this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    const isFalling =
      this.character.speedY < 0 && this.character.isAboveGround();
    return isFalling && charBottom > enemyTop;
  }

  /**
   * Handles enemy death by jumping.
   */
  regularEnemyDiesByJump(enemy) {
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
  }

  /**
   * Applies damage to character from endboss.
   */
  characterHurtByEndboss() {
    this.character.hitByEndboss();
    this.statusBar.updateStatusBar(this.character.energy);
  }

  /**
   * Applies damage to character from regular enemy.
   */
  characterHurtByRegularEnemy() {
    this.character.hitByEnemy();
    this.statusBar.updateStatusBar(this.character.energy);
  }

  /**
   * Checks if bottles hit the ground.
   */
  checkBottleWithBottomCollision() {
    const GROUND_Y = 450;

    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      const bottle = this.throwableObjects[i];
      const bottleBottom = bottle.y + bottle.height - bottle.offset.bottom;

      if (this.bottleFallsToGround(bottle, bottleBottom, GROUND_Y))
        this.bottleBreaksAndSplashes(bottle);
    }
  }

  /**
   * Checks if a bottle has reached the ground.
   */
  bottleFallsToGround(bottle, bottleBottom, GROUND_Y) {
    return !bottle.isBroken && bottleBottom >= GROUND_Y;
  }

  /**
   * Handles bottle breaking and splash animation.
   */
  bottleBreaksAndSplashes(bottle) {
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
  }

  /**
   * Checks bottle collisions with enemies.
   */
  checkBottleWithEnemyCollision() {
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
  }

  /**
   * Applies damage to the endboss.
   */
  endbossIsDamagedByCharacter(enemy) {
    enemy.hitByPepe();
    this.statusBarEndbossHealth.updateStatusBar(enemy.energy);
  }

  /**
   * Handles enemy death caused by bottle.
   */
  regularEnemyDiesByBottle(enemy) {
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
  }

  /**
   * Renders the game canvas and all objects.
   */
  drawCanvas() {
    if (!this.isGameRunning) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
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
  }

  /**
   * Adds multiple objects to the canvas.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Draws a single object on the canvas with optional flipping.
   */
  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.drawSingleObject(this.ctx);
    movableObject.drawFrame(this.ctx);
    movableObject.drawFrameWithOffset(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

  /**
   * Flips an object horizontally.
   */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  /**
   * Restores the original orientation after flipping.
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }
}