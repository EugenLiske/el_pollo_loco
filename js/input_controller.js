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