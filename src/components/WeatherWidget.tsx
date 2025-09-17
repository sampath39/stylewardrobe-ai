import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Thermometer, Droplets, Wind, RefreshCw, Navigation, Satellite } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';
import weatherIcons from '@/assets/weather-icons.jpg';
import { Button } from '@/components/ui/button';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [locationSource, setLocationSource] = useState<'browser' | 'ip' | 'fallback'>('browser');

  const fetchWeather = async (useFallback = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let weatherData: WeatherData;
      
      if (useFallback) {
        console.log('Using fallback to London');
        setLocationSource('fallback');
        weatherData = await weatherService.getWeatherByCity('vadlamudi');
      } else {
        console.log('Attempting to get current location...');
        try {
          const coords = await weatherService.getCurrentLocation();
          console.log('Location coordinates received:', coords);
          setLocationSource('browser');
          weatherData = await weatherService.getCurrentWeather(coords);
        } catch (locationError) {
          console.warn('Location detection failed, using IP-based location');
          setLocationSource('ip');
          // Get approximate location from IP
          const response = await fetch('https://ipapi.co/json/');
          const ipData = await response.json();
          const ipCoords = {
            latitude: ipData.latitude,
            longitude: ipData.longitude
          };
          weatherData = await weatherService.getCurrentWeather(ipCoords);
        }
      }
      
      setWeather(weatherData);
    } catch (err) {
      console.error('Weather fetch error:', err);
      
      if (!useFallback && retryCount < 1) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchWeather(true), 1000);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleRetry = () => {
    setRetryCount(0);
    fetchWeather();
  };

  if (loading) {
    return (
      <Card className="bg-gradient-primary shadow-elegant">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          <span className="ml-2 text-primary-foreground">Detecting location...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-primary shadow-elegant">
        <CardContent className="p-6 text-center">
          <Navigation className="h-12 w-12 text-primary-foreground/50 mx-auto mb-4" />
          <p className="text-primary-foreground mb-4">{error || 'Failed to load weather data'}</p>
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="text-primary-foreground border-primary-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getWeatherAdvice = (temp: number) => {
    if (temp < 10) return '❄️ Bundle up! Perfect for coats and warm layers';
    if (temp < 20) return '🌤️ Light jacket weather. Great for layers!';
    if (temp < 30) return '☀️ Warm and sunny! Perfect for light clothing';
    return '🔥 Hot weather! Stay cool with breathable fabrics';
  };

  const locationName = weather?.name || 'Unknown Location';
  const country = weather?.sys?.country || '';
  const temperature = weather?.main?.temp || 0;
  const feelsLike = weather?.main?.feels_like || 0;
  const humidity = weather?.main?.humidity || 0;
  const tempMin = weather?.main?.temp_min || 0;
  const tempMax = weather?.main?.temp_max || 0;
  const windSpeed = weather?.wind?.speed || 0;
  const weatherDescription = weather?.weather?.[0]?.description || 'Unknown weather';
  const weatherIcon = weather?.weather?.[0]?.icon || '113';

  const getLocationSourceText = () => {
    switch (locationSource) {
      case 'browser': return 'Your precise location';
      case 'ip': return 'Your approximate location';
      case 'fallback': return 'Default location (London)';
      default: return 'Your location';
    }
  };

  return (
    <Card className="bg-gradient-primary shadow-elegant relative overflow-hidden">
      <div className="absolute top-2 right-2 opacity-20">
        <img src={weatherIcons} alt="Weather icons" className="h-16 w-16 object-cover rounded" />
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-primary-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {locationName}
          {country && `, ${country}`}
        </CardTitle>
        <div className="flex items-center gap-1 text-xs text-primary-foreground/60">
          <Satellite className="h-3 w-3" />
          <span>{getLocationSourceText()}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://cdn.worldweatheronline.com/images/weathericons/${weatherIcon}.png`}
              alt={weatherDescription}
              className="h-20 w-20"
              onError={(e) => {
                e.currentTarget.src = `https://openweathermap.org/img/wn/02d@4x.png`;
              }}
            />
            <div>
              <div className="text-4xl font-bold text-primary-foreground">
                {Math.round(temperature)}°C
              </div>
              <div className="text-primary-foreground/80 capitalize text-sm">
                {weatherDescription}
              </div>
              <div className="text-primary-foreground/60 text-xs mt-1">
                H: {Math.round(tempMax)}° L: {Math.round(tempMin)}°
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center text-primary-foreground/80">
            <Thermometer className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">{Math.round(feelsLike)}°</span>
            <span className="text-xs">Feels like</span>
          </div>
          <div className="flex flex-col items-center text-primary-foreground/80">
            <Droplets className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">{humidity}%</span>
            <span className="text-xs">Humidity</span>
          </div>
          <div className="flex flex-col items-center text-primary-foreground/80">
            <Wind className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">{Math.round(windSpeed)}</span>
            <span className="text-xs">m/s wind</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-primary-foreground font-medium text-center">
            {getWeatherAdvice(temperature)}
          </p>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div className="text-xs text-primary-foreground/50">
            Source: World Weather Online
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRetry}
            className="text-primary-foreground/70 hover:text-primary-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};