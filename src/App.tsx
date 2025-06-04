import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import WordLearningPage from './pages/WordLearningPage';
import UploadPage from './pages/UploadPage';
import NotFoundPage from './pages/NotFoundPage';
import { useGlobalWordInitialization } from './hooks/useGlobalWordInitialization';
import { ROUTES } from './constants/routes';

const AppContent: FC = () => {
  // Initialize words globally for valid routes
  useGlobalWordInitialization();

  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LEARN} replace />} />
      <Route path={ROUTES.LEARN} element={<WordLearningPage />} />
      <Route path={ROUTES.UPLOAD} element={<UploadPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
