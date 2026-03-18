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
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
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

    isWalkingSoundPlaying = false;
    isSleepSoundPlaying = false;
    wasDeadSoundPlayed = false;
    wasHurtSoundPlayed = false;

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

    animate(){
        startIntervalAndSaveID(() => {
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

            if((this.world.keyboard.UP) && !this.isAboveGround()){
                this.jump();
                SfxManager.play(SfxManager.jump);

                SfxManager.stop(SfxManager.walk);
                this.isWalkingSoundPlaying = false;
            }            

            this.world.camera_x = -this.x + 150;
        }, 1000 / 60)

        startIntervalAndSaveID(() => {
            if (this.isDead()) {
                if (!this.wasDeadSoundPlayed) {
                    SfxManager.play(SfxManager.dead);
                    this.wasDeadSoundPlayed = true;
                }

                this.setAnimation('dead', this.IMAGES_DEAD, false);
                this.idleToSleepCounter = 0;

            } else if (this.isHurt()) {
                if (!this.wasHurtSoundPlayed) {
                    SfxManager.play(SfxManager.hurt, 0.4);
                    this.wasHurtSoundPlayed = true;
                } 

                SfxManager.stop(SfxManager.walk);
                this.isWalkingSoundPlaying = false;

                this.setAnimation('hurt', this.IMAGES_HURT);
                this.idleToSleepCounter = 0;

            } else if (this.isAboveGround()) {
                this.setAnimation('jump', this.IMAGES_JUMPING, false);
                this.idleToSleepCounter = 0;

            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                if (!this.isWalkingSoundPlaying) {
                    SfxManager.playLoop(SfxManager.walk, 3.5);
                    this.isWalkingSoundPlaying = true;
                }
                SfxManager.stop(SfxManager.sleep);

                this.wasHurtSoundPlayed = false;
                this.setAnimation('walk', this.IMAGES_WALKING);
                this.idleToSleepCounter = 0;

            } else {
                this.wasHurtSoundPlayed = false;
                this.isWalkingSoundPlaying = false;
                SfxManager.stop(SfxManager.walk);
                
                if (this.idleToSleepCounter >= 50) {
                    if (!this.isSleepSoundPlaying) {
                        SfxManager.playLoop(SfxManager.sleep);
                        this.isSleepSoundPlaying = true;
                    }

                    this.setAnimation('idleSleep', this.IMAGES_IDLE_LONG);
                } else {
                    SfxManager.stop(SfxManager.sleep);
                    this.isSleepSoundPlaying = false;

                    this.setAnimation('idle', this.IMAGES_IDLE);
                    this.idleToSleepCounter++;
                }
            }
        }, 100);
    }
}