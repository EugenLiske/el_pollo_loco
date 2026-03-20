/**
 * Checks if the player is dead and triggers lose state.
 */
World.prototype.checkIfPepeIsDead = function () {
  if (this.character.isDead()) {
    this.gameEnded = true;
    AudioManager.playLose();
    let losingScreen = document.querySelector(".losing_screen");
    setTimeout(() => {
      losingScreen.classList.remove("hidden");
    }, 1000);
  }
};

/**
 * Checks if the endboss is dead and triggers win state.
 */
World.prototype.checkIfEndbossIsDead = function () {
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
};