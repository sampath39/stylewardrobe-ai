import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, MapPin, Tag, Loader2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'work' | 'casual' | 'formal' | 'party' | 'sport' | 'holiday' | 'festival' | 'other';
  location?: string;
  description?: string;
  occasion?: string;
  isPublicHoliday?: boolean;
}

const eventTypeColors = {
  work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  casual: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  formal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  party: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  sport: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  holiday: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  festival: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

// Function to fetch holidays from Google Calendar API
const fetchHolidays = async (year: number, countryCode: string = 'US') => {
  try {
    const timeMin = new Date(year, 0, 1).toISOString();
    const timeMax = new Date(year, 11, 31).toISOString();
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/en.${countryCode}%23holiday%40group.v.calendar.google.com/events?` +
      `key=AIzaSyAIOxiRZlsMnU9hXhmRrEL0xp71PzRR_uw&` +
      `timeMin=${timeMin}&timeMax=${timeMax}&maxResults=100`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

// Function to convert API events to our format
const convertApiEventsToCalendarEvents = (apiEvents: any[]): CalendarEvent[] => {
  return apiEvents.map(event => ({
    id: event.id,
    title: event.summary,
    date: new Date(event.start.date || event.start.dateTime),
    type: event.summary.toLowerCase().includes('festival') ? 'festival' : 'holiday',
    description: event.description,
    isPublicHoliday: true,
  }));
};

export const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'other' as CalendarEvent['type'],
    location: '',
    description: '',
    occasion: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch holidays on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch holidays for the current year
        const apiEvents = await fetchHolidays(currentDate.getFullYear());
        const holidayEvents = convertApiEventsToCalendarEvents(apiEvents);
        
        // Combine with any existing user events (if you want to persist them)
        setEvents(prevEvents => [...prevEvents, ...holidayEvents]);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate.getFullYear()]);

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
        occasion: newEvent.occasion,
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', type: 'other', location: '', description: '', occasion: '' });
      setSelectedDate(null);
    }
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const today = new Date();
  const todaysEvents = getEventsForDate(today);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading calendar events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Events */}
      <Card className="card-elegant bg-gradient-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-card rounded-lg shadow-soft">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                    {event.occasion && (
                      <p className="text-sm text-primary flex items-center gap-1 mt-1">
                        <Tag className="h-3 w-3" />
                        {event.occasion}
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
      <Card className="card-elegant">
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
                      className={`h-16 p-1 flex flex-col items-center justify-center relative transition-smooth ${
                        !isCurrentMonth ? 'text-muted-foreground' : ''
                      } ${isToday ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="text-sm">{format(date, 'd')}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div 
                              key={eventIndex} 
                              className={`w-1 h-1 rounded-full ${
                                event.isPublicHoliday 
                                  ? 'bg-red-500' 
                                  : event.type === 'festival' 
                                    ? 'bg-yellow-500' 
                                    : 'bg-primary'
                              }`} 
                            />
                          ))}
                        </div>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
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
                            <div key={event.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{event.title}</p>
                                {event.location && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </p>
                                )}
                                {event.occasion && (
                                  <p className="text-sm text-primary flex items-center gap-1 mt-1">
                                    <Tag className="h-3 w-3" />
                                    {event.occasion}
                                  </p>
                                )}
                                {event.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={eventTypeColors[event.type]}>
                                  {event.type}
                                </Badge>
                                {!event.isPublicHoliday && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add new event form - only show for non-holiday dates */}
                      {!dayEvents.some(event => event.isPublicHoliday) && (
                        <div className="space-y-3 border-t pt-4">
                          <h4 className="font-medium">Add Event</h4>
                          <div>
                            <Label htmlFor="event-title">Event Title</Label>
                            <Input
                              id="event-title"
                              value={newEvent.title}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter event title"
                              className="input-elegant"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="event-occasion">Occasion Details</Label>
                            <Input
                              id="event-occasion"
                              value={newEvent.occasion}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, occasion: e.target.value }))}
                              placeholder="e.g., Formal dinner, Casual meetup, Business presentation"
                              className="input-elegant"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="event-type">Type</Label>
                              <select
                                id="event-type"
                                value={newEvent.type}
                                onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                                className="input-elegant w-full p-2"
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
                                className="input-elegant"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="event-description">Description</Label>
                            <Textarea
                              id="event-description"
                              value={newEvent.description}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Additional details about the event"
                              rows={2}
                              className="input-elegant"
                            />
                          </div>
                          
                          <Button 
                            onClick={addEvent} 
                            className="w-full btn-primary" 
                            disabled={!newEvent.title}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                          </Button>
                        </div>
                      )}
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