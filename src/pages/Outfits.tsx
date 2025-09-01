import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { OutfitSuggestions } from '@/components/OutfitSuggestions';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Save } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';

interface OutfitCombo {
  id: string;
  name: string;
  items: string[];
  weather: string;
  occasion: string;
  image: string;
  favorite: boolean;
}

// Mock outfit combinations
const mockOutfits: OutfitCombo[] = [
  {
    id: '1',
    name: 'Casual Friday',
    items: ['Blue Jeans', 'White T-shirt', 'Denim Jacket', 'White Sneakers'],
    weather: 'Sunny, 22°C',
    occasion: 'Casual',
    image: '/placeholder.svg',
    favorite: false,
  },
  {
    id: '2',
    name: 'Business Meeting',
    items: ['Black Blazer', 'White Shirt', 'Black Pants', 'Dress Shoes'],
    weather: 'Cloudy, 18°C',
    occasion: 'Work',
    image: '/placeholder.svg',
    favorite: true,
  },
  {
    id: '3',
    name: 'Weekend Brunch',
    items: ['Floral Dress', 'Light Cardigan', 'Comfortable Flats', 'Small Bag'],
    weather: 'Partly cloudy, 20°C',
    occasion: 'Casual',
    image: '/placeholder.svg',
    favorite: false,
  },
];

const Outfits = () => {
  const [outfits, setOutfits] = useState<OutfitCombo[]>(mockOutfits);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentOccasion, setCurrentOccasion] = useState<string>('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = await weatherService.getCurrentLocation();
        const weatherData = await weatherService.getCurrentWeather(coords);
        setWeather(weatherData);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
  }, []);

  const toggleFavorite = (id: string) => {
    setOutfits(outfits.map(outfit => 
      outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
    ));
  };

  const saveOutfit = (id: string) => {
    console.log('Saving outfit:', id);
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Outfit Suggestions</h1>
            <p className="text-muted-foreground">
              AI-powered outfit recommendations based on weather and occasions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OutfitSuggestions weather={weather} occasion={currentOccasion} />
              
              {/* Saved Outfit Combinations */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Your Outfit Combinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {outfits.map((outfit) => (
                      <Card key={outfit.id} className="shadow-soft hover:shadow-elegant transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={outfit.image}
                              alt={outfit.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="bg-background/80 backdrop-blur-sm"
                                onClick={() => toggleFavorite(outfit.id)}
                              >
                                <Heart className={`h-4 w-4 ${outfit.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="bg-background/80 backdrop-blur-sm"
                                onClick={() => saveOutfit(outfit.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">{outfit.name}</h3>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {outfit.items.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>{outfit.weather}</span>
                                <Badge variant="secondary">{outfit.occasion}</Badge>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full mt-3" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Outfit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <WeatherWidget />
              
              {/* Today's Occasion */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Today's Occasion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Work', 'Casual', 'Date', 'Party', 'Sport'].map((occasion) => (
                      <Button
                        key={occasion}
                        variant={currentOccasion === occasion ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setCurrentOccasion(occasion)}
                      >
                        {occasion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Outfits;