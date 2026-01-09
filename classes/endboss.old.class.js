class Endboss extends MovableObject {
    IMAGES_IDLE = [
        'img/4_enemie_boss_chicken/1_walk/G1.png'
    ];
    
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ]
    
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
    ]

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ]

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    width = 150;
    height = 240;
    x = 720;
    y = 200;

    speed = 1.0;

    world;
    alertTriggered = false;
    hasStartedWalking = false;

    /**
     * NEU:
     * Steuert, ob der Boss nach rechts laufen soll (true) oder nach links (false).
     * Wird anhand deiner "drüber gesprungen"-Regel berechnet.
     */
    moveToRight = false;

    constructor(){
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
     * NEU:
     * Erkennt "Pepe ist über den Endboss gesprungen" exakt nach deiner Definition:
     * Pepes linke Seite MIT Offset (left: 25) ist hinter dem Endboss,
     * also hinter der rechten Seite MIT Offset (right: 15).
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
            this.otherDirection = true;   // Bild spiegeln über World.flipImage()
        } else {
            this.moveToRight = false;
            this.otherDirection = false;  // normal zeichnen
        }
    }

    animate() {
        const WALK_DISTANCE = 600;
        const ALERT_DISTANCE = 300;

        // 1) Bewegung (smooth)
        setInterval(() => {
            if (!this.world || !this.world.character) {
                return;
            }

            // NEU: Richtung (links/rechts) aus Peppes Position ableiten
            this.updateMovementDirectionByCharacterPosition();

            const distance = Math.abs(this.x - this.world.character.x);

            // Trigger: einmalig aktivieren, sobald du in 500px kommst
            if (!this.hasStartedWalking && distance <= WALK_DISTANCE) {
                this.hasStartedWalking = true;
            }

            // Im Alert-Bereich: stehen bleiben
            if (distance < ALERT_DISTANCE) {
                return;
            }

            // Sobald aktiviert: weiterlaufen, auch wenn distance wieder > WALK_DISTANCE wird
            if (this.hasStartedWalking) {
                if (this.moveToRight) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            }
        }, 1000 / 60);

        // 2) Animation (Frames wechseln)
        setInterval(() => {
            if (!this.world || !this.world.character) {
                return;
            }

            // NEU: Spiegelung (otherDirection) soll auch für das Zeichnen passen
            this.updateMovementDirectionByCharacterPosition();

            const distance = Math.abs(this.x - this.world.character.x);

            // Trigger auch hier setzen (falls Animationstakt zuerst greift)
            if (!this.hasStartedWalking && distance <= WALK_DISTANCE) {
                this.hasStartedWalking = true;
            }

            // < 300px → ALERT (einmal starten + weiterlaufen lassen)
            if (distance < ALERT_DISTANCE) {
                if (!this.alertTriggered) {
                    this.alertTriggered = true;
                    this.setAnimation('alert', this.IMAGES_ALERT, false);
                    return;
                }

                if (this.currentAnimation === 'alert') {
                    this.setAnimation('alert', this.IMAGES_ALERT, false);
                }
                return;
            }

            // Außerhalb Alert: Reset, damit Alert beim nächsten Unterschreiten wieder triggert
            this.alertTriggered = false;

            // Solange nicht aktiviert: IDLE (1 Bild)
            if (!this.hasStartedWalking) {
                if (this.currentAnimation !== 'idle') {
                    this.setAnimation('idle', this.IMAGES_IDLE, false);
                }
                return;
            }

            // Aktiviert und nicht im Alert: WALK loopen
            this.setAnimation('walk', this.IMAGES_WALKING, true);
        }, 150);
    }
}