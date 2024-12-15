import React, { useEffect } from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import NotificationProvider, { useNotification } from './NotificationProvider';

describe('NotificationProvider', () => {
  test('should render children', () => {
    const TestComponent = () => <div>Test Component</div>;
    const { getByText } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    const testComponent = getByText('Test Component');
    expect(testComponent).toBeInTheDocument();
  });

  test('should add notifications', () => {
    const TestComponent = () => {
      const { addNotification } = useNotification();
      const handleClick = () => {
        addNotification('Notification message', 'info', true);
      };

      return (
        <div>
          <button onClick={handleClick}>Add Notification</button>
        </div>
      );
    };

    const { getByRole, getByText } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    const addButton = getByRole('button', { name: 'Add Notification' });
    act(() => {
      fireEvent.click(addButton);
    });

    const notificationMessage = getByText('Notification message');
    expect(notificationMessage).toBeInTheDocument();
  });

  test('should auto close notifications', async () => {
    const TestComponent = () => {
      const { addNotification } = useNotification();
      useEffect(() => {
        addNotification('Notification message', 'info', true);
      }, [addNotification]);

      return <div></div>;
    };

    const { getByText, queryByText } = render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    const notificationMessage = getByText('Notification message');
    expect(notificationMessage).toBeInTheDocument();

    await waitFor(
      () => {
        expect(queryByText('Notification message')).not.toBeInTheDocument();
      },
      { timeout: 3010 },
    );
  });
});
