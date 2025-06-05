import { FC } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Deck as DeckType } from '../../types/deck.types';
import Deck from './Deck';

interface DeckListProps {
  decks: DeckType[];
  onPlayDeck?: (deck: DeckType) => void;
  onEditDeck?: (deck: DeckType) => void;
  onDeleteDeck?: (deck: DeckType) => void;
}

const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  width: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const DeckList: FC<DeckListProps> = ({ decks, onPlayDeck, onEditDeck, onDeleteDeck }) => {
  if (decks.length === 0) {
    return (
      <EmptyState>
        <Typography variant="h6" gutterBottom>
          No decks available
        </Typography>
        <Typography variant="body2">Create your first deck to start learning!</Typography>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {decks.map(deck => (
        <Deck
          key={deck.id}
          deck={deck}
          onPlay={onPlayDeck}
          onEdit={onEditDeck}
          onDelete={onDeleteDeck}
        />
      ))}
    </GridContainer>
  );
};

export default DeckList;
