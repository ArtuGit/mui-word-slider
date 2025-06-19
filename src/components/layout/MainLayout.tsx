import { ReactNode, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header.tsx';
import CircularProgress from '@mui/material/CircularProgress';
import db from '../../db/database';
import { deckService } from '../../services/deck.service';
import { cardService } from '../../services/card.service';

export const MainLayout = ({ children }: { children?: ReactNode }) => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkAndInit = async () => {
      // Check if decks and cards are empty
      const decksCount = await db.decks.count();
      const cardsCount = await db.cards.count();
      if (decksCount === 0) {
        await deckService.getDefaultDecks();
      }
      if (cardsCount === 0) {
        await cardService.initializeCards();
      }
      setInitializing(false);
    };
    checkAndInit();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Header />
      {initializing && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={80} />
        </Box>
      )}
      <Box
        key={initializing ? 'loading' : 'ready'}
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
