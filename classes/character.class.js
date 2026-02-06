class Character extends MovableObject {
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        // 'img/2_character_pepe/3_jump/J-31.png',
        // 'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ]

    IMAGES_IDLE_LONG = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]

    world;
    speed = 5;
    idleToSleepCounter = 0;

    // ✅ NEW: Jump-Animation über die gesamte Flugzeit strecken
    jumpStartTime = 0;         // ✅ NEW
    jumpDurationMs = 0;        // ✅ NEW
    jumpInitialSpeedY = 23;    // ✅ NEW (entspricht deinem jump(): speedY = 23)

    constructor(){
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);

        this.offset = {
            top: 110,
            left: 25,
            right: 35,
            bottom: 15
        };

        this.applyGravity();
        this.animate();
    }

    // ✅ NEW: Sprungdauer anhand deiner Gravity-Logik berechnen (applyGravity läuft mit 25 FPS, acceleration = 1)
    initJumpTiming() { // ✅ NEW
        this.jumpStartTime = Date.now();

        // applyGravity() tickt alle 1000/25 ms
        const GRAVITY_FPS = 25;
        const framesUp = this.jumpInitialSpeedY / this.acceleration; // bei acceleration=1 -> 23 Frames nach oben
        const totalFrames = 2 * framesUp; // hoch + runter (vereinfachtes Modell)

        this.jumpDurationMs = (totalFrames / GRAVITY_FPS) * 1000;
    }

    // ✅ NEW: Jump-Frames einmalig über die gesamte Flugzeit verteilen (statt Looping)
    playJumpAnimationStretched() { // ✅ NEW
        if (!this.jumpStartTime || !this.jumpDurationMs) {
            this.initJumpTiming();
        }

        const now = Date.now();
        const elapsed = now - this.jumpStartTime;
        const duration = Math.max(1, this.jumpDurationMs);

        // Fortschritt 0..1 über die gesamte Jump-Dauer
        const progress = Math.min(1, elapsed / duration);

        // Frame-Index passend zum Fortschritt (0..lastIndex)
        const lastIndex = this.IMAGES_JUMPING.length - 1;
        const frameIndex = Math.floor(progress * lastIndex);

        // Hier setzen wir das Bild direkt, damit es NICHT loopen kann.
        if (this.currentAnimation !== 'jump') {
            this.currentAnimation = 'jump';
        }

        this.currentImageIndex = frameIndex;

        const path = this.IMAGES_JUMPING[frameIndex];
        this.img = this.imageCache[path];
    }

    animate(){
        setInterval(() => {
            if (this.isDead()) {
                return;
            }

            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x){                
                this.moveRight();
                this.otherDirection = false;
            }

            if(this.world.keyboard.LEFT && this.x > 0){
                this.moveLeft();
                this.otherDirection = true;
            }

            if((this.world.keyboard.SPACE || this.world.keyboard.UP) && !this.isAboveGround()){
                this.jump();
                // ✅ NEW: Beim Absprung Timing starten, damit die Jump-Frames über die ganze Flugzeit gestreckt werden
                this.initJumpTiming(); // ✅ NEW
            }            

            this.world.camera_x = -this.x + 250;
        }, 1000 / 60)

        setInterval(() => {
            if (this.isDead()) {
                this.setAnimation('dead', this.IMAGES_DEAD, false);
                this.idleToSleepCounter = 0;

            } else if (this.isHurt()) {
                this.setAnimation('hurt', this.IMAGES_HURT);
                this.idleToSleepCounter = 0;

            } else if (this.isAboveGround()) {
                // ✅ CHANGED: Jump-Animation nicht loopen, sondern einmalig über die Flugzeit strecken
                this.playJumpAnimationStretched(); // ✅ NEW
                this.idleToSleepCounter = 0;

            } else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
                // ✅ NEW: Sobald wir wieder am Boden sind, Jump-Timing zurücksetzen (nächster Sprung startet sauber)
                this.jumpStartTime = 0; // ✅ NEW
                this.jumpDurationMs = 0; // ✅ NEW

                this.setAnimation('walk', this.IMAGES_WALKING);
                this.idleToSleepCounter = 0;

            } else {
                // ✅ NEW: Sobald wir wieder am Boden sind, Jump-Timing zurücksetzen (nächster Sprung startet sauber)
                this.jumpStartTime = 0; // ✅ NEW
                this.jumpDurationMs = 0; // ✅ NEW

                if (this.idleToSleepCounter >= 50) {
                    this.setAnimation('idleSleep', this.IMAGES_IDLE_LONG);
                } else {
                    this.setAnimation('idle', this.IMAGES_IDLE);
                    this.idleToSleepCounter++;
                }
            }
        }, 100);  
    }
}