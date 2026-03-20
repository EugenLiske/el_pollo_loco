/**
 * Toggles global sound and updates UI icon.
 */
function toggleSounds(){
    AudioManager.toggleMute();
    SfxManager.syncMuteState();

    localStorage.setItem('mute', AudioManager.isMuted);

    const soundButton = document.getElementById("sound_button");
    setUpCorrectSoundIcon(soundButton);
}

/**
 * Loads mute state from localStorage and applies it.
 */
function loadMuteState(){
    let savedMuteState = localStorage.getItem('mute');
    if (savedMuteState === 'true') {
        AudioManager.isMuted = true;
    } else {
        AudioManager.isMuted = false;
    }
    SfxManager.syncMuteState();
    const soundButton = document.getElementById("sound_button");
    if (soundButton) {
        setUpCorrectSoundIcon(soundButton);
    }
}

/**
 * Updates the sound button icon based on mute state.
 * 
 * @param {HTMLImageElement} soundButton
 */
function setUpCorrectSoundIcon(soundButton){
    if (AudioManager.isMuted) {
        soundButton.src = "img/10_menu_elements/mute_button.png";
    } else {
        soundButton.src = "img/10_menu_elements/sound_button.png";
    }
}

/**
 * Starts audio once after first user interaction.
 * 
 * @param {Event} event
 */
function startAudioOnce(event) {
    if (audioStarted) return;

    const clickedStartButton = event?.target?.id === "startGameButton";
    const clickedSoundButton = event?.target?.id === "sound_button";

    if (clickedSoundButton) return;

    audioStarted = true;
    
    if (!clickedStartButton) {
        AudioManager.playMenu();
    }

    window.removeEventListener("keydown", startAudioOnce);
    window.removeEventListener("click", startAudioOnce);
}