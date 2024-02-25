// Function to perform the search
function performSearch() {
    console.log('Performing search');
    var query = document.getElementById('search-input').value;
    var searchEngine = document.getElementById('selected-engine').getAttribute('data-value');
    var searchURL = '';

    switch (searchEngine) {
        case 'google':
            searchURL = 'https://www.google.com/search?q=' + query;
            break;
        case 'bing':
            searchURL = 'https://www.bing.com/search?q=' + query;
            break;
        case 'duckduckgo':
            searchURL = 'https://www.duckduckgo.com/?q=' + query;
            break;
        case 'perplexity':
            searchURL = 'https://www.perplexity.ai/search?q=' + query;
            break;
        default:
            searchURL = 'https://www.google.com/search?q=' + query;
            break;
    }

    window.location.href = searchURL;
}

// Function to handle option click
function handleOptionClick() {
    let selectedText = this.innerHTML;
    document.getElementById('selected-engine').innerHTML = selectedText;
    document.getElementById('selected-engine').setAttribute('data-value', this.getAttribute('data-value'));
    document.querySelector('.options-container').style.display = 'none';
    let value = this.getAttribute('data-value'); // Assuming each option has a data-value attribute
    browser.storage.local.set({ defaultSearchEngine: value });
}

// Handle the page load
document.addEventListener('DOMContentLoaded', function () {
    
    // Get the default search engine from storage
    browser.storage.local.get('defaultSearchEngine', function (data) {
        if (data.defaultSearchEngine) {
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

    // Set the background image directly using the Unsplash source URL
    document.body.style.backgroundImage = "url('https://source.unsplash.com/random/2160x1440?mountains')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    
});