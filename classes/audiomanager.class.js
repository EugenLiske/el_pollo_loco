/**
 * Manages background music playback and global audio state.
 */
class AudioManager {
  static menuMusic = new Audio("audio/loops/menu_music.mp3");
  static gameMusic = new Audio("audio/loops/game_music.mp3");
  static winMusic = new Audio("audio/loops/win_music.mp3");
  static loseMusic = new Audio("audio/loops/lose_music.mp3");

  static currentMusic = null;
  static isMuted = false;

  static {
    this.gameMusic.volume = 0.3;
    this.menuMusic.volume = 0.3;
    this.winMusic.volume = 0.3;
    this.loseMusic.volume = 0.3;
  }

  /**
   * Plays the given music track and stops any currently playing track.
   * 
   * @param {HTMLAudioElement} music - The audio track to be played.
   * @returns {Promise<void>}
   */
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
      if (error.name === "NotAllowedError") return;
      console.error("Audio error:", error);
    }
  }

  /**
   * Plays the menu background music.
   */
  static playMenu() {
    this.playMusic(this.menuMusic);
  }

  /**
   * Plays the in-game background music.
   */
  static playGame() {
    this.playMusic(this.gameMusic);
  }

  /**
   * Plays the win screen music.
   */
  static playWin() {
    this.playMusic(this.winMusic);
  }

  /**
   * Plays the lose screen music.
   */
  static playLose() {
    this.playMusic(this.loseMusic);
  }

  /**
   * Toggles the global mute state and updates the current track.
   */
  static toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.currentMusic) {
      this.currentMusic.muted = this.isMuted;
    }
  }
}