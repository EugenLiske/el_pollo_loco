let canvas;
let world;
let keyboard = new Keyboard();
let intervalIDs = [];
let audioStarted = false;


function init(){
    canvas = document.getElementById('canvas');
    initTouchControls();
}


function startIntervalAndSaveID(fn, time){
    let intervalID = setInterval(fn, time);
    intervalIDs.push(intervalID);
}


function stopGame(){
    intervalIDs.forEach(singleInterval => {
        clearInterval(singleInterval)
    });
    intervalIDs = [];

    if (world) {
        world.stopDrawing();
    }
}


function startGame(){
    document.body.classList.add('game_started');
    AudioManager.playGame();
    let dialogButtonContainer = document.querySelector('.button_container');
    dialogButtonContainer.classList.add('invisible');
 

    let ingameButtons = document.querySelectorAll('#home_button, #replay_button');
    ingameButtons.forEach(button => {
        button.classList.remove('is_disabled');
    });

    initLevel();
    world = new World(canvas, keyboard);
    document.getElementById('startScreen').classList.add('hidden');
}


function toggleSounds(){
    AudioManager.toggleMute();
    SfxManager.syncMuteState();
    const soundButton = document.getElementById("sound_button");

    if (AudioManager.isMuted) {
        soundButton.src = "img/10_menu_elements/mute_button.png";
    } else {
        soundButton.src = "img/10_menu_elements/sound_button.png";
    }
}


function goBackToMainMenu(){
    document.body.classList.remove('game_started');
    SfxManager.stop(SfxManager.sleep);
    stopGame();
    AudioManager.playMenu();

    let losingScreen = document.querySelector('.losing_screen');
    losingScreen.classList.add('hidden');

    let winningScreen = document.querySelector('.winning_screen');
    winningScreen.classList.add('hidden');

    let dialogButtonContainer = document.querySelector('.button_container');
    dialogButtonContainer.classList.remove('invisible');

    let ingameButtons = document.querySelectorAll('#home_button, #replay_button');
    ingameButtons.forEach(button => {
        button.classList.add('is_disabled');
    });

    document.getElementById('startScreen').classList.remove('hidden');
}

function restartGame(){
    stopGame();
    AudioManager.playGame();
    let losingScreen = document.querySelector('.losing_screen');
    losingScreen.classList.add('hidden');
    let winningScreen = document.querySelector('.winning_screen');
    winningScreen.classList.add('hidden');
    initLevel();
    world = new World(canvas, keyboard);
}


function openDialog(menuReference){
    let dialogRef = document.getElementById(menuReference);
    dialogRef.showModal();
}

function closeDialog(menuReference){
    let dialogRef = document.getElementById(menuReference);
    dialogRef.close();
}

function closeDialogOnOutsideClick(event) {
    const dialog = event.currentTarget;
    const rect = dialog.getBoundingClientRect();

    const clickedOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

    if (clickedOutside) {
        dialog.close();
    }
}


window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (!world) return;
    if (world.gameEnded) return;

    if(key === "w"){
        keyboard.UP = true
    }

    if(key === "a"){
        keyboard.LEFT = true
    }

    if(key === "d"){
        keyboard.RIGHT = true
    }

    if(key === " "){
        if (world.character.isDead()){
            return
        }
        keyboard.SPACE = true;
    }
});

window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if(key === "w"){
        keyboard.UP = false
    }

    if(key === "a"){
        keyboard.LEFT = false
    }

    if(key === "d"){
        keyboard.RIGHT = false
    }

    if(key === " "){
        keyboard.SPACE = false
    }
});

function initTouchControls() {
    let touchLeftButton = document.getElementById('touch-left-button');
    let touchRightButton = document.getElementById('touch-right-button');
    let touchThrowButton = document.getElementById('touch-throw-button');
    let touchJumpButton = document.getElementById('touch-jump-button');

    bindTouchButton(touchLeftButton, 'LEFT');
    bindTouchButton(touchRightButton, 'RIGHT');
    bindTouchButton(touchJumpButton, 'UP');
    bindTouchButton(touchThrowButton, 'SPACE');
}

function bindTouchButton(button, keyboardKey) {
    if (!button) return;

    button.addEventListener('touchstart', (event) => {
        event.preventDefault();

        if (!world) return;
        if (world.gameEnded) return;

        if (keyboardKey === 'SPACE' && world.character.isDead()) {
            return;
        }

        keyboard[keyboardKey] = true;
    }, { passive: false });

    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard[keyboardKey] = false;
    });

    button.addEventListener('touchcancel', () => {
        keyboard[keyboardKey] = false;
    });
}

window.addEventListener("keydown", startAudioOnce);
window.addEventListener("click", startAudioOnce);

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


function toggleFullscreen() {
    let gameArea = document.getElementById('canvas_wrapper');

    if (!document.fullscreenElement) {
        openFullscreen(gameArea);
    } else {
        closeFullscreen();
    }
}

/* View in fullscreen */
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) { /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { /* IE11 */
    element.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
    const button = document.getElementById('change_screen_size_button');

    if (document.fullscreenElement) {
        button.src = "img/10_menu_elements/normal_size.png";
    } else {
        button.src = "img/10_menu_elements/full_size.png";
    }
});


function checkDeviceOrientation() {
    let turnDeviceWarning = document.getElementById('turn-device-warning');

    let isMobileDevice = window.matchMedia("(pointer: coarse)").matches;
    let isPortraitMode = window.innerHeight > window.innerWidth;

    if (isMobileDevice) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }

    if (isMobileDevice && isPortraitMode) {
        turnDeviceWarning.classList.remove('hidden');
    } else {
        turnDeviceWarning.classList.add('hidden');
    }
}

window.addEventListener('load', checkDeviceOrientation);
window.addEventListener('resize', checkDeviceOrientation);
window.addEventListener('orientationchange', checkDeviceOrientation);