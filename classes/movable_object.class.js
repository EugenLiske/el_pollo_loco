class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    currentAnimation = null;
    collectedCoins = 0;
    collectedBottles = 0;
    maxBottles = 20;
    maxCoins = 50;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };


    applyGravity(){
        startIntervalAndSaveID(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }


    isAboveGround(){
        if(this instanceof ThrowableObject){
            return true;
        } else {
            return this.y < 180;
        }
    }


    isColliding(movableObject){
        return this.x + this.width > movableObject.x &&
               this.y + this.height > movableObject.y &&
               this.x < movableObject.x + movableObject.width &&
               this.y < movableObject.y + movableObject.height;
    }

    isCollidingWithOffset(movableObject){
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
               this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
               this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
               this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    
    hitByEnemy() {
        if (this.isDead()) {
            return;
        }

        this.energy -= 2;

        if (this.energy <= 0) {
            this.energy = 0;              
            this.currentImageIndex = 0; 
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    hitByEndboss() {
        if (this.isDead()) {
            return;
        }

        this.energy -= 10;

        if (this.energy <= 0) {
            this.energy = 0;              
            this.currentImageIndex = 0; 
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    isHurt(){
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }


    isDead(){
        return this.energy === 0;
    }

    collectCoin(){
        this.collectedCoins++;
    }

    collectBottle(){
        this.collectedBottles++;
    }


    setAnimation(animationKey, images, loop = true) {
        if (this.currentAnimation !== animationKey) {
            this.currentAnimation = animationKey;
            this.currentImageIndex = 0;
        }

        this.playAnimation(images, loop);
    }


    playAnimation(images, loop = true) {
        let index = this.currentImageIndex;

        if (loop) {
            index = index % images.length;
            this.currentImageIndex++;

        } else {
            if (this.currentImageIndex < images.length - 1) {
                this.currentImageIndex++;
            }
        }

        const path = images[index];
        this.img = this.imageCache[path];
    }


    moveRight(){
        this.x += this.speed;
    }


    moveLeft(){
        this.x -= this.speed;
    }

    
    jump(){
        this.speedY = 23;
    }
}