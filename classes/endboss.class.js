class Endboss extends MovableObject {
  IMAGES_IDLE = ["img/4_enemie_boss_chicken/1_walk/G1.png"];

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  width = 150;
  height = 240;
  x = 2000;
  y = 200;

  speed = 1.2;

  world;
  alertTriggered = false;
  hasStartedWalking = false;
  moveToRight = false;
  isAttacking = false;
  attackStartX = 0;
  attackDirectionRight = false;
  attackSpeed = 0;
  normalSpeed = 0;

  wasDeadSoundPlayed = false;
  wasHurtSoundPlayed = false;
  wasAttackSoundPlayed = false;

  constructor() {
    super();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.offset = {
      top: 50,
      left: 15,
      right: 15,
      bottom: 10,
    };

    this.animate();
  }

  updateMovementDirectionByCharacterPosition() {
    const character = this.world.character;

    const pepeLeftWithOffset = character.x + character.offset.left;
    const bossRightWithOffset = this.x + this.width - this.offset.right;

    const pepeIsBehindBoss = pepeLeftWithOffset > bossRightWithOffset;

    if (pepeIsBehindBoss) {
      this.moveToRight = true;
      this.otherDirection = true;
    } else {
      this.moveToRight = false;
      this.otherDirection = false;
    }
  }

  hitByPepe() {
    if (this.isAttacking) {
      return;
    }

    if (this.isDead()) {
      return;
    }

    this.energy -= 20;

    if (this.energy <= 0) {
      this.energy = 0;
      this.currentImageIndex = 0;

      this.isAttacking = false;
      this.speed = 0;
      this.alertTriggered = false;

      this.currentAnimation = "idle";
      this.setAnimation("dead", this.IMAGES_DEAD, false);
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  animate() {
    const WALK_DISTANCE = 1500;
    const ALERT_DISTANCE = 400;
    const ATTACK_DISTANCE = 600;
    const ANIMATION_INTERVAL_MS = 100;
    startIntervalAndSaveID(
      () => this.moveEndboss(WALK_DISTANCE, ALERT_DISTANCE, ATTACK_DISTANCE),
      1000 / 60,
    );
    startIntervalAndSaveID(
      () =>
        this.playEndbossAnimation(
          ALERT_DISTANCE,
          ATTACK_DISTANCE,
          ANIMATION_INTERVAL_MS,
        ),
      ANIMATION_INTERVAL_MS,
    );
  }

  moveEndboss(WALK_DISTANCE, ALERT_DISTANCE, ATTACK_DISTANCE) {
    if (!this.world || !this.world.character) {
      return;
    }

    if (this.isDead()) {
      this.speed = 0;
      return;
    }

    this.updateMovementDirectionWhileMoving();

    const distance = this.getDistanceToCharacter();

    this.checkIfEndbossStartsWalking(distance, WALK_DISTANCE);

    if (this.isAttacking) {
      this.performAttackMovement(ATTACK_DISTANCE);
      return;
    }

    if (distance < ALERT_DISTANCE) {
      return;
    }

    if (this.hasStartedWalking) {
      this.endbossWalks();
    }
  }

  updateMovementDirectionWhileMoving() {
    if (!this.isAttacking) {
      this.updateMovementDirectionByCharacterPosition();
    } else {
      this.otherDirection = this.attackDirectionRight;
    }
  }

  getDistanceToCharacter() {
    return Math.abs(this.x - this.world.character.x);
  }

  checkIfEndbossStartsWalking(distance, WALK_DISTANCE) {
    if (!this.hasStartedWalking && distance <= WALK_DISTANCE) {
      this.hasStartedWalking = true;
      SfxManager.play(SfxManager.endbossStartsWalking);
    }
  }

  performAttackMovement(ATTACK_DISTANCE) {
    const traveled = Math.abs(this.x - this.attackStartX);

    if (traveled >= ATTACK_DISTANCE) {
      this.finishAttackMovement();
      return;
    }

    this.speed = this.attackSpeed;

    if (this.attackDirectionRight) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  finishAttackMovement() {
    this.isAttacking = false;
    this.speed = this.normalSpeed;
    this.wasAttackSoundPlayed = false;

    this.alertTriggered = false;
    this.currentAnimation = "idle";
  }

  endbossWalks() {
    if (this.moveToRight) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  playEndbossAnimation(ALERT_DISTANCE, ATTACK_DISTANCE, ANIMATION_INTERVAL_MS) {
    if (!this.world || !this.world.character) {
      return;
    }

    if (this.isDead()) {
      this.playDeadAnimation();
    } else if (this.isAttacking) {
      this.playAttackAnimation();
    } else {
      this.updateMovementDirectionByCharacterPosition();

      const distance = this.getDistanceToCharacter();

      if (this.isHurt()) {
        this.playHurtAnimation();
      } else if (this.endbossIsAlert(distance, ALERT_DISTANCE)) {
        this.playAlertAnimation(ATTACK_DISTANCE, ANIMATION_INTERVAL_MS);
      } else {
        this.playWalkingOrIdleAnimation();
      }
    }
  }

  playDeadAnimation() {
    if (!this.wasDeadSoundPlayed) {
      SfxManager.play(SfxManager.endbossDead);
      this.wasDeadSoundPlayed = true;
    }

    this.isAttacking = false;
    this.alertTriggered = false;
    this.setAnimation("dead", this.IMAGES_DEAD, false);
  }

  playAttackAnimation() {
    if (!this.wasAttackSoundPlayed) {
      SfxManager.play(SfxManager.endbossAttacks);
      this.wasAttackSoundPlayed = true;
    }

    this.otherDirection = this.attackDirectionRight;
    this.setAnimation("attack", this.IMAGES_ATTACK, false);
  }

  playHurtAnimation() {
    if (!this.wasHurtSoundPlayed) {
      SfxManager.play(SfxManager.bottleBreaks);
      SfxManager.play(SfxManager.endbossHurt);
      setTimeout(() => {
        SfxManager.stop(SfxManager.endbossHurt);
      }, 1000);
      this.wasHurtSoundPlayed = true;
    }

    this.alertTriggered = false;
    this.setAnimation("hurt", this.IMAGES_HURT, true);
  }

  endbossIsAlert(distance, ALERT_DISTANCE) {
    return distance < ALERT_DISTANCE;
  }

  playAlertAnimation(ATTACK_DISTANCE, ANIMATION_INTERVAL_MS) {
    this.wasHurtSoundPlayed = false;

    if (!this.alertTriggered) {
      this.alertTriggered = true;
      this.setAnimation("alert", this.IMAGES_ALERT, false);
      return;
    }

    if (this.currentAnimation === "alert") {
      this.setAnimation("alert", this.IMAGES_ALERT, false);

      if (this.currentImageIndex >= this.IMAGES_ALERT.length - 1) {
        this.startAttack(ATTACK_DISTANCE, ANIMATION_INTERVAL_MS);
      }
    }
  }

  startAttack(ATTACK_DISTANCE, ANIMATION_INTERVAL_MS) {
    this.attackDirectionRight = this.moveToRight;
    this.otherDirection = this.attackDirectionRight;

    this.normalSpeed = this.speed;

    const durationSeconds =
      (this.IMAGES_ATTACK.length * ANIMATION_INTERVAL_MS) / 1000;
    this.attackSpeed = ATTACK_DISTANCE / (durationSeconds * 60);

    this.attackStartX = this.x;
    this.isAttacking = true;

    this.currentAnimation = "idle";
    this.setAnimation("attack", this.IMAGES_ATTACK, false);
  }

  playWalkingOrIdleAnimation() {
    this.alertTriggered = false;
    this.wasHurtSoundPlayed = false;

    if (!this.hasStartedWalking) {
      this.playIdleAnimation();
      return;
    }

    this.playWalkingAnimation();
  }

  playIdleAnimation() {
    if (this.currentAnimation !== "idle") {
      this.setAnimation("idle", this.IMAGES_IDLE, false);
    }
  }

  playWalkingAnimation() {
    this.setAnimation("walk", this.IMAGES_WALKING, true);
  }
}
