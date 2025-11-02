'use client';

import type { PolicyEvent } from '@/lib/types';
import { format } from 'date-fns';

interface PolicyTimelineProps {
  events: PolicyEvent[];
  limit?: number;
}

export default function PolicyTimeline({ events, limit = 10 }: PolicyTimelineProps) {
  const displayedEvents = events.slice(0, limit);

  if (displayedEvents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No policy events available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedEvents.map((event) => (
        <div
          key={event.id}
          className="border-l-4 border-accent pl-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {event.type}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(event.date), 'MMM d, yyyy')}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              )}
              {event.source_url && (
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:text-accent-dark underline"
                >
                  View source ?
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
