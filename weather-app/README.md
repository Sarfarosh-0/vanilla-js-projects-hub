# Weather App

A dynamic weather dashboard fetching current conditions, forecasts, and city comparisons using the OpenWeatherMap API.

## What it does
- Searches current weather data for any global city.
- Displays temperatures, humidity, wind speed, visibility, and atmospheric conditions.
- Renders an hourly forecast timeline.
- Changes background imagery dynamically according to active weather conditions (Rain, Snow, Clouds, etc.).
- Displays quick-glance weather cards for featured international cities.

## How to use
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api).
2. Open `JS/script.js` and set your key in `const API_KEY = "YOUR_API_KEY_HERE";`.
3. Open `index.html` in your browser.
4. Type any city name into the search bar and click Search or hit Enter.

## API key note
> **Important:** This project requires a free API key from OpenWeatherMap. For security reasons, never commit your personal API key to version control. Keep `const API_KEY = "YOUR_API_KEY_HERE";` as a placeholder before committing.

## Concepts practiced
- Asynchronous JavaScript (`fetch`, `async/await`, `Promise.all`)
- Consuming external REST APIs and parsing JSON responses
- Dynamic image and theme switching based on API data
- Error handling and HTTP status checking

## What I learned
I learned how to manage asynchronous API pipelines, gracefully handle failed network requests or invalid search queries, and dynamically map API weather codes to corresponding background assets.

## Credits
Built by [Sarfarosh-0](https://github.com/Sarfarosh-0).
Weather data powered by [OpenWeatherMap](https://openweathermap.org/).
