// Search Engine list
let searchEngines = [];
let currentSelectionIndex = 0;
let lastTime = '';

// Function to perform the search
function performSearch() {
    var query = document.getElementById('search-input').value;
    let selectedEngine = searchEngines[currentSelectionIndex];
    searchURL = selectedEngine.searchUrl;

    if (isValidUrl(query)) {
        // If the input is a valid URL, open it directly
        window.location.href = 'https://' + query;
    } else {
        // If the input is not a valid URL, perform a search
        searchURL += query;
        // If the the selectedEngine has a searchUrlSuffix parameter, append it to the searchURL
        if (selectedEngine.searchUrlSuffix) {
            searchURL += selectedEngine.searchUrlSuffix;
        }
        // window.location.href = searchURL;
    }
}

// Utility function to check if the input is a valid URL
function isValidUrl(string) {
    if (!string.includes('.')) {
        // Most URLs will contain a dot, this excludes simple words without a dot
        return false;
    }

    try {
        const url = new URL(string);
        // Additional check to ensure the URL has a protocol
        return ['http:', 'https:'].includes(url.protocol);
    } catch (_) {
        // Check if prepending "https://" makes it a valid URL
        try {
            const url = new URL("https://" + string);
            // Further check to ensure it doesn't just accept anything with a dot
            return url.hostname.includes('.') && url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
}


// Function to handle the click event on an option
function handleOptionClick() {
    let value = this.getAttribute('data-value'); // Assuming each option has a data-value attribute
    currentSelectionIndex = searchEngines.findIndex(engine => engine.value === value);
    browser.storage.local.set({ defaultSearchEngine: value });
    document.querySelector('.options-container').style.display = 'none';
    updateDisplayedSelection(currentSelectionIndex);
}

// Function to update the displayed selection based on the current selection index
function updateDisplayedSelection(defaultEngineIndex) {
    // Assuming you have a function to update the UI based on the current selection
    let selectedEngine = searchEngines[defaultEngineIndex];
    // Add the favicon to the selected engine as well as the name in two separate elements
    document.getElementById('selected-engine-favicon').src = selectedEngine.favicon;
    document.getElementById('selected-engine-favicon').alt = selectedEngine.name;
    document.getElementById('selected-engine-name').innerHTML = selectedEngine.name;
    document.getElementById('selected-engine').setAttribute('data-value', selectedEngine.value);

    // If you're using browser.storage to remember the user's choice:
    browser.storage.local.set({ defaultSearchEngine: selectedEngine.value });
}

// Function to populate the options container with the search engines
function populateEngineOptions() {
    // Function to populate the options container with the options from the engine list
    let optionsContainer = document.querySelector('.options-container');
    searchEngines.forEach(engine => {
        let option = document.createElement('div');
        option.className = 'option';
        option.setAttribute('data-value', engine.value);

        let favicon = document.createElement('img');
        favicon.src = engine.favicon;
        favicon.alt = engine.name;
        favicon.id = 'selected-engine-favicon';
        option.appendChild(favicon);

        let name = document.createElement('span');
        name.id = 'selected-engine-name';
        name.innerHTML = engine.name;
        option.appendChild(name);

        option.addEventListener('click', handleOptionClick);
        optionsContainer.appendChild(option);
    });
}

// Function to load search engines from the JSON file
async function initializeExtension() {
    try {
        const response = await fetch('searchEngines.json');
        const data = await response.json();
        searchEngines = data;
        populateEngineOptions(); // Populate the options UI

        // Now correctly await getting the default search engine
        const defaultEngineIndex = await getDefaultSearchEngine();

        // Assuming updateDisplayedSelection can work with just the index
        updateDisplayedSelection(defaultEngineIndex);
    } catch (error) {
        console.error('Failed to load search engines:', error);
    }
}

// Function to get the default search engine from storage
async function getDefaultSearchEngine() {
    // Using the promise-based approach of browser.storage API
    const data = await browser.storage.local.get('defaultSearchEngine');
    if (data.defaultSearchEngine) {
        // Update the current selection index based on storage
        const index = searchEngines.findIndex(engine => engine.value === data.defaultSearchEngine);
        return index >= 0 ? index : 0; // Ensure a valid index is returned or default to 0
    } else {
        return 0; // Default to the first engine if none is set
    }
}


function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let time = `${hours}:${minutes}`;
    if (time !== lastTime) {
        lastTime = time;
        document.getElementById('clock').textContent = time;
    }
}

// Handle the page load
document.addEventListener('DOMContentLoaded', function () {
    // Update the clock every minute
    updateClock();
    setInterval(updateClock, 1000);

    // Load the search engines from the JSON file
    initializeExtension();

    // Focus on the search input field when the page loads
    var searchInput = document.getElementById('search-input');
    setTimeout(function () {
        searchInput.focus();
    }, 100);

    // Event listener for the search button
    document.getElementById('search-btn').addEventListener('click', performSearch);

    // Event listener for pressing the Enter key in the search input field
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Handle the search engine dropdown
    document.getElementById('selected-engine').addEventListener('click', function () {
        if (document.querySelector('.options-container').style.display === 'block') {
            document.querySelector('.options-container').style.display = 'none';
        } else {
            document.querySelector('.options-container').style.display = 'block';
        }
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!document.getElementById('search-engine-dropdown').contains(e.target)) {
            document.querySelector('.options-container').style.display = 'none';
        }
    });

    // Function to change the search engine with hotkeys
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault(); // Prevent default action to avoid scrolling the page

            // Determine the direction and update the current selection index
            if (e.key === 'ArrowUp') {
                // Move up in the list
                currentSelectionIndex = (currentSelectionIndex - 1 + searchEngines.length) % searchEngines.length;
            } else {
                // Move down in the list
                currentSelectionIndex = (currentSelectionIndex + 1) % searchEngines.length;
            }

            // Update the displayed selection based on the new index
            updateDisplayedSelection(currentSelectionIndex);
        }
    });

    // Set the background image directly using the Unsplash source URL
    document.body.style.backgroundImage = "url('https://source.unsplash.com/random/2160x1440?mountains')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

});