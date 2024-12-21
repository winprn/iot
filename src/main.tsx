import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/login/index.tsx';
import SignUpPage from './pages/signup/index.tsx';
import WrapperPage from './pages/wrapper.tsx';
import Dashboard from './pages/dashboard/index.tsx';
import Home from './components/Home.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LightPage from './pages/lights/index.tsx';
import HistoryPage from './pages/history/index.tsx';
import 'chart.js/auto';
import 'chartjs-adapter-moment';
import SettingPage from './pages/settings/index.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <WrapperPage>
        <Dashboard />
      </WrapperPage>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'lights',
        element: <LightPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'settings',
        element: <SettingPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {},
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
