let canvas;
let world;
let keyboard = new Keyboard();
let intervalIDs = [];
let audioStarted = false;


/* =======================
   INIT
======================= */

/**
 * Initializes the game, sets up canvas, controls and audio state.
 */
function init(){
    canvas = document.getElementById('canvas');
    initTouchControls();
    loadMuteState();
    disableContextMenuOnMobile(); 
}


/* =======================
   INTERVAL MANAGEMENT
======================= */

/**
 * Starts an interval and stores its ID for later cleanup.
 * 
 * @param {Function} fn - The function to execute.
 * @param {number} time - Interval time in milliseconds.
 */
function startIntervalAndSaveID(fn, time){
    let intervalID = setInterval(fn, time);
    intervalIDs.push(intervalID);
}

/**
 * Stops all intervals and rendering.
 */
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

/**
 * Starts the game and initializes world and UI.
 */
function startGame(){
    document.body.classList.add('game_started');
    AudioManager.playGame();
    prepareButtonsForGame();
    initLevel();
    world = new World(canvas, keyboard);
    document.getElementById('startScreen').classList.add('hidden');
}

/**
 * Returns to the main menu and resets the game state.
 */
function goBackToMainMenu(){
    document.body.classList.remove('game_started');
    SfxManager.stop(SfxManager.sleep);
    stopGame();
    AudioManager.playMenu();
    cleanEndingScreen();
    prepareButtonsForMenu();
    document.getElementById('startScreen').classList.remove('hidden');
}

/**
 * Restarts the game from scratch.
 */
function restartGame(){
    stopGame();
    AudioManager.playGame();
    cleanEndingScreen();
    initLevel();
    world = new World(canvas, keyboard);
}

/**
 * Hides win and lose screens.
 */
function cleanEndingScreen(){
    let losingScreen = document.querySelector('.losing_screen');
    losingScreen.classList.add('hidden');

    let winningScreen = document.querySelector('.winning_screen');
    winningScreen.classList.add('hidden');
}

/**
 * Prepares UI buttons for gameplay.
 */
function prepareButtonsForGame(){
    let dialogButtonContainer = document.querySelector('.button_container');
    dialogButtonContainer.classList.add('invisible');

    let ingameButtons = document.querySelectorAll('#home_button, #replay_button');
    ingameButtons.forEach(button => {
        button.classList.remove('is_disabled');
    });
}

/**
 * Prepares UI buttons for the main menu.
 */
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


/* =======================
   DIALOGS
======================= */

/**
 * Opens a dialog by ID.
 * 
 * @param {string} menuReference
 */
function openDialog(menuReference){
    let dialogRef = document.getElementById(menuReference);
    dialogRef.showModal();
}

/**
 * Closes a dialog by ID.
 * 
 * @param {string} menuReference
 */
function closeDialog(menuReference){
    let dialogRef = document.getElementById(menuReference);
    dialogRef.close();
}

/**
 * Closes dialog when clicking outside.
 * 
 * @param {MouseEvent} event
 */
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

/**
 * Handles keydown events for character control.
 */
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

/**
 * Handles keyup events for character control.
 */
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

/**
 * Initializes touch controls for mobile devices.
 */
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

/**
 * Binds touch events to a button.
 */
function bindTouchButton(button, keyboardKey) {
    if (!button) return;
    bindTouchStartEvent(button, keyboardKey);
    bindTouchEndEvent(button, keyboardKey);
    bindTouchCancelEvent(button, keyboardKey)
}

/**
 * Handles touchstart event.
 */
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

/**
 * Handles touchend event.
 */
function bindTouchEndEvent(button, keyboardKey){
    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        button.classList.remove('active');
        keyboard[keyboardKey] = false;
    });
}

/**
 * Handles touchcancel event.
 */
function bindTouchCancelEvent(button, keyboardKey){
    button.addEventListener('touchcancel', () => {
        button.classList.remove('active');
        keyboard[keyboardKey] = false;
    });
}


/* =======================
   FULLSCREEN
======================= */

/**
 * Toggles fullscreen mode.
 */
function toggleFullscreen() {
    let gameArea = document.getElementById('canvas_wrapper');

    if (!document.fullscreenElement) {
        openFullscreen(gameArea);
    } else {
        closeFullscreen();
    }
}

/**
 * Opens fullscreen mode.
 * 
 * @param {HTMLElement} element
 */
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

/**
 * Closes fullscreen mode.
 */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * Updates fullscreen button icon based on state.
 */
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

/**
 * Checks device orientation and updates UI accordingly.
 */
function checkDeviceOrientation() {
    let turnDeviceWarning = document.getElementById('turn-device-warning');
    let changeScreenButton = document.getElementById('change_screen_size_button');

    let isMobileDevice = window.matchMedia("(pointer: coarse)").matches;
    let isPortraitMode = window.innerHeight > window.innerWidth;

    setUpCorrectDeviceProperties(isMobileDevice, changeScreenButton);
    handleMobileDeviceWarning(isMobileDevice, isPortraitMode, turnDeviceWarning);
}

/**
 * Adjusts UI based on device type.
 */
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

/**
 * Shows or hides orientation warning on mobile devices.
 */
function handleMobileDeviceWarning(isMobileDevice, isPortraitMode, turnDeviceWarning){
    if (isMobileDevice && isPortraitMode) {
        turnDeviceWarning.classList.remove('hidden');
    } else {
        turnDeviceWarning.classList.add('hidden');
    }
}

/**
 * Toggles the burger menu visibility.
 */
function toggleBurgerMenu() {
    let burgerMenu = document.getElementById('burger_menu');
    burgerMenu.classList.toggle('is_open');
}

/**
 * Disables context menu on mobile devices.
 */
function disableContextMenuOnMobile() {
    let isMobileDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isMobileDevice) {
        document.addEventListener('contextmenu', preventContextMenu);
    }
}

/**
 * Prevents default context menu.
 * 
 * @param {Event} event
 */
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