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