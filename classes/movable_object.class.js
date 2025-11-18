class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;





    applyGravity(){
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }


    isAboveGround(){
        return this.y < 180;
    }


    isColliding(movableObject){
        return this.x + this.width > movableObject.x &&
               this.y + this.height > movableObject.y &&
               this.x < movableObject.x + movableObject.width &&
               this.y < movableObject.y + movableObject.height;
    }


    hit(){
        this.energy -= 5;
        if(this.energy < 0){
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    isHurt(){
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1.2;
    }


    isDead(){
        return this.energy === 0;
    }

    
    playAnimation(images){
        let imageIndex = this.currentImageIndex % images.length;
        let path = images[imageIndex];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }


    moveRight(){
        this.x += this.speed;
    }


    moveLeft(){
        this.x -= this.speed;
    }

    
    jump(){
        this.speedY = 20;
    }
}