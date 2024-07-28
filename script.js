document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const suggestionsDiv = document.getElementById('suggestions');
    const overlay = document.getElementById('overlay');
    const detailImage = document.getElementById('detail-image');
    const detailName = document.getElementById('detail-name');
    const detailDescription = document.getElementById('detail-description');
    const closeButton = document.getElementById('close-button');
    const resetButton = document.getElementById('reset-btn');

    // Fetch data from JSON file
    async function fetchData() {
        try {
            const response = await fetch('travel_recommendation_api.json');
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Display autocomplete suggestions with images
    function displaySuggestions(results) {
        suggestionsDiv.innerHTML = '';
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';

            const img = document.createElement('img');
            img.src = result.imageUrl;
            img.alt = result.name;

            const text = document.createElement('span');
            text.textContent = result.name;

            div.appendChild(img);
            div.appendChild(text);

            div.addEventListener('click', () => {
                searchInput.value = result.name;
                suggestionsDiv.classList.add('hidden');
                displayOverlay(result);
            });

            suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.classList.remove('hidden');
    }

    // Display detailed information in overlay
    function displayOverlay(result) {
        detailImage.src = result.imageUrl;
        detailImage.alt = result.name;
        detailName.textContent = result.name;
        detailDescription.textContent = result.description;
        overlay.classList.add('active');
    }

    // Handle input and show suggestions
    async function handleInput() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            suggestionsDiv.classList.add('hidden');
            return;
        }

        const data = await fetchData();
        let results = [];

        if (query.startsWith('tem')) {
            results = data.temples;
        } else if (query.startsWith('bea')) {
            results = data.beaches;
        } else if (query.startsWith('cou')) {
            data.countries.forEach(country => {
                results.push(...country.cities);
            });
        } else {
            // Check for matches in countries
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        results.push(city);
                    }
                });
            });

            // Check for matches in temples
            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(query)) {
                    results.push(temple);
                }
            });

            // Check for matches in beaches
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(query)) {
                    results.push(beach);
                }
            });
        }

        // Display results
        if (results.length > 0) {
            displaySuggestions(results);
        } else {
            suggestionsDiv.innerHTML = '<p class="text-gray-500 p-2">No results found.</p>';
            suggestionsDiv.classList.remove('hidden');
            
        }
    }

    // Handle search icon click and show overlay
    async function handleSearchIconClick() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            return;
        }

        const data = await fetchData();
        const results = [];

        // Check for matches in countries
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)) {
                    results.push(city);
                }
            });
        });

        // Check for matches in temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(query)) {
                results.push(temple);
            }
        });

        // Check for matches in beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(query)) {
                results.push(beach);
            }
        });

        // Display overlay with first matching result
        if (results.length > 0) {
            displayOverlay(results[0]);
        }
    }

    // Add event listeners
    searchInput.addEventListener('input', handleInput);
    searchIcon.addEventListener('click', handleSearchIconClick);

    // Hide suggestions when clicking outside
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !suggestionsDiv.contains(event.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });

    // Hide overlay when clicking outside of overlay content
    overlay.addEventListener('click', (event) => {
        if (!event.target.closest('.overlay-content')) {
            overlay.classList.remove('active');
        }
    });
    closeButton.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
    resetButton.addEventListener('click', () => {
        searchInput.value = "";
        suggestionsDiv.classList.add('hidden'); // Optionally hide the suggestions
    });
    
});
