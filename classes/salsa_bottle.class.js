class SalsaBottle extends MovableObject {
    IMAGES_SALSA_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    static existingBottles = [];

    height = 60;
    width = 60;

    constructor(){
        super();
        const randomIndex = Math.floor(Math.random() * this.IMAGES_SALSA_BOTTLE.length);
        const randomPath = this.IMAGES_SALSA_BOTTLE[randomIndex];

        this.loadImage(randomPath);

        this.placeWithoutOverlap();
        SalsaBottle.existingBottles.push(this);
    }

    placeWithoutOverlap(){
        const maxTries = 100;
        let tries = 0;
        let positionOk = false;

        while (!positionOk && tries < maxTries) {
            this.x = 300 + Math.random() * 4700;
            this.y = 360 + Math.random() * 10;

            positionOk = true;

            SalsaBottle.existingBottles.forEach(existingBottle => {
                if (this.isColliding(existingBottle)) {
                    positionOk = false;
                }
            });

            tries++;
        }
    }
}