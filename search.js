// Search Engine list
let searchEngines = [
    { value: 'google', name: 'Google', searchUrl: 'https://www.google.com/search?q=', favicon: 'https://www.google.com/favicon.ico' },
    { value: 'bing', name: 'Bing', searchUrl: 'https://www.bing.com/search?q=', favicon: 'https://www.bing.com/favicon.ico' },
    { value: 'duckduckgo', name: 'DuckDuckGo', searchUrl: 'https://www.duckduckgo.com/?q=', favicon: 'https://www.duckduckgo.com/favicon.ico' },
    { value: 'perplexity', name: 'Perplexity', searchUrl: 'https://www.perplexity.ai/search?q=', favicon: 'https://www.perplexity.ai/favicon.ico' },
    { value: 'consensus', name: 'Consensus', searchUrl: 'https://www.consensus.app/results/?q=', favicon: 'https://www.consensus.app/favicon.png' }
];
let currentSelectionIndex = 0;

// Function to perform the search
function performSearch() {
    var query = document.getElementById('search-input').value;
    var searchEngine = document.getElementById('selected-engine').getAttribute('data-value');
    var searchURL = searchEngines.find(engine => engine.value === searchEngine).searchUrl;

    if (isValidUrl(query)) {
        // If the input is a valid URL, open it directly
        window.location.href = 'https://' + query;
    } else {
        // If the input is not a valid URL, perform a search
        searchURL += query;
        window.location.href = searchURL;
    }
}

// Utility function to check if the input is a valid URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        // If input is not a complete URL, try prepending "http://" to see if it forms a valid URL
        try {
            new URL("https://" + string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

function handleOptionClick() {
    let value = this.getAttribute('data-value'); // Assuming each option has a data-value attribute
    currentSelectionIndex = searchEngines.findIndex(engine => engine.value === value);
    browser.storage.local.set({ defaultSearchEngine: value });
    document.querySelector('.options-container').style.display = 'none';
    updateDisplayedSelection();
}

function updateDisplayedSelection() {
    // Assuming you have a function to update the UI based on the current selection
    let selectedEngine = searchEngines[currentSelectionIndex];
    // Add the favicon to the selected engine as well as the name in two separate elements
    document.getElementById('selected-engine-favicon').src = selectedEngine.favicon;
    document.getElementById('selected-engine-favicon').alt = selectedEngine.name;
    document.getElementById('selected-engine-name').innerHTML = selectedEngine.name;
    document.getElementById('selected-engine').setAttribute('data-value', selectedEngine.value);

    // If you're using browser.storage to remember the user's choice:
    browser.storage.local.set({ defaultSearchEngine: selectedEngine.value });
}

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
        optionsContainer.appendChild(option);
    });
}

// Handle the page load
document.addEventListener('DOMContentLoaded', function () {
    // Populate the options container with the search engines
    populateEngineOptions();

    // Get the default search engine from storage
    browser.storage.local.get('defaultSearchEngine', function (data) {
        if (data.defaultSearchEngine) {
            // Update the current selection index
            currentSelectionIndex = searchEngines.findIndex(engine => engine.value === data.defaultSearchEngine);

            // Update the UI to reflect the stored selection
            document.querySelectorAll('.option').forEach(option => {
                if (option.getAttribute('data-value') === data.defaultSearchEngine) {
                    let selectedText = option.innerHTML;
                    document.getElementById('selected-engine').innerHTML = selectedText;
                    document.getElementById('selected-engine').setAttribute('data-value', data.defaultSearchEngine);
                }
            });
        }
    });

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
        document.querySelector('.options-container').style.display = 'block';
    });

    // Add event listeners to all options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', handleOptionClick);
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
            updateDisplayedSelection();
        }
    });

    // Set the background image directly using the Unsplash source URL
    document.body.style.backgroundImage = "url('https://source.unsplash.com/random/2160x1440?mountains')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

});