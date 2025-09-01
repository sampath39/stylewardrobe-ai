import { Navigation } from '@/components/Navigation';
import { WardrobeGrid } from '@/components/WardrobeGrid';

const Wardrobe = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Wardrobe</h1>
            <p className="text-muted-foreground">
              Organize and manage your clothing collection
            </p>
          </div>
          <WardrobeGrid />
        </div>
      </main>
    </div>
  );
};

export default Wardrobe;