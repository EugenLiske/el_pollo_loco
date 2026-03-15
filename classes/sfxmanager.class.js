class SfxManager {
    static walk = new Audio('audio/sfx/pepe_walk.mp3');
    static jump = new Audio('audio/sfx/pepe_jump.mp3');
    static hurt = new Audio('audio/sfx/pepe_hurt.mp3');
    static dead = new Audio('audio/sfx/pepe_dead.mp3');
    static sleep = new Audio('audio/sfx/pepe_sleep.mp3');
    static throwBottle = new Audio('audio/sfx/pepe_throw.mp3');

    static play(sound, startAt = 0) {
        sound.pause();
        sound.currentTime = startAt;
        sound.muted = AudioManager.isMuted;
        sound.play();
    }

    static playLoop(sound, rate = 1) {
        sound.loop = true;
        sound.playbackRate = rate;
        sound.muted = AudioManager.isMuted;
        sound.play();
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
    }
}