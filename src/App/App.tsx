import React from 'react';
import { RouterProvider, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import router from './Router';
import NotificationProvider from 'App/Features/Common/Presentation/Providers/NotificationProvider';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

let awsRum: AwsRum | null = null;
if (process.env.REACT_APP_RUM_APP_ID != '') {
  try {
    const rumConfig: AwsRumConfig = {
      allowCookies: true,
      endpoint: 'https://dataplane.rum.us-east-1.amazonaws.com',
      sessionSampleRate: 1,
      telemetries: ['errors', 'performance', 'http'],
      enableXRay: true,
      disableAutoPageView: true,
    };

    const APPLICATION_ID: string = process.env.REACT_APP_RUM_APP_ID || '';
    const APPLICATION_VERSION = process.env.REACT_APP_VERSION || '0.1';
    const APPLICATION_REGION = 'us-east-1';

    awsRum = new AwsRum(
      APPLICATION_ID,
      APPLICATION_VERSION,
      APPLICATION_REGION,
      rumConfig,
    );
  } catch (err) {
    //
  }
}

export function RecordPageView() {
  const location = useLocation();
  React.useEffect(() => {
    if (process.env.NODE_ENV != 'development' && awsRum) {
      awsRum?.recordPageView(location.pathname);
    }
  }, [location]);
}

export function RecordEvent(name: string, eventData: object) {
  if (process.env.NODE_ENV != 'development' && awsRum) {
    awsRum?.recordEvent(name, eventData);
  }
}
function Fallback({ error }: FallbackProps) {
  // TODO: Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <NotificationProvider>
        <RouterProvider router={router()} fallbackElement={<Spinner />} />
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
