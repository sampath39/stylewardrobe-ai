import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';

interface OutfitSuggestionsProps {
  weather?: WeatherData | null;
  occasion?: string;
}

export const OutfitSuggestions = ({ weather, occasion }: OutfitSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = () => {
    if (!weather) return;
    
    setLoading(true);
    setTimeout(() => {
      const weatherSuggestions = weatherService.getOutfitSuggestion(weather);
      let finalSuggestions = [...weatherSuggestions];

      // Add occasion-specific suggestions
      if (occasion) {
        const occasionSuggestions = getOccasionSuggestions(occasion);
        finalSuggestions = [...finalSuggestions, ...occasionSuggestions];
      }

      // Remove duplicates and limit to 8 suggestions
      const uniqueSuggestions = [...new Set(finalSuggestions)].slice(0, 8);
      setSuggestions(uniqueSuggestions);
      setLoading(false);
    }, 1000);
  };

  const getOccasionSuggestions = (occasion: string): string[] => {
    const lowerOccasion = occasion.toLowerCase();
    
    if (lowerOccasion.includes('work') || lowerOccasion.includes('office')) {
      return ['Blazer', 'Dress shirt', 'Formal shoes', 'Watch', 'Belt'];
    }
    if (lowerOccasion.includes('party') || lowerOccasion.includes('celebration')) {
      return ['Dress', 'Heels', 'Statement jewelry', 'Clutch', 'Bold lipstick'];
    }
    if (lowerOccasion.includes('casual') || lowerOccasion.includes('weekend')) {
      return ['Jeans', 'T-shirt', 'Sneakers', 'Casual jacket'];
    }
    if (lowerOccasion.includes('date')) {
      return ['Nice dress', 'Comfortable heels', 'Light perfume', 'Small bag'];
    }
    if (lowerOccasion.includes('sport') || lowerOccasion.includes('gym')) {
      return ['Athletic wear', 'Sports shoes', 'Water bottle', 'Towel'];
    }
    
    return [];
  };

  useEffect(() => {
    if (weather) {
      generateSuggestions();
    }
  }, [weather, occasion]);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Today's Outfit Suggestions
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={!weather || loading}
          className="w-fit"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {!weather ? (
          <p className="text-muted-foreground">Weather data needed for suggestions</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="p-2 text-center justify-center text-sm"
              >
                {suggestion}
              </Badge>
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