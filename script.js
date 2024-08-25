document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('locationInput').value;
    console.log(`Fetching weather data for: ${city}`); // Debugging line
    fetchWeatherData(city);
});

document.getElementById('sort-options').addEventListener('change', function() {
    sortForecast(this.value);
});

document.getElementById('filter-options').addEventListener('change', function() {
    filterForecast(this.value);
});

let forecastData = [];

async function fetchWeatherData(city) {
    const apiKey = '61ad039c650d490a9ba53215241905'; // Replace with your actual API key
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('API Response:', data); // Debugging line

        if (response.ok) {
            forecastData = data.forecast.forecastday;
            displayWeather(data);
            displayForecast(forecastData);
        } else {
            displayError(data.error.message);
        }
    } catch (error) {
        console.error('Fetch Error:', error); // Debugging line
        displayError('Unable to fetch weather data.');
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherContainer');
    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${data.location.name}, ${data.location.country}</h2>
            <p>Temperature: ${data.current.temp_c}°C</p>
            <p>Condition: ${data.current.condition.text}</p>
            <img src="${data.current.condition.icon}" alt="Weather icon">
        </div>
    `;
}

function displayForecast(forecast) {
    const forecastDisplay = document.createElement('div');
    forecastDisplay.classList.add('forecast-info');
    forecastDisplay.id = 'forecast-info';

    forecast.forEach(day => {
        const date = new Date(day.date).toLocaleDateString();
        forecastDisplay.innerHTML += `
            <div class="forecast-day">
                <h3>${date}</h3>
                <p>Max Temp: ${day.day.maxtemp_c}°C</p>
                <p>Min Temp: ${day.day.mintemp_c}°C</p>
                <p>Avg Temp: ${day.day.avgtemp_c}°C</p>
                <p>Condition: ${day.day.condition.text}</p>
                <img src="${day.day.condition.icon}" alt="Weather icon">
                <p>Wind Speed: ${day.day.maxwind_kph} kph</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
                <p>Precipitation: ${day.day.totalprecip_mm} mm</p>
            </div>
        `;
    });

    const weatherDisplay = document.getElementById('weatherContainer');
    weatherDisplay.innerHTML = '';
    weatherDisplay.appendChild(forecastDisplay);
}

function sortForecast(option) {
    let sortedForecast = [...forecastData];

    if (option === 'temp-high-low') {
        sortedForecast.sort((a, b) => b.day.maxtemp_c - a.day.maxtemp_c);
    } else if (option === 'temp-low-high') {
        sortedForecast.sort((a, b) => a.day.maxtemp_c - b.day.maxtemp_c);
    }

    displayForecast(sortedForecast);
}

function filterForecast(condition) {
    let filteredForecast = forecastData;

    if (condition !== 'all') {
        filteredForecast = forecastData.filter(day => day.day.condition.text.toLowerCase().includes(condition.toLowerCase()));
    }

    displayForecast(filteredForecast);
}

function displayError(message) {
    const weatherDisplay = document.getElementById('weatherContainer');
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
}
