class DrawableObject {
    img;
    imageCache = {};
    currentImageIndex = 0;
    x = 100;
    y = 180;
    width = 100;
    height = 250;
    

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }


    drawSingleObject(ctx){
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }


    drawFrame(ctx){
        if(this instanceof Character || this instanceof Chicken){
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x,
                this.y,
                this.width,
                this.height);
            ctx.stroke();
        } 
    }


    loadImages(array){
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }
}