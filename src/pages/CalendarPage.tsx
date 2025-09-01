import { Navigation } from '@/components/Navigation';
import { CalendarWidget } from '@/components/CalendarWidget';

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Style Calendar</h1>
            <p className="text-muted-foreground">
              Plan your outfits for upcoming events and occasions
            </p>
          </div>
          <CalendarWidget />
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;