import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'work' | 'casual' | 'formal' | 'party' | 'sport' | 'other';
  location?: string;
  description?: string;
}

// Mock events for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Work Meeting',
    date: new Date(2024, 8, 15),
    type: 'work',
    location: 'Office',
    description: 'Important client presentation'
  },
  {
    id: '2',
    title: 'Birthday Party',
    date: new Date(2024, 8, 18),
    type: 'party',
    location: 'Restaurant',
    description: "Sarah's birthday celebration"
  },
  {
    id: '3',
    title: 'Gym Session',
    date: new Date(2024, 8, 20),
    type: 'sport',
    location: 'Local Gym',
    description: 'Weekly workout'
  },
];

const eventTypeColors = {
  work: 'bg-blue-100 text-blue-800',
  casual: 'bg-green-100 text-green-800',
  formal: 'bg-purple-100 text-purple-800',
  party: 'bg-pink-100 text-pink-800',
  sport: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'other' as CalendarEvent['type'],
    location: '',
    description: '',
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const addEvent = () => {
    if (newEvent.title && selectedDate) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: selectedDate,
        type: newEvent.type,
        location: newEvent.location,
        description: newEvent.description,
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', type: 'other', location: '', description: '' });
      setSelectedDate(null);
    }
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const today = new Date();
  const todaysEvents = getEventsForDate(today);

  return (
    <div className="space-y-6">
      {/* Today's Events */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                  <Badge className={eventTypeColors[event.type]}>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No events scheduled for today</p>
          )}
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 42 }, (_, i) => {
              const date = new Date(startDate);
              date.setDate(date.getDate() + i);
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(date, today);
              
              return (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost" 
                      className={`h-12 p-1 flex flex-col items-center justify-center relative ${
                        !isCurrentMonth ? 'text-muted-foreground' : ''
                      } ${isToday ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="text-sm">{format(date, 'd')}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((_, eventIndex) => (
                            <div key={eventIndex} className="w-1 h-1 bg-primary rounded-full" />
                          ))}
                        </div>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {format(date, 'EEEE, MMMM d, yyyy')}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Events for selected date */}
                      {dayEvents.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Events</h4>
                          {dayEvents.map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-2 bg-accent rounded">
                              <div>
                                <p className="font-medium">{event.title}</p>
                                {event.location && (
                                  <p className="text-sm text-muted-foreground">{event.location}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={eventTypeColors[event.type]}>
                                  {event.type}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add new event form */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Add Event</h4>
                        <div>
                          <Label htmlFor="event-title">Event Title</Label>
                          <Input
                            id="event-title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter event title"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="event-type">Type</Label>
                            <select
                              id="event-type"
                              value={newEvent.type}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="work">Work</option>
                              <option value="casual">Casual</option>
                              <option value="formal">Formal</option>
                              <option value="party">Party</option>
                              <option value="sport">Sport</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <Label htmlFor="event-location">Location</Label>
                            <Input
                              id="event-location"
                              value={newEvent.location}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Event location"
                            />
                          </div>
                        </div>
                        
                        <Button onClick={addEvent} className="w-full" disabled={!newEvent.title}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Event
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};