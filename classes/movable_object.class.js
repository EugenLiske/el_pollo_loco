class MovableObject {
    img;
    x = 100;
    y = 80;
    width = 100;
    height = 250;
    imageCache = {};
    currentImageIndex = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;

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
    
    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(array){
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }

    playAnimation(images){
        let imageIndex = this.currentImageIndex % images.length;
        let path = images[imageIndex];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    moveRight(){
        console.log('Moving right'); 
    }

    moveLeft(){
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60)
    }
}