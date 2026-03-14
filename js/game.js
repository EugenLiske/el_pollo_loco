let canvas;
let world;
let keyboard = new Keyboard();
let intervalIDs = [];


function init(){
    canvas = document.getElementById('canvas');
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

function goBackToMainMenu(){
    stopGame();

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

    if (world.gameEnded) return

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