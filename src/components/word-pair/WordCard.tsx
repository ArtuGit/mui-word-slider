import { FC } from 'react';
import { Box, Card, CardContent, styled, Typography } from '@mui/material';
import { WordPair } from '../../types/word.types';

type WordCardProps = Pick<WordPair, 'sourceWord' | 'targetWord' | 'pronunciation' | 'remark'>;

// Styled components for custom card sections
const CardSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
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
  border: `2px solid transparent`,
  '&:hover': {
    boxShadow: theme.shadows[15],
    borderColor: theme.palette.primary.main,
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

const PronunciationTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 400,
  textAlign: 'center',
  fontFamily: 'monospace, "Courier New", Courier',
  opacity: 0.9,
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
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
}));

export const WordCard: FC<WordCardProps> = ({ sourceWord, targetWord, pronunciation, remark }) => {
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
