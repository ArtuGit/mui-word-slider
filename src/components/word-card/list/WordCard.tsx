import { FC, useEffect, useState } from 'react';
import { Box, Card, CardContent, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { ICard } from '../../../types/card.types.ts';
import { Delete as DeleteIcon, VolumeUp as VolumeUpIcon } from '@mui/icons-material';
import { speechService } from '../../../services/speech.service.ts';

interface WordCardProps {
  word: ICard;
  onDelete?: (cardId: string) => void;
}

const WordCard: FC<WordCardProps> = ({ word, onDelete }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);

  useEffect(() => {
    const checkSpeechAvailability = () => {
      const available =
        speechService.isSupported() &&
        Boolean(word.sourceLanguage) &&
        speechService.isLanguageSupported(word.sourceLanguage);
      setIsSpeechAvailable(available);
    };

    checkSpeechAvailability();

    if (speechService.isSupported() && window.speechSynthesis) {
      const handleVoicesChanged = () => {
        setTimeout(checkSpeechAvailability, 100);
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, [word.sourceLanguage]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onDelete?.(word.id);
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSpeechAvailable) return;

    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await speechService.speak(word.sourceWord, {
        language: word.sourceLanguage,
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
      });
    } finally {
      setIsSpeaking(false);
    }
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
        <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              {isSpeechAvailable && (
                <Tooltip title={isSpeaking ? 'Stop pronunciation' : 'Pronounce word'}>
                  <span>
                    <IconButton
                      onClick={handleSpeak}
                      size="small"
                      disabled={!isSpeechAvailable}
                      sx={{
                        ml: 0.5,
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <VolumeUpIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Box>
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
