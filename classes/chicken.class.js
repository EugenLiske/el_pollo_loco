class Chicken extends MovableObject {
    static existingEnemies = [];

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    y = 350;
    width = 75;
    height = 75;
    isDeadChicken = false;

    
    constructor(){
        super();
        
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.offset = {
            top: 20,
            left: 10,
            right: 10,
            bottom: 10
        };

        this.x = 1000 + Math.random() * 4000;
        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
    }


    die() {
        this.isDeadChicken = true;
        this.speed = 0;
        this.setAnimation('dead', this.IMAGES_DEAD, false);
    }


    animate() {
        setInterval(() => {
            if (!this.isDeadChicken) {
                this.moveLeft();
            }
        }, 1000 / 60);
        
        setInterval(() => {
            if (!this.isDeadChicken) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}