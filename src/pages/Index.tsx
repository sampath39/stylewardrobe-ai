import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { WeatherWidget } from '@/components/WeatherWidget';
import { OutfitSuggestions } from '@/components/OutfitSuggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, Shirt, Palette, ArrowRight } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';
import wardrobeHero from '@/assets/wardrobe-hero.jpg';
import aiAssistant from '@/assets/ai-assistant.jpg';

// Mock wardrobe items for demonstration
const mockWardrobeItems = [
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
];

const Index = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

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

  const quickStats = [
    { label: 'Wardrobe Items', value: '127', icon: Shirt },
    { label: 'Saved Outfits', value: '24', icon: Palette },
    { label: 'Upcoming Events', value: '3', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="relative rounded-2xl overflow-hidden shadow-elegant">
            <img
              src={wardrobeHero}
              alt="Fashion wardrobe"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50 flex items-center justify-center">
              <div className="text-center text-primary-foreground px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Welcome to StyleMe
                </h1>
                <p className="text-xl mb-6 opacity-90">
                  Your AI-powered wardrobe assistant with cool, calm styling
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/outfits">
                    <Button size="lg" variant="secondary" className="shadow-soft">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Outfit Suggestions
                    </Button>
                  </Link>
                  <Link to="/wardrobe">
                    <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                      <Shirt className="mr-2 h-5 w-5" />
                      Manage Wardrobe
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <section>
                <div className="grid md:grid-cols-3 gap-4">
                  {quickStats.map((stat, index) => (
                    <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-accent">
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="p-3 bg-gradient-primary rounded-full">
                            <stat.icon className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold mb-2">{stat.value}</div>
                        <div className="text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Today's Suggestions */}
              <section>
                <OutfitSuggestions 
                  weather={weather} 
                  wardrobeItems={mockWardrobeItems}
                />
              </section>

              {/* Recent Activity */}
              <section>
                <Card className="shadow-soft bg-gradient-cool">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary-foreground">
                      <img src={aiAssistant} alt="AI Assistant" className="h-6 w-6 rounded-full" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg shadow-soft">
                        <div>
                          <p className="font-medium">Added "Summer Dress" to wardrobe</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                        <Badge variant="secondary">New Item</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg shadow-soft">
                        <div>
                          <p className="font-medium">Created "Business Casual" outfit</p>
                          <p className="text-sm text-muted-foreground">1 day ago</p>
                        </div>
                        <Badge variant="secondary">Outfit</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg shadow-soft">
                        <div>
                          <p className="font-medium">Scheduled "Date Night" event</p>
                          <p className="text-sm text-muted-foreground">3 days ago</p>
                        </div>
                        <Badge variant="secondary">Event</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            <div className="space-y-8">
              {/* Weather Widget */}
              <section>
                <WeatherWidget />
              </section>

              {/* Quick Actions */}
              <section>
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/wardrobe">
                      <Button variant="outline" className="w-full justify-between">
                        Add New Item
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/outfits">
                      <Button variant="outline" className="w-full justify-between">
                        Create Outfit
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/calendar">
                      <Button variant="outline" className="w-full justify-between">
                        Plan Event
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </section>

              {/* Today's Weather Summary */}
              {weather && (
                <section>
                  <Card className="shadow-soft bg-gradient-accent">
                    <CardHeader>
                      <CardTitle>Weather Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="font-medium">{Math.round(weather.main.temp)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Condition:</span>
                          <span className="font-medium capitalize">{weather.weather[0].description}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Humidity:</span>
                          <span className="font-medium">{weather.main.humidity}%</span>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg mt-4">
                          <p className="text-sm text-primary font-medium">
                            ❄️ Cool and calm weather - perfect for layered looks!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
