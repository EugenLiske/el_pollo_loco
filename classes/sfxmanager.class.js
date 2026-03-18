class SfxManager {
    static walk = new Audio('audio/sfx/pepe_walk.mp3');
    static jump = new Audio('audio/sfx/pepe_jump.mp3');
    static hurt = new Audio('audio/sfx/pepe_hurt.mp3');
    static dead = new Audio('audio/sfx/pepe_dead.mp3');
    static sleep = new Audio('audio/sfx/pepe_sleep.mp3');
    static throwBottle = new Audio('audio/sfx/pepe_throw.mp3');

    static collectCoin = new Audio('audio/sfx/collect_coin.mp3');
    static collectBottle = new Audio('audio/sfx/collect_bottle.mp3')
    static bottleBreaks = new Audio('audio/sfx/bottle_breaks.mp3')

    static chickenDead = new Audio('audio/sfx/chicken_dead.mp3');
    static smallChickenDead = new Audio('audio/sfx/small_chicken_dead.mp3');

    static endbossStartsWalking = new Audio('audio/sfx/endboss_starts_walking.mp3');
    static endbossDead = new Audio('audio/sfx/endboss_dead.mp3');
    static endbossHurt = new Audio('audio/sfx/endboss_hurt.mp3');
    static endbossAttacks = new Audio('audio/sfx/endboss_attacks.mp3');

    static dialogButtonClick = new Audio('audio/sfx/dialog_button_click.mp3');

    static {
        this.collectCoin.volume = 0.3;
        this.walk.volume = 0.3;
        this.hurt.volume = 0.3;
        this.dead.volume = 0.3;
        this.jump.volume = 0.3;
        this.sleep.volume = 0.3;
        this.throwBottle.volume = 0.3;
        this.smallChickenDead.volume = 0.3;
        this.chickenDead.volume = 0.3;
    }

    static async play(sound, startAt = 0) {
        sound.pause();
        sound.currentTime = startAt;
        sound.muted = AudioManager.isMuted;

        try {
            await sound.play();
        } catch (error) {
            if (error.name === "AbortError") return;
            console.error("SFX error:", error);
        }
    }

    static async playLoop(sound, rate = 1) {
        sound.loop = true;
        sound.playbackRate = rate;
        sound.muted = AudioManager.isMuted;

        try {
            await sound.play();
        } catch (error) {
            if (error.name === "AbortError") return;
            console.error("SFX loop error:", error);
        }
    }

    static stop(sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.loop = false;
    }

    static syncMuteState() {
        this.walk.muted = AudioManager.isMuted;
        this.jump.muted = AudioManager.isMuted;
        this.hurt.muted = AudioManager.isMuted;
        this.dead.muted = AudioManager.isMuted;
        this.sleep.muted = AudioManager.isMuted;
        this.throwBottle.muted = AudioManager.isMuted;
        this.collectCoin.muted = AudioManager.isMuted;
        this.collectBottle.muted = AudioManager.isMuted;
        this.bottleBreaks.muted = AudioManager.isMuted;
        this.chickenDead.muted = AudioManager.isMuted;
        this.smallChickenDead.muted = AudioManager.isMuted;
        this.endbossStartsWalking.muted = AudioManager.isMuted;
        this.endbossDead.muted = AudioManager.isMuted;
        this.endbossHurt.muted = AudioManager.isMuted;
        this.endbossAttacks.muted = AudioManager.isMuted;
        this.dialogButtonClick.muted = AudioManager.isMuted;
    }
}