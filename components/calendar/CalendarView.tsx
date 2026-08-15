'use client'

import { useMemo, useCallback } from 'react'
import { Calendar, Views, type SlotInfo } from 'react-big-calendar'
import { localizer } from '@/lib/calendar/localizer'
import type { ScheduleEvent } from '@/hooks/useSchedule'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-overrides.css'

type CalendarEventItem = {
  id: string
  title: string
  start: Date
  end: Date
  resource: ScheduleEvent
}

type Props = {
  events: ScheduleEvent[]
  onSelectSlot: (start: Date, end: Date) => void
  onSelectEvent: (event: ScheduleEvent) => void
}

export function CalendarView({ events, onSelectSlot, onSelectEvent }: Props) {
  const calendarEvents = useMemo<CalendarEventItem[]>(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start_time),
        end: e.end_time ? new Date(e.end_time) : new Date(e.start_time),
        resource: e,
      })),
    [events]
  )

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => onSelectSlot(slotInfo.start, slotInfo.end),
    [onSelectSlot]
  )

  const eventPropGetter = useCallback((event: CalendarEventItem) => {
    return {
      style: {
        backgroundColor: event.resource.color || '#c4b5fd',
        color: '#3f3f46',
      },
    }
  }, [])

  return (
    <div className="pastel-calendar" style={{ height: 640 }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor={(event: CalendarEventItem) => event.start}
        endAccessor={(event: CalendarEventItem) => event.end}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.WEEK}
        selectable
        popup
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(e: CalendarEventItem) => onSelectEvent(e.resource)}
        eventPropGetter={eventPropGetter}
        style={{ height: '100%' }}
      />
    </div>
  )
}