import React from 'react';
import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';
import JoinScreen from 'App/Features/JoinPlayground/Presentation/Components/JoinScreen';
import PlaygroundScreen from 'App/Features/Playground/Presentation/Screens/PlaygroundScreen';
import LoginGame from 'App/Features/LoginGame/LoginGame';
import playgroundUseCases from 'App/Features/Playground/Usecase/Playground';
import ErrorBoundary from './Features/Common/Presentation/Components/ErrorBoundary';
import AppMain from './Features/Common/Presentation/Components/AppMain';

const router = () => {
  return createBrowserRouter([
    {
      element: <AppMain />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: 'login',
          element: <LoginGame />,
        },
        {
          path: 'join-playground',
          element: <JoinScreen />,
        },
        {
          path: 'playground',
          element: <PlaygroundScreen />,
          children: [],
          loader: () => {
            const canNavigate = playgroundUseCases.shouldHaveValidUser();
            if (!canNavigate) {
              return redirect('/join-playground');
            }
            return true;
          },
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);
};

export default router;
