class World {
    character = new Character();
    level = level_1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar(30, 0, 'health');
    statusBarCoins = new StatusBar(240, 0, 'coins');
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
        }, 200);
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

            if (this.character.isColliding(coin)) {
                this.character.collectCoin();

                let percent = (this.character.collectedCoins / maxCoins) * 100;
                this.statusBarCoins.setCollectedCoinsPercentage(percent);

                this.level.coins.splice(i, 1);
            }   
        }

        this.level.enemies.forEach((enemy) => {
            if(this.character.isColliding(enemy)){
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
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
