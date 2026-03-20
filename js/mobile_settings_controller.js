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