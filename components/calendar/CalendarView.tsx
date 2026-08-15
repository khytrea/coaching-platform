'use client'

import { useMemo, useCallback } from 'react'
import { Calendar, Views, type SlotInfo, type View } from 'react-big-calendar'
import { localizer } from '@/lib/calendar/localizer'
import type { ScheduleEvent } from '@/hooks/useSchedule'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-overrides.css'

type Props = {
  events: ScheduleEvent[]
  onSelectSlot: (start: Date, end: Date) => void
  onSelectEvent: (event: ScheduleEvent) => void
}

export function CalendarView({ events, onSelectSlot, onSelectEvent }: Props) {
  const calendarEvents = useMemo(
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

  const eventPropGetter = useCallback((event: { resource: ScheduleEvent }) => {
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
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.WEEK}
        selectable
        popup
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(e) => onSelectEvent(e.resource)}
        eventPropGetter={eventPropGetter}
        style={{ height: '100%' }}
      />
    </div>
  )
}