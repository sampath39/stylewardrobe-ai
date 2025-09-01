const WEATHER_API_KEY = '6c793f417ff47704ed912c0394b2b55f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  wind: {
    speed: number;
  };
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export const weatherService = {
  async getCurrentWeather(coords: Coordinates): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return response.json();
  },

  async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  getOutfitSuggestion(weather: WeatherData): string[] {
    const temp = weather.main.temp;
    const condition = weather.weather[0].main.toLowerCase();
    const suggestions: string[] = [];

    // Temperature-based suggestions
    if (temp < 0) {
      suggestions.push('Heavy winter coat', 'Warm boots', 'Gloves', 'Scarf', 'Thermal layers');
    } else if (temp < 10) {
      suggestions.push('Warm jacket', 'Long pants', 'Closed shoes', 'Light sweater');
    } else if (temp < 15) {
      suggestions.push('Light jacket', 'Jeans', 'Sneakers', 'Long sleeve shirt');
    } else if (temp < 25) {
      suggestions.push('Light cardigan', 'Jeans or light pants', 'Comfortable shoes');
    } else {
      suggestions.push('Light shirt', 'Shorts or light pants', 'Sandals', 'Sun hat');
    }

    // Weather condition-based suggestions
    if (condition.includes('rain')) {
      suggestions.push('Umbrella', 'Waterproof jacket', 'Water-resistant shoes');
    } else if (condition.includes('snow')) {
      suggestions.push('Warm boots', 'Heavy coat', 'Gloves');
    } else if (condition.includes('sun') || condition.includes('clear')) {
      suggestions.push('Sunglasses', 'Light colors', 'Breathable fabrics');
    }

    return suggestions;
  }
};