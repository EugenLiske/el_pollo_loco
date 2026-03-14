class AudioManager {

    static menuMusic = new Audio('audio/menu_music.mp3');
    static gameMusic = new Audio('audio/game_music.mp3');
    static winMusic = new Audio('audio/win_music.mp3');
    static loseMusic = new Audio('audio/lose_music.mp3');

    static currentMusic = null;
    static isMuted = false;


    static async playMusic(music) {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        this.currentMusic = music;
        music.loop = true;
        music.muted = this.isMuted;

        try {
            await music.play();
        } catch (error) {
            if (error.name === 'NotAllowedError') return;
            console.error("Audio error:", error);
        }
    }


    static playMenu(){
        this.playMusic(this.menuMusic);
    }

    static playGame(){
        this.playMusic(this.gameMusic);
    }

    static playWin(){
        this.playMusic(this.winMusic);
    }

    static playLose(){
        this.playMusic(this.loseMusic);
    }


    static toggleMute(){
        this.isMuted = !this.isMuted;

        if(this.currentMusic){
            this.currentMusic.muted = this.isMuted;
        }
    }
}