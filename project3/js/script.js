// WEATHER APP

const weatherForm =
    document.getElementById("weatherForm");


// Run weather code only on weather page
if (weatherForm) {

    weatherForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            const message =
                document.getElementById(
                    "weatherMessage"
                );


            if (city === "") {

                message.textContent =
                    "Please enter a city name.";

                return;

            }


            message.textContent =
                "Searching...";


            try {

                // Find city
                const cityResponse =
                    await fetch(
                        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
                    );


                const cityData =
                    await cityResponse.json();


                if (
                    !cityData.results ||
                    cityData.results.length === 0
                ) {

                    throw new Error(
                        "City not found."
                    );

                }


                // Destructuring
                const {
                    latitude,
                    longitude,
                    name,
                    country
                } = cityData.results[0];


                // Get weather
                const weatherResponse =
                    await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
                    );


                const weatherData =
                    await weatherResponse.json();


                const weather =
                    weatherData.current;


                // Display weather
                document.getElementById(
                    "place"
                ).textContent =
                    `${name}, ${country}`;


                document.getElementById(
                    "temp"
                ).textContent =
                    Math.round(
                        weather.temperature_2m
                    );


                document.getElementById(
                    "humidity"
                ).textContent =
                    weather.relative_humidity_2m
                    + "%";


                document.getElementById(
                    "wind"
                ).textContent =
                    Math.round(
                        weather.wind_speed_10m
                    );


                document.getElementById(
                    "feels"
                ).textContent =
                    Math.round(
                        weather.apparent_temperature
                    ) + "°C";


                document.getElementById(
                    "condition"
                ).textContent =
                    getWeatherName(
                        weather.weather_code
                    );


                message.textContent = "";


            } catch (error) {

                message.textContent =
                    error.message;

            }

        }
    );

}


// Weather code function
function getWeatherName(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code === 1 || code === 2) {
        return "🌤️ Partly Cloudy";
    }

    if (code === 3) {
        return "☁️ Cloudy";
    }

    if (
        code === 45 ||
        code === 48
    ) {
        return "🌫️ Foggy";
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return "🌧️ Rainy";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "❄️ Snowy";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "🌦️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "Weather information";
}


// MOVIE APP

const movieForm =
    document.getElementById("movieForm");


// Run movie code only on movie page
if (movieForm) {

    movieForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const movieName =
                document
                    .getElementById("movie")
                    .value
                    .trim();


            const message =
                document.getElementById(
                    "movieMessage"
                );


            const movieList =
                document.getElementById(
                    "movieList"
                );


            if (movieName === "") {

                message.textContent =
                    "Please enter a movie name.";

                return;

            }


            message.textContent =
                "Searching...";


            movieList.innerHTML = "";


            try {

                // ADD YOUR OMDb API KEY HERE

                const apiKey =
                    "YOUR_OMDB_API_KEY";


                const response =
                    await fetch(
                        `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(movieName)}`
                    );


                const data =
                    await response.json();


                if (data.Response === "False") {

                    throw new Error(
                        "Movie not found."
                    );

                }


                // Display movies
                data.Search.forEach(
                    function (movie) {

                        let poster =
                            movie.Poster;


                        if (
                            poster === "N/A"
                        ) {

                            poster =
                                "https://via.placeholder.com/300x400?text=No+Poster";

                        }


                        movieList.innerHTML += `

                            <div class="movie">

                                <img
                                    src="${poster}"
                                    alt="${movie.Title} movie poster"
                                >

                                <div class="movie-info">

                                    <h2>
                                        ${movie.Title}
                                    </h2>

                                    <p>
                                        <strong>Year:</strong>
                                        ${movie.Year}
                                    </p>

                                    <p>
                                        <strong>Type:</strong>
                                        ${movie.Type}
                                    </p>

                                </div>

                            </div>

                        `;

                    }
                );


                message.textContent = "";


            } catch (error) {

                message.textContent =
                    error.message;

            }

        }
    );

}