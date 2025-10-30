let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    

    console.log('My character is', world.character); 
}

window.addEventListener("keydown", (event) => {
    if(event.key === "ArrowUp"){
        keyboard.UP = true
        console.log(keyboard.UP);
    }

    if(event.key === "ArrowDown"){
        keyboard.DOWN = true
        console.log(keyboard.DOWN);
    }

    if(event.key === "ArrowLeft"){
        keyboard.LEFT = true
        console.log(keyboard.LEFT);
    }

    if(event.key === "ArrowRight"){
        keyboard.RIGHT = true
        console.log(keyboard.RIGHT);
    }

    if(event.key === " "){
        keyboard.SPACE = true
        console.log(keyboard.SPACE);
    }

    console.log(`Taste: "${event.key}"`);
});

window.addEventListener("keyup", (event) => {
    if(event.key === "ArrowUp"){
        keyboard.UP = false
        console.log(keyboard.UP);
    }

    if(event.key === "ArrowDown"){
        keyboard.DOWN = false
        console.log(keyboard.DOWN);
    }

    if(event.key === "ArrowLeft"){
        keyboard.LEFT = false
        console.log(keyboard.LEFT);
    }

    if(event.key === "ArrowRight"){
        keyboard.RIGHT = false
        console.log(keyboard.RIGHT);
    }

    if(event.key === " "){
        keyboard.SPACE = false
        console.log(keyboard.SPACE);
    }

    console.log(`Taste: "${event.key}"`);
});