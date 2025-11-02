'use client';

import type { PolicyEvent } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';

interface AlertBannerProps {
  event: PolicyEvent;
  onDismiss?: () => void;
}

export default function AlertBanner({ event, onDismiss }: AlertBannerProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-accent p-4 mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-accent-dark">
            Latest Policy Update
          </p>
          <div className="mt-1">
            <p className="text-sm text-gray-700">
              <strong>{event.title}</strong> ? {format(new Date(event.date), 'MMMM d, yyyy')}
            </p>
            {event.description && (
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            )}
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:text-accent-dark underline mt-1 inline-block"
              >
                View source ?
              </a>
            )}
          </div>
        </div>
        {onDismiss && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Dismiss"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
