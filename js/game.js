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
   EVENT LISTENERS
======================= */

window.addEventListener("keydown", startAudioOnce);
window.addEventListener("click", startAudioOnce);

window.addEventListener('load', checkDeviceOrientation);
window.addEventListener('resize', checkDeviceOrientation);
window.addEventListener('orientationchange', checkDeviceOrientation);