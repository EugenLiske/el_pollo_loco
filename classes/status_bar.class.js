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
    ]

    percentage = 100;
    collectedCoinsPercentage = 0;
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
        }
        
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
    }

    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    setCollectedCoinsPercentage(collectedCoinsPercentage){
        this.collectedCoinsPercentage = Math.min(100, collectedCoinsPercentage);
        let path = this.IMAGES_COINS_BAR[this.resolveImageIndex()];
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
    }
}