let body = document.querySelector('body'),langs = [{id : 'en', name: "english"},{id:'fr', name: 'french'},{id :'rw', name: 'kinyarwanda'}],bttnsDiv = document.createElement('div')
body.appendChild(bttnsDiv)
bttnsDiv.className = `p-a w-a h-a t-0`
for (const language of langs) {
    let translateButton = document.createElement('button')
    bttnsDiv.appendChild(translateButton)
    translateButton.className = `btn btn-primary btn-sm t-0 capitalize trbutton`
    translateButton.innerText = language.name
    translateButton.setAttribute('data-lang-code',language.id)
}
const translateButtons = Array.from(document.querySelectorAll('button.trbutton'))
translateButtons.forEach(button=>{
    button.onclick = function (event) {
        event.preventDefault();
        translatePage(this.getAttribute('data-lang-code'))
    }
})
function isGoogleTranslateApiLoaded() {
    return typeof google !== 'undefined' && typeof google.translate !== 'undefined';
}

// Function to initialize Google Translate
function initializeGoogleTranslate() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}

// Function to trigger page translation
function translatePage(lang) {
    // Check if the Google Translate API is loaded
    if (isGoogleTranslateApiLoaded()) {
        // Get the selected language code from the dropdown menu
        var targetLanguage = 'fr';

        // Translate the entire page to the selected language
        google.translate.pageLanguage = 'en'; // Set the source language
        google.translate.translatePage('auto', targetLanguage);
    } else {
        // If API is not loaded, initialize it and try again
        initializeGoogleTranslate();
        setTimeout(translatePage, 500); // Retry after a short delay
    }
}

// Check if the API is loaded on page load
if (!isGoogleTranslateApiLoaded()) {
    // If not loaded, initialize it
    initializeGoogleTranslate();
}