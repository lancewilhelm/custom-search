document.addEventListener('DOMContentLoaded', function() {
    // Focus on the search input field when the page loads
    var searchInput = document.getElementById('search-input');
    searchInput.focus();

    // Event listener for the search button
    document.getElementById('search-btn').addEventListener('click', function() {
        performSearch();
    });

    // Event listener for pressing the Enter key in the search input field
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Set the background image directly using the Unsplash source URL
    document.body.style.backgroundImage = "url('https://source.unsplash.com/random/2160x1440?mountains')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    // Function to perform the search
    function performSearch() {
        var query = searchInput.value;
        var engine = document.getElementById('search-engine').value;
        var url = '';
    
        switch (engine) {
            case 'google':
                url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                break;
            case 'bing':
                url = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
                break;
            case 'duckduckgo':
                url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
                break;
            case 'perplexity':
                url = 'https://perplexity.ai/search?q=' + encodeURIComponent(query);
                break;
            default:
                url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        }
    
        window.location.href = url;
    }
    
});