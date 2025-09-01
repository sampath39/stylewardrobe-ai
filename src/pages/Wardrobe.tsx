import { Navigation } from '@/components/Navigation';
import { WardrobeGrid } from '@/components/WardrobeGrid';
import wardrobeHero from '@/assets/wardrobe-hero.jpg';

const Wardrobe = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden shadow-elegant mb-8">
            <img
              src={wardrobeHero}
              alt="Fashion wardrobe"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center">
              <div className="text-center text-primary-foreground">
                <h1 className="text-3xl font-bold mb-2">My Wardrobe</h1>
                <p className="text-lg opacity-90">
                  Organize and manage your clothing collection
                </p>
              </div>
            </div>
          </div>
          <WardrobeGrid />
        </div>
      </main>
    </div>
  );
};

export default Wardrobe;