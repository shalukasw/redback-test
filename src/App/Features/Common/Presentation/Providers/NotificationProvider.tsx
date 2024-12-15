import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  withHeader: boolean;
}

interface NotificationContextValue {
  addNotification: (
    message: string,
    type?: Notification['type'],
    showHeader?: boolean,
  ) => void;
}

const NotificationContext = createContext<NotificationContextValue>(
  {} as NotificationContextValue,
);

export const useNotification = () => useContext(NotificationContext);

interface Props {
  children: ReactNode;
}
const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: Notification['type'] = 'info',
    showHeader = false,
  ) => {
    const id = Date.now().toString();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, message, type, withHeader: showHeader },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id),
    );
  };

  const value = useMemo(() => {
    return { addNotification };
  }, []);

  return (
    <>
      <ToastContainer position="top-end" className="m-3">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            onClose={() => removeNotification(notification.id)}
            delay={3000}
            autohide
            className={`p-3 border-${notification.type}`}
          >
            {notification.withHeader && (
              <Toast.Header
                closeButton={false}
                className={`bg-${notification.type} text-white`}
              >
                <strong className="mr-auto">
                  {notification.type.toUpperCase()}
                </strong>
              </Toast.Header>
            )}
            <Toast.Body>
              <div className="d-flex  align-items-center">
                <div className="me-3">
                  {notification.type == 'success' && (
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  )}
                  {notification.type == 'danger' && (
                    <i className="bi bi-exclamation-circle-fill text-danger fs-4"></i>
                  )}
                  {notification.type == 'warning' && (
                    <i className="bi bi-exclamation-triangle-fill text-warning fs-4"></i>
                  )}
                  {notification.type == 'info' && (
                    <i className="bi bi-info-circle-fill text-primary fs-4"></i>
                  )}
                </div>
                <div>{notification.message}</div>
              </div>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
    </>
  );
};

export default NotificationProvider;
