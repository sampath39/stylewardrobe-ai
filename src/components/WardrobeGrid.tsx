import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Heart, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WardrobeItem {
  id: string;
  name: string;
  image: string;
  category: string;
  color: string;
  season: string;
  favorite: boolean;
}

// Mock data for demonstration
const mockItems: WardrobeItem[] = [
  {
    id: '1',
    name: 'Tshirt',
    image: "https://i.imghippo.com/files/QtRB8668EPw.jpg",
    category: 'Tshirts',
    color: 'White',
    season: 'All',
    favorite: true,
  },
  {
    id: '2', 
    name: 'Blue Jeans',
    image: "https://i.imghippo.com/files/vswu2763Nc.webp",
    category: 'Pants',
    color: 'Blue',
    season: 'All',
    favorite: false,
  },
  {
    id: '3',
    name: 'Saree',
    image: "https://i.imghippo.com/files/cAnw3121gnc.jpg",
    category: 'Sarees',
    color: 'Golden',
    season: 'Spring',
    favorite: true,
  },
  {
    id: '4',
    name: 'Dress',
    image: "https://i.imghippo.com/files/HPdd4485vk.webp",
    category: 'Dresses',
    color: 'Red',
    season: 'Winter',
    favorite: true,
  },
  {
    id: '5',
    name: 'Kurta',
    image: "https://i.imghippo.com/files/hqV9652CtA.jpg",
    category: 'Kurtas',
    color: 'Pink',
    season: 'Summer',
    favorite: true,
  },
];

export const WardrobeGrid = () => {
  const [items, setItems] = useState<WardrobeItem[]>(mockItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    color: '',
    season: '',
    image: '',
  });

  const categories = ['All', 'Tops', 'Pants', 'Shirts', 'Dresses', 'Jackets', 'Shoes', 'Accessories', 'Kurtas', 'Sarees'];
  const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter'];

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const toggleFavorite = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItem(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (newItem.name && newItem.category) {
      const item: WardrobeItem = {
        id: Date.now().toString(),
        ...newItem,
        favorite: false,
      };
      setItems([...items, item]);
      setNewItem({ name: '', category: '', color: '', season: '', image: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Wardrobe</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-elegant">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Black Blazer"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select category</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={newItem.color}
                    onChange={(e) => setNewItem(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="e.g., Black"
                  />
                </div>
                
                <div>
                  <Label htmlFor="season">Season</Label>
                  <select
                    id="season"
                    value={newItem.season}
                    onChange={(e) => setNewItem(prev => ({ ...prev, season: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select season</option>
                    {seasons.slice(1).map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <Button onClick={addItem} className="w-full">
                Add to Wardrobe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="shadow-soft hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart className={`h-4 w-4 ${item.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{item.name}</h3>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.color}
                  </Badge>
                  {item.season && (
                    <Badge variant="secondary" className="text-xs">
                      {item.season}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};