let canvas;
let world;
let keyboard = new Keyboard();
let intervalIDs = [];
let audioStarted = false;


/* =======================
   INIT
======================= */

function init(){
    canvas = document.getElementById('canvas');
    initTouchControls();
    loadMuteState();
    disableContextMenuOnMobile(); 
}


/* =======================
   INTERVAL MANAGEMENT
======================= */

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


/* =======================
   GAME LIFECYCLE
======================= */

function startGame(){
    document.body.classList.add('game_started');
    AudioManager.playGame();
    prepareButtonsForGame();
    initLevel();
    world = new World(canvas, keyboard);
    document.getElementById('startScreen').classList.add('hidden');
}

function goBackToMainMenu(){
    document.body.classList.remove('game_started');
    SfxManager.stop(SfxManager.sleep);
    stopGame();
    AudioManager.playMenu();
    cleanEndingScreen();
    prepareButtonsForMenu();
    document.getElementById('startScreen').classList.remove('hidden');
}

function restartGame(){
    stopGame();
    AudioManager.playGame();
    cleanEndingScreen();
    initLevel();
    world = new World(canvas, keyboard);
}

function cleanEndingScreen(){
    let losingScreen = document.querySelector('.losing_screen');
    losingScreen.classList.add('hidden');

    let winningScreen = document.querySelector('.winning_screen');
    winningScreen.classList.add('hidden');
}

function prepareButtonsForGame(){
    let dialogButtonContainer = document.querySelector('.button_container');
    dialogButtonContainer.classList.add('invisible');

    let ingameButtons = document.querySelectorAll('#home_button, #replay_button');
    ingameButtons.forEach(button => {
        button.classList.remove('is_disabled');
    });
}

function prepareButtonsForMenu(){
    let dialogButtonContainer = document.querySelector('.button_container');
    dialogButtonContainer.classList.remove('invisible');

    let ingameButtons = document.querySelectorAll('#home_button, #replay_button');
    ingameButtons.forEach(button => {
        button.classList.add('is_disabled');
    });
}

/* =======================
   AUDIO
======================= */

function toggleSounds(){
    AudioManager.toggleMute();
    SfxManager.syncMuteState();

    localStorage.setItem('mute', AudioManager.isMuted);

    const soundButton = document.getElementById("sound_button");
    setUpCorrectSoundIcon(soundButton);
}

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

function setUpCorrectSoundIcon(soundButton){
    if (AudioManager.isMuted) {
        soundButton.src = "img/10_menu_elements/mute_button.png";
    } else {
        soundButton.src = "img/10_menu_elements/sound_button.png";
    }
}

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


/* =======================
   DIALOGS
======================= */

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


/* =======================
   KEYBOARD INPUT
======================= */

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


/* =======================
   TOUCH INPUT
======================= */

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
    bindTouchStartEvent(button, keyboardKey);
    bindTouchEndEvent(button, keyboardKey);
    bindTouchCancelEvent(button, keyboardKey)
}

function bindTouchStartEvent(button, keyboardKey){
    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        if (!world) return;
        if (world.gameEnded) return;

        if (keyboardKey === 'SPACE' && world.character.isDead()) {
            return;
        }
        button.classList.add('active');
        keyboard[keyboardKey] = true;
    }, { passive: false });
}

function bindTouchEndEvent(button, keyboardKey){
    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        button.classList.remove('active');
        keyboard[keyboardKey] = false;
    });
}

function bindTouchCancelEvent(button, keyboardKey){
    button.addEventListener('touchcancel', () => {
        button.classList.remove('active');
        keyboard[keyboardKey] = false;
    });
}


/* =======================
   FULLSCREEN
======================= */

function toggleFullscreen() {
    let gameArea = document.getElementById('canvas_wrapper');

    if (!document.fullscreenElement) {
        openFullscreen(gameArea);
    } else {
        closeFullscreen();
    }
}

function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
    const button = document.getElementById('change_screen_size_button');
    let isMobileDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isMobileDevice) return;

    if (document.fullscreenElement) {
        button.src = "img/10_menu_elements/normal_size.png";
    } else {
        button.src = "img/10_menu_elements/full_size.png";
    }
});


/* =======================
   MOBILE / UI
======================= */

function checkDeviceOrientation() {
    let turnDeviceWarning = document.getElementById('turn-device-warning');
    let changeScreenButton = document.getElementById('change_screen_size_button');

    let isMobileDevice = window.matchMedia("(pointer: coarse)").matches;
    let isPortraitMode = window.innerHeight > window.innerWidth;

    setUpCorrectDeviceProperties(isMobileDevice, changeScreenButton);
    handleMobileDeviceWarning(isMobileDevice, isPortraitMode, turnDeviceWarning);
}

function setUpCorrectDeviceProperties(isMobileDevice, changeScreenButton){
    if (isMobileDevice) {
        document.body.classList.add('mobile');
        changeScreenButton.src = "img/10_menu_elements/burger_menu_icon.png";
        changeScreenButton.onclick = toggleBurgerMenu;
  
    } else {
        document.body.classList.remove('mobile');
        changeScreenButton.src = "img/10_menu_elements/full_size.png";
        changeScreenButton.onclick = toggleFullscreen;
    }
}

function handleMobileDeviceWarning(isMobileDevice, isPortraitMode, turnDeviceWarning){
    if (isMobileDevice && isPortraitMode) {
        turnDeviceWarning.classList.remove('hidden');
    } else {
        turnDeviceWarning.classList.add('hidden');
    }
}

function toggleBurgerMenu() {
    let burgerMenu = document.getElementById('burger_menu');
    burgerMenu.classList.toggle('is_open');
}

function disableContextMenuOnMobile() {
    let isMobileDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isMobileDevice) {
        document.addEventListener('contextmenu', preventContextMenu);
    }
}

function preventContextMenu(event) {
    event.preventDefault();
}


/* =======================
   EVENT LISTENERS
======================= */

window.addEventListener("keydown", startAudioOnce);
window.addEventListener("click", startAudioOnce);

window.addEventListener('load', checkDeviceOrientation);
window.addEventListener('resize', checkDeviceOrientation);
window.addEventListener('orientationchange', checkDeviceOrientation);