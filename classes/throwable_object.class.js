class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_ROTATION_LEFT = [
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    isBroken = false;
    rotationImages;

    constructor(x, y, otherDirection){
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_ROTATION_LEFT);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;

        this.otherDirection = otherDirection;

        this.rotationImages = this.otherDirection ? this.IMAGES_BOTTLE_ROTATION_LEFT : this.IMAGES_BOTTLE_ROTATION;

        this.offset = {
            top: 5,
            left: 10,
            right: 10,
            bottom: 5
        };

        this.throw();
        this.animate();
    }

    throw(){
        this.speedY = 15;
        this.applyGravity();
        startIntervalAndSaveID(() => {
            if(this.isBroken) {
                return;
            }

            if (this.otherDirection) {
                this.x -= 15;
            } else {
                this.x += 15;
            }
        }, 50);
    }

    animate(){
        startIntervalAndSaveID(() => {
            if (this.isBroken) {
                this.setAnimation('splash', this.IMAGES_BOTTLE_SPLASH, false);
            } else {
                this.playAnimation(this.rotationImages);
            }
        }, 100);
    }
}