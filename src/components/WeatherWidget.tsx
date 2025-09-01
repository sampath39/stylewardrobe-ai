import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = await weatherService.getCurrentLocation();
        const weatherData = await weatherService.getCurrentWeather(coords);
        setWeather(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gradient-primary shadow-elegant">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-primary shadow-elegant">
        <CardContent className="p-6">
          <p className="text-primary-foreground text-center">Unable to load weather data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-primary shadow-elegant">
      <CardHeader className="pb-3">
        <CardTitle className="text-primary-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {weather.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="h-16 w-16"
            />
            <div>
              <div className="text-3xl font-bold text-primary-foreground">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-primary-foreground/80 capitalize">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">Feels {Math.round(weather.main.feels_like)}°</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Droplets className="h-4 w-4" />
            <span className="text-sm">{weather.main.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Wind className="h-4 w-4" />
            <span className="text-sm">{Math.round(weather.wind.speed)} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};