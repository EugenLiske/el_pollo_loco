class World {
    character = new Character();
    level = level_1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    animationFrameID;
    isGameRunning = true;
    gameEnded = false;

    statusBar = new StatusBar(20, -5, 'health');
    statusBarCoins = new StatusBar(20, 35, 'coins');
    statusBarBottles = new StatusBar(20, 75, 'bottles');
    statusBarEndbossHealth = new StatusBar(550, 0, 'endbossHealth');

    throwableObjects = [];
    lastThrowTime = 0;


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
        
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }


    runGameLogic(){
        startIntervalAndSaveID(() => {
            if (this.gameEnded) return;
            this.checkCollisions();
            this.checkIfPepeisDead();
            this.checkIfEndbossIsDead();
            this.checkThrowObjects();
        }, 1000 / 25);
    }


    stopDrawing(){
        this.isGameRunning = false;
        cancelAnimationFrame(this.animationFrameID);
    }


    checkCollisions(){
        this.checkCoinCollection();
        this.checkBottleCollection();
        this.checkEnemyCollision();
        this.checkBottleWithBottomCollision();
        this.checkBottleWithEnemyCollision();
    }

    checkIfPepeisDead() {
        if (this.character.isDead()) {
            this.gameEnded = true;
            AudioManager.playLose();

            let losingScreen = document.querySelector('.losing_screen');
            setTimeout(() => {
                losingScreen.classList.remove('hidden');
            }, 1000);   
        }
    }

    checkIfEndbossIsDead() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];

            if(enemy instanceof Endboss && enemy.isDead()) {
                this.gameEnded = true;
                AudioManager.playWin();

                let winningScreen = document.querySelector('.winning_screen');
                winningScreen.classList.remove('hidden');

                setTimeout(() => {
                    stopGame();
                }, 1000);

                return;
            }
        }    
    }


    checkThrowObjects() {
        const COOLDOWN_MS = 500;
        const now = Date.now();

        const canThrow =
            this.keyboard.SPACE &&
            this.character.currentAnimation !== 'idleSleep' &&
            // this.character.collectedBottles > 0 &&
            (now - this.lastThrowTime) >= COOLDOWN_MS;

        if (canThrow) {
            this.character.idleToSleepCounter = 0;
            const directionLeft = this.character.otherDirection;

            const spawnX = directionLeft ? this.character.x - 13 : this.character.x + 55;
            const spawnY = this.character.y + 130;

            const bottle = new ThrowableObject(spawnX, spawnY, directionLeft);
            this.throwableObjects.push(bottle);

            SfxManager.play(SfxManager.throwBottle);

            this.character.collectedBottles--;

            let percent = (this.character.collectedBottles / this.character.maxBottles) * 100;
            this.statusBarBottles.setCollectedBottlesPercentage(percent);

            this.lastThrowTime = now;
        }
    }


    isCharacterStompingEnemy(enemy) {
        const charBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop   = enemy.y + enemy.offset.top;

        const isFalling = this.character.speedY < 0 && this.character.isAboveGround();

        return isFalling && charBottom > enemyTop;
    }

    checkCoinCollection(){
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i];

            if (this.character.isCollidingWithOffset(coin)) {
                this.character.collectCoin();
                SfxManager.play(SfxManager.collectCoin);

                let percent = (this.character.collectedCoins / this.character.maxCoins) * 100;
                this.statusBarCoins.setCollectedCoinsPercentage(percent);

                this.level.coins.splice(i, 1);
            }   
        }
    }


    checkBottleCollection(){
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            const bottle = this.level.bottles[i];

            if (this.character.isCollidingWithOffset(bottle)) {
                this.character.collectBottle();
                SfxManager.play(SfxManager.collectBottle);

                let percent = (this.character.collectedBottles / this.character.maxBottles) * 100;
                this.statusBarBottles.setCollectedBottlesPercentage(percent);

                this.level.bottles.splice(i, 1);
            }   
        }
    }


    checkEnemyCollision(){
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];

            if (enemy instanceof Chicken && enemy.isDeadChicken) {
                continue;
            }

            if (this.character.isCollidingWithOffset(enemy)) {

                if (enemy instanceof Chicken && this.isCharacterStompingEnemy(enemy)) {
                    enemy.die();

                    if (enemy instanceof MiniChicken) {
                        SfxManager.play(SfxManager.smallChickenDead, 0.1);
                        setTimeout(() => {
                            SfxManager.stop(SfxManager.smallChickenDead);
                        }, 750);
                    } else if (enemy instanceof Chicken) {
                        SfxManager.play(SfxManager.chickenDead, 0.1);
                    }

                    this.character.speedY = 5;

                    setTimeout(() => {
                        const index = this.level.enemies.indexOf(enemy);
                        if (index > -1) {
                            this.level.enemies.splice(index, 1);
                        }
                    }, 500);

                } else if(enemy instanceof Endboss){
                    this.character.hitByEndboss();
                    this.statusBar.setPercentage(this.character.energy);
                } else {
                    this.character.hitByEnemy();
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        }
    }

    
    checkBottleWithBottomCollision(){
        const GROUND_Y = 450;

        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];
            const bottleBottom = bottle.y + bottle.height - bottle.offset.bottom;

            if (!bottle.isBroken && bottleBottom >= GROUND_Y) {
                SfxManager.play(SfxManager.bottleBreaks);
                bottle.y = GROUND_Y - (bottle.height - bottle.offset.bottom);
                bottle.isBroken = true;
                bottle.speedY = 0;
                bottle.acceleration = 0;
                bottle.setAnimation('splash', bottle.IMAGES_BOTTLE_SPLASH, false);

                setTimeout(() => {
                    const index = this.throwableObjects.indexOf(bottle);
                    if (index > -1) {
                        this.throwableObjects.splice(index, 1);
                    }
                }, 500);
            }
        }
    }


    checkBottleWithEnemyCollision() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            const bottle = this.throwableObjects[i];

            if (bottle.isBroken) {
                continue;
            }

            for (let i = this.level.enemies.length - 1; i >= 0; i--) {
                const enemy = this.level.enemies[i];

                if (enemy instanceof Chicken && enemy.isDeadChicken) {
                    continue;
                }

                if (bottle.isCollidingWithOffset(enemy)) {

                    bottle.isBroken = true;
                    bottle.speedY = 0;
                    bottle.acceleration = 0;
                    bottle.setAnimation('splash', bottle.IMAGES_BOTTLE_SPLASH, false);

                    if (enemy instanceof Endboss) {
                        enemy.hitByPepe();
                        this.statusBarEndbossHealth.setEndbossHealthPercentage(enemy.energy);
                    }

                    setTimeout(() => {
                        const index = this.throwableObjects.indexOf(bottle);
                        if (index > -1) {
                            this.throwableObjects.splice(index, 1);
                        }
                    }, 500);

                    if (enemy instanceof Chicken) {
                        enemy.die();
                        SfxManager.play(SfxManager.bottleBreaks);
                        if (enemy instanceof MiniChicken) {
                            SfxManager.play(SfxManager.smallChickenDead, 0.1);
                            setTimeout(() => {
                                SfxManager.stop(SfxManager.smallChickenDead);
                            }, 750);
                        } else if (enemy instanceof Chicken) {
                            SfxManager.play(SfxManager.chickenDead, 0.1);
                        }

                        setTimeout(() => {
                        const index = this.level.enemies.indexOf(enemy);
                            if (index > -1) {
                                this.level.enemies.splice(index, 1);
                            }
                        }, 500);
                    }

                    break;
                }
            }
        }
    }




    drawCanvas(){
        if (!this.isGameRunning) {
            return;
        }

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
        this.addToMap(this.statusBarEndbossHealth);
        //--------- space for fixed objects ---------
        this.ctx.translate(this.camera_x, 0);

        this.ctx.translate(-this.camera_x, 0);

        this.animationFrameID = requestAnimationFrame(() => this.drawCanvas());
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
