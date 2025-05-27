import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import WordLearningPage from './pages/WordLearningPage';
import UploadPage from './pages/UploadPage';
import NotFoundPage from './pages/NotFoundPage';

const App: FC = () => {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<Navigate to="/learn" replace />} />
        <Route path="/learn" element={<WordLearningPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  );
};

export default App;
