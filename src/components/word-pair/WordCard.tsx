import { FC } from 'react';
import { Box, Card, CardContent, styled, Typography } from '@mui/material';
import { WordPair } from '../../types/word.types';

type WordCardProps = Pick<WordPair, 'sourceWord' | 'targetWord'>;

// Styled components for custom card sections
const CardSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
  width: '100%',
}));

const UpperSection = styled(CardSection)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  background: theme.palette.primary.main,
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
  '&:hover': {
    transform: 'scale(1.02)',
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
}));

export const WordCard: FC<WordCardProps> = ({ sourceWord, targetWord }) => {
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
          <WordTypography variant="h1" color="text.primary">
            {sourceWord}
          </WordTypography>
        </UpperSection>
        <LowerSection>
          <WordTypography variant="h1" color="background.paper">
            {targetWord}
          </WordTypography>
        </LowerSection>
      </CardContent>
    </StyledCard>
  );
};

export default WordCard;
