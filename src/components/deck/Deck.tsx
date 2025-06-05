import { FC } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  styled,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { Deck as DeckType } from '../../types/deck.types';

interface DeckProps {
  deck: DeckType;
  onPlay?: (deck: DeckType) => void;
  onEdit?: (deck: DeckType) => void;
  onDelete?: (deck: DeckType) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: `2px solid transparent`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  position: 'relative',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(0.5),
  flexShrink: 0,
}));

const LanguageChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.spacing(1),
}));

export const Deck: FC<DeckProps> = ({ deck, onPlay, onEdit, onDelete }) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(deck);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(deck);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(deck);
  };

  const handleCardClick = () => {
    onPlay?.(deck);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <CardHeader>
        <Typography variant="h6" component="h3" gutterBottom>
          {deck.topic}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <LanguageChip
            icon={<TranslateIcon />}
            label={`${deck.languageFrom} → ${deck.languageTo}`}
            size="small"
          />

          <ActionButtons>
            <Tooltip title="Play Deck">
              <IconButton
                size="small"
                onClick={handlePlay}
                sx={{
                  color: 'inherit',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '4px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <PlayArrowIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Deck">
              <IconButton
                size="small"
                onClick={handleEdit}
                sx={{
                  color: 'inherit',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '4px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <EditIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Deck">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{
                  color: 'inherit',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '4px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </ActionButtons>
        </Box>
      </CardHeader>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {deck.description}
        </Typography>

        <StatsBox>
          <Typography variant="body2" color="text.secondary">
            Words
          </Typography>
          <Typography variant="h6" color="primary">
            {deck.amount}
          </Typography>
        </StatsBox>
      </CardContent>
    </StyledCard>
  );
};

export default Deck;
