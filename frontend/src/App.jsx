import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './page/HomeRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import ProfilePage from './page/Profile/ProfilePage.jsx';
import Login from './page/Auth/Login';
import SignUp from './page/Auth/SignUp';
import ForgotPassword from './page/Auth/ForgotPassword';
import WelcomePage from './page/WelcomePage';
import BoardPage from './page/BoardPage';
import HomeRedirect from './page/HomeRedirect';
import UserDetails from './components/Profile/UserDetails';
import Credentials from './components/Profile/Credentials';
import Notifications from './components/Profile/Notifications';

import ProfileComp from './components/Profile/ProfileComp';
import ResetPassword from './page/Auth/ResetPassword';
import { ErrorBoundary } from './ErrorBoundary';
import NotFound from './page/NotFound';
import RouteError from './RouteError';

const router = createBrowserRouter([
  {
    path: '/',
    Component: ProtectedRoute,
    errorElement: <RouteError />,
    children: [
      {
        Component: WelcomePage,
        children: [
          {
            Component: AppLayout,
            children: [
              { index: true, Component: HomeRedirect },
              { path: 'board/:slug', Component: BoardPage },
              {
                path: 'account',
                Component: ProfilePage,
                children: [
                  { path: 'profile', Component: ProfileComp },
                  { path: 'email-password', Component: Credentials },
                  { path: 'notifications', Component: Notifications },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    errorElement: <RouteError />,
    children: [
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: SignUp,
      },
      {
        path: '/forgotPassword',
        Component: ForgotPassword,
      },
      {
        path: '/resetPassword/:token',
        Component: ResetPassword,
      },
      { path: '*', Component: NotFound },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
