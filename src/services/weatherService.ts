export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

class WeatherService {
  private API_KEY = import.meta.env.VITE_WORLD_WEATHER_ONLINE_API_KEY;
  private BASE_URL = import.meta.env.VITE_WORLD_WEATHER_ONLINE_BASE_URL;

  async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          // Use IP-based location as fallback
          this.getLocationFromIP()
            .then(resolve)
            .catch((ipError) => {
              reject(new Error('Could not determine your location'));
            });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }

  private async getLocationFromIP(): Promise<Coordinates> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP location failed');
      
      const data = await response.json();
      return {
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      console.warn('IP-based location failed:', error);
      throw error;
    }
  }

  async getCurrentWeather(coords: Coordinates): Promise<WeatherData> {
    if (!this.API_KEY) {
      throw new Error('World Weather Online API key is not configured');
    }

    try {
      // Use the weather API with coordinates
      const url = `${this.BASE_URL}/weather.ashx?key=${this.API_KEY}&q=${coords.latitude},${coords.longitude}&format=json&num_of_days=1&includeLocation=yes`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check if the API returned an error
      if (data.data && data.data.error) {
        throw new Error(`Weather API error: ${data.data.error[0]?.msg || 'Unknown error'}`);
      }
      
      if (!data.data || !data.data.current_condition || !data.data.current_condition[0]) {
        throw new Error('Invalid weather data structure received from API');
      }

      const current = data.data.current_condition[0];
      const location = data.data.nearest_area?.[0] || {};
      const request = data.data.request?.[0] || {};
      
      // Extract location name
      let locationName = 'Your Location';
      if (location.areaName?.[0]?.value) {
        locationName = location.areaName[0].value;
      } else if (request.query) {
        // Try to extract city name from query
        const queryParts = request.query.split(',');
        locationName = queryParts[0];
      }

      // Extract country
      let country = '';
      if (location.country?.[0]?.value) {
        country = location.country[0].value;
      } else if (request.query && request.query.includes(',')) {
        const queryParts = request.query.split(',');
        country = queryParts[queryParts.length - 1].trim();
      }

      return {
        name: locationName,
        main: {
          temp: parseFloat(current.temp_C) || 0,
          feels_like: parseFloat(current.FeelsLikeC) || 0,
          humidity: parseFloat(current.humidity) || 0,
          temp_min: parseFloat(current.temp_C) - 2 || 0,
          temp_max: parseFloat(current.temp_C) + 2 || 0,
          pressure: parseFloat(current.pressure) || 1013,
        },
        weather: [{
          id: parseInt(current.weatherCode) || 800,
          main: current.weatherDesc?.[0]?.value || 'Clear',
          description: current.weatherDesc?.[0]?.value || 'Clear sky',
          icon: current.weatherCode.toString(),
        }],
        wind: {
          speed: parseFloat(current.windspeedKmph) / 3.6 || 0,
          deg: parseFloat(current.winddirDegree) || 0,
        },
        sys: {
          country: country,
          sunrise: 0,
          sunset: 0,
        },
        coord: {
          lat: coords.latitude,
          lon: coords.longitude,
        },
      };
    } catch (error) {
      console.error('Weather API call failed:', error);
      throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    if (!this.API_KEY) {
      throw new Error('World Weather Online API key is not configured');
    }

    try {
      const url = `${this.BASE_URL}/weather.ashx?key=${this.API_KEY}&q=${city}&format=json&num_of_days=1&includeLocation=yes`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.error) {
        throw new Error(`Weather API error: ${data.data.error[0]?.msg || 'Unknown error'}`);
      }
      
      if (!data.data || !data.data.current_condition || !data.data.current_condition[0]) {
        throw new Error('Invalid weather data structure received from API');
      }

      const current = data.data.current_condition[0];
      const location = data.data.nearest_area?.[0] || {};
      const request = data.data.request?.[0] || {};

      let locationName = city;
      if (location.areaName?.[0]?.value) {
        locationName = location.areaName[0].value;
      }

      let country = '';
      if (location.country?.[0]?.value) {
        country = location.country[0].value;
      }

      let lat = 0;
      let lon = 0;
      if (location.latitude) {
        lat = parseFloat(location.latitude);
      }
      if (location.longitude) {
        lon = parseFloat(location.longitude);
      }

      return {
        name: locationName,
        main: {
          temp: parseFloat(current.temp_C) || 0,
          feels_like: parseFloat(current.FeelsLikeC) || 0,
          humidity: parseFloat(current.humidity) || 0,
          temp_min: parseFloat(current.temp_C) - 2 || 0,
          temp_max: parseFloat(current.temp_C) + 2 || 0,
          pressure: parseFloat(current.pressure) || 1013,
        },
        weather: [{
          id: parseInt(current.weatherCode) || 800,
          main: current.weatherDesc?.[0]?.value || 'Clear',
          description: current.weatherDesc?.[0]?.value || 'Clear sky',
          icon: current.weatherCode.toString(),
        }],
        wind: {
          speed: parseFloat(current.windspeedKmph) / 3.6 || 0,
          deg: parseFloat(current.winddirDegree) || 0,
        },
        sys: {
          country: country,
          sunrise: 0,
          sunset: 0,
        },
        coord: {
          lat: lat,
          lon: lon,
        },
      };
    } catch (error) {
      console.error('City weather API call failed:', error);
      throw new Error(`Failed to fetch weather data for ${city}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const weatherService = new WeatherService();