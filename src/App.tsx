import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import WordLearningPage from './pages/WordLearningPage';
import DecksPage from './pages/DecksPage';
import NotFoundPage from './pages/NotFoundPage';
import { ROUTES } from './constants/routes';
import DeckEditPage from './pages/DeckEditPage';

const AppContent: FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DECKS} replace />} />
      <Route path={ROUTES.DECKS} element={<DecksPage />} />
      <Route path="/deck/add" element={<DeckEditPage />} />
      <Route path="/deck/:deckId/edit" element={<DeckEditPage />} />
      <Route path="/deck/:deckId" element={<WordLearningPage />} />
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
