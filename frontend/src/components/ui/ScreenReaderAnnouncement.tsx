'use client';

import { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

const ScreenReaderAnnouncement = ({ message, priority = 'polite' }: ScreenReaderAnnouncementProps) => {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcementRef.current && message) {
      // Force screen readers to announce the message
      announcementRef.current.textContent = '';
      setTimeout(() => {
        announcementRef.current!.textContent = message;
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={announcementRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only fixed top-0 left-0 w-1 h-1 overflow-hidden"
    />
  );
};

export default ScreenReaderAnnouncement;