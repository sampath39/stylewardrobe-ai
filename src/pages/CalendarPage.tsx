import { Navigation } from '@/components/Navigation';
import { CalendarWidget } from '@/components/CalendarWidget';

const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="p-4 md:ml-64 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient-primary">
              Style Calendar
            </h1>
            <p className="text-muted-foreground text-lg">
              Plan your outfits for upcoming events, holidays, and special occasions
            </p>
          </div>
          <CalendarWidget />
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;