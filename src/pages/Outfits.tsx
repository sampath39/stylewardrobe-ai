import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { OutfitSuggestions } from '@/components/OutfitSuggestions';
import { WeatherWidget } from '@/components/WeatherWidget';
import { OutfitPreview } from '@/components/OutfitPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Save, Eye } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';
import wardrobeHero from '@/assets/wardrobe-hero.jpg';
import aiAssistant from '@/assets/ai-assistant.jpg';

interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  category: string;
  color: string;
  season: string;
  favorite: boolean;
}

interface OutfitCombo {
  id: string;
  name: string;
  items: string[];
  weather: string;
  occasion: string;
  image: string;
  favorite: boolean;
}

// Mock wardrobe items for demonstration
const mockWardrobeItems: WardrobeItem[] = [
  {
    id: '1',
    name: 'Navy Blazer',
    image: '/placeholder.svg',
    category: 'Jackets',
    color: 'Navy',
    season: 'All',
    favorite: true,
  },
  {
    id: '2', 
    name: 'White Button Shirt',
    image: '/placeholder.svg',
    category: 'Tops',
    color: 'White',
    season: 'All',
    favorite: false,
  },
  {
    id: '3',
    name: 'Black Dress Pants',
    image: '/placeholder.svg',
    category: 'Pants',
    color: 'Black',
    season: 'All',
    favorite: true,
  },
  {
    id: '4',
    name: 'Summer Floral Dress',
    image: '/placeholder.svg',
    category: 'Dresses',
    color: 'Floral',
    season: 'Summer',
    favorite: true,
  },
  {
    id: '5',
    name: 'Casual Jeans',
    image: '/placeholder.svg',
    category: 'Pants',
    color: 'Blue',
    season: 'All',
    favorite: false,
  },
];

// Mock outfit combinations
const mockOutfits: OutfitCombo[] = [
  {
    id: '1',
    name: 'Professional Look',
    items: ['Navy Blazer', 'White Button Shirt', 'Black Dress Pants'],
    weather: 'Cool, 18°C',
    occasion: 'Work',
    image: '/placeholder.svg',
    favorite: false,
  },
  {
    id: '2',
    name: 'Summer Elegance',
    items: ['Summer Floral Dress'],
    weather: 'Warm, 26°C',
    occasion: 'Casual',
    image: '/placeholder.svg',
    favorite: true,
  },
  {
    id: '3',
    name: 'Casual Friday',
    items: ['White Button Shirt', 'Casual Jeans'],
    weather: 'Mild, 22°C',
    occasion: 'Casual',
    image: '/placeholder.svg',
    favorite: false,
  },
];

const Outfits = () => {
  const [outfits, setOutfits] = useState<OutfitCombo[]>(mockOutfits);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentOccasion, setCurrentOccasion] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const handlePreview = (userImage: string, outfitItems: string[]) => {
    console.log('Previewing outfit:', { userImage, outfitItems });
    // Handle preview logic
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden shadow-elegant">
            <img
              src={wardrobeHero}
              alt="Fashion wardrobe"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <h1 className="text-4xl font-bold mb-2">AI-Powered Outfit Suggestions</h1>
                <p className="text-xl opacity-90">
                  Personalized recommendations from your wardrobe
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OutfitSuggestions 
                weather={weather} 
                occasion={currentOccasion}
                wardrobeItems={mockWardrobeItems}
              />
              
              {/* Outfit Preview */}
              <OutfitPreview
                selectedItems={selectedItems}
                onPreview={handlePreview}
              />
              
              {/* Saved Outfit Combinations */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <img src={aiAssistant} alt="AI Assistant" className="h-8 w-8 rounded-full" />
                    Your Outfit Combinations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {outfits.map((outfit) => (
                      <Card key={outfit.id} className="shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-accent">
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
                                onClick={() => {
                                  setSelectedItems(outfit.items);
                                }}
                              >
                                <Eye className="h-4 w-4" />
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
              <Card className="shadow-soft bg-gradient-cool">
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Today's Occasion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Work', 'Casual', 'Date', 'Party', 'Sport'].map((occasion) => (
                      <Button
                        key={occasion}
                        variant={currentOccasion === occasion ? "secondary" : "outline"}
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