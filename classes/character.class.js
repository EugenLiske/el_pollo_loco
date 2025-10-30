class Character extends MovableObject{
    world;
    IMAGES_WALKING = [
                'img/2_character_pepe/2_walk/W-21.png',
                'img/2_character_pepe/2_walk/W-22.png',
                'img/2_character_pepe/2_walk/W-23.png',
                'img/2_character_pepe/2_walk/W-24.png',
                'img/2_character_pepe/2_walk/W-25.png',
                'img/2_character_pepe/2_walk/W-26.png'
            ];

    constructor(){
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);

        this.animate();
    }

    animate(){
        setInterval(() => {
            if(this.world.keyboard.RIGHT){
                let imageIndex = this.currentImageIndex % this.IMAGES_WALKING.length
                let path = this.IMAGES_WALKING[imageIndex];
                this.img = this.imageCache[path];
                this.currentImageIndex++;
            }  
        }, 100)  
    }

    jump(){

    }
}