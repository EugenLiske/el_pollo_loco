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
        if (this instanceof Character ||
            this instanceof Chicken ||
            this instanceof Coin ||
            this instanceof Endboss ||
            this instanceof SalsaBottle){

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x,
                this.y,
                this.width,
                this.height);
            ctx.stroke();
        } 
    }


    drawFrameWithOffset(ctx) {
        if (this instanceof Character || 
            this instanceof Chicken || 
            this instanceof Coin || 
            this instanceof Endboss || 
            this instanceof SalsaBottle || 
            this instanceof ThrowableObject) {

            const hitboxX = this.x + this.offset.left;
            const hitboxY = this.y + this.offset.top;
            const hitboxWidth = this.width - this.offset.left - this.offset.right;
            const hitboxHeight = this.height - this.offset.top - this.offset.bottom;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.rect(
                hitboxX,
                hitboxY,
                hitboxWidth,
                hitboxHeight);
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