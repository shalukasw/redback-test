import React from 'react';
import {
  Navigate,
  createBrowserRouter,
  redirect,
  Outlet,
} from 'react-router-dom';
import JoinScreen from 'App/Features/JoinPlayground/Presentation/Components/JoinScreen';
import PlaygroundScreen from 'App/Features/Playground/Presentation/Screens/PlaygroundScreen';
import LoginGame from 'App/Features/LoginGame/LoginGame';
import playgroundUseCases from 'App/Features/Playground/Usecase/Playground';
import ErrorBoundary from './Features/Common/Presentation/Components/ErrorBoundary';
import AppMain from './Features/Common/Presentation/Components/AppMain';
import PlanetMatchGame from 'App/Features/PlanetMatchGame/PlanetMatchGame';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const router = () => {
  return createBrowserRouter([
    {
      element: <AppMain />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          element: (
            <DndProvider backend={HTML5Backend}>
              <Outlet />
            </DndProvider>
          ),
          children: [
            { path: 'login', element: <LoginGame /> },
            { path: 'planet-match-game', element: <PlanetMatchGame /> },
          ],
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
