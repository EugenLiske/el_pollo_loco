class StatusBar extends DrawableObject {
    IMAGES_HEALTH_BAR = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    IMAGES_COINS_BAR = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    IMAGES_BOTTLES_BAR = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    IMAGES_ENDBOSS_HEALTH = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ]

    percentage = 100;
    collectedCoinsPercentage = 0;
    collectedBottlesPercentage = 0;
    endbossHealthPercentage = 100;
    type;

    constructor(x, y, type){
        super();
        this.type = type;


        if (this.type === 'health') {
            this.loadImages(this.IMAGES_HEALTH_BAR);
            this.setPercentage(this.percentage);
            
        } else if (this.type === 'coins') {
            this.loadImages(this.IMAGES_COINS_BAR);
            this.setCollectedCoinsPercentage(this.collectedCoinsPercentage);

        } else if(this.type === 'bottles') {
            this.loadImages(this.IMAGES_BOTTLES_BAR);
            this.setCollectedBottlesPercentage(this.collectedBottlesPercentage);

        } else if(this.type === 'endbossHealth') {
            this.loadImages(this.IMAGES_ENDBOSS_HEALTH);
            this.setEndbossHealthPercentage(this.endbossHealthPercentage);
        }
        
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 45;
    }

    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    setCollectedCoinsPercentage(collectedCoinsPercentage){
        this.collectedCoinsPercentage = collectedCoinsPercentage;
        let path = this.IMAGES_COINS_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    setCollectedBottlesPercentage(collectedBottlesPercentage){
        this.collectedBottlesPercentage = collectedBottlesPercentage;
        let path = this.IMAGES_BOTTLES_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    setEndbossHealthPercentage(endbossHealthPercentage){
        this.endbossHealthPercentage = endbossHealthPercentage;
        let path = this.IMAGES_ENDBOSS_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    resolveImageIndex(){
        if (this.type === 'health') {
            const p = this.percentage;
            if (p === 100)      return 5;
            else if (p >= 80)   return 4;
            else if (p >= 60)   return 3;
            else if (p >= 40)   return 2;
            else if (p >= 20)   return 1;
            else                return 0;
        }

        if (this.type === 'coins') {
            const p = this.collectedCoinsPercentage;
            if (p === 100)      return 5;
            else if (p >= 80)   return 4;
            else if (p >= 60)   return 3;
            else if (p >= 40)   return 2;
            else if (p >= 20)   return 1;
            else                return 0;
        }

        if (this.type === 'bottles') {
            const p = this.collectedBottlesPercentage;
            if (p === 100)      return 5;
            else if (p >= 80)   return 4;
            else if (p >= 60)   return 3;
            else if (p >= 40)   return 2;
            else if (p >= 20)   return 1;
            else                return 0;
        }

        if (this.type === 'endbossHealth') {
            const p = this.endbossHealthPercentage;
            if (p === 100)      return 5;
            else if (p >= 80)   return 4;
            else if (p >= 60)   return 3;
            else if (p >= 40)   return 2;
            else if (p >= 20)   return 1;
            else                return 0;
        }
    }
}