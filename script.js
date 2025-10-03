// ========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('location-input');
    const resultDiv = document.getElementById('weather-result');

    // ========================================
    // HANDLER DE SUBMIT DO FORMULÁRIO
    // ========================================
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const location = input.value.trim();
        if (!location) return;

        // Mostra estado de loading
        showLoading();

        try {
            const apiKey = 'bff8024a8a78f5706939b8222c960287';
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&lang=pt_pt&appid=${apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Cidade não encontrada');

            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            showError(error.message);
        }
    });

    // ========================================
    // FUNÇÃO: MOSTRAR LOADING
    // ========================================
    function showLoading() {
        resultDiv.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p style="font-size: 15px; font-weight: 500;">Carregando dados...</p>
            </div>
        `;
    }

    // ========================================
    // FUNÇÃO: EXIBIR CLIMA
    // ========================================
    function displayWeather(data) {
        const current = data.list[0];
        const cityName = data.city.name;
        const country = data.city.country;
        const temp = Math.round(current.main.temp);
        const feelsLike = Math.round(current.main.feels_like);
        const humidity = current.main.humidity;
        const windSpeed = (current.wind.speed * 3.6).toFixed(1);
        const description = current.weather[0].description;
        const weatherMain = current.weather[0].main.toLowerCase();
        const pressure = current.main.pressure;

        // Ícone e cor do gradiente baseado no clima
        const iconClass = getWeatherIcon(weatherMain);
        const gradient = getGradientClass(weatherMain);
        
        // Atualiza o background do body
        document.body.style.background = gradient;

        // Data e hora atual
        const now = new Date();
        const dateTimeStr = now.toLocaleDateString('pt-PT', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Processa previsão dos próximos dias
        const forecast = [];
        for (let i = 0; i < data.list.length && forecast.length < 5; i += 8) {
            const day = data.list[i];
            forecast.push({
                day: new Date(day.dt * 1000).toLocaleDateString('pt-PT', { weekday: 'short' }),
                temp: Math.round(day.main.temp),
                icon: getWeatherIcon(day.weather[0].main.toLowerCase())
            });
        }

        // ========================================
        // RENDERIZAÇÃO DO HTML
        // ========================================
        resultDiv.innerHTML = `
            <div class="main-weather">
                <!-- Cidade e data -->
                <h2 class="city-name">${cityName}, ${country}</h2>
                <p class="date-time">${dateTimeStr} <span>(meu horário local)</span></p>

                <!-- Temperatura e Ícone lado a lado -->
                <div class="temp-icon-container">
                    <div class="temperature-main">${temp}°C</div>
                    <i class="fas ${iconClass} weather-icon-main"></i>
                </div>
                
                <p class="weather-description">${description}</p>
                <p class="feels-like">Sensação térmica: ${feelsLike}°C</p>

                <!-- Métricas detalhadas -->
                <div class="weather-details">
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-tint"></i></div>
                        <div class="detail-label">Umidade</div>
                        <div class="detail-value">${humidity}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-wind"></i></div>
                        <div class="detail-label">Vento</div>
                        <div class="detail-value">${windSpeed} km/h</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fas fa-gauge"></i></div>
                        <div class="detail-label">Pressão</div>
                        <div class="detail-value">${pressure} hPa</div>
                    </div>
                </div>

                <!-- Previsão dos próximos dias -->
                <div class="forecast-section">
                    <h3 class="forecast-title">Previsão para os próximos dias</h3>
                    <div class="forecast-grid">
                        ${forecast.map(f => `
                            <div class="forecast-day">
                                <div class="forecast-day-name">${f.day}</div>
                                <i class="fas ${f.icon} forecast-icon"></i>
                                <div class="forecast-temp">${f.temp}°</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ========================================
    // FUNÇÃO: MOSTRAR ERRO
    // ========================================
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="error-state">
                <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <p class="error-message">Ops! ${message}</p>
                <p class="error-hint">Tente buscar outra cidade</p>
            </div>
        `;
    }

    // ========================================
    // FUNÇÃO: ÍCONE DO CLIMA
    // ========================================
    function getWeatherIcon(desc) {
        const icons = {
            clear: 'wi wi-day-sunny',          // Céu limpo
            clouds: 'wi wi-cloudy',            // Nublado
            rain: 'wi wi-rain',                // Chuva
            drizzle: 'wi wi-sprinkle',         // Chuvisco
            thunderstorm: 'wi wi-thunderstorm',// Trovoada
            snow: 'wi wi-snow',                // Neve
            mist: 'wi wi-fog',                 // Névoa
            fog: 'wi wi-fog',                  // Neblina
            haze: 'wi wi-day-haze'             // Nebulosidade
        };
        return icons[desc] || 'wi wi-cloud';   // Default: Nuvem (genérico)
    }


    // ========================================
    // FUNÇÃO: GRADIENTE DINÂMICO
    // ========================================
    function getGradientClass(desc) {
        const gradients = {
            clear: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)',
            sun: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
            clouds: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            rain: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
            drizzle: 'linear-gradient(135deg, #647DEE 0%, #7F53AC 100%)',
            thunderstorm: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            snow: 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
            mist: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
        };
        return gradients[desc] || gradients.clear;
    }
});