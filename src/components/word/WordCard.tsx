import { FC, useEffect, useState } from 'react';
import { Box, Card, CardContent, IconButton, styled, Tooltip, Typography } from '@mui/material';
import { VolumeUp as VolumeUpIcon } from '@mui/icons-material';
import { ICard } from '../../types/card.types.ts';
import { speechService } from '../../services/speech.service';

type CardProps = Pick<
  ICard,
  'sourceWord' | 'targetWord' | 'pronunciation' | 'remark' | 'sourceLanguage'
>;

// Styled components for custom card sections
const CardSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
    minHeight: '280px',
  },
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(8),
    minHeight: '320px',
  },
}));

const UpperSection = styled(CardSection)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  background: theme.palette.primary.main,
  position: 'relative',
}));

const LowerSection = styled(CardSection)(({ theme }) => ({
  background: theme.palette.secondary.main,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  margin: '2rem auto',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'translateX(0)',
  border: `2px solid transparent`,
  '&:hover': {
    boxShadow: theme.shadows[15],
    borderColor: theme.palette.primary.main,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: '900px',
    margin: '3rem auto',
    borderRadius: theme.spacing(3),
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1200px',
    margin: '4rem auto',
  },
}));

const WordTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 500,
  textAlign: 'center',
  transition: 'opacity 0.3s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '4.5rem',
  },
}));

const PronunciationTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 400,
  textAlign: 'center',
  fontFamily:
    '"Noto Sans", "Roboto", "Segoe UI", "Arial Unicode MS", "Lucida Sans Unicode", sans-serif',
  opacity: 0.9,
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.6rem',
    marginTop: theme.spacing(2),
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '2rem',
  },
}));

const RemarkTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 400,
  textAlign: 'center',
  fontStyle: 'italic',
  opacity: 0.8,
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.4rem',
    marginTop: theme.spacing(2),
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1.6rem',
  },
}));

const SpeechButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&:disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  [theme.breakpoints.up('lg')]: {
    top: theme.spacing(3),
    right: theme.spacing(3),
  },
  [theme.breakpoints.up('xl')]: {
    top: theme.spacing(4),
    right: theme.spacing(4),
  },
}));

export const WordCard: FC<CardProps> = ({
  sourceWord,
  targetWord,
  pronunciation,
  remark,
  sourceLanguage,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);

  // Check speech availability when component mounts and when voices change
  useEffect(() => {
    const checkSpeechAvailability = () => {
      const available =
        speechService.isSupported() &&
        Boolean(sourceLanguage) &&
        speechService.isLanguageSupported(sourceLanguage);
      setIsSpeechAvailable(available);
    };

    // Initial check
    checkSpeechAvailability();

    // Listen for voices changed event (important for mobile devices)
    if (speechService.isSupported() && window.speechSynthesis) {
      const handleVoicesChanged = () => {
        // Small delay to ensure voices are fully loaded
        setTimeout(checkSpeechAvailability, 100);
      };

      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, [sourceLanguage]);

  const handleSpeak = async () => {
    if (!isSpeechAvailable) {
      return;
    }

    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await speechService.speak(sourceWord, {
        language: sourceLanguage,
        rate: 0.8, // Slightly slower for learning
        pitch: 1.0,
        volume: 1.0,
      });
    } catch {
      // Silently handle errors in production
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <StyledCard>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UpperSection>
          {isSpeechAvailable && (
            <Tooltip title={isSpeaking ? 'Stop pronunciation' : 'Pronounce word'}>
              <SpeechButton onClick={handleSpeak} size="medium">
                <VolumeUpIcon />
              </SpeechButton>
            </Tooltip>
          )}
          <WordTypography variant="h1" color="text.primary">
            {sourceWord}
          </WordTypography>
          <PronunciationTypography variant="body1" color="text.primary">
            {pronunciation}
          </PronunciationTypography>
        </UpperSection>
        <LowerSection>
          <WordTypography variant="h1" color="background.paper">
            {targetWord}
          </WordTypography>
          {remark && (
            <RemarkTypography variant="body2" color="background.paper">
              {remark}
            </RemarkTypography>
          )}
        </LowerSection>
      </CardContent>
    </StyledCard>
  );
};

export default WordCard;
