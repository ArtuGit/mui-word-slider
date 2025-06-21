import { FC, useState } from 'react';
import { Box, Card, CardContent, IconButton, Typography, useTheme } from '@mui/material';
import { ICard } from '../../../types/card.types.ts';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface WordCardProps {
  word: ICard;
  onDelete?: (cardId: string) => void;
}

const WordCard: FC<WordCardProps> = ({ word, onDelete }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onDelete?.(word.id);
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      elevation={2}
      sx={{
        minHeight: 140,
        width: '100%',
        maxWidth: 280,
        mx: 'auto',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-4px)',
        },
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // for positioning the delete button
      }}
    >
      {onDelete && isHovered && (
        <IconButton
          aria-label="delete"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
      <CardContent
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.2rem',
              color: theme.palette.primary.main,
              wordBreak: 'break-word',
              lineHeight: 1.1,
              mb: 0.5,
            }}
          >
            {word.sourceWord}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: '1.1rem',
              color: theme.palette.text.primary,
              fontWeight: 500,
              wordBreak: 'break-word',
              lineHeight: 1.2,
            }}
          >
            {word.targetWord}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 'auto',
            pt: 0.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {word.pronunciation && (
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: theme.palette.text.secondary,
                fontSize: '1rem',
                lineHeight: 1.2,
              }}
            >
              {word.pronunciation}
            </Typography>
          )}

          {word.remark && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.9rem',
                lineHeight: 1.3,
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {word.remark}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WordCard;
