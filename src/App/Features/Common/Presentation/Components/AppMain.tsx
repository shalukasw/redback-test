import React, { useEffect } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import apiClient from 'App/Lib/APIClient';
import { authStateChange } from 'App/Features/Common/Presentation/ViewModels/AppSlice';
import { useNotification } from 'App/Features/Common/Presentation/Providers/NotificationProvider';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import store, { RootState } from 'App/Features/Common/Presentation/Store/store';

// API interceptor to catch 401 and redirect
apiClient.http?.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status) {
      if (error.response.status === 401) {
        store.dispatch(authStateChange());
        return Promise.reject(error);
      }
    }
  },
);

const AppContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { addNotification } = useNotification();

  const loginState = useSelector((state: RootState) => state.app.current);
  useEffect(() => {
    if (loginState == 'LoggedOff' && location.pathname != '/join-playground') {
      addNotification(t('common.errors.sessionExpired'), 'danger');
      navigate('/join-playground');
    }
  }, [loginState, t, navigate, addNotification, location.pathname]);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

export default AppContainer;
