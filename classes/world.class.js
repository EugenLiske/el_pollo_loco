class World {
    character = new Character();
    level = level_1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar(30, 0, 'health');
    statusBarCoins = new StatusBar(190, 0, 'coins');
    statusBarBottles = new StatusBar(350, 0, 'bottles');
    throwableObjects = [];


    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.drawCanvas();
        this.setWorld();
        this.runGameLogic();
    }


    setWorld(){
        this.character.world = this;
    }


    runGameLogic(){
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 25);
    }


    checkThrowObjects(){
        if(this.keyboard.D){
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }


    checkCollisions(){
        const maxCoins = 50;
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];

            if (this.character.isCollidingWithOffset(coin)) {
                this.character.collectCoin();

                let percent = (this.character.collectedCoins / maxCoins) * 100;
                this.statusBarCoins.setCollectedCoinsPercentage(percent);

                this.level.coins.splice(i, 1);
            }   
        }

        const maxBottles = 20;
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            const bottle = this.level.bottles[i];

            if (this.character.isCollidingWithOffset(bottle)) {
                this.character.collectBottle();

                let percent = (this.character.collectedBottles / maxBottles) * 100;
                this.statusBarBottles.setCollectedBottlesPercentage(percent);

                this.level.bottles.splice(i, 1);
            }   
        }

        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];

            if (enemy instanceof Chicken && enemy.isDeadChicken) {
                continue;
            }

            if (this.character.isCollidingWithOffset(enemy)) {

                if (enemy instanceof Chicken && this.isCharacterStompingEnemy(enemy)) {
                    enemy.die();

                    this.character.speedY = 15;

                    setTimeout(() => {
                        const index = this.level.enemies.indexOf(enemy);
                        if (index > -1) {
                            this.level.enemies.splice(index, 1);
                        }
                    }, 500);

                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        }
    }


    isCharacterStompingEnemy(enemy) {
        const charBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop   = enemy.y + enemy.offset.top;

        const isFalling = this.character.speedY < 0 && this.character.isAboveGround();

        return isFalling && charBottom > enemyTop;
    }


    drawCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.ctx.translate(-this.camera_x, 0);
        //--------- space for fixed objects ---------
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        //--------- space for fixed objects ---------
        this.ctx.translate(this.camera_x, 0);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function(){
            self.drawCanvas();
        });
    }


    addObjectsToMap(objects){
        objects.forEach(object => {
            this.addToMap(object);
        })
    }


    addToMap(movableObject){
        if(movableObject.otherDirection){
            this.flipImage(movableObject);
        }

        movableObject.drawSingleObject(this.ctx);
        movableObject.drawFrame(this.ctx);
        movableObject.drawFrameWithOffset(this.ctx);
        

        if(movableObject.otherDirection){
            this.flipImageBack(movableObject);
        }
    }
    

    flipImage(movableObject){
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }


    flipImageBack(movableObject){
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
}
