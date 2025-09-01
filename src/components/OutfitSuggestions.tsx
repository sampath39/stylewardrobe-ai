import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';

interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  category: string;
  color: string;
  season: string;
  favorite: boolean;
}

interface OutfitSuggestionsProps {
  weather?: WeatherData | null;
  occasion?: string;
  wardrobeItems?: WardrobeItem[];
}

export const OutfitSuggestions = ({ weather, occasion, wardrobeItems = [] }: OutfitSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = () => {
    if (!weather || wardrobeItems.length === 0) return;
    
    setLoading(true);
    setTimeout(() => {
      // Filter wardrobe items based on weather and occasion
      let filteredItems = [...wardrobeItems];
      
      // Weather-based filtering
      const temp = weather.main.temp;
      if (temp < 10) {
        filteredItems = filteredItems.filter(item => 
          item.category === 'Jackets' || 
          item.category === 'Pants' || 
          item.season === 'Winter' || 
          item.season === 'All'
        );
      } else if (temp > 25) {
        filteredItems = filteredItems.filter(item => 
          item.category === 'Tops' || 
          item.category === 'Dresses' || 
          item.season === 'Summer' || 
          item.season === 'All'
        );
      }

      // Occasion-based filtering
      if (occasion) {
        const occasionItems = getOccasionItems(occasion, filteredItems);
        filteredItems = occasionItems.length > 0 ? occasionItems : filteredItems;
      }

      // Select a diverse outfit (limit to 4-6 items)
      const outfitSuggestions = selectDiverseOutfit(filteredItems);
      setSuggestions(outfitSuggestions);
      setLoading(false);
    }, 1000);
  };

  const getOccasionItems = (occasion: string, items: WardrobeItem[]): WardrobeItem[] => {
    const lowerOccasion = occasion.toLowerCase();
    
    if (lowerOccasion.includes('work') || lowerOccasion.includes('office')) {
      return items.filter(item => 
        item.category === 'Jackets' || 
        item.category === 'Pants' || 
        item.color === 'Black' || 
        item.color === 'Navy'
      );
    }
    if (lowerOccasion.includes('party') || lowerOccasion.includes('celebration')) {
      return items.filter(item => 
        item.category === 'Dresses' || 
        item.category === 'Accessories' ||
        item.favorite
      );
    }
    if (lowerOccasion.includes('casual') || lowerOccasion.includes('weekend')) {
      return items.filter(item => 
        item.category === 'Tops' || 
        item.category === 'Pants' ||
        item.category === 'Shoes'
      );
    }
    
    return items;
  };

  const selectDiverseOutfit = (items: WardrobeItem[]): WardrobeItem[] => {
    const categories = ['Tops', 'Pants', 'Dresses', 'Jackets', 'Shoes', 'Accessories'];
    const outfit: WardrobeItem[] = [];
    
    // Try to get one item from each relevant category
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
        outfit.push(randomItem);
      }
    });
    
    return outfit.slice(0, 6); // Limit to 6 items
  };

  useEffect(() => {
    if (weather && wardrobeItems.length > 0) {
      generateSuggestions();
    }
  }, [weather, occasion, wardrobeItems]);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Today's Outfit Suggestions from Your Wardrobe
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={!weather || loading || wardrobeItems.length === 0}
          className="w-fit"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {!weather ? (
          <p className="text-muted-foreground">Weather data needed for suggestions</p>
        ) : wardrobeItems.length === 0 ? (
          <p className="text-muted-foreground">Add items to your wardrobe to get personalized suggestions</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {suggestions.map((item, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square bg-gradient-accent rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="text-sm"
                >
                  {item.name}
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        {occasion && (
          <div className="mt-4 p-3 bg-accent rounded-lg">
            <p className="text-sm font-medium text-accent-foreground">
              Occasion: {occasion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};