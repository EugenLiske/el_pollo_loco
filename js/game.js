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
    if(event.key === "ArrowUp"){
        keyboard.UP = true
    }

    if(event.key === "ArrowDown"){
        keyboard.DOWN = true
    }

    if(event.key === "ArrowLeft"){
        keyboard.LEFT = true
    }

    if(event.key === "ArrowRight"){
        keyboard.RIGHT = true
    }

    if(event.key === " "){
        keyboard.SPACE = true
    }

    if(event.key === "d"){
        if (world.character.isDead()){
            return
        }
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (event) => {
    if(event.key === "ArrowUp"){
        keyboard.UP = false
    }

    if(event.key === "ArrowDown"){
        keyboard.DOWN = false
    }

    if(event.key === "ArrowLeft"){
        keyboard.LEFT = false
    }

    if(event.key === "ArrowRight"){
        keyboard.RIGHT = false
    }

    if(event.key === " "){
        keyboard.SPACE = false
    }

    if(event.key === "d"){
        keyboard.D = false;
    }
});