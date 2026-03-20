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