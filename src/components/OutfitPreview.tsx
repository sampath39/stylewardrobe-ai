import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Upload, Camera } from 'lucide-react';
import modelTemplate from '@/assets/model-template.jpg';

interface OutfitPreviewProps {
  selectedItems: string[];
  onPreview: (userImage: string, outfitItems: string[]) => void;
}

export const OutfitPreview = ({ selectedItems, onPreview }: OutfitPreviewProps) => {
  const [userImage, setUserImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    if (userImage && selectedItems.length > 0) {
      onPreview(userImage, selectedItems);
      setPreviewOpen(true);
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Outfit Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="user-photo">Upload Your Photo</Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              id="user-photo"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose Photo
            </Button>
            {userImage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Camera className="h-4 w-4" />
                Photo uploaded
              </div>
            )}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div>
            <Label>Selected Items</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedItems.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handlePreview}
              disabled={!userImage || selectedItems.length === 0}
              className="w-full bg-gradient-primary shadow-elegant"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Outfit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Outfit Preview</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-medium mb-3">Your Photo</h4>
                <div className="relative bg-gradient-soft rounded-lg p-4">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="User photo"
                      className="max-w-full h-auto rounded-lg shadow-soft mx-auto"
                      style={{ maxHeight: '400px' }}
                    />
                  ) : (
                    <img
                      src={modelTemplate}
                      alt="Model template"
                      className="max-w-full h-auto rounded-lg shadow-soft mx-auto opacity-50"
                      style={{ maxHeight: '400px' }}
                    />
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-medium mb-3">Outfit Combination</h4>
                <div className="bg-gradient-accent rounded-lg p-6 h-full flex flex-col justify-center">
                  <div className="space-y-4">
                    {selectedItems.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-card rounded-lg shadow-soft"
                      >
                        <p className="font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      💡 This is a preview of how your selected outfit items would look together!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};