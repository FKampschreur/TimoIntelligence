import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// Lazy load ChatWidget om errors te voorkomen
const ChatWidget = React.lazy(() => import('./ChatWidget'));

const ChatWidgetWrapper: React.FC = () => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        <ChatWidget />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default ChatWidgetWrapper;
