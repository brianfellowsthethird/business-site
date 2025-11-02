'use client';

interface HeadlineBlockProps {
  headline: string;
  subhead?: string;
  source?: string;
  lastUpdated?: string;
}

export default function HeadlineBlock({
  headline,
  subhead,
  source,
  lastUpdated,
}: HeadlineBlockProps) {
  return (
    <div className="mb-8 md:mb-12">
      <h1 className="text-hero mb-4">{headline}</h1>
      {subhead && <p className="text-subhead mb-4">{subhead}</p>}
      {(source || lastUpdated) && (
        <div className="source-badge">
          {source && `Source: ${source}`}
          {source && lastUpdated && ' ? '}
          {lastUpdated && `Updated ${new Date(lastUpdated).toLocaleDateString()}`}
        </div>
      )}
    </div>
  );
}
