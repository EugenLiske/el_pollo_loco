class MovableObject {
    img;
    x = 120;
    y = 230;
    width = 100;
    height = 200;
    imageCache = {};
    currentImageIndex = 0;
    speed = 0.15;
    
    
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

    moveRight(){
        console.log('Moving right'); 
    }

    moveLeft(){
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60)
    }
}