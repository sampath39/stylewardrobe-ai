import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Calendar, 
  Shirt, 
  Palette, 
  User,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/wardrobe', label: 'Wardrobe', icon: Shirt },
  { href: '/outfits', label: 'Outfits', icon: Palette },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/95 backdrop-blur-sm shadow-soft"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <Card className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-gradient-soft shadow-elegant border-0 rounded-none flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg"></div>
            <h1 className="text-xl font-semibold">StyleMe</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? "default" : "ghost"}
                className="w-full justify-start mb-2"
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-3 h-4 w-4" />
              Profile
            </Button>
          </Link>
        </div>
      </Card>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <Card className="m-4 mt-16 bg-gradient-soft shadow-elegant">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg"></div>
                <h1 className="text-xl font-semibold">StyleMe</h1>
              </div>
              
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={location.pathname === item.href ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </nav>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};