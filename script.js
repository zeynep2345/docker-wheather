async function getWeather() {
    const citiesInput = document.getElementById('city').value;
    const resultEl = document.getElementById('result');

    if (!citiesInput) {
        resultEl.textContent = "Lütfen en az bir şehir adı girin.";
        return;
    }

    // Şehirleri virgül ile ayır
    const cities = citiesInput.split(',').map(c => c.trim()).filter(c => c.length > 0);

    let finalResult = "";

    for (let city of cities) {
        try {
            // 1. Şehir koordinatlarını al
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                finalResult += `${city}: Şehir bulunamadı.\n\n`;
                continue;
            }

            const { latitude, longitude, name } = geoData.results[0];

            // 2. Hava durumunu al
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherResponse.json();

            const temp = weatherData.current_weather.temperature;
            const wind = weatherData.current_weather.windspeed;
            finalResult += `Şehir: ${name}\nSıcaklık: ${temp}°C\nRüzgar Hızı: ${wind} km/h\n\n`;

        } catch (error) {
            console.error(error);
            finalResult += `${city}: Hava durumu alınamadı.\n\n`;
        }
    }

    resultEl.textContent = finalResult;
}
