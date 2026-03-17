class Endboss extends MovableObject {
    IMAGES_IDLE = [
        'img/4_enemie_boss_chicken/1_walk/G1.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    width = 150;
    height = 240;
    x = 1000;
    y = 200;

    speed = 1.2;

    world;
    alertTriggered = false;
    hasStartedWalking = false;

    /**
     * Steuert, ob der Boss nach rechts laufen soll (true) oder nach links (false).
     * Wird anhand deiner "drüber gesprungen"-Regel berechnet.
     */
    moveToRight = false;

    // ─────────────────────────────────────────────
    // NEU: Attack-Status (nicht abbrechbar sobald gestartet)
    // ─────────────────────────────────────────────
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
            bottom: 10
        };

        this.animate();
    }

    /**
     * Erkennt "Pepe ist über den Endboss gesprungen" exakt nach deiner Definition:
     * Pepes linke Seite MIT Offset ist hinter dem Endboss,
     * also hinter der rechten Seite MIT Offset.
     *
     * Daraus leiten wir ab:
     * - Bewegung: moveRight statt moveLeft
     * - Spiegelung: otherDirection = true (damit World.flipImage() greift)
     */
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

            this.currentAnimation = 'idle'; 
            this.setAnimation('dead', this.IMAGES_DEAD, false);
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    animate() {
        const WALK_DISTANCE = 1500;
        const ALERT_DISTANCE = 400;

        const ATTACK_DISTANCE = 600;
        const ANIMATION_INTERVAL_MS = 100;

        startIntervalAndSaveID(() => {
            if (!this.world || !this.world.character) {
                return;
            }

            if (this.isDead()) {
                this.speed = 0;
                return;
            }

            if (!this.isAttacking) {
                this.updateMovementDirectionByCharacterPosition();
            } else {
                this.otherDirection = this.attackDirectionRight;
            }

            const distance = Math.abs(this.x - this.world.character.x);

            if (!this.hasStartedWalking && distance <= WALK_DISTANCE) {
                this.hasStartedWalking = true;
                SfxManager.play(SfxManager.endbossStartsWalking);
            }


            if (this.isAttacking) {
                const traveled = Math.abs(this.x - this.attackStartX);

                if (traveled >= ATTACK_DISTANCE) {
                    this.isAttacking = false;
                    this.speed = this.normalSpeed;
                    this.wasAttackSoundPlayed = false;

                    this.alertTriggered = false;
                    this.currentAnimation = 'idle';
                    return;
                }

                this.speed = this.attackSpeed;

                if (this.attackDirectionRight) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
                return;
            }

            if (distance < ALERT_DISTANCE) {
                return;
            }

            if (this.hasStartedWalking) {
                if (this.moveToRight) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            }
        }, 1000 / 60);

        startIntervalAndSaveID(() => {
            if (!this.world || !this.world.character) {
                return;
            }

            if (this.isDead()) {
                if (!this.wasDeadSoundPlayed) {
                    SfxManager.play(SfxManager.endbossDead);
                    this.wasDeadSoundPlayed = true;
                }
                this.isAttacking = false;
                this.alertTriggered = false;
                this.setAnimation('dead', this.IMAGES_DEAD, false);
                return;
            }

            if (this.isAttacking) {
                if (!this.wasAttackSoundPlayed) {
                    SfxManager.play(SfxManager.endbossAttacks);
                    this.wasAttackSoundPlayed = true;
                }
                this.otherDirection = this.attackDirectionRight;
                this.setAnimation('attack', this.IMAGES_ATTACK, false);
                return;
            }

            this.updateMovementDirectionByCharacterPosition();

            const distance = Math.abs(this.x - this.world.character.x);

            if (this.isHurt()) {
                if (!this.wasHurtSoundPlayed) {
                    SfxManager.play(SfxManager.bottleBreaks);
                    SfxManager.play(SfxManager.endbossHurt);
                    setTimeout(() => {
                            SfxManager.stop(SfxManager.endbossHurt);
                    }, 1000);
                    this.wasHurtSoundPlayed = true;
                } 
                this.alertTriggered = false; 
                this.setAnimation('hurt', this.IMAGES_HURT, true);
                return;
            }

            this.wasHurtSoundPlayed = false;
            if (distance < ALERT_DISTANCE) {
                if (!this.alertTriggered) {
                    this.alertTriggered = true;
                    this.setAnimation('alert', this.IMAGES_ALERT, false);
                    return;
                }

                if (this.currentAnimation === 'alert') {
                    this.setAnimation('alert', this.IMAGES_ALERT, false);

                    if (this.currentImageIndex >= this.IMAGES_ALERT.length - 1) {
                        this.attackDirectionRight = this.moveToRight;
                        this.otherDirection = this.attackDirectionRight;

                        this.normalSpeed = this.speed;
                        const durationSeconds = (this.IMAGES_ATTACK.length * ANIMATION_INTERVAL_MS) / 1000;
                        this.attackSpeed = ATTACK_DISTANCE / (durationSeconds * 60);

                        this.attackStartX = this.x;
                        this.isAttacking = true;

                        this.currentAnimation = 'idle';
                        this.setAnimation('attack', this.IMAGES_ATTACK, false);
                    }
                }
                return;
            }

            this.alertTriggered = false;

            if (!this.hasStartedWalking) {
                if (this.currentAnimation !== 'idle') {
                    this.setAnimation('idle', this.IMAGES_IDLE, false);
                }
                return;
            }

            this.setAnimation('walk', this.IMAGES_WALKING, true);
        }, ANIMATION_INTERVAL_MS);
    }
}
