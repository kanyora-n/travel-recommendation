// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchBtn');
    const clearButton = document.getElementById('clearBtn');
    const resultsContainer = document.getElementById('searchResults');

    // Fetch data from JSON file
    let travelData = {};

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            travelData = data;
        })
        .catch(error => {
            console.error('Error fetching travel data:', error);
            resultsContainer.innerHTML = `<p>Error loading travel data.</p>`;
        });

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase().trim(); // Convert input to lowercase and trim whitespace
        if (query) {
            performSearch(query);
        } else {
            resultsContainer.innerHTML = `<p>Please enter a search term.</p>`;
        }
    });

    // Event listener for clear button
    clearButton.addEventListener('click', () => {
        searchInput.value = ''; // Clear input
        resultsContainer.innerHTML = ''; // Clear search results
    });

    // Function to perform search
    function performSearch(query) {
        let resultsFound = false;
        resultsContainer.innerHTML = ''; // Clear previous results

        // Check if the query matches a specific category
        if (query === 'beach' || query === 'beaches') {
            searchInBeaches();
            resultsFound = true;
        } else if (query === 'temple' || query === 'temples') {
            searchInTemples();
            resultsFound = true;
        } else if (query === 'country' || query === 'countries') {
            searchInCountries();
            resultsFound = true;
        } else {
            // Search in beaches, temples, and countries for other queries
            searchInCategory('temples', query);
            searchInCountries(query);
            searchInBeaches(query);
        }

        if (!resultsFound) {
            resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
        }
    }

    // Function to search and display all beaches
    function searchInBeaches() {
        const beachesData = travelData.beaches;
        if (beachesData && beachesData.length > 0) {
            beachesData.forEach(beach => {
                displayResult(beach.name, beach.imageUrl, beach.description);
            });
        }
    }

    // Function to search and display all temples
    function searchInTemples() {
        const templesData = travelData.temples;
        if (templesData && templesData.length > 0) {
            templesData.forEach(temple => {
                displayResult(temple.name, temple.imageUrl, temple.description);
            });
        }
    }

    // Function to search and display all countries
    function searchInCountries() {
        const countriesData = travelData.countries;
        if (countriesData && countriesData.length > 0) {
            countriesData.forEach(country => {
                displayCountryResult(country);
            });
        }
    }

    // Function to search within a single category (temples)
    function searchInCategory(category, query) {
        const categoryData = travelData[category];
        if (categoryData && categoryData.length > 0) {
            categoryData.forEach(item => {
                if (item.name.toLowerCase().includes(query)) {
                    displayResult(item.name, item.imageUrl, item.description);
                    resultsFound = true;
                }
            });
        }
    }

    // Function to search within countries and their cities
    function searchInCountries(query) {
        const countriesData = travelData.countries;
        if (countriesData && countriesData.length > 0) {
            countriesData.forEach(country => {
                if (country.name.toLowerCase().includes(query)) {
                    displayCountryResult(country);
                    resultsFound = true;
                }
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        displayResult(city.name, city.imageUrl, city.description);
                        resultsFound = true;
                    }
                });
            });
        }
    }

    // Function to display a single result
    function displayResult(name, imageUrl, description) {
        const resultHTML = `
            <div class="result-item">
                <h3>${name}</h3>
                <img src="${imageUrl}" alt="${name}">
                <p>${description}</p>
            </div>
        `;
        resultsContainer.innerHTML += resultHTML;
    }

    // Function to display country and its cities
    function displayCountryResult(country) {
        const countryHTML = `
            <div class="result-item">
                <h3>${country.name}</h3>
            </div>
        `;
        resultsContainer.innerHTML += countryHTML;

        country.cities.forEach(city => {
            displayResult(city.name, city.imageUrl, city.description);
        });
    }
});
