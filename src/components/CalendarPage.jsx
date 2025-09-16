// src/components/CalendarPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Load saved events from localStorage
  useEffect(() => {
    const savedEvents =
      JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(savedEvents);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("calendarEvents", JSON.stringify(events));
    }
  }, [events]);

  // Handle clicking an existing event (delete option)
  const handleEventClick = (info) => {
    if (window.confirm(`Delete event '${info.event.title}'?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== info.event.id));
    }
  };

  // Handle resizing or dragging events on the calendar
  const handleEventChange = (changeInfo) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === changeInfo.event.id
          ? {
              ...e,
              start: changeInfo.event.start.toISOString(),
              end: changeInfo.event.end
                ? changeInfo.event.end.toISOString()
                : null,
            }
          : e
      )
    );
  };

  return (
    <div className="p-4">
      {/* Back Navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">📅 Calendar</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        eventChange={handleEventChange} // when user drags/resizes
        editable={true}
        selectable={true}
        height="85vh"
      />
    </div>
  );
};

export default CalendarPage;
