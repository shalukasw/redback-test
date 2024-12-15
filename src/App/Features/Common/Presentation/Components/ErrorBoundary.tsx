import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError() as Error;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>This page doesn&pos;t exist!</div>;
    }

    if (error.status === 401) {
      return <div>You aren&pos;t authorized to see this</div>;
    }

    if (error.status === 503) {
      return <div>Looks like our API is down</div>;
    }

    if (error.status === 418) {
      return <div>🫖</div>;
    }
  }

  return (
    <section>
      <h1>Something went wrong</h1>
      <small>{error?.message}</small>
    </section>
  );
};

export default ErrorBoundary;
