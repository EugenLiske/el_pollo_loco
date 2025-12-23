class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
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

    constructor(x, y){
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;

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
        setInterval(() => {
            if(this.isBroken) {
                return; // nach dem Zerplatzen nicht weiter nach rechts fliegen
            }
            this.x += 15;
        }, 50);
    }

    animate(){
        setInterval(() => {
            if (this.isBroken) {
                // Splash-Animation EINMALIG, dank loop = false und setAnimation
                this.setAnimation('splash', this.IMAGES_BOTTLE_SPLASH, false);
            } else {
                // Solange die Flasche fliegt, Rotation abspielen
                this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
            }
        }, 100);
    }
}