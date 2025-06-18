import {FC, useEffect} from 'react';
import {Alert, Box, Button, CircularProgress, Container, styled, Typography} from '@mui/material';
import {Add as AddIcon} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {useDecksStore} from '../stores/useDecksStore';
import DeckList from '../components/deck/DeckList';
import {IDeck as DeckType} from '../types/deck.types';

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'stretch',
  },
}));

const ContentContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '400px',
  py: 4,
}));

export const DecksPage: FC = () => {
  const navigate = useNavigate();
  const {decks, isLoading, error, clearError, getAllDecks} = useDecksStore();

  // Load decks when component mounts
  useEffect(() => {
    getAllDecks();
  }, [getAllDecks]);

  const handlePlayDeck = async (deck: DeckType) => {
    try {
      // Navigate to the specific deck learning page
      navigate(`/deck/${deck.id}`);
    } catch (error) {
      console.error('Failed to start deck:', error);
    }
  };

  const handleEditDeck = (deck: DeckType) => {
    navigate(`/deck/${deck.id}/edit`);
  };

  const handleCreateDeck = () => {
    navigate('/deck/add');
  };

  let content;
  if (isLoading) {
    content = <CircularProgress size={60} />;
  } else if (error) {
    content = (
      <Alert severity="error" onClose={clearError}>
        {error}
      </Alert>
    );
  } else {
    content = <DeckList decks={decks} onPlayDeck={handlePlayDeck} onEditDeck={handleEditDeck} />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader>
        <Typography variant="h4" component="h1" color="primary">
          My Decks
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateDeck} size="large">
          Create Deck
        </Button>
      </PageHeader>

      <ContentContainer>{content}</ContentContainer>
    </Container>
  );
};

export default DecksPage;
