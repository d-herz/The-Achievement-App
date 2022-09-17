// ----------------------------------------
// Functions
function revealErrors() {
    const error = document.querySelector('.error')
    if (error) {
        // There could be multiple errors to show, but it's only the parent element that is hidden,
        // thus all children error elements will be revealed with this toggle.
        error.parentElement.classList.toggle('hidden')
    }
}

// ----------------------------------------
// Start here!
window.onload = () => {
    revealErrors()
}
