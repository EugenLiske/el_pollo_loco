class Coin extends MovableObject {
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ]

    static existingCoins = []; // static - das Array gehört zur Klasse und somit allen Instanzen. Keine Property einer einzelnen Instanz!

    width = 125;
    height = 125;

    constructor(){
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);

        this.offset = {
            top: 45,
            left: 45,
            right: 45,
            bottom: 45
        };

        this.placeWithoutOverlap();
        Coin.existingCoins.push(this);

        this.animate();
    }

    placeWithoutOverlap() {
        const maxTries = 100;
        let tries = 0;
        let positionOk = false;

        while (!positionOk && tries < maxTries) {
            this.x = 300 + Math.random() * 4700;
            this.y = 0 + Math.random() * 280;

            positionOk = true;

            Coin.existingCoins.forEach(existingCoin => {
                if (this.isCollidingWithOffset(existingCoin)) {
                    positionOk = false;
                }
            });

            tries++;
        }
    }

    animate(){
        startIntervalAndSaveID(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200)
    }
}