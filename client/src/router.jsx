import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GeneratePage from './pages/GeneratePage';
import PreviewPage from './pages/PreviewPage';
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/generate', element: <GeneratePage /> },
  { path: '/preview/:pageName', element: <PreviewPage /> },
]);
