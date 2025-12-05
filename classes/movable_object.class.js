class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;
    currentAnimation = null;
    collectedCoins = 0;


    applyGravity(){
        setInterval(() => {
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


    hit() {
        if (this.isDead()) {
            return;
        }

        this.energy -= 5;

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
        this.collectedCoins ++;
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